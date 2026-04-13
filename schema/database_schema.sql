-- ═══════════════════════════════════════════════════════════════════════
-- SAMSUNG SECURITIES AGENTIC CRM — DATABASE SCHEMA
-- Capital Markets Institutional Equity Sales Intelligence Platform
-- Based on DeepAuto.ai Agentic Intelligence Platform
-- ═══════════════════════════════════════════════════════════════════════

-- ─── ENUMS ──────────────────────────────────────────────────────────

CREATE TYPE institution_type AS ENUM ('자산운용사', '연기금', '보험사', '은행신탁', '외국인기관');
CREATE TYPE client_tier AS ENUM ('Platinum', 'Gold', 'Silver', 'Bronze');
CREATE TYPE client_status AS ENUM ('Active', 'Watch', 'At Risk', 'Inactive');
CREATE TYPE decision_authority AS ENUM ('High', 'Medium', 'Low');
CREATE TYPE interaction_channel AS ENUM ('통화', '미팅', '블룸버그', '이메일', '기업탐방', '리서치배포');
CREATE TYPE sentiment_type AS ENUM ('Positive', 'Neutral', 'Negative');
CREATE TYPE need_category AS ENUM ('종목추천', '리서치요청', '기업탐방', '트레이딩', '딜참여', 'ESG', '기타');
CREATE TYPE need_urgency AS ENUM ('HIGH', 'MEDIUM', 'LOW');
CREATE TYPE need_status AS ENUM ('New', 'In Progress', 'Resolved', 'Expired');
CREATE TYPE action_priority AS ENUM ('URGENT', 'THIS_WEEK', 'THIS_MONTH', 'MONITOR');
CREATE TYPE action_status AS ENUM ('Pending', 'In Progress', 'Completed', 'Overdue');
CREATE TYPE risk_severity AS ENUM ('CRITICAL', 'WARNING', 'WATCH');
CREATE TYPE compliance_type AS ENUM ('정보교류차단', '고객정보접근', '거래제한', '감사요청');
CREATE TYPE compliance_severity AS ENUM ('HIGH', 'MEDIUM', 'LOW');
CREATE TYPE compliance_status AS ENUM ('Active', 'Resolved', 'Acknowledged');
CREATE TYPE research_type AS ENUM ('기업분석', '산업분석', '전략', '매크로', '퀀트');
CREATE TYPE recommendation_type AS ENUM ('BUY', 'HOLD', 'SELL');
CREATE TYPE event_type AS ENUM ('NDR', 'Conference', '1:1 Meeting', 'Site Visit', 'Expert Call');
CREATE TYPE event_status AS ENUM ('예정', '완료', '취소');
CREATE TYPE commission_type AS ENUM ('High-touch', 'DMA', 'Algo');
CREATE TYPE order_type AS ENUM ('매수', '매도', '공매도');
CREATE TYPE deal_type AS ENUM ('IPO', '블록딜', '세컨더리', '유상증자', 'CB발행');
CREATE TYPE deal_role AS ENUM ('단독주선', '공동주관', '참여', '인수');
CREATE TYPE schedule_type AS ENUM ('통화', '미팅', '기업탐방', '내부회의', '컨퍼런스', '기타');
CREATE TYPE market_index AS ENUM ('KOSPI', 'KOSDAQ', 'S&P500', 'NASDAQ', 'USD/KRW', 'EUR/KRW', '국고채3년', '국고채10년');

-- ─── CORE: 조직 ──────────────────────────────────────────────────────

-- 세일즈 팀/부서
CREATE TABLE teams (
  id              VARCHAR(20) PRIMARY KEY,   -- TEAM_A, TEAM_B, TEAM_C
  name            VARCHAR(100) NOT NULL,     -- Team A, Team B, Team C
  head_name       VARCHAR(100),
  created_at      TIMESTAMP DEFAULT NOW()
);

-- 세일즈 직원
CREATE TABLE salespeople (
  id              VARCHAR(20) PRIMARY KEY,   -- SP001
  name            VARCHAR(100) NOT NULL,
  team_id         VARCHAR(20) REFERENCES teams(id),
  title           VARCHAR(50),               -- 차장, 과장, 부장
  email           VARCHAR(255),
  phone           VARCHAR(20),
  client_count    INTEGER DEFAULT 0,
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

-- ─── CORE: 기관 고객 ─────────────────────────────────────────────────

-- 기관 고객 (Institutional Client)
CREATE TABLE institutions (
  id              VARCHAR(20) PRIMARY KEY,   -- INST001
  name            VARCHAR(255) NOT NULL,     -- 미래에셋자산운용
  name_en         VARCHAR(255),              -- Mirae Asset Global Investments
  type            institution_type NOT NULL,
  tier            client_tier NOT NULL DEFAULT 'Bronze',
  status          client_status NOT NULL DEFAULT 'Active',
  -- 투자 프로필
  aum             VARCHAR(50),               -- "52조원"
  investment_style VARCHAR(100),             -- 가치투자, 성장투자, 인덱스, 멀티전략
  benchmark       VARCHAR(100),              -- KOSPI200, MSCI Korea
  rebalancing_cycle VARCHAR(50),             -- 분기, 반기, 연간
  commission_budget VARCHAR(50),             -- "180억"
  -- 의사결정 구조
  investment_committee_size INTEGER,
  approval_threshold VARCHAR(100),           -- "10억 이상 IC 승인"
  external_research_policy TEXT,
  -- 수수료
  annual_commission DECIMAL(12,2),           -- 억원 단위
  -- 담당
  salesperson_id  VARCHAR(20) REFERENCES salespeople(id),
  -- 위험 점수
  risk_score      INTEGER DEFAULT 0 CHECK (risk_score BETWEEN 0 AND 100),
  --
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_inst_tier ON institutions(tier);
CREATE INDEX idx_inst_type ON institutions(type);
CREATE INDEX idx_inst_salesperson ON institutions(salesperson_id);

-- 핵심 인물 (Key Person)
CREATE TABLE key_persons (
  id              VARCHAR(20) PRIMARY KEY,   -- KP001
  institution_id  VARCHAR(20) NOT NULL REFERENCES institutions(id),
  name            VARCHAR(100) NOT NULL,
  role            VARCHAR(100),              -- CIO, PM, 트레이더, 리서치헤드
  department      VARCHAR(100),
  decision_authority decision_authority DEFAULT 'Medium',
  -- 연락처
  phone           VARCHAR(20),
  email           VARCHAR(255),
  contact_preference VARCHAR(50),            -- 전화, 블룸버그, 이메일
  communication_style VARCHAR(100),          -- 간결, 데이터중심, 비공식
  -- 분석
  influence_score INTEGER DEFAULT 50 CHECK (influence_score BETWEEN 0 AND 100),
  notes           TEXT,                      -- 메모 (관계, 선호, 이력)
  --
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_kp_institution ON key_persons(institution_id);

-- ─── 인터랙션 (Interaction) ──────────────────────────────────────────

-- 모든 고객 접점 기록
CREATE TABLE interactions (
  id              VARCHAR(20) PRIMARY KEY,   -- INT001
  date            DATE NOT NULL,
  time            TIME NOT NULL,
  channel         interaction_channel NOT NULL,  -- 통화/미팅/블룸버그/이메일/기업탐방/리서치배포
  -- 관계
  institution_id  VARCHAR(20) NOT NULL REFERENCES institutions(id),
  key_person_id   VARCHAR(20) REFERENCES key_persons(id),
  salesperson_id  VARCHAR(20) NOT NULL REFERENCES salespeople(id),
  -- 내용
  summary         TEXT NOT NULL,
  duration_minutes INTEGER,
  -- AI 분석
  needs_extracted INTEGER DEFAULT 0,
  sentiment       sentiment_type DEFAULT 'Neutral',
  follow_up_required BOOLEAN DEFAULT FALSE,
  -- 음성 트랜스크립트 (통화인 경우)
  transcript_url  VARCHAR(500),
  -- 메타데이터
  stocks_mentioned TEXT[],                   -- {"삼성전자", "SK하이닉스"}
  sectors_mentioned TEXT[],                  -- {"반도체", "2차전지"}
  --
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_int_institution ON interactions(institution_id);
CREATE INDEX idx_int_salesperson ON interactions(salesperson_id);
CREATE INDEX idx_int_date ON interactions(date);
CREATE INDEX idx_int_channel ON interactions(channel);

-- ─── AI 추출 니즈 (Client Need) ──────────────────────────────────────

CREATE TABLE client_needs (
  id              VARCHAR(20) PRIMARY KEY,   -- NEED001
  interaction_id  VARCHAR(20) REFERENCES interactions(id),
  institution_id  VARCHAR(20) NOT NULL REFERENCES institutions(id),
  -- 내용
  category        need_category NOT NULL,
  description     TEXT NOT NULL,
  urgency         need_urgency DEFAULT 'MEDIUM',
  confidence      DECIMAL(3,2) DEFAULT 0.80, -- AI 신뢰도 0.00-1.00
  status          need_status DEFAULT 'New',
  -- 컨텍스트
  sector          VARCHAR(100),
  stocks          TEXT[],                    -- {"SK하이닉스", "삼성전자"}
  extracted_date  DATE NOT NULL,
  resolved_date   DATE,
  --
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_needs_institution ON client_needs(institution_id);
CREATE INDEX idx_needs_status ON client_needs(status);
CREATE INDEX idx_needs_category ON client_needs(category);

-- ─── 추천 액션 (Action Item) ─────────────────────────────────────────

CREATE TABLE action_items (
  id              VARCHAR(20) PRIMARY KEY,   -- ACT001
  need_id         VARCHAR(20) REFERENCES client_needs(id),
  institution_id  VARCHAR(20) NOT NULL REFERENCES institutions(id),
  -- 내용
  description     TEXT NOT NULL,
  priority        action_priority NOT NULL DEFAULT 'THIS_WEEK',
  rationale       TEXT,                      -- AI가 생성한 근거
  -- 실행
  assignee_id     VARCHAR(20) REFERENCES salespeople(id),
  channel         VARCHAR(50),               -- 통화, 이메일, 미팅, 리서치배포
  deadline        DATE,
  status          action_status DEFAULT 'Pending',
  completed_date  DATE,
  -- 영향
  revenue_impact  VARCHAR(50),               -- "월 수수료 2억 유지"
  completion_criteria TEXT,
  --
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_actions_institution ON action_items(institution_id);
CREATE INDEX idx_actions_status ON action_items(status);
CREATE INDEX idx_actions_priority ON action_items(priority);
CREATE INDEX idx_actions_assignee ON action_items(assignee_id);

-- ─── 브로커 보트 (Broker Vote) ───────────────────────────────────────

CREATE TABLE broker_vote_periods (
  id              VARCHAR(20) PRIMARY KEY,   -- BVP_2025H2
  period_label    VARCHAR(50) NOT NULL,      -- "2025 H2"
  start_date      DATE,
  end_date        DATE,
  is_active       BOOLEAN DEFAULT FALSE
);

CREATE TABLE broker_votes (
  id              VARCHAR(20) PRIMARY KEY,   -- BV001
  period_id       VARCHAR(20) NOT NULL REFERENCES broker_vote_periods(id),
  institution_id  VARCHAR(20) NOT NULL REFERENCES institutions(id),
  -- 점수
  overall_score   DECIMAL(3,1) NOT NULL,
  previous_score  DECIMAL(3,1),
  -- 카테고리별 점수
  score_research       DECIMAL(3,1),
  score_sales          DECIMAL(3,1),
  score_trading        DECIMAL(3,1),
  score_corporate_access DECIMAL(3,1),
  score_events         DECIMAL(3,1),
  -- 순위
  rank            INTEGER,
  previous_rank   INTEGER,
  -- 수수료 연계
  estimated_commission DECIMAL(12,2),        -- 만원 단위
  --
  created_at      TIMESTAMP DEFAULT NOW(),
  UNIQUE(period_id, institution_id)
);

CREATE INDEX idx_bv_institution ON broker_votes(institution_id);
CREATE INDEX idx_bv_period ON broker_votes(period_id);

-- ─── 수수료 (Commission) ────────────────────────────────────────────

-- 월별 수수료 집계
CREATE TABLE commissions_monthly (
  id              SERIAL PRIMARY KEY,
  month           DATE NOT NULL,             -- 매월 1일
  -- 유형별
  total           DECIMAL(10,2) NOT NULL,    -- 억원
  high_touch      DECIMAL(10,2),
  dma             DECIMAL(10,2),
  algo            DECIMAL(10,2),
  --
  created_at      TIMESTAMP DEFAULT NOW(),
  UNIQUE(month)
);

-- 고객별 수수료
CREATE TABLE commissions_by_client (
  id              SERIAL PRIMARY KEY,
  month           DATE NOT NULL,
  institution_id  VARCHAR(20) NOT NULL REFERENCES institutions(id),
  total           DECIMAL(10,2) NOT NULL,    -- 만원
  high_touch      DECIMAL(10,2),
  dma             DECIMAL(10,2),
  algo            DECIMAL(10,2),
  --
  created_at      TIMESTAMP DEFAULT NOW(),
  UNIQUE(month, institution_id)
);

-- ─── 거래 (Trade) ────────────────────────────────────────────────────

CREATE TABLE trades (
  id              VARCHAR(20) PRIMARY KEY,   -- TRD001
  trade_date      DATE NOT NULL,
  trade_time      TIME,
  institution_id  VARCHAR(20) NOT NULL REFERENCES institutions(id),
  -- 종목
  stock_code      VARCHAR(20) NOT NULL,      -- 005930
  stock_name      VARCHAR(100) NOT NULL,     -- 삼성전자
  -- 주문
  order_type      order_type NOT NULL,
  quantity        BIGINT NOT NULL,
  price           DECIMAL(12,2) NOT NULL,
  amount          DECIMAL(14,2) NOT NULL,    -- 체결금액
  commission      DECIMAL(10,2),             -- 수수료
  commission_rate DECIMAL(5,4),              -- bps
  -- 실행
  execution_type  commission_type,           -- High-touch, DMA, Algo
  algo_strategy   VARCHAR(100),              -- VWAP, TWAP, IS 등
  --
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_trades_institution ON trades(institution_id);
CREATE INDEX idx_trades_date ON trades(trade_date);
CREATE INDEX idx_trades_stock ON trades(stock_code);

-- ─── 딜 참여 (Deal Participation) ────────────────────────────────────

CREATE TABLE deals (
  id              VARCHAR(20) PRIMARY KEY,   -- DEAL001
  company         VARCHAR(255) NOT NULL,     -- SK바이오팜
  deal_type       deal_type NOT NULL,
  deal_size       VARCHAR(50),               -- "3,200억"
  deal_size_amount DECIMAL(14,2),            -- 억원
  -- 역할
  role            deal_role NOT NULL,
  commission      DECIMAL(10,2),             -- 억원
  commission_rate DECIMAL(5,4),
  -- 고객 참여
  participating_institutions TEXT[],         -- {"INST001", "INST003"}
  -- 일정
  launch_date     DATE,
  close_date      DATE,
  status          VARCHAR(50) DEFAULT '진행중', -- 진행중, 완료, 취소
  --
  created_at      TIMESTAMP DEFAULT NOW()
);

-- ─── 리서치 (Research) ───────────────────────────────────────────────

CREATE TABLE research_reports (
  id              VARCHAR(20) PRIMARY KEY,   -- RR001
  title           VARCHAR(500) NOT NULL,
  analyst_id      VARCHAR(20),               -- 향후 analyst 테이블 연결
  analyst_name    VARCHAR(100) NOT NULL,
  sector          VARCHAR(100) NOT NULL,
  type            research_type NOT NULL,
  date            DATE NOT NULL,
  -- 종목
  stocks_covered  TEXT[],
  recommendation  recommendation_type,
  target_price    VARCHAR(50),
  -- 배포
  distribution_count INTEGER DEFAULT 0,
  open_rate       DECIMAL(3,2) DEFAULT 0,    -- 0.00-1.00
  -- AI 분석
  relevance_score DECIMAL(3,2) DEFAULT 0,    -- 고객 관심도 매칭 점수
  --
  pdf_url         VARCHAR(500),
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_research_sector ON research_reports(sector);
CREATE INDEX idx_research_date ON research_reports(date);

-- 리서치 배포 기록 (누가 어떤 리포트를 받았는지)
CREATE TABLE research_distributions (
  id              SERIAL PRIMARY KEY,
  report_id       VARCHAR(20) NOT NULL REFERENCES research_reports(id),
  institution_id  VARCHAR(20) NOT NULL REFERENCES institutions(id),
  key_person_id   VARCHAR(20) REFERENCES key_persons(id),
  distributed_at  TIMESTAMP NOT NULL,
  channel         VARCHAR(50),               -- 이메일, 블룸버그, 직접전달
  opened          BOOLEAN DEFAULT FALSE,
  opened_at       TIMESTAMP,
  downloaded      BOOLEAN DEFAULT FALSE,
  time_spent_secs INTEGER,                   -- 열람 시간
  feedback        TEXT,
  --
  created_at      TIMESTAMP DEFAULT NOW(),
  UNIQUE(report_id, institution_id, key_person_id)
);

-- ─── 기업탐방 (Corporate Access) ─────────────────────────────────────

CREATE TABLE corporate_access_events (
  id              VARCHAR(20) PRIMARY KEY,   -- CA001
  company         VARCHAR(255) NOT NULL,
  event_type      event_type NOT NULL,
  date            DATE NOT NULL,
  status          event_status DEFAULT '예정',
  -- 참석
  invited_count   INTEGER DEFAULT 0,
  attended_count  INTEGER DEFAULT 0,
  -- 평가
  feedback_score  DECIMAL(3,1),              -- 1.0-5.0
  -- 비용/수익
  cost            DECIMAL(10,2) DEFAULT 0,   -- 만원
  commission_contribution DECIMAL(10,2),     -- 만원 (수수료 기여)
  -- 관련 기관
  target_institutions TEXT[],                -- 초대 대상 기관 ID
  --
  created_at      TIMESTAMP DEFAULT NOW()
);

-- 참석자 상세
CREATE TABLE corporate_access_attendees (
  id              SERIAL PRIMARY KEY,
  event_id        VARCHAR(20) NOT NULL REFERENCES corporate_access_events(id),
  institution_id  VARCHAR(20) NOT NULL REFERENCES institutions(id),
  key_person_id   VARCHAR(20) REFERENCES key_persons(id),
  rsvp_status     VARCHAR(20) DEFAULT '미응답', -- 참석, 불참, 미응답
  attended        BOOLEAN DEFAULT FALSE,
  feedback        TEXT,
  feedback_score  DECIMAL(3,1),
  --
  UNIQUE(event_id, key_person_id)
);

-- ─── 이탈 조기 경보 (Attrition Warning) ──────────────────────────────

CREATE TABLE attrition_scores (
  id              SERIAL PRIMARY KEY,
  institution_id  VARCHAR(20) NOT NULL REFERENCES institutions(id),
  score_date      DATE NOT NULL,
  -- 종합 점수
  risk_score      INTEGER NOT NULL CHECK (risk_score BETWEEN 0 AND 100),
  previous_score  INTEGER,
  severity        risk_severity NOT NULL,
  -- 요인별 점수 (각 0-100)
  factor_engagement       INTEGER,           -- 참여도 (가중치 25%)
  factor_revenue          INTEGER,           -- 수익 궤적 (25%)
  factor_broker_vote      INTEGER,           -- 보트 신호 (20%)
  factor_competition      INTEGER,           -- 경쟁 압력 (15%)
  factor_coverage_gap     INTEGER,           -- 커버리지 갭 (10%)
  factor_personnel        INTEGER,           -- 인사 변동 (5%)
  -- AI 분석
  recommendation  TEXT,
  root_cause      TEXT,
  intervention_plan TEXT,
  --
  created_at      TIMESTAMP DEFAULT NOW(),
  UNIQUE(institution_id, score_date)
);

CREATE INDEX idx_attrition_institution ON attrition_scores(institution_id);
CREATE INDEX idx_attrition_severity ON attrition_scores(severity);

-- ─── 컴플라이언스 (Compliance) ───────────────────────────────────────

-- 정보교류차단 제한 종목
CREATE TABLE chinese_wall_restrictions (
  id              SERIAL PRIMARY KEY,
  stock_code      VARCHAR(20) NOT NULL,
  stock_name      VARCHAR(100) NOT NULL,
  reason          VARCHAR(255),              -- "IB 딜 관련", "M&A 자문 관련"
  restricted_from DATE NOT NULL,
  restricted_until DATE,                     -- NULL = 무기한
  is_active       BOOLEAN DEFAULT TRUE,
  --
  created_at      TIMESTAMP DEFAULT NOW()
);

-- 컴플라이언스 알림
CREATE TABLE compliance_alerts (
  id              VARCHAR(20) PRIMARY KEY,   -- COMP001
  type            compliance_type NOT NULL,
  severity        compliance_severity NOT NULL,
  description     TEXT NOT NULL,
  date            DATE NOT NULL,
  status          compliance_status DEFAULT 'Active',
  -- 관련 엔티티
  restricted_stock VARCHAR(100),
  salesperson_id  VARCHAR(20) REFERENCES salespeople(id),
  institution_id  VARCHAR(20) REFERENCES institutions(id),
  --
  resolved_date   DATE,
  resolved_by     VARCHAR(100),
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

-- 감사 추적 (불변 이벤트 로그)
CREATE TABLE audit_trail (
  id              BIGSERIAL PRIMARY KEY,
  timestamp       TIMESTAMP NOT NULL DEFAULT NOW(),
  event_type      VARCHAR(100) NOT NULL,     -- interaction_created, need_extracted, action_completed, chinese_wall_triggered...
  -- 행위자
  actor_type      VARCHAR(50) NOT NULL,      -- user, agent, system
  actor_id        VARCHAR(50),               -- salesperson_id 또는 "agent:needs_extraction"
  -- 대상
  entity_type     VARCHAR(50),               -- institution, interaction, need, action, research, compliance
  entity_id       VARCHAR(50),
  -- 상세
  description     TEXT,
  metadata        JSONB,                     -- 입력/출력 참조, 변경 전후
  -- 컴플라이언스
  chinese_wall_check BOOLEAN DEFAULT FALSE,
  compliance_flag  BOOLEAN DEFAULT FALSE,
  --
  hash            VARCHAR(64)                -- 암호화 해시 (무결성)
);

CREATE INDEX idx_audit_timestamp ON audit_trail(timestamp);
CREATE INDEX idx_audit_entity ON audit_trail(entity_type, entity_id);
CREATE INDEX idx_audit_actor ON audit_trail(actor_id);

-- ─── 일정 (Schedule / Calendar) ──────────────────────────────────────

CREATE TABLE schedules (
  id              SERIAL PRIMARY KEY,
  salesperson_id  VARCHAR(20) NOT NULL REFERENCES salespeople(id),
  date            DATE NOT NULL,
  start_time      TIME NOT NULL,
  end_time        TIME,
  type            schedule_type NOT NULL,
  title           VARCHAR(255) NOT NULL,
  -- 관련 엔티티
  institution_id  VARCHAR(20) REFERENCES institutions(id),
  key_person_id   VARCHAR(20) REFERENCES key_persons(id),
  -- 상세
  location        VARCHAR(255),
  description     TEXT,
  -- 동기화
  calendar_event_id VARCHAR(255),            -- MS Graph / CalDAV ID
  is_synced       BOOLEAN DEFAULT FALSE,
  --
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_schedule_salesperson ON schedules(salesperson_id);
CREATE INDEX idx_schedule_date ON schedules(date);

-- ─── 시장 데이터 (Market Data) ───────────────────────────────────────

CREATE TABLE market_snapshots (
  id              SERIAL PRIMARY KEY,
  snapshot_date   DATE NOT NULL,
  snapshot_time   TIME,
  index_name      market_index NOT NULL,
  value           DECIMAL(12,2) NOT NULL,
  change_pct      DECIMAL(6,3),
  change_value    DECIMAL(12,2),
  --
  created_at      TIMESTAMP DEFAULT NOW(),
  UNIQUE(snapshot_date, index_name)
);

-- ─── 포트폴리오 추정 (Portfolio Estimation) ──────────────────────────

CREATE TABLE portfolio_estimates (
  id              SERIAL PRIMARY KEY,
  institution_id  VARCHAR(20) NOT NULL REFERENCES institutions(id),
  estimate_date   DATE NOT NULL,
  -- 섹터별 비중
  sector_weights  JSONB,                     -- {"반도체": 25.3, "2차전지": 12.1, ...}
  -- 주요 보유 종목
  top_holdings    JSONB,                     -- [{"stock": "삼성전자", "weight": 8.5}, ...]
  -- 벤치마크 대비
  benchmark_deviation DECIMAL(5,2),
  --
  source          VARCHAR(100),              -- DART, 추정, 고객 제공
  created_at      TIMESTAMP DEFAULT NOW(),
  UNIQUE(institution_id, estimate_date)
);

-- ─── 관심 추적 (Interest Tracking) ───────────────────────────────────

CREATE TABLE client_interests (
  id              SERIAL PRIMARY KEY,
  institution_id  VARCHAR(20) NOT NULL REFERENCES institutions(id),
  -- 관심 대상
  interest_type   VARCHAR(50) NOT NULL,      -- sector, stock, theme
  interest_value  VARCHAR(255) NOT NULL,     -- "반도체", "SK하이닉스", "AI 인프라"
  -- 강도
  intensity       INTEGER DEFAULT 50 CHECK (intensity BETWEEN 0 AND 100),
  -- 이력
  first_detected  DATE,
  last_detected   DATE,
  mention_count   INTEGER DEFAULT 1,
  -- 상태
  is_active       BOOLEAN DEFAULT TRUE,
  --
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_interests_institution ON client_interests(institution_id);

-- ─── 경쟁 인텔리전스 (Competitive Intelligence) ─────────────────────

CREATE TABLE competitor_mentions (
  id              SERIAL PRIMARY KEY,
  interaction_id  VARCHAR(20) REFERENCES interactions(id),
  institution_id  VARCHAR(20) NOT NULL REFERENCES institutions(id),
  -- 경쟁사
  competitor_name VARCHAR(255) NOT NULL,     -- NH투자증권, 한국투자증권, etc.
  mention_type    VARCHAR(50),               -- positive, negative, comparison
  context         TEXT,                      -- "NH투자증권 반도체 애널리스트 커버리지가 강화됐다는 언급"
  -- 위험
  threat_level    VARCHAR(20) DEFAULT 'Low', -- Low, Medium, High
  --
  detected_date   DATE NOT NULL,
  created_at      TIMESTAMP DEFAULT NOW()
);

-- ─── 연동 채널 (Integration Channels) ────────────────────────────────

CREATE TABLE integration_channels (
  id              SERIAL PRIMARY KEY,
  channel_name    VARCHAR(100) NOT NULL,     -- 이메일, 전화, 블룸버그, 캘린더, OMS, 리서치포탈
  protocol        VARCHAR(100),              -- Exchange API, STT 자동기록, B-PIPE, MS Graph, 실시간 API
  status          VARCHAR(50) DEFAULT '연결됨', -- 연결됨, 동기화중, 미연결
  last_sync_at    TIMESTAMP,
  total_records   INTEGER DEFAULT 0,         -- 연동된 총 레코드 수
  --
  config          JSONB,                     -- 연결 설정 (서버, 포트, 인증 등)
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

-- ─── 세일즈 코칭 (Sales Coaching — Phase 3) ─────────────────────────

CREATE TABLE salesperson_metrics (
  id              SERIAL PRIMARY KEY,
  salesperson_id  VARCHAR(20) NOT NULL REFERENCES salespeople(id),
  metric_date     DATE NOT NULL,
  -- 활동 지표
  calls_made      INTEGER DEFAULT 0,
  meetings_held   INTEGER DEFAULT 0,
  emails_sent     INTEGER DEFAULT 0,
  bloomberg_msgs  INTEGER DEFAULT 0,
  -- AI 지표
  needs_extracted INTEGER DEFAULT 0,
  action_completion_rate DECIMAL(5,2),
  avg_response_time_hours DECIMAL(6,2),
  -- 성과 지표
  monthly_commission DECIMAL(10,2),          -- 만원
  avg_broker_vote_score DECIMAL(3,1),
  client_satisfaction DECIMAL(3,1),          -- NPS or custom
  --
  created_at      TIMESTAMP DEFAULT NOW(),
  UNIQUE(salesperson_id, metric_date)
);

-- ─── 대시보드 KPI (스냅샷) ───────────────────────────────────────────

CREATE TABLE dashboard_kpis (
  id              SERIAL PRIMARY KEY,
  snapshot_date   DATE NOT NULL UNIQUE,
  -- 핵심 지표
  total_clients   INTEGER,
  active_clients  INTEGER,
  monthly_commission DECIMAL(10,2),           -- 억원
  commission_trend DECIMAL(5,2),              -- %
  avg_broker_vote DECIMAL(3,1),
  vote_trend      DECIMAL(3,1),
  at_risk_count   INTEGER,
  risk_trend      INTEGER,
  needs_extracted INTEGER,
  needs_trend     DECIMAL(5,2),               -- %
  action_completion_rate DECIMAL(5,2),        -- %
  action_trend    DECIMAL(5,2),               -- %
  research_open_rate DECIMAL(3,2),
  research_trend  DECIMAL(5,2),
  --
  created_at      TIMESTAMP DEFAULT NOW()
);

-- ─── AI 대화 (Lumina Conversations) ──────────────────────────────────

CREATE TABLE ai_conversations (
  id              SERIAL PRIMARY KEY,
  salesperson_id  VARCHAR(20) REFERENCES salespeople(id),
  page_context    VARCHAR(100),              -- /dashboard, /clients, /broker-vote
  started_at      TIMESTAMP DEFAULT NOW(),
  last_message_at TIMESTAMP,
  message_count   INTEGER DEFAULT 0
);

CREATE TABLE ai_messages (
  id              SERIAL PRIMARY KEY,
  conversation_id INTEGER NOT NULL REFERENCES ai_conversations(id),
  role            VARCHAR(20) NOT NULL,      -- user, assistant, system
  content         TEXT NOT NULL,
  metadata        JSONB,
  created_at      TIMESTAMP DEFAULT NOW()
);

-- ─── 최근 활동 피드 ──────────────────────────────────────────────────

CREATE TABLE activity_feed (
  id              SERIAL PRIMARY KEY,
  text            TEXT NOT NULL,
  time_label      VARCHAR(50),               -- "5분 전", "1시간 전"
  type            VARCHAR(50),               -- call, meeting, bloomberg, email, research, compliance
  -- 관련 엔티티
  institution_id  VARCHAR(20) REFERENCES institutions(id),
  salesperson_id  VARCHAR(20) REFERENCES salespeople(id),
  --
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_activity_created ON activity_feed(created_at);

-- ═══════════════════════════════════════════════════════════════════════
-- VIEWS (편의)
-- ═══════════════════════════════════════════════════════════════════════

-- 고객 360 요약
CREATE VIEW v_client_360 AS
SELECT
  i.id, i.name, i.name_en, i.type, i.tier, i.status,
  i.aum, i.investment_style, i.benchmark,
  i.annual_commission, i.risk_score,
  s.name AS salesperson_name,
  (SELECT COUNT(*) FROM interactions x WHERE x.institution_id = i.id) AS interaction_count,
  (SELECT COUNT(*) FROM client_needs x WHERE x.institution_id = i.id AND x.status IN ('New', 'In Progress')) AS open_needs,
  (SELECT COUNT(*) FROM action_items x WHERE x.institution_id = i.id AND x.status IN ('Pending', 'In Progress')) AS pending_actions,
  (SELECT overall_score FROM broker_votes x WHERE x.institution_id = i.id ORDER BY x.created_at DESC LIMIT 1) AS latest_vote_score
FROM institutions i
LEFT JOIN salespeople s ON i.salesperson_id = s.id;

-- 세일즈 성과 요약
CREATE VIEW v_salesperson_performance AS
SELECT
  s.id, s.name, s.team_id,
  (SELECT COUNT(*) FROM institutions i WHERE i.salesperson_id = s.id) AS client_count,
  (SELECT COALESCE(SUM(cm.total), 0) FROM commissions_by_client cm
   JOIN institutions i ON cm.institution_id = i.id
   WHERE i.salesperson_id = s.id
   AND cm.month = DATE_TRUNC('month', CURRENT_DATE)) AS monthly_commission,
  (SELECT COUNT(*) FROM client_needs n
   JOIN institutions i ON n.institution_id = i.id
   WHERE i.salesperson_id = s.id) AS total_needs_extracted,
  (SELECT AVG(bv.overall_score) FROM broker_votes bv
   JOIN institutions i ON bv.institution_id = i.id
   WHERE i.salesperson_id = s.id) AS avg_vote_score
FROM salespeople s
WHERE s.is_active = TRUE;

-- 이탈 위험 고객
CREATE VIEW v_at_risk_clients AS
SELECT
  a.institution_id, i.name, a.risk_score, a.previous_score, a.severity,
  a.factor_engagement, a.factor_revenue, a.factor_broker_vote,
  a.factor_competition, a.factor_coverage_gap, a.factor_personnel,
  a.recommendation
FROM attrition_scores a
JOIN institutions i ON a.institution_id = i.id
WHERE a.score_date = (SELECT MAX(score_date) FROM attrition_scores)
AND a.risk_score >= 60
ORDER BY a.risk_score DESC;

-- 채널별 인터랙션 통계
CREATE VIEW v_channel_stats AS
SELECT
  channel,
  COUNT(*) AS total_count,
  COUNT(CASE WHEN date >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) AS last_30_days,
  COUNT(CASE WHEN date >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) AS last_7_days,
  AVG(needs_extracted) AS avg_needs_per_interaction
FROM interactions
GROUP BY channel;

-- ═══════════════════════════════════════════════════════════════════════
-- DATA GAP ANALYSIS: 현재 JSON vs 스키마
-- ═══════════════════════════════════════════════════════════════════════
--
-- ✅ 이미 JSON 존재: institutions, key_persons, salespeople, interactions,
--    needs, actions, broker_votes, commissions, research_reports,
--    corporate_access, at_risk_clients, compliance_alerts, dashboard_kpis,
--    volume_trend, recent_activity
--
-- ❌ 빠진 데이터 (새로 생성 필요):
--    1. trades.json — 실제 거래 데이터 (체결 기록)
--    2. deals.json — 딜 참여 (IPO/블록딜) → 현재 RevenueIntelligence에서 하드코딩
--    3. schedules.json — 일정 데이터 → 현재 MorningBriefing에서 하드코딩
--    4. market_snapshots.json — 시장 데이터 → 현재 MorningBriefing에서 하드코딩
--    5. portfolio_estimates.json — 고객 포트폴리오 추정
--    6. client_interests.json — 고객 관심 추적 (섹터/종목)
--    7. competitor_mentions.json — 경쟁 인텔리전스
--    8. chinese_wall_restrictions.json — 정보교류차단 제한 종목 리스트
--    9. audit_trail.json — 감사 추적 로그
--   10. research_distributions.json — 리서치 배포 상세 (누가 어떤 리포트를 열었는지)
--   11. corporate_access_attendees.json — 기업탐방 참석자 상세
--   12. salesperson_metrics.json — 세일즈 코칭 지표
--   13. integration_channels.json — 연동 채널 현황
--
-- ═══════════════════════════════════════════════════════════════════════
