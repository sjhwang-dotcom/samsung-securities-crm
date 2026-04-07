-- Harlow Payments DuckDB Schema
-- 24 Tables for full payment processing platform

-- ═══════════════════════════════════════════
-- CORE TABLES
-- ═══════════════════════════════════════════

CREATE TABLE IF NOT EXISTS isos (
    iso_id              INTEGER PRIMARY KEY,
    name                VARCHAR NOT NULL,
    status              VARCHAR NOT NULL,
    acquisition_date    DATE,
    description         VARCHAR,
    founded_year        INTEGER,
    hq_city             VARCHAR,
    hq_state            VARCHAR(2),
    contact_name        VARCHAR,
    contact_email       VARCHAR,
    contact_phone       VARCHAR(15),
    website             VARCHAR,
    target_merchant_count INTEGER,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mcc_codes (
    mcc                 VARCHAR(4) PRIMARY KEY,
    description         VARCHAR NOT NULL,
    category            VARCHAR NOT NULL,
    risk_tier           VARCHAR DEFAULT 'Standard',
    avg_ticket_low      DECIMAL(10,2),
    avg_ticket_high     DECIMAL(10,2)
);

CREATE TABLE IF NOT EXISTS processors (
    processor_id        INTEGER PRIMARY KEY,
    name                VARCHAR NOT NULL,
    platform            VARCHAR,
    settlement_speed    VARCHAR DEFAULT 'Next-day',
    is_active           BOOLEAN DEFAULT TRUE,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS merchants (
    merchant_id         INTEGER PRIMARY KEY,
    iso_id              INTEGER NOT NULL,
    processor_id        INTEGER,
    mid                 VARCHAR(16),
    dba_name            VARCHAR NOT NULL,
    legal_name          VARCHAR,
    mcc                 VARCHAR(4) NOT NULL,
    address_street      VARCHAR,
    address_city        VARCHAR DEFAULT 'New York',
    address_state       VARCHAR(2) DEFAULT 'NY',
    address_zip         VARCHAR(10),
    phone               VARCHAR(15),
    email               VARCHAR,
    website             VARCHAR,
    status              VARCHAR NOT NULL DEFAULT 'Active',
    boarding_date       DATE,
    annual_volume_estimate DECIMAL(12,2),
    avg_ticket          DECIMAL(10,2),
    risk_score          INTEGER,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS merchant_owners (
    owner_id            INTEGER PRIMARY KEY,
    merchant_id         INTEGER NOT NULL,
    first_name          VARCHAR NOT NULL,
    last_name           VARCHAR NOT NULL,
    title               VARCHAR,
    ownership_pct       DECIMAL(5,2),
    ssn_last4           VARCHAR(4),
    dob                 DATE,
    phone               VARCHAR(15),
    email               VARCHAR,
    is_control_person   BOOLEAN DEFAULT FALSE,
    kyc_verified        BOOLEAN DEFAULT FALSE,
    kyc_verified_at     TIMESTAMP,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ═══════════════════════════════════════════
-- FINANCIAL TABLES
-- ═══════════════════════════════════════════

CREATE TABLE IF NOT EXISTS daily_transactions (
    id                  INTEGER PRIMARY KEY,
    merchant_id         INTEGER NOT NULL,
    txn_date            DATE NOT NULL,
    sale_count          INTEGER NOT NULL DEFAULT 0,
    sale_amount         DECIMAL(12,2) NOT NULL DEFAULT 0,
    refund_count        INTEGER NOT NULL DEFAULT 0,
    refund_amount       DECIMAL(12,2) NOT NULL DEFAULT 0,
    void_count          INTEGER NOT NULL DEFAULT 0,
    void_amount         DECIMAL(12,2) NOT NULL DEFAULT 0,
    net_amount          DECIMAL(12,2) NOT NULL DEFAULT 0,
    avg_ticket          DECIMAL(10,2),
    tip_amount          DECIMAL(10,2) DEFAULT 0,
    visa_count          INTEGER DEFAULT 0,
    mc_count            INTEGER DEFAULT 0,
    amex_count          INTEGER DEFAULT 0,
    discover_count      INTEGER DEFAULT 0,
    UNIQUE(merchant_id, txn_date)
);

CREATE TABLE IF NOT EXISTS deposits (
    deposit_id          INTEGER PRIMARY KEY,
    merchant_id         INTEGER NOT NULL,
    batch_id            VARCHAR NOT NULL,
    deposit_date        DATE NOT NULL,
    txn_count           INTEGER NOT NULL,
    gross_amount        DECIMAL(12,2) NOT NULL,
    fee_amount          DECIMAL(12,2) NOT NULL,
    net_amount          DECIMAL(12,2) NOT NULL,
    reserve_amount      DECIMAL(12,2) DEFAULT 0,
    bank_last4          VARCHAR(4),
    status              VARCHAR DEFAULT 'Deposited',
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chargebacks (
    chargeback_id       INTEGER PRIMARY KEY,
    merchant_id         INTEGER NOT NULL,
    case_number         VARCHAR NOT NULL,
    filed_date          DATE NOT NULL,
    card_brand          VARCHAR NOT NULL,
    card_last4          VARCHAR(4),
    amount              DECIMAL(12,2) NOT NULL,
    reason_code         VARCHAR(10),
    reason_desc         VARCHAR NOT NULL,
    response_deadline   DATE,
    status              VARCHAR NOT NULL,
    representment_filed BOOLEAN DEFAULT FALSE,
    resolved_date       DATE,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS residuals (
    residual_id         INTEGER PRIMARY KEY,
    iso_id              INTEGER NOT NULL,
    merchant_id         INTEGER NOT NULL,
    month               DATE NOT NULL,
    processing_volume   DECIMAL(12,2) NOT NULL,
    gross_revenue       DECIMAL(12,2) NOT NULL,
    buy_rate_cost       DECIMAL(12,2) NOT NULL,
    net_residual        DECIMAL(12,2) NOT NULL,
    iso_split_pct       DECIMAL(5,2),
    iso_residual        DECIMAL(12,2) NOT NULL,
    txn_count           INTEGER,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(merchant_id, month)
);

CREATE TABLE IF NOT EXISTS pricing (
    pricing_id          INTEGER PRIMARY KEY,
    merchant_id         INTEGER NOT NULL,
    pricing_model       VARCHAR NOT NULL DEFAULT 'Interchange Plus',
    discount_rate       DECIMAL(5,4),
    per_txn_fee         DECIMAL(6,4),
    monthly_fee         DECIMAL(10,2) DEFAULT 0,
    pci_fee             DECIMAL(10,2) DEFAULT 0,
    statement_fee       DECIMAL(10,2) DEFAULT 0,
    batch_fee           DECIMAL(6,4) DEFAULT 0,
    chargeback_fee      DECIMAL(10,2) DEFAULT 25.00,
    annual_fee          DECIMAL(10,2) DEFAULT 0,
    effective_date      DATE NOT NULL,
    end_date            DATE,
    is_current          BOOLEAN DEFAULT TRUE,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(merchant_id, effective_date)
);

-- ═══════════════════════════════════════════
-- LIFECYCLE TABLES
-- ═══════════════════════════════════════════

CREATE TABLE IF NOT EXISTS leads (
    lead_id             INTEGER PRIMARY KEY,
    iso_id              INTEGER NOT NULL,
    business_name       VARCHAR NOT NULL,
    contact_name        VARCHAR,
    phone               VARCHAR(15),
    email               VARCHAR,
    location            VARCHAR,
    mcc                 VARCHAR(4),
    estimated_monthly_volume DECIMAL(12,2),
    current_processor   VARCHAR,
    current_rate        DECIMAL(5,4),
    estimated_savings   DECIMAL(10,2),
    stage               VARCHAR NOT NULL,
    ai_score            INTEGER,
    source              VARCHAR,
    assigned_to         VARCHAR,
    notes               VARCHAR,
    converted_merchant_id INTEGER,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS applications (
    application_id      INTEGER PRIMARY KEY,
    lead_id             INTEGER,
    iso_id              INTEGER NOT NULL,
    merchant_name       VARCHAR NOT NULL,
    legal_name          VARCHAR,
    mcc                 VARCHAR(4),
    bank_name           VARCHAR DEFAULT 'Esquire Bank',
    submitted_date      DATE NOT NULL,
    stage               VARCHAR NOT NULL,
    risk_score          INTEGER,
    risk_label          VARCHAR,
    status              VARCHAR NOT NULL,
    assigned_to         VARCHAR,
    estimated_volume    DECIMAL(12,2),
    decision_date       DATE,
    decision_reason     VARCHAR,
    created_merchant_id INTEGER,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS documents (
    document_id         INTEGER PRIMARY KEY,
    merchant_id         INTEGER,
    application_id      INTEGER,
    document_type       VARCHAR NOT NULL,
    file_name           VARCHAR,
    file_size_kb        INTEGER,
    status              VARCHAR DEFAULT 'Pending',
    verified_by         VARCHAR,
    verified_at         TIMESTAMP,
    expiration_date     DATE,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS risk_assessments (
    assessment_id       INTEGER PRIMARY KEY,
    merchant_id         INTEGER NOT NULL,
    assessed_date       DATE NOT NULL,
    risk_score          INTEGER NOT NULL,
    previous_score      INTEGER,
    score_change        INTEGER,
    risk_tier           VARCHAR,
    volume_trend_pct    DECIMAL(5,2),
    chargeback_flag     BOOLEAN DEFAULT FALSE,
    pci_flag            BOOLEAN DEFAULT FALSE,
    velocity_flag       BOOLEAN DEFAULT FALSE,
    trigger_reason      VARCHAR,
    recommended_action  VARCHAR,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ═══════════════════════════════════════════
-- OPERATIONS TABLES
-- ═══════════════════════════════════════════

CREATE TABLE IF NOT EXISTS equipment (
    equipment_id        INTEGER PRIMARY KEY,
    merchant_id         INTEGER NOT NULL,
    device_type         VARCHAR NOT NULL,
    make_model          VARCHAR NOT NULL,
    serial_number       VARCHAR,
    firmware_version    VARCHAR,
    connection_type     VARCHAR,
    p2pe_certified      BOOLEAN DEFAULT FALSE,
    status              VARCHAR DEFAULT 'Active',
    deployed_date       DATE,
    last_txn_date       DATE,
    is_online           BOOLEAN DEFAULT TRUE,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pci_compliance (
    pci_id              INTEGER PRIMARY KEY,
    merchant_id         INTEGER NOT NULL UNIQUE,
    compliance_status   VARCHAR NOT NULL,
    saq_type            VARCHAR,
    saq_completed_date  DATE,
    saq_expiration_date DATE,
    last_asv_scan_date  DATE,
    last_asv_result     VARCHAR,
    next_asv_scan_date  DATE,
    p2pe_validated      BOOLEAN DEFAULT FALSE,
    tokenization_enabled BOOLEAN DEFAULT FALSE,
    employee_training_date DATE,
    breach_plan_filed   BOOLEAN DEFAULT FALSE,
    non_compliant_days  INTEGER DEFAULT 0,
    monthly_noncompliance_fee DECIMAL(10,2) DEFAULT 19.95,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    product_id          INTEGER PRIMARY KEY,
    merchant_id         INTEGER NOT NULL,
    product_name        VARCHAR NOT NULL,
    enrolled_date       DATE,
    status              VARCHAR DEFAULT 'Active',
    monthly_revenue     DECIMAL(10,2),
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS support_tickets (
    ticket_id           INTEGER PRIMARY KEY,
    merchant_id         INTEGER NOT NULL,
    ticket_number       VARCHAR NOT NULL,
    subject             VARCHAR NOT NULL,
    description         VARCHAR,
    category            VARCHAR,
    priority            VARCHAR DEFAULT 'Normal',
    status              VARCHAR NOT NULL,
    assigned_to         VARCHAR,
    opened_at           TIMESTAMP NOT NULL,
    resolved_at         TIMESTAMP,
    closed_at           TIMESTAMP,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS voice_calls (
    call_id             INTEGER PRIMARY KEY,
    lead_id             INTEGER,
    merchant_id         INTEGER,
    phone_number        VARCHAR(15),
    business_name       VARCHAR,
    call_date           TIMESTAMP NOT NULL,
    duration_seconds    INTEGER,
    status              VARCHAR NOT NULL,
    stage               VARCHAR,
    sentiment           VARCHAR,
    outcome             VARCHAR,
    transfer_to         VARCHAR,
    recording_url       VARCHAR,
    notes               VARCHAR,
    cost                DECIMAL(6,4),
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ═══════════════════════════════════════════
-- ISO EXTENDED TABLES
-- ═══════════════════════════════════════════

CREATE TABLE IF NOT EXISTS iso_monthly_metrics (
    metric_id       INTEGER PRIMARY KEY,
    iso_id          INTEGER NOT NULL,
    month           DATE NOT NULL,
    merchant_count  INTEGER,
    new_merchants   INTEGER DEFAULT 0,
    lost_merchants  INTEGER DEFAULT 0,
    processing_volume DECIMAL(14,2),
    total_residuals DECIMAL(14,2),
    avg_ticket      DECIMAL(10,2),
    churn_rate      DECIMAL(5,2),
    chargeback_rate DECIMAL(5,4),
    pci_compliance_rate DECIMAL(5,2),
    product_penetration_rate DECIMAL(5,2),
    voice_calls_made INTEGER DEFAULT 0,
    voice_transfers INTEGER DEFAULT 0,
    support_tickets_opened INTEGER DEFAULT 0,
    support_tickets_resolved INTEGER DEFAULT 0,
    UNIQUE(iso_id, month)
);

CREATE TABLE IF NOT EXISTS iso_processors (
    id              INTEGER PRIMARY KEY,
    iso_id          INTEGER NOT NULL,
    processor_id    INTEGER NOT NULL,
    is_primary      BOOLEAN DEFAULT FALSE,
    volume_share_pct DECIMAL(5,2),
    UNIQUE(iso_id, processor_id)
);

CREATE TABLE IF NOT EXISTS iso_events (
    event_id        INTEGER PRIMARY KEY,
    iso_id          INTEGER NOT NULL,
    event_date      TIMESTAMP NOT NULL,
    event_type      VARCHAR NOT NULL,
    title           VARCHAR NOT NULL,
    description     VARCHAR,
    severity        VARCHAR DEFAULT 'info',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS iso_product_enrollment (
    id              INTEGER PRIMARY KEY,
    iso_id          INTEGER NOT NULL,
    product_name    VARCHAR NOT NULL,
    enrolled_count  INTEGER NOT NULL,
    eligible_count  INTEGER NOT NULL,
    enrollment_rate DECIMAL(5,2),
    monthly_revenue DECIMAL(12,2),
    UNIQUE(iso_id, product_name)
);

CREATE TABLE IF NOT EXISTS iso_contacts (
    contact_id      INTEGER PRIMARY KEY,
    iso_id          INTEGER NOT NULL,
    first_name      VARCHAR NOT NULL,
    last_name       VARCHAR NOT NULL,
    title           VARCHAR,
    role            VARCHAR,
    phone           VARCHAR(15),
    email           VARCHAR,
    is_primary      BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ═══════════════════════════════════════════
-- INDEXES
-- ═══════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_daily_txn_merchant_date ON daily_transactions(merchant_id, txn_date);
CREATE INDEX IF NOT EXISTS idx_daily_txn_date ON daily_transactions(txn_date);
CREATE INDEX IF NOT EXISTS idx_deposits_merchant_date ON deposits(merchant_id, deposit_date);
CREATE INDEX IF NOT EXISTS idx_chargebacks_merchant ON chargebacks(merchant_id);
CREATE INDEX IF NOT EXISTS idx_residuals_merchant_month ON residuals(merchant_id, month);
CREATE INDEX IF NOT EXISTS idx_residuals_iso_month ON residuals(iso_id, month);
CREATE INDEX IF NOT EXISTS idx_merchants_iso ON merchants(iso_id);
CREATE INDEX IF NOT EXISTS idx_merchants_mcc ON merchants(mcc);
CREATE INDEX IF NOT EXISTS idx_merchants_status ON merchants(status);
CREATE INDEX IF NOT EXISTS idx_risk_merchant_date ON risk_assessments(merchant_id, assessed_date);
CREATE INDEX IF NOT EXISTS idx_leads_stage ON leads(stage);
CREATE INDEX IF NOT EXISTS idx_voice_calls_date ON voice_calls(call_date);
CREATE INDEX IF NOT EXISTS idx_iso_metrics_iso_month ON iso_monthly_metrics(iso_id, month);
CREATE INDEX IF NOT EXISTS idx_iso_events_iso ON iso_events(iso_id);
