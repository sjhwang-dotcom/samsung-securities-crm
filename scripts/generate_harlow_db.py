#!/usr/bin/env python3
"""
Generate Harlow Payments DuckDB database with realistic synthetic data.
19 tables, ~1.6M transaction rows, full payment processing platform.
"""

import os
import sys
import time
import random
from datetime import datetime, date, timedelta
from pathlib import Path

# Force unbuffered stdout for progress visibility
sys.stdout.reconfigure(line_buffering=True)

import duckdb
import numpy as np
import pandas as pd
from faker import Faker

# ─── Config ───────────────────────────────────────────────────────────────────
SEED = 42
random.seed(SEED)
np.random.seed(SEED)
fake = Faker()
Faker.seed(SEED)

SCRIPT_DIR = Path(__file__).parent
SCHEMA_PATH = SCRIPT_DIR / "schema.sql"
DB_PATH = SCRIPT_DIR.parent / "harlow.duckdb"
BATCH_SIZE = 50_000

start_time = time.time()


def elapsed():
    return f"{time.time() - start_time:.1f}s"


# ─── Database setup ──────────────────────────────────────────────────────────
if DB_PATH.exists():
    os.remove(DB_PATH)

conn = duckdb.connect(str(DB_PATH))

# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 1: Schema + Reference Data
# ═══════════════════════════════════════════════════════════════════════════════
print(f"[{elapsed()}] Phase 1: Schema + Reference Data")

schema_sql = SCHEMA_PATH.read_text()
for stmt in schema_sql.split(";"):
    stmt = stmt.strip()
    if stmt:
        conn.execute(stmt)

# ISOs
conn.executemany(
    """INSERT INTO isos (iso_id, name, status, acquisition_date, description,
       founded_year, hq_city, hq_state, contact_name, contact_email,
       contact_phone, website, target_merchant_count)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)""",
    [
        (1, "Harlow Direct", "Primary", None, "Primary ISO portfolio",
         2018, "New York", "NY", "Marcus Chen", "marcus@harlowpayments.com",
         "212-555-0100", "harlowpayments.com", 2847),
        (2, "Zenith Payments", "Acquired", date(2025, 10, 1),
         "Acquired Q4 2025", 2020, "New York", "NY", "Sarah Kim",
         "sarah@zenithpay.com", "212-555-0200", "zenithpay.com", 1024),
        (3, "Liberty Processing", "Acquired", date(2026, 1, 15),
         "Acquired Q1 2026", 2021, "New York", "NY", "James Rivera",
         "james@libertyproc.com", "212-555-0300", "libertyprocessing.com", 741),
    ],
)

# MCC codes
mcc_data = [
    # Restaurants (34%)
    ("5812", "Eating Places, Restaurants", "Restaurants", "Standard", 25, 65),
    ("5813", "Bars, Cocktail Lounges", "Restaurants", "Elevated", 15, 55),
    ("5814", "Fast Food Restaurants", "Restaurants", "Standard", 8, 25),
    ("5462", "Bakeries", "Restaurants", "Standard", 10, 35),
    # Retail (22%)
    ("5411", "Grocery Stores", "Retail", "Standard", 30, 120),
    ("5311", "Department Stores", "Retail", "Standard", 40, 200),
    ("5331", "Variety Stores", "Retail", "Standard", 15, 60),
    ("5944", "Jewelry Stores", "Retail", "Elevated", 80, 500),
    ("5912", "Drug Stores, Pharmacies", "Retail", "Standard", 20, 65),
    ("5651", "Family Clothing Stores", "Retail", "Standard", 35, 150),
    ("5999", "Miscellaneous Retail", "Retail", "Standard", 20, 100),
    # Services (18%)
    ("7230", "Barber and Beauty Shops", "Services", "Standard", 25, 80),
    ("7241", "Laundry, Cleaning Services", "Services", "Standard", 15, 45),
    ("7216", "Dry Cleaners", "Services", "Standard", 15, 40),
    ("7941", "Sports Clubs, Fields", "Services", "Standard", 30, 100),
    ("7299", "Miscellaneous Recreation", "Services", "Standard", 20, 75),
    # Auto (12%)
    ("7538", "Auto Service Shops", "Auto", "Standard", 80, 250),
    ("7542", "Car Washes", "Auto", "Elevated", 12, 35),
    ("5541", "Service Stations", "Auto", "Standard", 30, 70),
    ("5531", "Auto Parts Stores", "Auto", "Standard", 25, 120),
    # Health (8%)
    ("8011", "Doctors", "Health", "Standard", 100, 500),
    ("8021", "Dentists", "Health", "Standard", 150, 800),
    ("8099", "Health Practitioners", "Health", "Standard", 75, 300),
    # Other (6%)
    ("5992", "Florists", "Other", "Standard", 30, 80),
    ("5261", "Lawn and Garden Stores", "Other", "Standard", 25, 150),
    ("7011", "Hotels and Motels", "Other", "Standard", 80, 250),
    ("7629", "Electrical Repair Shops", "Other", "Standard", 40, 150),
]

conn.executemany("INSERT INTO mcc_codes VALUES (?,?,?,?,?,?)", mcc_data)

# Processors
conn.executemany(
    "INSERT INTO processors (processor_id, name, platform, settlement_speed) VALUES (?,?,?,?)",
    [
        (1, "Harlow Payments", "Proprietary", "Same-day"),
        (2, "Repay TSYS FEO", "TSYS", "Next-day"),
        (3, "EPSG", "EPSG", "Next-day"),
        (4, "EPSG Wells Fargo", "EPSG", "Next-day"),
        (5, "Card Point/First Data", "First Data", "Next-day"),
    ],
)

print(f"[{elapsed()}]   Reference data inserted")

# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 2: Merchants (4,612)
# ═══════════════════════════════════════════════════════════════════════════════
print(f"[{elapsed()}] Phase 2: Merchants")

NEIGHBORHOODS = [
    "Astoria", "Bay Ridge", "Bushwick", "Chelsea", "Crown Heights",
    "East Village", "Flatbush", "Flushing", "Forest Hills",
    "Greenwich Village", "Harlem", "Jackson Heights", "Jamaica",
    "Lower East Side", "Midtown", "Park Slope", "Red Hook", "SoHo",
    "Tribeca", "Upper East Side", "Upper West Side", "Washington Heights",
    "Williamsburg", "Woodside", "Bensonhurst", "Kew Gardens",
    "Long Island City", "Sunnyside", "Bayside", "Riverdale",
]

NOUNS = ["Dragon", "Lotus", "Harbor", "Palace", "Empire", "Crown",
         "Phoenix", "Star", "Moon", "Garden", "Ocean", "Summit"]
SPECIALTIES = ["MD", "DDS", "DO", "DPM", "OD"]

NAME_TEMPLATES = {
    "Restaurants": [
        lambda n, f, l: f"{n} Kitchen",
        lambda n, f, l: f"{f}'s Pizzeria",
        lambda n, f, l: f"Golden {random.choice(NOUNS)}",
        lambda n, f, l: f"{n} Cafe",
        lambda n, f, l: f"{f}'s Bistro",
        lambda n, f, l: f"{n} Deli",
        lambda n, f, l: f"{f}'s Grill",
        lambda n, f, l: f"Taste of {n}",
    ],
    "Retail": [
        lambda n, f, l: f"{n} Market",
        lambda n, f, l: f"{f}'s Grocery",
        lambda n, f, l: f"{n} Pharmacy",
        lambda n, f, l: f"Fashion {random.choice(NOUNS)}",
        lambda n, f, l: f"{n} Jewelers",
        lambda n, f, l: f"{f}'s Variety",
    ],
    "Services": [
        lambda n, f, l: f"{f}'s Barbershop",
        lambda n, f, l: f"{n} Cleaners",
        lambda n, f, l: f"{f}'s Salon",
        lambda n, f, l: f"{n} Spa",
        lambda n, f, l: f"Elite {random.choice(NOUNS)}",
    ],
    "Auto": [
        lambda n, f, l: f"{n} Auto Repair",
        lambda n, f, l: f"{f}'s Auto Body",
        lambda n, f, l: f"Express Car Wash",
        lambda n, f, l: f"{f}'s Auto Parts",
        lambda n, f, l: f"{n} Gas",
    ],
    "Health": [
        lambda n, f, l: f"Dr. {l}, {random.choice(SPECIALTIES)}",
        lambda n, f, l: f"{n} Dental",
        lambda n, f, l: f"{l} Medical",
        lambda n, f, l: f"{n} Wellness",
    ],
    "Other": [
        lambda n, f, l: f"{n} Florist",
        lambda n, f, l: f"{f}'s Hardware",
        lambda n, f, l: f"{n} Inn",
        lambda n, f, l: f"{f}'s Electric",
    ],
}

CATEGORIES = ["Restaurants", "Retail", "Services", "Auto", "Health", "Other"]
CAT_WEIGHTS = [34, 22, 18, 12, 8, 6]
PROCESSOR_WEIGHTS = [44, 24, 16, 10, 6]

mcc_by_cat = {}
mcc_info = {}
for row in mcc_data:
    mcc, desc, cat, risk, low, high = row
    mcc_by_cat.setdefault(cat, []).append(mcc)
    mcc_info[mcc] = {"category": cat, "low": low, "high": high, "risk": risk}

ISO_COUNTS = {1: 2847, 2: 1024, 3: 741}

merchants = []
merchant_rows = []
merchant_id = 0
used_names = set()

for iso_id, count in ISO_COUNTS.items():
    for _ in range(count):
        merchant_id += 1
        cat = random.choices(CATEGORIES, weights=CAT_WEIGHTS, k=1)[0]
        mcc = random.choice(mcc_by_cat[cat])
        info = mcc_info[mcc]

        neighborhood = random.choice(NEIGHBORHOODS)
        first = fake.first_name()
        last = fake.last_name()
        template = random.choice(NAME_TEMPLATES[cat])
        dba = template(neighborhood, first, last)
        attempt = 0
        while dba in used_names and attempt < 5:
            neighborhood = random.choice(NEIGHBORHOODS)
            first = fake.first_name()
            last = fake.last_name()
            dba = template(neighborhood, first, last)
            attempt += 1
        if dba in used_names:
            dba = f"{dba} #{merchant_id}"
        used_names.add(dba)

        proc_id = random.choices([1, 2, 3, 4, 5], weights=PROCESSOR_WEIGHTS, k=1)[0]
        mid_str = f"5489-{random.randint(1000,9999)}-{random.randint(1000,9999)}"
        status = random.choices(["Active", "Boarding", "Inactive"], weights=[95, 2, 3], k=1)[0]
        risk = int(np.clip(np.random.normal(72, 15), 10, 100))

        if iso_id == 1:
            bd = date(2025, 4, 1) - timedelta(days=random.randint(365, 5 * 365))
        elif iso_id == 2:
            bd = date(2025, 10, 1) + timedelta(days=random.randint(0, 180))
        else:
            bd = date(2026, 1, 15) + timedelta(days=random.randint(0, 75))

        avg_ticket = round(random.uniform(info["low"], info["high"]), 2)
        annual_vol = round(avg_ticket * random.randint(5000, 30000), 2)

        street = fake.street_address()
        zipcode = f"1{random.randint(0,1)}{random.randint(0,9)}{random.randint(0,9)}{random.randint(0,9)}"
        phone = f"212-{random.randint(200,999)}-{random.randint(1000,9999)}"
        clean_name = dba.lower().replace(' ', '').replace('.', '').replace(',', '').replace('#', '').replace("'", '')[:20]
        email = f"info@{clean_name}.com"

        merchant_rows.append((
            merchant_id, iso_id, proc_id, mid_str, dba, f"{dba} LLC", mcc,
            street, "New York", "NY", zipcode, phone, email, None,
            status, bd, annual_vol, avg_ticket, risk,
        ))

        merchants.append({
            "merchant_id": merchant_id,
            "iso_id": iso_id,
            "mcc": mcc,
            "category": cat,
            "status": status,
            "avg_ticket": avg_ticket,
            "annual_vol": annual_vol,
            "boarding_date": bd,
            "risk_score": risk,
        })

conn.executemany(
    """INSERT INTO merchants (merchant_id, iso_id, processor_id, mid, dba_name,
       legal_name, mcc, address_street, address_city, address_state, address_zip,
       phone, email, website, status, boarding_date, annual_volume_estimate,
       avg_ticket, risk_score)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
    merchant_rows,
)
print(f"[{elapsed()}]   {len(merchant_rows)} merchants inserted")

# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 3: Merchant Owners (~5,100)
# ═══════════════════════════════════════════════════════════════════════════════
print(f"[{elapsed()}] Phase 3: Merchant Owners")

owner_rows = []
owner_id = 0

for m in merchants:
    mid = m["merchant_id"]
    has_partner = random.random() < 0.10
    if has_partner:
        pct1 = random.randint(51, 80)
        pct2 = 100 - pct1
        for pct, is_ctrl in [(pct1, True), (pct2, False)]:
            owner_id += 1
            fn, ln = fake.first_name(), fake.last_name()
            kyc = m["status"] == "Active"
            kyc_at = datetime.now() - timedelta(days=random.randint(30, 365)) if kyc else None
            owner_rows.append((
                owner_id, mid, fn, ln,
                "Owner" if is_ctrl else "Partner",
                pct,
                f"{random.randint(1000,9999)}",
                fake.date_of_birth(minimum_age=25, maximum_age=70),
                f"917-{random.randint(200,999)}-{random.randint(1000,9999)}",
                f"{fn.lower()}.{ln.lower()}@email.com",
                is_ctrl, kyc, kyc_at,
            ))
    else:
        owner_id += 1
        fn, ln = fake.first_name(), fake.last_name()
        kyc = m["status"] == "Active"
        kyc_at = datetime.now() - timedelta(days=random.randint(30, 365)) if kyc else None
        owner_rows.append((
            owner_id, mid, fn, ln, "Owner", 100.00,
            f"{random.randint(1000,9999)}",
            fake.date_of_birth(minimum_age=25, maximum_age=70),
            f"917-{random.randint(200,999)}-{random.randint(1000,9999)}",
            f"{fn.lower()}.{ln.lower()}@email.com",
            True, kyc, kyc_at,
        ))

conn.executemany(
    """INSERT INTO merchant_owners (owner_id, merchant_id, first_name, last_name,
       title, ownership_pct, ssn_last4, dob, phone, email,
       is_control_person, kyc_verified, kyc_verified_at)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)""",
    owner_rows,
)
print(f"[{elapsed()}]   {len(owner_rows)} owners inserted")

# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 4: Pricing (4,612)
# ═══════════════════════════════════════════════════════════════════════════════
print(f"[{elapsed()}] Phase 4: Pricing")

pricing_rows = []
merchant_pricing = {}
for i, m in enumerate(merchants, 1):
    mid = m["merchant_id"]
    dr = round(random.uniform(0.0250, 0.0350), 4)
    ptf = round(random.uniform(0.08, 0.15), 4)
    mf = random.choice([0, 9.95, 14.95, 24.95])
    pci = random.choice([0, 9.95, 19.95])
    pricing_rows.append((
        i, mid, "Interchange Plus", dr, ptf, mf, pci, 0, 0.10, 25.00, 0,
        m["boarding_date"], None, True,
    ))
    merchant_pricing[mid] = {"discount_rate": dr, "per_txn_fee": ptf}

conn.executemany(
    """INSERT INTO pricing (pricing_id, merchant_id, pricing_model, discount_rate,
       per_txn_fee, monthly_fee, pci_fee, statement_fee, batch_fee,
       chargeback_fee, annual_fee, effective_date, end_date, is_current)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
    pricing_rows,
)
print(f"[{elapsed()}]   {len(pricing_rows)} pricing records inserted")

# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 5: Equipment (~4,400)
# ═══════════════════════════════════════════════════════════════════════════════
print(f"[{elapsed()}] Phase 5: Equipment")

EQUIPMENT = [
    ("POS Terminal", "PAX A920", "PAX", 40),
    ("POS Terminal", "Clover Flex", "CLV", 25),
    ("POS Terminal", "Dejavoo Z11", "DJV", 20),
    ("Virtual Terminal", "Virtual Terminal", "VTL", 15),
]
eq_models = [(t, m, p) for t, m, p, _ in EQUIPMENT]
eq_weights = [w for _, _, _, w in EQUIPMENT]

equip_rows = []
eq_id = 0
for m in merchants:
    if m["status"] != "Active":
        continue
    eq_id += 1
    dev_type, model, prefix = random.choices(eq_models, weights=eq_weights, k=1)[0]
    serial = f"{prefix}{random.randint(10000000, 99999999)}"
    fw = f"{random.randint(1,5)}.{random.randint(0,9)}.{random.randint(0,99)}"
    conn_type = "WiFi" if dev_type == "POS Terminal" else "Ethernet"
    deploy = m["boarding_date"] + timedelta(days=random.randint(1, 14))
    last_txn = date(2026, 3, 31) - timedelta(days=random.randint(0, 7))
    equip_rows.append((
        eq_id, m["merchant_id"], dev_type, model, serial, fw, conn_type,
        dev_type == "POS Terminal", "Active", deploy, last_txn, True,
    ))

conn.executemany(
    """INSERT INTO equipment (equipment_id, merchant_id, device_type, make_model,
       serial_number, firmware_version, connection_type, p2pe_certified,
       status, deployed_date, last_txn_date, is_online)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?)""",
    equip_rows,
)
print(f"[{elapsed()}]   {len(equip_rows)} equipment records inserted")

# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 6: PCI Compliance (4,612)
# ═══════════════════════════════════════════════════════════════════════════════
print(f"[{elapsed()}] Phase 6: PCI Compliance")

pci_rows = []
for i, m in enumerate(merchants, 1):
    mid = m["merchant_id"]
    cs = random.choices(
        ["Compliant", "Non-Compliant", "Pending"], weights=[87, 9, 4], k=1
    )[0]
    saq_type = random.choice(["SAQ A", "SAQ B", "SAQ C", "SAQ D"])
    saq_done = date(2025, 4, 1) + timedelta(days=random.randint(0, 300))
    saq_exp = saq_done + timedelta(days=365)
    last_scan = date(2026, 3, 31) - timedelta(days=random.randint(0, 90))
    scan_result = "Pass" if cs == "Compliant" else ("Fail" if cs == "Non-Compliant" else "Pending")
    next_scan = last_scan + timedelta(days=90)
    nc_days = random.randint(30, 180) if cs == "Non-Compliant" else 0
    pci_rows.append((
        i, mid, cs, saq_type, saq_done, saq_exp, last_scan, scan_result,
        next_scan, random.random() < 0.3, random.random() < 0.6,
        saq_done - timedelta(days=random.randint(0, 60)),
        random.random() < 0.5, nc_days, 19.95 if cs == "Non-Compliant" else 0,
    ))

conn.executemany(
    """INSERT INTO pci_compliance (pci_id, merchant_id, compliance_status,
       saq_type, saq_completed_date, saq_expiration_date, last_asv_scan_date,
       last_asv_result, next_asv_scan_date, p2pe_validated,
       tokenization_enabled, employee_training_date, breach_plan_filed,
       non_compliant_days, monthly_noncompliance_fee)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
    pci_rows,
)
print(f"[{elapsed()}]   {len(pci_rows)} PCI records inserted")

# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 7: Daily Transactions (~1.6M rows) — CRITICAL
# Uses pandas DataFrames + DuckDB INSERT FROM for zero Python-loop insertion
# ═══════════════════════════════════════════════════════════════════════════════
print(f"[{elapsed()}] Phase 7: Daily Transactions (pandas vectorized...)")

START_DATE = date(2025, 4, 1)
END_DATE = date(2026, 3, 31)

monthly_targets = {
    4: 18.2, 5: 19.1, 6: 20.4, 7: 21.2, 8: 22.8, 9: 23.5,
    10: 25.1, 11: 26.3, 12: 27.8, 1: 29.2, 2: 30.5, 3: 32.1,
}

DOW_DEFAULT = np.array([0.9, 0.95, 1.0, 1.0, 1.2, 1.3, 0.6])
DOW_RESTAURANT = np.array([0.8, 0.85, 0.9, 0.95, 1.15, 1.35, 1.0])

active_merchants = [m for m in merchants if m["status"] == "Active"]
n_active = len(active_merchants)
print(f"[{elapsed()}]   {n_active} active merchants")

total_annual = sum(m["annual_vol"] for m in active_merchants)

m_ids = np.array([m["merchant_id"] for m in active_merchants], dtype=np.int32)
m_avg_tickets = np.array([m["avg_ticket"] for m in active_merchants], dtype=np.float64)
m_annual_vols = np.array([m["annual_vol"] for m in active_merchants], dtype=np.float64)
m_is_restaurant = np.array([m["category"] == "Restaurants" for m in active_merchants])

merchant_shares = m_annual_vols / total_annual

txn_id_counter = 0
total_txn_rows = 0

current = START_DATE
while current <= END_DATE:
    month_num = current.month
    year_num = current.year
    if month_num == 12:
        next_month_start = date(year_num + 1, 1, 1)
    else:
        next_month_start = date(year_num, month_num + 1, 1)
    month_end = min(next_month_start - timedelta(days=1), END_DATE)
    days_in_month = (month_end - current).days + 1

    target_vol = monthly_targets[month_num] * 1e6
    merchant_monthly_targets = merchant_shares * target_vol

    # Build all days for this month in one shot
    # Shape: (days_in_month, n_active)
    days_range = np.arange(days_in_month)
    dates_list = [current + timedelta(days=int(d)) for d in days_range]
    dows = np.array([d.weekday() for d in dates_list])  # shape (days,)

    # DOW factors: shape (days, n_active)
    dow_def_factors = DOW_DEFAULT[dows][:, None]  # (days, 1)
    dow_rest_factors = DOW_RESTAURANT[dows][:, None]  # (days, 1)
    dow_factors = np.where(m_is_restaurant[None, :], dow_rest_factors, dow_def_factors)  # (days, n_active)

    daily_base = (merchant_monthly_targets[None, :] / days_in_month) * dow_factors
    noise = np.random.uniform(0.8, 1.2, (days_in_month, n_active))
    daily_volume = np.maximum(daily_base * noise, 0)

    sale_counts = np.maximum(np.round(daily_volume / m_avg_tickets[None, :]).astype(np.int32), 0)
    sale_amounts = np.round(sale_counts * m_avg_tickets[None, :], 2)

    # Refunds: 2% chance per merchant per day
    refund_mask = np.random.random((days_in_month, n_active)) < 0.02
    refund_counts = np.where(refund_mask, np.maximum(1, (sale_counts * 0.02).astype(np.int32)), 0)
    refund_amounts = np.round(refund_counts * m_avg_tickets[None, :], 2)

    # Voids: 0.5%
    void_mask = np.random.random((days_in_month, n_active)) < 0.005
    void_counts = np.where(void_mask, 1, 0).astype(np.int32)
    void_amounts = np.round(void_counts * m_avg_tickets[None, :] * 0.5, 2)

    net_amounts = np.round(sale_amounts - refund_amounts - void_amounts, 2)

    # Tips
    tip_rand = np.random.uniform(0.08, 0.18, (days_in_month, n_active))
    tip_amounts = np.where(
        m_is_restaurant[None, :],
        np.round(sale_amounts * tip_rand, 2),
        0,
    )

    # Card brands
    visa_counts = np.round(sale_counts * 0.45).astype(np.int32)
    mc_counts = np.round(sale_counts * 0.30).astype(np.int32)
    amex_counts = np.round(sale_counts * 0.15).astype(np.int32)
    disc_counts = np.maximum(sale_counts - visa_counts - mc_counts - amex_counts, 0)

    # Filter: only rows where sale_count > 0
    valid_mask = sale_counts > 0  # (days, n_active)
    n_valid = valid_mask.sum()

    if n_valid > 0:
        # Get day and merchant indices for valid entries
        day_idx, merch_idx = np.where(valid_mask)

        # Build date array: map day indices to dates
        date_arr = np.array([dates_list[d] for d in day_idx], dtype='datetime64[D]')

        # Assign IDs
        id_start = txn_id_counter + 1
        txn_id_counter += n_valid
        ids = np.arange(id_start, id_start + n_valid, dtype=np.int64)

        # Build DataFrame directly from numpy fancy indexing (no Python loop)
        df = pd.DataFrame({
            'id': ids,
            'merchant_id': m_ids[merch_idx].astype(np.int64),
            'txn_date': pd.to_datetime(date_arr),
            'sale_count': sale_counts[day_idx, merch_idx].astype(np.int64),
            'sale_amount': sale_amounts[day_idx, merch_idx],
            'refund_count': refund_counts[day_idx, merch_idx].astype(np.int64),
            'refund_amount': refund_amounts[day_idx, merch_idx],
            'void_count': void_counts[day_idx, merch_idx].astype(np.int64),
            'void_amount': void_amounts[day_idx, merch_idx],
            'net_amount': net_amounts[day_idx, merch_idx],
            'avg_ticket': m_avg_tickets[merch_idx],
            'tip_amount': tip_amounts[day_idx, merch_idx],
            'visa_count': visa_counts[day_idx, merch_idx].astype(np.int64),
            'mc_count': mc_counts[day_idx, merch_idx].astype(np.int64),
            'amex_count': amex_counts[day_idx, merch_idx].astype(np.int64),
            'discover_count': disc_counts[day_idx, merch_idx].astype(np.int64),
        })

        # Insert via DuckDB's native DataFrame scan (no Python loop, columnar transfer)
        conn.execute("INSERT INTO daily_transactions SELECT * FROM df")
        total_txn_rows += n_valid
        del df

    print(f"[{elapsed()}]   Month {year_num}-{month_num:02d}: {days_in_month} days, {n_valid:,} rows ({total_txn_rows:,} total)")
    current = next_month_start

print(f"[{elapsed()}]   {total_txn_rows:,} total transaction rows inserted")

# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 8: Deposits — SQL-based generation
# ═══════════════════════════════════════════════════════════════════════════════
print(f"[{elapsed()}] Phase 8: Deposits")

# First, insert pricing into a temp table for SQL join
conn.execute("""
    CREATE TEMP TABLE _pricing_lookup AS
    SELECT merchant_id, discount_rate, per_txn_fee
    FROM pricing WHERE is_current = true
""")

# Generate deposits via SQL: one per merchant per business day
conn.execute("""
    INSERT INTO deposits (deposit_id, merchant_id, batch_id, deposit_date,
        txn_count, gross_amount, fee_amount, net_amount, reserve_amount,
        bank_last4, status)
    SELECT
        ROW_NUMBER() OVER (ORDER BY dt.txn_date, dt.merchant_id) as deposit_id,
        dt.merchant_id,
        'BTH-' || EXTRACT(YEAR FROM dt.txn_date)::VARCHAR || '-' ||
            LPAD(ROW_NUMBER() OVER (ORDER BY dt.txn_date, dt.merchant_id)::VARCHAR, 7, '0') as batch_id,
        dt.txn_date as deposit_date,
        dt.sale_count as txn_count,
        dt.sale_amount as gross_amount,
        ROUND(dt.sale_amount * p.discount_rate + dt.sale_count * p.per_txn_fee, 2) as fee_amount,
        ROUND(dt.sale_amount - (dt.sale_amount * p.discount_rate + dt.sale_count * p.per_txn_fee), 2) as net_amount,
        0 as reserve_amount,
        LPAD((ABS(HASH(dt.merchant_id || dt.txn_date::VARCHAR)) % 9000 + 1000)::VARCHAR, 4, '0') as bank_last4,
        'Deposited' as status
    FROM daily_transactions dt
    JOIN _pricing_lookup p ON dt.merchant_id = p.merchant_id
    WHERE EXTRACT(DOW FROM dt.txn_date) BETWEEN 1 AND 5
""")

dep_count = conn.execute("SELECT COUNT(*) FROM deposits").fetchone()[0]
print(f"[{elapsed()}]   {dep_count:,} deposit rows inserted (SQL-based)")

# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 9: Chargebacks (~17K)
# ═══════════════════════════════════════════════════════════════════════════════
print(f"[{elapsed()}] Phase 9: Chargebacks")

total_vol = conn.execute("SELECT SUM(sale_amount) FROM daily_transactions").fetchone()[0]
target_cb_volume = float(total_vol) * 0.0035

HIGH_RISK_MCC = {"5944": 1.2, "7542": 0.8, "5813": 0.6}

REASON_CODES = [
    ("4837", "Not Recognized", 25),
    ("4855", "Merchandise Not Received", 30),
    ("4834", "Duplicate", 20),
    ("4860", "Credit Not Processed", 15),
    ("4863", "Fraudulent", 10),
]
reason_items = [(c, d) for c, d, _ in REASON_CODES]
reason_weights = [w for _, _, w in REASON_CODES]

CB_STATUS = [("Won", 35), ("Lost", 30), ("Open", 15), ("Under Review", 20)]
cb_statuses = [s for s, _ in CB_STATUS]
cb_weights = [w for _, w in CB_STATUS]

CARD_BRANDS = ["Visa", "Mastercard", "Amex", "Discover"]
BRAND_WEIGHTS = [45, 30, 15, 10]

cb_rows = []
cb_id = 0
cb_total = 0.0

merchant_cb_weights = []
for m in active_merchants:
    base = m["annual_vol"]
    multiplier = HIGH_RISK_MCC.get(m["mcc"], 0.35) / 0.35
    merchant_cb_weights.append(base * multiplier)

while cb_total < target_cb_volume:
    cb_id += 1
    m = random.choices(active_merchants, weights=merchant_cb_weights, k=1)[0]
    amount = round(random.uniform(20, m["avg_ticket"] * 3), 2)
    cb_total += amount
    filed = START_DATE + timedelta(days=random.randint(0, 364))
    reason_code, reason_desc = random.choices(reason_items, weights=reason_weights, k=1)[0]
    status = random.choices(cb_statuses, weights=cb_weights, k=1)[0]
    brand = random.choices(CARD_BRANDS, weights=BRAND_WEIGHTS, k=1)[0]
    deadline = filed + timedelta(days=30)
    resolved = filed + timedelta(days=random.randint(10, 90)) if status in ("Won", "Lost") else None
    rep_filed = status in ("Won", "Under Review") and random.random() < 0.7
    case = f"CB-{filed.year}-{cb_id:06d}"
    card4 = f"{random.randint(1000,9999)}"

    cb_rows.append((
        cb_id, m["merchant_id"], case, filed, brand, card4, amount,
        reason_code, reason_desc, deadline, status, rep_filed, resolved,
    ))

conn.executemany(
    """INSERT INTO chargebacks (chargeback_id, merchant_id, case_number,
       filed_date, card_brand, card_last4, amount, reason_code, reason_desc,
       response_deadline, status, representment_filed, resolved_date)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)""",
    cb_rows,
)
print(f"[{elapsed()}]   {len(cb_rows):,} chargebacks inserted (${cb_total:,.0f} total)")

# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 10: Residuals (~52.8K) — SQL-based with buy_rate lookup
# ═══════════════════════════════════════════════════════════════════════════════
print(f"[{elapsed()}] Phase 10: Residuals")

ISO_SPLIT = {1: 1.00, 2: 0.70, 3: 0.60}

# Build merchant lookup
merchant_by_id = {m["merchant_id"]: m for m in merchants}

month_starts = []
d = START_DATE
while d <= END_DATE:
    month_starts.append(d)
    if d.month == 12:
        d = date(d.year + 1, 1, 1)
    else:
        d = date(d.year, d.month + 1, 1)

res_rows = []
res_id = 0

for ms in month_starts:
    if ms.month == 12:
        me = date(ms.year + 1, 1, 1) - timedelta(days=1)
    else:
        me = date(ms.year, ms.month + 1, 1) - timedelta(days=1)
    me = min(me, END_DATE)

    rows = conn.execute("""
        SELECT merchant_id, SUM(sale_amount) as vol, SUM(sale_count) as txn_cnt
        FROM daily_transactions
        WHERE txn_date >= ? AND txn_date <= ?
        GROUP BY merchant_id
    """, [ms, me]).fetchall()

    for row in rows:
        mid, vol, txn_cnt = row
        if mid not in merchant_pricing:
            continue
        vol = float(vol)
        if vol == 0:
            continue
        pr = merchant_pricing[mid]
        m_info = merchant_by_id.get(mid)
        if not m_info:
            continue

        iso_id = m_info["iso_id"]
        per_txn_adj = pr["per_txn_fee"] * txn_cnt / vol
        effective_rate = pr["discount_rate"] + per_txn_adj
        gross_rev = round(vol * effective_rate, 2)
        buy_rate = round(random.uniform(0.018, 0.022), 4)
        buy_cost = round(vol * buy_rate, 2)
        net_res = round(gross_rev - buy_cost, 2)
        split_pct = ISO_SPLIT[iso_id]
        iso_res = round(net_res * split_pct, 2)

        res_id += 1
        res_rows.append((
            res_id, iso_id, mid, ms, vol, gross_rev, buy_cost,
            net_res, split_pct * 100, iso_res, txn_cnt,
        ))

    # Flush periodically
    if len(res_rows) >= BATCH_SIZE:
        conn.executemany(
            """INSERT INTO residuals (residual_id, iso_id, merchant_id, month,
               processing_volume, gross_revenue, buy_rate_cost, net_residual,
               iso_split_pct, iso_residual, txn_count)
               VALUES (?,?,?,?,?,?,?,?,?,?,?)""",
            res_rows,
        )
        res_rows = []

if res_rows:
    conn.executemany(
        """INSERT INTO residuals (residual_id, iso_id, merchant_id, month,
           processing_volume, gross_revenue, buy_rate_cost, net_residual,
           iso_split_pct, iso_residual, txn_count)
           VALUES (?,?,?,?,?,?,?,?,?,?,?)""",
        res_rows,
    )

total_res = conn.execute("SELECT COUNT(*) FROM residuals").fetchone()[0]
print(f"[{elapsed()}]   {total_res:,} residual rows inserted")

# Scale residuals so March 2026 iso_residual total ≈ $3.21M
mar_actual = conn.execute(
    "SELECT SUM(iso_residual) FROM residuals WHERE month = '2026-03-01'"
).fetchone()[0]
if mar_actual and float(mar_actual) > 0:
    scale_factor = 3_210_000.0 / float(mar_actual)
    conn.execute(f"""
        UPDATE residuals SET
            gross_revenue = ROUND(gross_revenue::DOUBLE * {scale_factor}, 2),
            net_residual = ROUND(net_residual::DOUBLE * {scale_factor}, 2),
            iso_residual = ROUND(iso_residual::DOUBLE * {scale_factor}, 2)
    """)
    print(f"[{elapsed()}]   Scaled residuals by {scale_factor:.2f}x to hit $3.21M March target")

# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 11: Leads (~200)
# ═══════════════════════════════════════════════════════════════════════════════
print(f"[{elapsed()}] Phase 11: Leads")

LEAD_STAGES = [
    ("Lead", 30), ("Proposal", 25), ("Application", 15),
    ("Underwriting", 10), ("Approval", 8), ("Boarding", 5),
    ("Equipment", 4), ("Go-Live", 3),
]
lead_stage_names = [s for s, _ in LEAD_STAGES]
lead_stage_weights = [w for _, w in LEAD_STAGES]

SOURCES = [
    ("Voice Agent", 40), ("Referral", 25), ("Web", 15),
    ("Walk-in", 10), ("Cold Call", 10),
]
source_names = [s for s, _ in SOURCES]
source_weights = [w for _, w in SOURCES]

AGENTS = ["Alex Park", "Jordan Lee", "Taylor Kim", "Morgan Chen", "Casey Rivera"]

lead_rows = []
for i in range(1, 201):
    iso_id = random.choices([1, 2, 3], weights=[60, 25, 15], k=1)[0]
    cat = random.choices(CATEGORIES, weights=CAT_WEIGHTS, k=1)[0]
    mcc = random.choice(mcc_by_cat[cat])
    neighborhood = random.choice(NEIGHBORHOODS)
    first = fake.first_name()
    last = fake.last_name()
    template = random.choice(NAME_TEMPLATES[cat])
    biz_name = template(neighborhood, first, last)
    stage = random.choices(lead_stage_names, weights=lead_stage_weights, k=1)[0]
    source = random.choices(source_names, weights=source_weights, k=1)[0]
    ai_score = random.randint(45, 95)
    est_vol = round(random.uniform(5000, 150000), 2)
    cur_rate = round(random.uniform(0.0280, 0.0450), 4)
    savings = round(est_vol * (cur_rate - random.uniform(0.0250, 0.0300)), 2)
    phone = f"212-{random.randint(200,999)}-{random.randint(1000,9999)}"
    email = f"{first.lower()}.{last.lower()}@email.com"
    created = datetime.now() - timedelta(days=random.randint(1, 180))

    lead_rows.append((
        i, iso_id, biz_name, f"{first} {last}", phone, email,
        neighborhood, mcc, est_vol,
        random.choice(["Square", "Toast", "Clover", "PayPal", "Stripe"]),
        cur_rate, savings, stage, ai_score, source,
        random.choice(AGENTS), None, None, created, created,
    ))

conn.executemany(
    "INSERT INTO leads VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    lead_rows,
)
print(f"[{elapsed()}]   {len(lead_rows)} leads inserted")

# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 12: Applications (~80)
# ═══════════════════════════════════════════════════════════════════════════════
print(f"[{elapsed()}] Phase 12: Applications")

APP_STAGES = [
    "Document Collection", "Underwriting Review", "Risk Assessment",
    "Bank Review", "Final Approval", "Declined", "Withdrawn",
]
APP_STATUSES = ["Pending", "In Review", "Approved", "Declined", "Withdrawn"]

app_rows = []
for i in range(1, 81):
    lead_id = random.randint(1, 200) if random.random() < 0.6 else None
    iso_id = random.choices([1, 2, 3], weights=[60, 25, 15], k=1)[0]
    cat = random.choices(CATEGORIES, weights=CAT_WEIGHTS, k=1)[0]
    mcc = random.choice(mcc_by_cat[cat])
    neighborhood = random.choice(NEIGHBORHOODS)
    first = fake.first_name()
    last = fake.last_name()
    template = random.choice(NAME_TEMPLATES[cat])
    name = template(neighborhood, first, last)
    stage = random.choice(APP_STAGES)
    status = random.choice(APP_STATUSES)
    risk = random.randint(30, 95)
    risk_label = "Low" if risk >= 70 else ("Medium" if risk >= 40 else "High")
    submitted = date(2026, 3, 31) - timedelta(days=random.randint(1, 180))
    decision = submitted + timedelta(days=random.randint(3, 30)) if status in ("Approved", "Declined") else None
    reason = None
    if status == "Declined":
        reason = random.choice(["High risk score", "Insufficient docs", "Credit check failed", "Volume mismatch"])
    est_vol = round(random.uniform(10000, 200000), 2)

    app_rows.append((
        i, lead_id, iso_id, name, f"{name} LLC", mcc, "Esquire Bank",
        submitted, stage, risk, risk_label, status,
        random.choice(AGENTS), est_vol, decision, reason, None,
    ))

conn.executemany(
    """INSERT INTO applications (application_id, lead_id, iso_id, merchant_name,
       legal_name, mcc, bank_name, submitted_date, stage, risk_score,
       risk_label, status, assigned_to, estimated_volume, decision_date,
       decision_reason, created_merchant_id)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
    app_rows,
)
print(f"[{elapsed()}]   {len(app_rows)} applications inserted")

# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 13: Documents (~300)
# ═══════════════════════════════════════════════════════════════════════════════
print(f"[{elapsed()}] Phase 13: Documents")

DOC_TYPES = [
    "Bank Statement", "Business License", "Tax Return",
    "Voided Check", "Processing Statement", "ID Verification",
    "Lease Agreement", "Articles of Incorporation",
]

doc_rows = []
doc_id = 0
for app in app_rows:
    app_id = app[0]
    n_docs = random.randint(2, 5)
    for _ in range(n_docs):
        doc_id += 1
        doc_type = random.choice(DOC_TYPES)
        ext = random.choice(["pdf", "jpg", "png"])
        fname = f"{doc_type.lower().replace(' ', '_')}_{doc_id}.{ext}"
        size = random.randint(50, 5000)
        status = random.choices(
            ["Verified", "Pending", "Rejected"], weights=[60, 30, 10], k=1
        )[0]
        verified_by = random.choice(AGENTS) if status == "Verified" else None
        verified_at = datetime.now() - timedelta(days=random.randint(1, 90)) if status == "Verified" else None
        exp = date(2027, 1, 1) + timedelta(days=random.randint(0, 365)) if doc_type in ("Business License", "ID Verification") else None

        doc_rows.append((
            doc_id, None, app_id, doc_type, fname, size,
            status, verified_by, verified_at, exp,
        ))

conn.executemany(
    """INSERT INTO documents (document_id, merchant_id, application_id,
       document_type, file_name, file_size_kb, status, verified_by,
       verified_at, expiration_date)
       VALUES (?,?,?,?,?,?,?,?,?,?)""",
    doc_rows,
)
print(f"[{elapsed()}]   {len(doc_rows)} documents inserted")

# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 14: Risk Assessments (~52.8K)
# ═══════════════════════════════════════════════════════════════════════════════
print(f"[{elapsed()}] Phase 14: Risk Assessments")

declining_set = set(random.sample(
    [m["merchant_id"] for m in merchants],
    k=int(len(merchants) * 0.05)
))

ra_rows = []
ra_id = 0
prev_scores = {m["merchant_id"]: m["risk_score"] for m in merchants}

for ms in month_starts:
    for m in merchants:
        mid = m["merchant_id"]
        ra_id += 1
        prev = prev_scores[mid]
        if mid in declining_set:
            drift = random.randint(-5, -1)
        else:
            drift = random.randint(-3, 3)
        new_score = max(10, min(100, prev + drift))
        change = new_score - prev
        prev_scores[mid] = new_score

        tier = "Low" if new_score >= 75 else ("Medium" if new_score >= 50 else "High")
        vol_trend = round(random.uniform(-10, 15), 2)
        cb_flag = new_score < 40 and random.random() < 0.3
        pci_flag = random.random() < 0.05
        vel_flag = random.random() < 0.03

        trigger = None
        action = None
        if new_score < 40:
            trigger = random.choice(["High chargeback rate", "Volume spike", "PCI non-compliance"])
            action = random.choice(["Review account", "Hold funds", "Contact merchant"])
        elif new_score < 60:
            trigger = "Moderate risk indicators"
            action = "Monitor closely"

        ra_rows.append((
            ra_id, mid, ms, new_score, prev, change, tier,
            vol_trend, cb_flag, pci_flag, vel_flag, trigger, action,
        ))

    # Flush each month
    if len(ra_rows) >= BATCH_SIZE:
        conn.executemany(
            """INSERT INTO risk_assessments (assessment_id, merchant_id,
               assessed_date, risk_score, previous_score, score_change,
               risk_tier, volume_trend_pct, chargeback_flag, pci_flag,
               velocity_flag, trigger_reason, recommended_action)
               VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)""",
            ra_rows,
        )
        ra_rows = []

if ra_rows:
    conn.executemany(
        """INSERT INTO risk_assessments (assessment_id, merchant_id,
           assessed_date, risk_score, previous_score, score_change,
           risk_tier, volume_trend_pct, chargeback_flag, pci_flag,
           velocity_flag, trigger_reason, recommended_action)
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)""",
        ra_rows,
    )

total_ra = conn.execute("SELECT COUNT(*) FROM risk_assessments").fetchone()[0]
print(f"[{elapsed()}]   {total_ra:,} risk assessments inserted")

# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 15: Products (~1,624)
# ═══════════════════════════════════════════════════════════════════════════════
print(f"[{elapsed()}] Phase 15: Products")

PRODUCTS = [
    ("POS Upgrade", 423, (29.95, 99.95)),
    ("Financing", 312, (0, 0)),
    ("Gift Cards", 234, (9.95, 29.95)),
    ("Banking", 189, (14.95, 49.95)),
    ("Payroll", 156, (29.95, 79.95)),
    ("Cash Advance", 145, (0, 0)),
    ("Insurance", 98, (19.95, 49.95)),
    ("Loyalty", 67, (9.95, 24.95)),
]

prod_rows = []
prod_id = 0
active_ids = [m["merchant_id"] for m in active_merchants]

for prod_name, count, (rev_low, rev_high) in PRODUCTS:
    selected = random.sample(active_ids, min(count, len(active_ids)))
    for mid in selected:
        prod_id += 1
        enrolled = date(2025, 4, 1) + timedelta(days=random.randint(0, 364))
        rev = round(random.uniform(rev_low, rev_high), 2) if rev_high > 0 else 0
        prod_rows.append((prod_id, mid, prod_name, enrolled, "Active", rev))

conn.executemany(
    """INSERT INTO products (product_id, merchant_id, product_name,
       enrolled_date, status, monthly_revenue)
       VALUES (?,?,?,?,?,?)""",
    prod_rows,
)
print(f"[{elapsed()}]   {len(prod_rows)} products inserted")

# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 16: Support Tickets (~700)
# ═══════════════════════════════════════════════════════════════════════════════
print(f"[{elapsed()}] Phase 16: Support Tickets")

TICKET_CATS = [
    ("Billing", 25), ("Equipment", 20), ("Settlement", 20),
    ("Rate Review", 15), ("General", 20),
]
tkt_cat_names = [c for c, _ in TICKET_CATS]
tkt_cat_weights = [w for _, w in TICKET_CATS]

TICKET_SUBJECTS = {
    "Billing": ["Incorrect fee charge", "Missing statement", "Billing dispute", "Rate discrepancy"],
    "Equipment": ["Terminal not working", "Paper roll needed", "WiFi connection issue", "Terminal upgrade request"],
    "Settlement": ["Missing deposit", "Delayed settlement", "Batch not closing", "Deposit discrepancy"],
    "Rate Review": ["Rate reduction request", "Competitive rate match", "Annual review", "Volume-based pricing"],
    "General": ["Account update", "Contact info change", "Statement request", "General inquiry"],
}

ticket_rows = []
for i in range(1, 701):
    mid = random.choice(active_ids)
    cat = random.choices(tkt_cat_names, weights=tkt_cat_weights, k=1)[0]
    subj = random.choice(TICKET_SUBJECTS[cat])
    priority = random.choices(
        ["Low", "Normal", "High", "Urgent"], weights=[15, 50, 25, 10], k=1
    )[0]
    is_resolved = random.random() < 0.85
    status = random.choice(["Resolved", "Closed"]) if is_resolved else random.choice(["Open", "In Progress", "Escalated"])
    opened = datetime.now() - timedelta(days=random.randint(1, 365))
    resolved_at = opened + timedelta(hours=random.randint(1, 168)) if is_resolved else None
    closed_at = resolved_at + timedelta(hours=random.randint(0, 24)) if resolved_at else None
    tkt_num = f"TKT-{opened.year}-{i:05d}"

    ticket_rows.append((
        i, mid, tkt_num, subj,
        f"{subj} - merchant reported issue requiring attention",
        cat, priority, status, random.choice(AGENTS),
        opened, resolved_at, closed_at,
    ))

conn.executemany(
    """INSERT INTO support_tickets (ticket_id, merchant_id, ticket_number,
       subject, description, category, priority, status, assigned_to,
       opened_at, resolved_at, closed_at)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?)""",
    ticket_rows,
)
print(f"[{elapsed()}]   {len(ticket_rows)} support tickets inserted")

# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 17: Voice Calls (~8,000)
# ═══════════════════════════════════════════════════════════════════════════════
print(f"[{elapsed()}] Phase 17: Voice Calls")

OUTCOMES = [
    ("Not Interested", 31.2), ("Gatekeeper", 22.4), ("No Answer", 18.7),
    ("Transfer", 15.1), ("Callback", 8.3), ("Voicemail", 4.3),
]
outcome_names = [o for o, _ in OUTCOMES]
outcome_weights = [w for _, w in OUTCOMES]

SENTIMENTS = ["Positive", "Neutral", "Negative"]

call_rows = []
for i in range(1, 8001):
    lead_id = random.randint(1, 200) if random.random() < 0.4 else None
    mid = random.choice(active_ids) if random.random() < 0.3 and not lead_id else None
    phone = f"212-{random.randint(200,999)}-{random.randint(1000,9999)}"
    neighborhood = random.choice(NEIGHBORHOODS)
    biz_name = f"{neighborhood} {random.choice(['Kitchen', 'Market', 'Shop', 'Deli', 'Salon'])}"

    call_dt = datetime(2026, 1, 1) + timedelta(
        days=random.randint(0, 89),
        hours=random.randint(8, 18),
        minutes=random.randint(0, 59),
    )
    duration = random.randint(10, 600)
    outcome = random.choices(outcome_names, weights=outcome_weights, k=1)[0]
    status = "Completed" if outcome not in ("No Answer", "Voicemail") else random.choice(["No Answer", "Completed"])
    sentiment = random.choice(SENTIMENTS) if status == "Completed" else None
    stage = random.choice(lead_stage_names)
    transfer = random.choice(AGENTS) if outcome == "Transfer" else None
    cost = round(random.uniform(0.02, 0.15), 4)

    call_rows.append((
        i, lead_id, mid, phone, biz_name, call_dt, duration,
        status, stage, sentiment, outcome, transfer,
        None, None, cost,
    ))

conn.executemany(
    """INSERT INTO voice_calls (call_id, lead_id, merchant_id, phone_number,
       business_name, call_date, duration_seconds, status, stage,
       sentiment, outcome, transfer_to, recording_url, notes, cost)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
    call_rows,
)
print(f"[{elapsed()}]   {len(call_rows)} voice calls inserted")

# ═══════════════════════════════════════════════════════════════════════════════
# VALIDATION
# ═══════════════════════════════════════════════════════════════════════════════
print(f"\n{'='*60}")
print(f"VALIDATION REPORT")
print(f"{'='*60}")

# 1. Row counts
print("\n1. Row counts:")
tables = [
    "isos", "mcc_codes", "processors", "merchants", "merchant_owners",
    "daily_transactions", "deposits", "chargebacks", "residuals", "pricing",
    "leads", "applications", "documents", "risk_assessments", "equipment",
    "pci_compliance", "products", "support_tickets", "voice_calls",
]
for t in tables:
    cnt = conn.execute(f"SELECT COUNT(*) FROM {t}").fetchone()[0]
    print(f"   {t:25s} {cnt:>12,}")

# 2. Merchant count by ISO
print("\n2. Merchant count by ISO:")
rows = conn.execute("""
    SELECT i.name, COUNT(*) FROM merchants m
    JOIN isos i ON m.iso_id = i.iso_id
    GROUP BY i.name ORDER BY COUNT(*) DESC
""").fetchall()
for name, cnt in rows:
    print(f"   {name:25s} {cnt:>6,}")

# 3. Category distribution
print("\n3. MCC Category distribution:")
rows = conn.execute("""
    SELECT mc.category, COUNT(*) as cnt,
           ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM merchants), 1) as pct
    FROM merchants m
    JOIN mcc_codes mc ON m.mcc = mc.mcc
    GROUP BY mc.category ORDER BY cnt DESC
""").fetchall()
for cat, cnt, pct in rows:
    print(f"   {cat:15s} {cnt:>6,}  ({pct:.1f}%)")

# 4. Monthly volume trend
print("\n4. Monthly volume trend:")
rows = conn.execute("""
    SELECT DATE_TRUNC('month', txn_date) as mon,
           ROUND(SUM(sale_amount)/1e6, 2) as vol_mm
    FROM daily_transactions
    GROUP BY mon ORDER BY mon
""").fetchall()
for mon, vol in rows:
    print(f"   {str(mon)[:7]:>10s}  ${vol:>8.2f}M")

# 5. March 2026 residuals
mar_res = conn.execute("""
    SELECT ROUND(SUM(iso_residual)/1e6, 2) FROM residuals
    WHERE month = '2026-03-01'
""").fetchone()[0]
print(f"\n5. March 2026 residuals total: ${mar_res:.2f}M")

# 6. DB file size
conn.close()
db_size = os.path.getsize(DB_PATH)
print(f"\n6. DB file size: {db_size / 1e6:.1f} MB")

print(f"\nTotal runtime: {elapsed()}")
print("Done!")
