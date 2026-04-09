-- ═══════════════════════════════════════════════════════════════════════
-- HARLOW PAYMENTS — DATABASE SCHEMA
-- Comprehensive schema covering all platform & merchant portal entities
-- ═══════════════════════════════════════════════════════════════════════

-- ─── ENUMS ───────────────────────────────────────────────────────────

CREATE TYPE merchant_status AS ENUM ('Active', 'Boarding', 'Inactive', 'Suspended');
CREATE TYPE iso_status AS ENUM ('Primary', 'Acquired');
CREATE TYPE integration_status AS ENUM ('Complete', 'In Progress', 'Not Started');
CREATE TYPE transaction_type AS ENUM ('Sale', 'Refund', 'Void', 'Auth');
CREATE TYPE transaction_status AS ENUM ('Settled', 'Processed', 'Voided', 'Pending', 'Declined');
CREATE TYPE deposit_status AS ENUM ('Deposited', 'Pending', 'Failed');
CREATE TYPE settlement_type AS ENUM ('Same-day', 'Next-day', 'T+2');
CREATE TYPE chargeback_status AS ENUM ('Open', 'Won', 'Lost', 'Expired');
CREATE TYPE chargeback_reason AS ENUM ('Merchandise Not Received', 'Duplicate Transaction', 'Credit Not Processed', 'Not Recognized', 'Fraud', 'Other');
CREATE TYPE risk_severity AS ENUM ('Critical', 'High', 'Moderate', 'Low', 'Inactive');
CREATE TYPE risk_tier AS ENUM ('Standard', 'Enhanced', 'High Risk');
CREATE TYPE pci_status AS ENUM ('Compliant', 'Non-Compliant', 'Pending', 'Expired');
CREATE TYPE kyb_status AS ENUM ('Current', 'Due Soon', 'Overdue', 'Pending');
CREATE TYPE lead_stage AS ENUM ('Lead', 'Qualified', 'Proposal', 'Negotiation', 'Contract', 'Closed', 'Lost');
CREATE TYPE app_stage AS ENUM ('Document Collection', 'KYB Review', 'Underwriting', 'Final Approval', 'Declined', 'Withdrawn');
CREATE TYPE app_status AS ENUM ('In Review', 'Approved', 'Declined', 'Withdrawn');
CREATE TYPE risk_label AS ENUM ('Low', 'Medium', 'High', 'Pending');
CREATE TYPE voice_call_status AS ENUM ('Completed', 'In Progress', 'Transferred', 'No Answer', 'Ringing', 'Failed');
CREATE TYPE voice_call_stage AS ENUM ('Greeting', 'Pitch', 'Objection', 'Close', 'Transfer', 'Equipment', 'Approval', 'Application', 'Proposal', 'Boarding');
CREATE TYPE sentiment AS ENUM ('Positive', 'Neutral', 'Negative', 'Skeptical');
CREATE TYPE card_brand AS ENUM ('Visa', 'Mastercard', 'Amex', 'Discover');
CREATE TYPE product_status AS ENUM ('Active', 'Pre-Approved', 'Available', 'Not Eligible', 'Cancelled');
CREATE TYPE funding_status AS ENUM ('Active', 'Paid Off', 'Delinquent', 'Pending');
CREATE TYPE payroll_run_status AS ENUM ('Scheduled', 'Processing', 'Paid', 'Failed');
CREATE TYPE employee_type AS ENUM ('Full-time', 'Part-time', 'Contractor');
CREATE TYPE insurance_plan_tier AS ENUM ('Bronze', 'Silver', 'Gold');
CREATE TYPE ticket_priority AS ENUM ('Low', 'Medium', 'High', 'Urgent');
CREATE TYPE ticket_status AS ENUM ('Open', 'In Progress', 'Resolved', 'Closed');
CREATE TYPE ai_message_role AS ENUM ('user', 'assistant', 'system');

-- ─── CORE TABLES ─────────────────────────────────────────────────────

-- ISOs (Independent Sales Organizations)
CREATE TABLE isos (
  id              SERIAL PRIMARY KEY,
  name            VARCHAR(255) NOT NULL,
  legal_name      VARCHAR(255),
  status          iso_status NOT NULL DEFAULT 'Primary',
  entity_type     VARCHAR(50),              -- LLC, Corp, etc.
  ein             VARCHAR(20),
  founded_year    INTEGER,
  hq_city         VARCHAR(100),
  hq_state        VARCHAR(2),
  address_street  VARCHAR(255),
  address_zip     VARCHAR(10),
  website         VARCHAR(255),
  industry_focus  VARCHAR(255),             -- comma-separated
  -- Financials
  iso_split_pct   DECIMAL(5,2),
  buy_rate        DECIMAL(5,4),
  total_monthly_volume    DECIMAL(14,2),
  total_monthly_residuals DECIMAL(12,2),
  -- Integration
  integration_status  integration_status DEFAULT 'Not Started',
  integration_pct     DECIMAL(5,2) DEFAULT 0,
  migration_target_date TIMESTAMP,
  -- Banking
  bank_partner    VARCHAR(255),
  bin_sponsor     VARCHAR(255),
  -- Contract
  contract_start_date DATE,
  contract_end_date   DATE,
  contract_term_years INTEGER,
  -- Acquisition
  acquisition_date     DATE,
  acquisition_price    DECIMAL(14,2),
  acquisition_multiple DECIMAL(5,2),
  -- Metrics (denormalized for dashboard speed)
  churn_rate              DECIMAL(5,2),
  pci_compliance_rate     DECIMAL(5,2),
  avg_ticket              DECIMAL(8,2),
  product_penetration_rate DECIMAL(5,2),
  --
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ISO Contacts
CREATE TABLE iso_contacts (
  id          SERIAL PRIMARY KEY,
  iso_id      INTEGER NOT NULL REFERENCES isos(id),
  first_name  VARCHAR(100),
  last_name   VARCHAR(100),
  title       VARCHAR(100),
  role        VARCHAR(100),
  phone       VARCHAR(20),
  email       VARCHAR(255),
  is_primary  BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- ISO Processors
CREATE TABLE iso_processors (
  id              SERIAL PRIMARY KEY,
  iso_id          INTEGER NOT NULL REFERENCES isos(id),
  processor_name  VARCHAR(255) NOT NULL,
  is_primary      BOOLEAN DEFAULT FALSE,
  volume_share_pct DECIMAL(5,2)
);

-- Processors (reference table)
CREATE TABLE processors (
  id    SERIAL PRIMARY KEY,
  name  VARCHAR(255) NOT NULL UNIQUE,
  -- e.g. Harlow Payments, Repay TSYS FEO, EPSG Wells Fargo, Card Point/First Data
  total_volume_m  DECIMAL(10,2),
  pct_of_total    DECIMAL(5,2)
);

-- MCC Codes (reference table)
CREATE TABLE mcc_codes (
  mcc           VARCHAR(10) PRIMARY KEY,
  description   VARCHAR(255),
  category      VARCHAR(100),          -- Restaurants, Retail, Services, Auto, Health, Other
  risk_tier     risk_tier DEFAULT 'Standard',
  avg_ticket_low  DECIMAL(8,2),
  avg_ticket_high DECIMAL(8,2)
);

-- ─── MERCHANTS ───────────────────────────────────────────────────────

CREATE TABLE merchants (
  id              SERIAL PRIMARY KEY,
  iso_id          INTEGER REFERENCES isos(id),
  dba_name        VARCHAR(255) NOT NULL,    -- Doing Business As
  legal_name      VARCHAR(255),
  mid             VARCHAR(50) UNIQUE NOT NULL, -- Merchant ID
  mcc             VARCHAR(10) REFERENCES mcc_codes(mcc),
  category        VARCHAR(100),
  processor_id    INTEGER REFERENCES processors(id),
  status          merchant_status NOT NULL DEFAULT 'Boarding',
  -- Address
  address_street  VARCHAR(255),
  address_city    VARCHAR(100),
  address_state   VARCHAR(2),
  address_zip     VARCHAR(10),
  -- Contact
  owner_first_name VARCHAR(100),
  owner_last_name  VARCHAR(100),
  email           VARCHAR(255),
  phone           VARCHAR(20),
  -- Financials
  annual_volume_estimate DECIMAL(14,2),
  avg_ticket       DECIMAL(8,2),
  effective_rate   DECIMAL(5,4),
  -- Risk
  risk_score       INTEGER CHECK (risk_score BETWEEN 0 AND 100),
  risk_severity    risk_severity,
  -- PCI
  pci_status           pci_status DEFAULT 'Pending',
  pci_valid_through    DATE,
  pci_saq_type         VARCHAR(10),        -- SAQ-A, SAQ-B, etc.
  -- KYB/KYC
  kyb_status       kyb_status DEFAULT 'Pending',
  kyb_last_screening DATE,
  kyb_next_due     DATE,
  -- Banking
  bank_name        VARCHAR(255),
  bank_routing     VARCHAR(20),
  bank_account_last4 VARCHAR(4),
  -- Dates
  boarding_date    DATE,
  created_at       TIMESTAMP DEFAULT NOW(),
  updated_at       TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_merchants_iso ON merchants(iso_id);
CREATE INDEX idx_merchants_status ON merchants(status);
CREATE INDEX idx_merchants_risk ON merchants(risk_score);
CREATE INDEX idx_merchants_mcc ON merchants(mcc);

-- ─── TRANSACTIONS ────────────────────────────────────────────────────

CREATE TABLE transactions (
  id              SERIAL PRIMARY KEY,
  merchant_id     INTEGER NOT NULL REFERENCES merchants(id),
  txn_ref         VARCHAR(50) UNIQUE,       -- TXN-XXXX
  txn_date        TIMESTAMP NOT NULL,
  type            transaction_type NOT NULL,
  card_brand      card_brand,
  card_last4      VARCHAR(4),
  amount          DECIMAL(10,2) NOT NULL,
  tip             DECIMAL(10,2) DEFAULT 0,
  total           DECIMAL(10,2) NOT NULL,
  auth_code       VARCHAR(20),
  status          transaction_status NOT NULL DEFAULT 'Pending',
  batch_id        VARCHAR(50),              -- Links to deposit batch
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_txns_merchant ON transactions(merchant_id);
CREATE INDEX idx_txns_date ON transactions(txn_date);
CREATE INDEX idx_txns_batch ON transactions(batch_id);
CREATE INDEX idx_txns_status ON transactions(status);

-- ─── DEPOSITS ────────────────────────────────────────────────────────

CREATE TABLE deposits (
  id              SERIAL PRIMARY KEY,
  merchant_id     INTEGER NOT NULL REFERENCES merchants(id),
  batch_id        VARCHAR(50) UNIQUE,       -- BTH-2026-MMDD
  deposit_date    DATE NOT NULL,
  txn_count       INTEGER,
  gross_amount    DECIMAL(12,2),
  fees            DECIMAL(10,2),
  net_amount      DECIMAL(12,2),
  bank_last4      VARCHAR(4),
  status          deposit_status NOT NULL DEFAULT 'Pending',
  settlement_type settlement_type DEFAULT 'Same-day',
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_deposits_merchant ON deposits(merchant_id);
CREATE INDEX idx_deposits_date ON deposits(deposit_date);

-- ─── CHARGEBACKS ─────────────────────────────────────────────────────

CREATE TABLE chargebacks (
  id              SERIAL PRIMARY KEY,
  merchant_id     INTEGER NOT NULL REFERENCES merchants(id),
  cb_ref          VARCHAR(50) UNIQUE,       -- CB-2026-XXXX
  filed_date      DATE NOT NULL,
  card_brand      card_brand,
  card_last4      VARCHAR(4),
  amount          DECIMAL(10,2) NOT NULL,
  reason          chargeback_reason NOT NULL,
  reason_code     VARCHAR(20),
  deadline        DATE,
  status          chargeback_status NOT NULL DEFAULT 'Open',
  evidence_uploaded BOOLEAN DEFAULT FALSE,
  resolved_date   DATE,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_cb_merchant ON chargebacks(merchant_id);
CREATE INDEX idx_cb_status ON chargebacks(status);
CREATE INDEX idx_cb_deadline ON chargebacks(deadline);

-- ─── STATEMENTS ──────────────────────────────────────────────────────

CREATE TABLE statements (
  id              SERIAL PRIMARY KEY,
  merchant_id     INTEGER NOT NULL REFERENCES merchants(id),
  statement_month DATE NOT NULL,            -- First of month
  generated_date  DATE,
  pages           INTEGER,
  -- Summary
  total_volume    DECIMAL(14,2),
  total_fees      DECIMAL(10,2),
  net_amount      DECIMAL(14,2),
  txn_count       INTEGER,
  avg_ticket      DECIMAL(8,2),
  refunds         DECIMAL(10,2),
  chargebacks     DECIMAL(10,2),
  effective_rate  DECIMAL(5,4),
  approval_rate   DECIMAL(5,2),
  -- File
  pdf_url         VARCHAR(500),
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE statement_fee_breakdown (
  id              SERIAL PRIMARY KEY,
  statement_id    INTEGER NOT NULL REFERENCES statements(id),
  category        VARCHAR(100),             -- Interchange, Assessment, Processor Markup, Monthly Fee, etc.
  amount          DECIMAL(10,2),
  pct_of_total    DECIMAL(5,2)
);

CREATE TABLE statement_card_breakdown (
  id              SERIAL PRIMARY KEY,
  statement_id    INTEGER NOT NULL REFERENCES statements(id),
  card_brand      card_brand,
  txn_count       INTEGER,
  volume          DECIMAL(12,2),
  pct_of_total    DECIMAL(5,2)
);

-- ─── EQUIPMENT ───────────────────────────────────────────────────────

CREATE TABLE equipment (
  id              SERIAL PRIMARY KEY,
  merchant_id     INTEGER NOT NULL REFERENCES merchants(id),
  make_model      VARCHAR(100) NOT NULL,    -- PAX A920, Clover Flex, etc.
  serial_number   VARCHAR(100) UNIQUE,
  firmware        VARCHAR(50),
  connection_type VARCHAR(50),              -- WiFi, 4G LTE, Ethernet
  is_online       BOOLEAN DEFAULT TRUE,
  p2pe_certified  BOOLEAN DEFAULT FALSE,
  battery_level   INTEGER,
  deployed_date   DATE,
  last_transaction TIMESTAMP,
  created_at      TIMESTAMP DEFAULT NOW()
);

-- ─── PRODUCTS & SERVICES ─────────────────────────────────────────────

-- Master product catalog
CREATE TABLE products (
  id              SERIAL PRIMARY KEY,
  slug            VARCHAR(50) UNIQUE NOT NULL,  -- funding, checking, payroll, etc.
  name            VARCHAR(255) NOT NULL,
  description     TEXT,
  category        VARCHAR(100),
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMP DEFAULT NOW()
);

-- Merchant ↔ Product enrollment
CREATE TABLE merchant_products (
  id              SERIAL PRIMARY KEY,
  merchant_id     INTEGER NOT NULL REFERENCES merchants(id),
  product_id      INTEGER NOT NULL REFERENCES products(id),
  status          product_status NOT NULL DEFAULT 'Available',
  enrolled_date   DATE,
  cancelled_date  DATE,
  metadata        JSONB,                    -- Product-specific data
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW(),
  UNIQUE(merchant_id, product_id)
);

-- ISO-level product penetration
CREATE TABLE iso_products (
  id              SERIAL PRIMARY KEY,
  iso_id          INTEGER NOT NULL REFERENCES isos(id),
  product_id      INTEGER NOT NULL REFERENCES products(id),
  enrolled_count  INTEGER DEFAULT 0,
  eligible_count  INTEGER DEFAULT 0,
  enrollment_rate DECIMAL(5,2),
  monthly_revenue DECIMAL(10,2),
  UNIQUE(iso_id, product_id)
);

-- ─── BUSINESS FUNDING (MCA) ─────────────────────────────────────────

CREATE TABLE funding_offers (
  id              SERIAL PRIMARY KEY,
  merchant_id     INTEGER NOT NULL REFERENCES merchants(id),
  pre_approved_amount DECIMAL(12,2),
  factor_rate     DECIMAL(5,4),
  total_payback   DECIMAL(12,2),
  daily_hold_pct  DECIMAL(5,2),
  min_daily_payback DECIMAL(8,2),
  est_term_days   INTEGER,
  status          funding_status NOT NULL DEFAULT 'Pending',
  funded_date     DATE,
  est_completion  DATE,
  current_balance DECIMAL(12,2),
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE funding_paybacks (
  id              SERIAL PRIMARY KEY,
  offer_id        INTEGER NOT NULL REFERENCES funding_offers(id),
  payback_date    DATE NOT NULL,
  amount          DECIMAL(8,2) NOT NULL,
  method          VARCHAR(50) DEFAULT 'Auto-debit',
  remaining_balance DECIMAL(12,2),
  status          VARCHAR(20) DEFAULT 'Completed',
  created_at      TIMESTAMP DEFAULT NOW()
);

-- ─── BUSINESS CHECKING ──────────────────────────────────────────────

CREATE TABLE checking_accounts (
  id              SERIAL PRIMARY KEY,
  merchant_id     INTEGER NOT NULL REFERENCES merchants(id),
  account_name    VARCHAR(255),
  routing_number  VARCHAR(20),
  account_last4   VARCHAR(4),
  current_balance DECIMAL(14,2),
  apy_rate        DECIMAL(5,4),
  status          VARCHAR(20) DEFAULT 'Active',
  opened_date     DATE,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE checking_transactions (
  id              SERIAL PRIMARY KEY,
  account_id      INTEGER NOT NULL REFERENCES checking_accounts(id),
  txn_date        TIMESTAMP NOT NULL,
  description     VARCHAR(255),
  type            VARCHAR(50),              -- Settlement, Repayment, Payroll, Transfer
  amount          DECIMAL(12,2) NOT NULL,
  balance_after   DECIMAL(14,2),
  status          VARCHAR(20) DEFAULT 'Completed',
  created_at      TIMESTAMP DEFAULT NOW()
);

-- ─── ACCOUNTING ──────────────────────────────────────────────────────

CREATE TABLE accounting_connections (
  id              SERIAL PRIMARY KEY,
  merchant_id     INTEGER NOT NULL REFERENCES merchants(id),
  provider        VARCHAR(100),             -- QuickBooks Online, Xero, etc.
  is_connected    BOOLEAN DEFAULT FALSE,
  last_synced_at  TIMESTAMP,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE accounting_pl (
  id              SERIAL PRIMARY KEY,
  merchant_id     INTEGER NOT NULL REFERENCES merchants(id),
  period_month    DATE NOT NULL,            -- First of month
  category        VARCHAR(100),             -- Sales Revenue, Cost of Goods, Rent, Payroll, etc.
  type            VARCHAR(20),              -- revenue, expense, total
  amount          DECIMAL(12,2),
  pct_of_revenue  DECIMAL(5,2),
  created_at      TIMESTAMP DEFAULT NOW()
);

-- ─── PAYROLL ─────────────────────────────────────────────────────────

CREATE TABLE employees (
  id              SERIAL PRIMARY KEY,
  merchant_id     INTEGER NOT NULL REFERENCES merchants(id),
  first_name      VARCHAR(100),
  last_name       VARCHAR(100),
  type            employee_type NOT NULL,
  hourly_rate     DECIMAL(8,2),
  is_active       BOOLEAN DEFAULT TRUE,
  hire_date       DATE,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE payroll_runs (
  id              SERIAL PRIMARY KEY,
  merchant_id     INTEGER NOT NULL REFERENCES merchants(id),
  run_date        DATE NOT NULL,
  period_start    DATE,
  period_end      DATE,
  employee_count  INTEGER,
  gross_pay       DECIMAL(12,2),
  taxes_fees      DECIMAL(10,2),
  total_cost      DECIMAL(12,2),
  status          payroll_run_status DEFAULT 'Scheduled',
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE payroll_items (
  id              SERIAL PRIMARY KEY,
  payroll_run_id  INTEGER NOT NULL REFERENCES payroll_runs(id),
  employee_id     INTEGER NOT NULL REFERENCES employees(id),
  hours           DECIMAL(6,2),
  gross_pay       DECIMAL(10,2),
  deductions      DECIMAL(10,2),
  net_pay         DECIMAL(10,2)
);

-- ─── INSURANCE ───────────────────────────────────────────────────────

CREATE TABLE insurance_plans (
  id              SERIAL PRIMARY KEY,
  type            VARCHAR(50),              -- health, business
  tier            insurance_plan_tier,      -- Bronze, Silver, Gold (health only)
  name            VARCHAR(255),
  monthly_per_employee DECIMAL(8,2),
  deductible      DECIMAL(8,2),
  copay           DECIMAL(8,2),
  coverage_pct    DECIMAL(5,2),
  features        JSONB,                    -- Array of feature strings
  is_recommended  BOOLEAN DEFAULT FALSE
);

CREATE TABLE merchant_insurance (
  id              SERIAL PRIMARY KEY,
  merchant_id     INTEGER NOT NULL REFERENCES merchants(id),
  plan_id         INTEGER REFERENCES insurance_plans(id),
  type            VARCHAR(50),              -- health, general_liability, property, workers_comp
  status          VARCHAR(50) DEFAULT 'Not Enrolled',
  enrolled_date   DATE,
  monthly_premium DECIMAL(8,2),
  employee_count  INTEGER,
  created_at      TIMESTAMP DEFAULT NOW()
);

-- ─── REWARDS ─────────────────────────────────────────────────────────

CREATE TABLE rewards_accounts (
  id              SERIAL PRIMARY KEY,
  merchant_id     INTEGER NOT NULL REFERENCES merchants(id) UNIQUE,
  points_balance  INTEGER DEFAULT 0,
  lifetime_points INTEGER DEFAULT 0,
  redemption_count INTEGER DEFAULT 0,
  lifetime_value  DECIMAL(10,2) DEFAULT 0,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE rewards_transactions (
  id              SERIAL PRIMARY KEY,
  account_id      INTEGER NOT NULL REFERENCES rewards_accounts(id),
  txn_date        TIMESTAMP NOT NULL,
  description     VARCHAR(255),
  type            VARCHAR(20),              -- Earned, Redeemed
  points          INTEGER NOT NULL,         -- Positive for earned, negative for redeemed
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE rewards_earning_rules (
  id              SERIAL PRIMARY KEY,
  activity        VARCHAR(100),             -- Card Processing, On-time Funding, Payroll, Referral, Anniversary
  points_formula  VARCHAR(255),             -- "1 pt / $100 processed", "500 pts / month"
  frequency       VARCHAR(50),              -- Daily, Monthly, Per payroll, One-time, Yearly
  description     TEXT,
  is_active       BOOLEAN DEFAULT TRUE
);

CREATE TABLE rewards_redemption_options (
  id              SERIAL PRIMARY KEY,
  name            VARCHAR(100),
  description     TEXT,
  points_cost     INTEGER NOT NULL,
  dollar_value    DECIMAL(8,2),
  is_active       BOOLEAN DEFAULT TRUE
);

-- ─── CRYPTO PAYMENTS ─────────────────────────────────────────────────

CREATE TABLE crypto_settings (
  id              SERIAL PRIMARY KEY,
  merchant_id     INTEGER NOT NULL REFERENCES merchants(id) UNIQUE,
  is_activated    BOOLEAN DEFAULT FALSE,
  supported_currencies JSONB,               -- ["BTC", "ETH", "USDC"]
  processing_fee_pct  DECIMAL(5,4) DEFAULT 0.01,
  settlement_method   VARCHAR(50) DEFAULT 'Same day',
  activated_date  DATE,
  created_at      TIMESTAMP DEFAULT NOW()
);

-- ─── CRM / LEADS ────────────────────────────────────────────────────

CREATE TABLE leads (
  id              SERIAL PRIMARY KEY,
  iso_id          INTEGER REFERENCES isos(id),
  assigned_to     VARCHAR(100),
  name            VARCHAR(255) NOT NULL,
  business_name   VARCHAR(255),
  location        VARCHAR(255),
  mcc             VARCHAR(10) REFERENCES mcc_codes(mcc),
  est_monthly_volume DECIMAL(12,2),
  ai_score        INTEGER CHECK (ai_score BETWEEN 0 AND 100),
  stage           lead_stage NOT NULL DEFAULT 'Lead',
  source          VARCHAR(100),             -- Inbound, Referral, Voice Agent, etc.
  detail          TEXT,
  phone           VARCHAR(20),
  email           VARCHAR(255),
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_leads_stage ON leads(stage);
CREATE INDEX idx_leads_iso ON leads(iso_id);

-- Onboarding Applications
CREATE TABLE applications (
  id              SERIAL PRIMARY KEY,
  lead_id         INTEGER REFERENCES leads(id),
  merchant_id     INTEGER REFERENCES merchants(id),
  bank            VARCHAR(255),
  submitted_at    TIMESTAMP,
  stage           app_stage NOT NULL DEFAULT 'Document Collection',
  status          app_status NOT NULL DEFAULT 'In Review',
  risk_score      INTEGER,
  risk_label      risk_label,
  assigned_to     VARCHAR(100),
  sla_hours       INTEGER,
  sla_remaining   INTEGER,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

-- ─── VOICE AGENT ─────────────────────────────────────────────────────

CREATE TABLE voice_calls (
  id              SERIAL PRIMARY KEY,
  lead_id         INTEGER REFERENCES leads(id),
  merchant_name   VARCHAR(255),
  phone           VARCHAR(20),
  call_start      TIMESTAMP,
  call_end        TIMESTAMP,
  duration_secs   INTEGER,
  status          voice_call_status NOT NULL,
  stage           voice_call_stage,
  sentiment       sentiment,
  script_id       INTEGER REFERENCES voice_scripts(id),
  transferred     BOOLEAN DEFAULT FALSE,
  recording_url   VARCHAR(500),
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE voice_scripts (
  id              SERIAL PRIMARY KEY,
  name            VARCHAR(255),
  industry        VARCHAR(100),
  win_rate        DECIMAL(5,2),
  calls_used      INTEGER DEFAULT 0,
  avg_duration    VARCHAR(20),
  script_text     TEXT,
  is_recommended  BOOLEAN DEFAULT FALSE,
  last_updated    TIMESTAMP DEFAULT NOW(),
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE call_outcomes (
  id              SERIAL PRIMARY KEY,
  name            VARCHAR(100) UNIQUE,      -- Not Interested, Gatekeeper Block, No Answer, etc.
  count           INTEGER DEFAULT 0,
  pct_of_total    DECIMAL(5,2)
);

-- ─── RISK & COMPLIANCE ──────────────────────────────────────────────

CREATE TABLE risk_alerts (
  id              SERIAL PRIMARY KEY,
  merchant_id     INTEGER NOT NULL REFERENCES merchants(id),
  alert_type      VARCHAR(100),             -- Volume Spike, Chargeback Threshold, etc.
  risk_score      INTEGER,
  score_change    INTEGER,
  trigger_desc    TEXT,
  recommended_action TEXT,
  severity        risk_severity NOT NULL,
  is_resolved     BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMP DEFAULT NOW(),
  resolved_at     TIMESTAMP
);

CREATE TABLE underwriting_queue (
  id              SERIAL PRIMARY KEY,
  application_id  INTEGER REFERENCES applications(id),
  merchant_name   VARCHAR(255),
  mcc             VARCHAR(10),
  est_volume      VARCHAR(50),
  risk_score      INTEGER,
  submitted_date  DATE,
  sla_hours       INTEGER,
  sla_remaining   INTEGER,
  assignee        VARCHAR(100),
  status          VARCHAR(50) DEFAULT 'Pending',
  created_at      TIMESTAMP DEFAULT NOW()
);

-- ─── SUPPORT TICKETS ─────────────────────────────────────────────────

CREATE TABLE tickets (
  id              SERIAL PRIMARY KEY,
  merchant_id     INTEGER REFERENCES merchants(id),
  iso_id          INTEGER REFERENCES isos(id),
  subject         VARCHAR(255),
  description     TEXT,
  priority        ticket_priority DEFAULT 'Medium',
  status          ticket_status DEFAULT 'Open',
  assigned_to     VARCHAR(100),
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW(),
  resolved_at     TIMESTAMP
);

-- ─── AI CONVERSATIONS ────────────────────────────────────────────────

CREATE TABLE ai_conversations (
  id              SERIAL PRIMARY KEY,
  merchant_id     INTEGER REFERENCES merchants(id),
  user_id         INTEGER,                  -- Future: user accounts
  started_at      TIMESTAMP DEFAULT NOW(),
  last_message_at TIMESTAMP,
  message_count   INTEGER DEFAULT 0,
  context         JSONB                     -- Snapshot of merchant context at start
);

CREATE TABLE ai_messages (
  id              SERIAL PRIMARY KEY,
  conversation_id INTEGER NOT NULL REFERENCES ai_conversations(id),
  role            ai_message_role NOT NULL,
  content         TEXT NOT NULL,
  card_type       VARCHAR(50),              -- sales, chargeback, payroll, rate, funding, rewards
  metadata        JSONB,                    -- Any inline data (chart data, etc.)
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ai_msgs_conv ON ai_messages(conversation_id);

-- ─── ACTIVITY LOG ────────────────────────────────────────────────────

CREATE TABLE activity_log (
  id              SERIAL PRIMARY KEY,
  merchant_id     INTEGER REFERENCES merchants(id),
  iso_id          INTEGER REFERENCES isos(id),
  event_type      VARCHAR(100),             -- deposit, chargeback, statement, payroll, pci_scan, etc.
  title           VARCHAR(255),
  detail          TEXT,
  icon            VARCHAR(50),
  color           VARCHAR(20),
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_activity_merchant ON activity_log(merchant_id);
CREATE INDEX idx_activity_created ON activity_log(created_at);

-- ─── ANALYTICS (pre-aggregated for dashboard) ────────────────────────

CREATE TABLE monthly_volume_trend (
  id              SERIAL PRIMARY KEY,
  period_month    DATE NOT NULL,
  total_volume    DECIMAL(14,2),
  total_residuals DECIMAL(12,2),
  merchant_count  INTEGER,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE daily_merchant_stats (
  id              SERIAL PRIMARY KEY,
  merchant_id     INTEGER NOT NULL REFERENCES merchants(id),
  stat_date       DATE NOT NULL,
  txn_count       INTEGER,
  total_volume    DECIMAL(12,2),
  avg_ticket      DECIMAL(8,2),
  approval_rate   DECIMAL(5,2),
  UNIQUE(merchant_id, stat_date)
);

CREATE TABLE hourly_merchant_stats (
  id              SERIAL PRIMARY KEY,
  merchant_id     INTEGER NOT NULL REFERENCES merchants(id),
  stat_date       DATE NOT NULL,
  hour            SMALLINT CHECK (hour BETWEEN 0 AND 23),
  txn_count       INTEGER,
  total_volume    DECIMAL(12,2),
  UNIQUE(merchant_id, stat_date, hour)
);

-- Dashboard KPIs (snapshot table, one row per day)
CREATE TABLE dashboard_kpis (
  id                  SERIAL PRIMARY KEY,
  snapshot_date       DATE NOT NULL UNIQUE,
  total_merchants     INTEGER,
  monthly_volume      DECIMAL(14,2),
  monthly_volume_trend DECIMAL(5,2),
  monthly_residuals   DECIMAL(12,2),
  monthly_residuals_trend DECIMAL(5,2),
  churn_rate          DECIMAL(5,2),
  chargeback_rate     DECIMAL(5,4),
  created_at          TIMESTAMP DEFAULT NOW()
);

-- Chargeback trend (monthly, portfolio-level)
CREATE TABLE chargeback_trend (
  id              SERIAL PRIMARY KEY,
  period_month    DATE NOT NULL,
  portfolio_rate  DECIMAL(5,4),
  visa_rate       DECIMAL(5,4),
  mc_rate         DECIMAL(5,4),
  total_count     INTEGER,
  total_amount    DECIMAL(12,2)
);

-- ─── RESIDUALS ───────────────────────────────────────────────────────

CREATE TABLE residual_reports (
  id              SERIAL PRIMARY KEY,
  iso_id          INTEGER NOT NULL REFERENCES isos(id),
  period_month    DATE NOT NULL,
  total_volume    DECIMAL(14,2),
  total_residuals DECIMAL(12,2),
  merchant_count  INTEGER,
  avg_per_merchant DECIMAL(8,2),
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE residual_items (
  id              SERIAL PRIMARY KEY,
  report_id       INTEGER NOT NULL REFERENCES residual_reports(id),
  merchant_id     INTEGER NOT NULL REFERENCES merchants(id),
  volume          DECIMAL(12,2),
  income          DECIMAL(10,2),
  buy_rate        DECIMAL(5,4),
  sell_rate       DECIMAL(5,4),
  net_residual    DECIMAL(10,2)
);

-- ═══════════════════════════════════════════════════════════════════════
-- VIEWS (convenience)
-- ═══════════════════════════════════════════════════════════════════════

-- Active merchants with ISO info
CREATE VIEW v_merchant_overview AS
SELECT
  m.id, m.dba_name, m.mid, m.status, m.mcc, mc.description AS mcc_desc,
  m.avg_ticket, m.risk_score, m.pci_status,
  m.address_city, m.address_state,
  i.name AS iso_name, i.status AS iso_status,
  p.name AS processor_name
FROM merchants m
LEFT JOIN isos i ON m.iso_id = i.id
LEFT JOIN processors p ON m.processor_id = p.id
LEFT JOIN mcc_codes mc ON m.mcc = mc.mcc;

-- Merchant product enrollment summary
CREATE VIEW v_merchant_products AS
SELECT
  m.id AS merchant_id, m.dba_name,
  pr.slug AS product_slug, pr.name AS product_name,
  mp.status, mp.enrolled_date
FROM merchant_products mp
JOIN merchants m ON mp.merchant_id = m.id
JOIN products pr ON mp.product_id = pr.id;

-- At-risk merchants
CREATE VIEW v_at_risk_merchants AS
SELECT
  m.id, m.dba_name, m.risk_score, m.risk_severity,
  m.annual_volume_estimate,
  i.name AS iso_name
FROM merchants m
LEFT JOIN isos i ON m.iso_id = i.id
WHERE m.risk_score >= 60 OR m.risk_severity IN ('Critical', 'High')
ORDER BY m.risk_score DESC;
