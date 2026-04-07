/**
 * Data loader — imports JSON exported from DuckDB.
 * All data is build-time static (no runtime DB connection needed).
 */

// Core
import isos from './isos.json'
import merchantsRaw from './merchants.json'
import mccCodes from './mcc_codes.json'

// Dashboard
import dashboardKpisRaw from './dashboard_kpis.json'
import volumeTrend from './volume_trend.json'
import categoryMix from './category_mix.json'
import isoPortfolio from './iso_portfolio.json'
import atRiskMerchants from './at_risk_merchants.json'
import recentActivity from './recent_activity.json'

// CRM
import leadPipeline from './lead_pipeline.json'
import applications from './applications.json'

// Risk
import riskDistribution from './risk_distribution.json'
import processorDistribution from './processor_distribution.json'
import productPenetration from './product_penetration.json'
import chargebackTrend from './chargeback_trend.json'

// Voice
import voiceCalls from './voice_calls.json'
import voiceHourly from './voice_hourly.json'
import callOutcomes from './call_outcomes.json'

// Equipment
import equipmentSummary from './equipment_summary.json'

export {
  isos,
  merchantsRaw,
  mccCodes,
  dashboardKpisRaw,
  volumeTrend,
  categoryMix,
  isoPortfolio,
  atRiskMerchants,
  recentActivity,
  leadPipeline,
  applications,
  riskDistribution,
  processorDistribution,
  productPenetration,
  chargebackTrend,
  voiceCalls,
  voiceHourly,
  callOutcomes,
  equipmentSummary,
}
