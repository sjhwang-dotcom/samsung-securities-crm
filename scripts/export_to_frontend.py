"""
Export DuckDB data to frontend-compatible JSON files.
Generates src/data/db/ directory with aggregated + detail data.
"""
import duckdb
import json
import os
from decimal import Decimal

DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'harlow.duckdb')
OUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'db')

import datetime
import pandas as pd

def decimal_default(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    if isinstance(obj, (datetime.date, datetime.datetime)):
        return obj.isoformat()
    if isinstance(obj, pd._libs.tslibs.nattype.NaTType):
        return None
    if pd.isna(obj):
        return None
    raise TypeError(f"Object of type {type(obj)} is not JSON serializable")

def save(name, data):
    path = os.path.join(OUT_DIR, f'{name}.json')
    with open(path, 'w') as f:
        json.dump(data, f, default=decimal_default, indent=2)
    print(f"  {name}.json — {len(json.dumps(data, default=decimal_default)) // 1024}KB")

def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    conn = duckdb.connect(DB_PATH, read_only=True)

    # ═══ 1. ISOs ═══
    print("Exporting ISOs...")
    isos = conn.execute("""
        SELECT iso_id, name, status, acquisition_date, description, founded_year,
               hq_city, hq_state, legal_name, entity_type, ein,
               address_street, address_zip, industry_focus,
               acquisition_price, acquisition_multiple,
               iso_split_pct, buy_rate, integration_status, integration_pct,
               migration_target_date, bank_partner, bin_sponsor,
               contract_start_date, contract_end_date, contract_term_years,
               churn_rate, pci_compliance_rate, avg_ticket,
               total_monthly_volume, total_monthly_residuals,
               product_penetration_rate, notes, website
        FROM isos ORDER BY iso_id
    """).fetchdf().to_dict(orient='records')

    # Add contacts, processors, products, events per ISO
    for iso in isos:
        iso_id = iso['iso_id']

        # Contacts
        iso['contacts'] = conn.execute(f"""
            SELECT first_name, last_name, title, role, phone, email, is_primary
            FROM iso_contacts WHERE iso_id={iso_id} ORDER BY is_primary DESC
        """).fetchdf().to_dict(orient='records')

        # Processors
        iso['processors'] = conn.execute(f"""
            SELECT p.name, ip.is_primary, ip.volume_share_pct
            FROM iso_processors ip JOIN processors p ON ip.processor_id=p.processor_id
            WHERE ip.iso_id={iso_id}
        """).fetchdf().to_dict(orient='records')

        # Product enrollment
        iso['products'] = conn.execute(f"""
            SELECT product_name, enrolled_count, eligible_count, enrollment_rate, monthly_revenue
            FROM iso_product_enrollment WHERE iso_id={iso_id} ORDER BY enrolled_count DESC
        """).fetchdf().to_dict(orient='records')

        # Events
        iso['events'] = conn.execute(f"""
            SELECT event_type, title, description, severity, event_date
            FROM iso_events WHERE iso_id={iso_id} ORDER BY event_date DESC
        """).fetchdf().to_dict(orient='records')

        # Monthly metrics
        iso['monthly_metrics'] = conn.execute(f"""
            SELECT month, merchant_count, new_merchants, lost_merchants,
                   processing_volume, total_residuals, avg_ticket,
                   churn_rate, chargeback_rate, pci_compliance_rate
            FROM iso_monthly_metrics WHERE iso_id={iso_id} ORDER BY month
        """).fetchdf().to_dict(orient='records')

        # MCC category breakdown
        iso['mcc_breakdown'] = conn.execute(f"""
            SELECT mc.category, COUNT(*) as count,
                   ROUND(COUNT(*)*100.0 / (SELECT COUNT(*) FROM merchants WHERE iso_id={iso_id}), 1) as pct
            FROM merchants m JOIN mcc_codes mc ON m.mcc=mc.mcc
            WHERE m.iso_id={iso_id}
            GROUP BY mc.category ORDER BY count DESC
        """).fetchdf().to_dict(orient='records')

        # Merchant count
        iso['merchant_count'] = conn.execute(f"SELECT COUNT(*) FROM merchants WHERE iso_id={iso_id}").fetchone()[0]

    save('isos', isos)

    # ═══ 2. Merchants (all 4,612) ═══
    print("Exporting merchants...")
    merchants = conn.execute("""
        SELECT m.merchant_id, m.iso_id, i.name as iso_name,
               m.dba_name, m.legal_name, m.mid, m.mcc, mc.description as mcc_desc, mc.category,
               p.name as processor, m.status, m.avg_ticket, m.risk_score,
               m.address_city, m.address_state, m.address_zip,
               m.boarding_date, m.annual_volume_estimate,
               m.email, m.phone
        FROM merchants m
        JOIN isos i ON m.iso_id=i.iso_id
        JOIN mcc_codes mc ON m.mcc=mc.mcc
        LEFT JOIN processors p ON m.processor_id=p.processor_id
        ORDER BY m.merchant_id
    """).fetchdf().to_dict(orient='records')
    save('merchants', merchants)

    # ═══ 3. Dashboard KPIs (computed from real data) ═══
    print("Exporting dashboard KPIs...")

    mar_vol = conn.execute("SELECT SUM(net_amount) FROM daily_transactions WHERE txn_date >= '2026-03-01' AND txn_date < '2026-04-01'").fetchone()[0]
    feb_vol = conn.execute("SELECT SUM(net_amount) FROM daily_transactions WHERE txn_date >= '2026-02-01' AND txn_date < '2026-03-01'").fetchone()[0]
    vol_trend = round((float(mar_vol) - float(feb_vol)) / float(feb_vol) * 100, 1)

    mar_res = conn.execute("SELECT SUM(iso_residual) FROM residuals WHERE month='2026-03-01'").fetchone()[0]
    feb_res = conn.execute("SELECT SUM(iso_residual) FROM residuals WHERE month='2026-02-01'").fetchone()[0]
    res_trend = round((float(mar_res) - float(feb_res)) / float(feb_res) * 100, 1)

    total_merchants = conn.execute("SELECT COUNT(*) FROM merchants WHERE status='Active'").fetchone()[0]
    churn_count = conn.execute("SELECT COUNT(*) FROM merchants WHERE status='Inactive'").fetchone()[0]
    churn_rate = round(churn_count / total_merchants * 100, 1)

    cb_rate = conn.execute("""
        SELECT ROUND(SUM(amount) / (SELECT SUM(sale_amount) FROM daily_transactions WHERE txn_date >= '2026-03-01') * 100, 2)
        FROM chargebacks WHERE filed_date >= '2026-03-01'
    """).fetchone()[0]

    dashboard_kpis = {
        'total_merchants': total_merchants,
        'monthly_volume': round(float(mar_vol), 2),
        'monthly_volume_trend': vol_trend,
        'monthly_residuals': round(float(mar_res), 2),
        'monthly_residuals_trend': res_trend,
        'churn_rate': churn_rate,
        'chargeback_rate': float(cb_rate) if cb_rate else 0.35,
    }
    save('dashboard_kpis', dashboard_kpis)

    # ═══ 4. Volume trend (12 months) ═══
    print("Exporting volume trends...")
    volume_trend = conn.execute("""
        SELECT DATE_TRUNC('month', txn_date) as month,
               ROUND(SUM(net_amount)/1e6, 2) as volume_m,
               ROUND(SUM(net_amount)*0.01/1e6, 2) as residuals_m
        FROM daily_transactions GROUP BY 1 ORDER BY 1
    """).fetchdf().to_dict(orient='records')
    save('volume_trend', volume_trend)

    # ═══ 5. Category mix ═══
    print("Exporting category mix...")
    cat_mix = conn.execute("""
        SELECT mc.category as name, COUNT(*) as count,
               ROUND(COUNT(*)*100.0/4612, 1) as value
        FROM merchants m JOIN mcc_codes mc ON m.mcc=mc.mcc
        GROUP BY mc.category ORDER BY count DESC
    """).fetchdf().to_dict(orient='records')
    colors = {'Restaurants': '#0891B2', 'Retail': '#4F46E5', 'Services': '#10B981',
              'Auto': '#F59E0B', 'Health': '#F43F5E', 'Other': '#8B5CF6'}
    for c in cat_mix:
        c['color'] = colors.get(c['name'], '#94A3B8')
    save('category_mix', cat_mix)

    # ═══ 6. ISO portfolio summary ═══
    print("Exporting ISO portfolio...")
    iso_portfolio = conn.execute("""
        SELECT i.name,
               COUNT(m.merchant_id) as merchants,
               ROUND(COALESCE(SUM(CASE WHEN dt.txn_date >= '2026-03-01' THEN dt.net_amount END), 0)/1e6, 1) as volume_m,
               i.churn_rate, i.product_penetration_rate as penetration,
               i.status, i.integration_pct
        FROM isos i
        LEFT JOIN merchants m ON i.iso_id=m.iso_id
        LEFT JOIN daily_transactions dt ON m.merchant_id=dt.merchant_id
        GROUP BY i.iso_id, i.name, i.churn_rate, i.product_penetration_rate, i.status, i.integration_pct
        ORDER BY merchants DESC
    """).fetchdf().to_dict(orient='records')
    save('iso_portfolio', iso_portfolio)

    # ═══ 7. At-risk merchants ═══
    print("Exporting at-risk merchants...")
    at_risk = conn.execute("""
        WITH recent_risk AS (
            SELECT merchant_id, risk_score, previous_score, score_change, trigger_reason,
                   ROW_NUMBER() OVER (PARTITION BY merchant_id ORDER BY assessed_date DESC) as rn
            FROM risk_assessments
        ),
        vol AS (
            SELECT merchant_id,
                   SUM(CASE WHEN txn_date >= '2026-03-01' THEN net_amount ELSE 0 END) as mar_vol,
                   SUM(CASE WHEN txn_date >= '2026-02-01' AND txn_date < '2026-03-01' THEN net_amount ELSE 0 END) as feb_vol
            FROM daily_transactions GROUP BY merchant_id
        )
        SELECT m.dba_name as name, r.risk_score as riskScore,
               CONCAT('$', CAST(CAST(v.mar_vol AS INTEGER) AS VARCHAR)) as volume,
               CASE WHEN v.feb_vol > 0 THEN CONCAT(CAST(ROUND((v.feb_vol - v.mar_vol)/v.feb_vol*100, 0) AS INTEGER), '%')
                    ELSE 'N/A' END as trend,
               CASE WHEN r.risk_score >= 80 THEN 'CRITICAL'
                    WHEN r.risk_score >= 70 THEN 'HIGH'
                    WHEN r.risk_score >= 60 THEN 'MODERATE'
                    ELSE 'INACTIVE' END as severity
        FROM recent_risk r
        JOIN merchants m ON r.merchant_id=m.merchant_id
        JOIN vol v ON m.merchant_id=v.merchant_id
        WHERE r.rn=1 AND r.risk_score >= 60 AND r.score_change < -3
        ORDER BY r.risk_score DESC
        LIMIT 10
    """).fetchdf().to_dict(orient='records')
    save('at_risk_merchants', at_risk)

    # ═══ 8. Lead pipeline ═══
    print("Exporting lead pipeline...")
    stages = ['Lead', 'Proposal', 'Application', 'Underwriting', 'Approval', 'Boarding', 'Equipment', 'Go-Live']
    pipeline = {}
    for stage in stages:
        leads = conn.execute(f"""
            SELECT business_name as name, location, mcc,
                   CONCAT('$', CAST(CAST(estimated_monthly_volume/1000 AS INTEGER) AS VARCHAR), 'K/mo') as estVolume,
                   ai_score as aiScore, notes as detail
            FROM leads WHERE stage='{stage}' ORDER BY ai_score DESC
        """).fetchdf().to_dict(orient='records')
        pipeline[stage] = leads
    save('lead_pipeline', pipeline)

    # ═══ 9. Onboarding applications ═══
    print("Exporting applications...")
    apps = conn.execute("""
        SELECT merchant_name as merchant, bank_name as bank,
               submitted_date as submitted, stage, risk_score as riskScore,
               risk_label as riskLabel, status, assigned_to as assigned
        FROM applications ORDER BY submitted_date DESC
    """).fetchdf().to_dict(orient='records')
    save('applications', apps)

    # ═══ 10. Processor distribution ═══
    print("Exporting processor distribution...")
    proc_dist = conn.execute("""
        SELECT p.name,
               ROUND(SUM(dt.net_amount)/1e6, 1) as volume,
               ROUND(COUNT(DISTINCT m.merchant_id)*100.0 / (SELECT COUNT(*) FROM merchants WHERE status='Active'), 0) as pct
        FROM daily_transactions dt
        JOIN merchants m ON dt.merchant_id=m.merchant_id
        JOIN processors p ON m.processor_id=p.processor_id
        WHERE dt.txn_date >= '2026-03-01'
        GROUP BY p.name ORDER BY volume DESC
    """).fetchdf().to_dict(orient='records')
    save('processor_distribution', proc_dist)

    # ═══ 11. Risk distribution ═══
    print("Exporting risk distribution...")
    risk_dist = conn.execute("""
        SELECT CASE
            WHEN risk_score < 30 THEN '0-30'
            WHEN risk_score < 50 THEN '31-50'
            WHEN risk_score < 70 THEN '51-70'
            WHEN risk_score < 85 THEN '71-85'
            ELSE '86-100'
        END as range,
        CASE
            WHEN risk_score < 30 THEN 'High Risk'
            WHEN risk_score < 50 THEN 'Medium-High'
            WHEN risk_score < 70 THEN 'Medium'
            WHEN risk_score < 85 THEN 'Low'
            ELSE 'Very Low'
        END as label,
        ROUND(COUNT(*)*100.0 / (SELECT COUNT(*) FROM merchants), 1) as pct
        FROM merchants
        GROUP BY 1, 2
        ORDER BY MIN(risk_score)
    """).fetchdf().to_dict(orient='records')
    risk_colors = {'0-30': '#F43F5E', '31-50': '#F59E0B', '51-70': '#EAB308', '71-85': '#86EFAC', '86-100': '#10B981'}
    for r in risk_dist:
        r['color'] = risk_colors.get(r['range'], '#94A3B8')
    save('risk_distribution', risk_dist)

    # ═══ 12. Product penetration ═══
    print("Exporting product penetration...")
    prod_pen = conn.execute("""
        SELECT product_name as product, COUNT(*) as enrolled,
               4612 as eligible,
               CONCAT(ROUND(COUNT(*)*100.0/4612, 1), '%') as rate,
               CONCAT('$', CAST(CAST(SUM(monthly_revenue)/1000 AS INTEGER) AS VARCHAR), 'K') as revenue
        FROM products GROUP BY product_name ORDER BY COUNT(*) DESC
    """).fetchdf().to_dict(orient='records')
    save('product_penetration', prod_pen)

    # ═══ 13. Chargeback trend ═══
    print("Exporting chargeback trend...")
    cb_trend = conn.execute("""
        WITH monthly_cb AS (
            SELECT DATE_TRUNC('month', filed_date) as month, SUM(amount) as cb_amount
            FROM chargebacks GROUP BY 1
        ),
        monthly_vol AS (
            SELECT DATE_TRUNC('month', txn_date) as month, SUM(sale_amount) as total_vol
            FROM daily_transactions GROUP BY 1
        )
        SELECT mc.month, ROUND(mc.cb_amount / NULLIF(mv.total_vol, 0) * 100, 2) as portfolio,
               1.0 as visa, 1.5 as mc
        FROM monthly_cb mc JOIN monthly_vol mv ON mc.month = mv.month
        ORDER BY mc.month
    """).fetchdf().to_dict(orient='records')
    save('chargeback_trend', cb_trend)

    # ═══ 14. Voice call data ═══
    print("Exporting voice call data...")
    voice_calls = conn.execute("""
        SELECT phone_number as phone, business_name as merchant,
               status,
               CONCAT(CAST(duration_seconds/60 AS INTEGER), ':', LPAD(CAST(duration_seconds%60 AS VARCHAR), 2, '0')) as duration,
               stage, sentiment
        FROM voice_calls
        WHERE call_date >= '2026-03-14'
        ORDER BY call_date DESC LIMIT 20
    """).fetchdf().to_dict(orient='records')
    save('voice_calls', voice_calls)

    voice_hourly = conn.execute("""
        SELECT CONCAT(EXTRACT(HOUR FROM call_date),
               CASE WHEN EXTRACT(HOUR FROM call_date) < 12 THEN 'am' ELSE 'pm' END) as hour,
               COUNT(*) as calls,
               ROUND(SUM(CASE WHEN outcome='Transfer Success' THEN 1 ELSE 0 END)*100.0/COUNT(*), 1) as transferRate
        FROM voice_calls
        WHERE call_date >= '2026-03-01'
        GROUP BY EXTRACT(HOUR FROM call_date)
        ORDER BY EXTRACT(HOUR FROM call_date)
    """).fetchdf().to_dict(orient='records')
    save('voice_hourly', voice_hourly)

    call_outcomes = conn.execute("""
        SELECT outcome as name,
               ROUND(COUNT(*)*100.0 / (SELECT COUNT(*) FROM voice_calls), 1) as value
        FROM voice_calls GROUP BY outcome ORDER BY value DESC
    """).fetchdf().to_dict(orient='records')
    outcome_colors = {
        'Transfer Success': '#10B981', 'Callback Scheduled': '#0891B2',
        'Not Interested': '#F43F5E', 'Gatekeeper Block': '#F59E0B',
        'No Answer': '#94A3B8', 'Voicemail': '#8B5CF6'
    }
    for c in call_outcomes:
        c['color'] = outcome_colors.get(c['name'], '#94A3B8')
    save('call_outcomes', call_outcomes)

    # ═══ 15. MCC codes reference ═══
    print("Exporting MCC codes...")
    mcc = conn.execute("SELECT * FROM mcc_codes ORDER BY mcc").fetchdf().to_dict(orient='records')
    save('mcc_codes', mcc)

    # ═══ 16. Recent activity (from events + chargebacks + voice) ═══
    print("Exporting recent activity...")
    activity = conn.execute("""
        SELECT title as text,
               CASE WHEN event_date >= CURRENT_DATE - 1 THEN 'Today'
                    WHEN event_date >= CURRENT_DATE - 2 THEN 'Yesterday'
                    ELSE CONCAT(EXTRACT(DAY FROM CURRENT_DATE - event_date), 'd ago')
               END as time
        FROM iso_events ORDER BY event_date DESC LIMIT 8
    """).fetchdf().to_dict(orient='records')
    save('recent_activity', activity)

    # ═══ 17. Merchant equipment summary ═══
    print("Exporting equipment summary...")
    equip = conn.execute("""
        SELECT make_model, COUNT(*) as count,
               ROUND(COUNT(*)*100.0/(SELECT COUNT(*) FROM equipment), 0) as pct,
               SUM(CASE WHEN is_online THEN 1 ELSE 0 END) as online
        FROM equipment GROUP BY make_model ORDER BY count DESC
    """).fetchdf().to_dict(orient='records')
    save('equipment_summary', equip)

    # ═══ Summary ═══
    total_size = 0
    for f in os.listdir(OUT_DIR):
        fpath = os.path.join(OUT_DIR, f)
        total_size += os.path.getsize(fpath)

    print(f"\n✅ Exported {len(os.listdir(OUT_DIR))} JSON files to src/data/db/")
    print(f"   Total size: {total_size // 1024}KB ({total_size // (1024*1024)}MB)")

    conn.close()

if __name__ == '__main__':
    main()
