import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()

  return (
    <div style={s.page}>
      {/* Left — Branding */}
      <div style={s.left}>
        <div style={s.brandTop}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #034EA2, #2B7DE9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: 'white' }}>SS</div>
          <span style={s.brandName}>삼성증권</span>
        </div>
        <div style={s.hero}>
          <h1 style={s.heroTitle}>Agentic<br />Capital Markets<br />CRM</h1>
          <p style={s.heroSub}>AI 기반 기관영업 인텔리전스 플랫폼<br />고객 니즈 추출 · 액션 추천 · 브로커 보트 분석</p>
        </div>
        <p style={s.copyright}>© 2026 Samsung Securities × DeepAuto.ai — Powered by Agentic Intelligence</p>
      </div>

      {/* Right — Portal Selector */}
      <div style={s.right}>
        <div style={s.formWrap}>
          <h2 style={s.formTitle}>포탈 선택</h2>
          <p style={s.formSub}>접속할 포탈을 선택하세요</p>

          {/* Sales Platform */}
          <button style={s.portalCard} onClick={() => navigate('/dashboard')}
            onMouseOver={e => { (e.currentTarget as HTMLElement).style.borderColor = '#034EA2'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(3,78,162,0.12)' }}
            onMouseOut={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E5E7EB'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}
          >
            <div style={{ ...s.portalIcon, background: 'linear-gradient(135deg, #0A1628, #034EA2)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>
            </div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={s.portalTitle}>세일즈 플랫폼</div>
              <div style={s.portalDesc}>대시보드, 고객 관리, 활동 관리, 브로커 보트, 수익 분석, 컴플라이언스</div>
            </div>
            <span style={{ fontSize: 18, color: '#CBD5E1' }}>→</span>
          </button>

          {/* Research Portal */}
          <button style={s.portalCard} onClick={() => navigate('/research-portal')}
            onMouseOver={e => { (e.currentTarget as HTMLElement).style.borderColor = '#2B7DE9'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(43,125,233,0.12)' }}
            onMouseOut={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E5E7EB'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}
          >
            <div style={{ ...s.portalIcon, background: 'linear-gradient(135deg, #1E3A5F, #2B7DE9)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={s.portalTitle}>리서치 포탈</div>
              <div style={s.portalDesc}>리포트 발행 현황, 고객 반응 분석, 리서치 영향력</div>
            </div>
            <span style={{ fontSize: 18, color: '#CBD5E1' }}>→</span>
          </button>

          {/* Executive Dashboard */}
          <button style={s.portalCard} onClick={() => navigate('/exec')}
            onMouseOver={e => { (e.currentTarget as HTMLElement).style.borderColor = '#2B7DE9'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(43,125,233,0.12)' }}
            onMouseOut={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E5E7EB'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}
          >
            <div style={{ ...s.portalIcon, background: 'linear-gradient(135deg, #1E3A5F, #2B7DE9)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={s.portalTitle}>경영진 대시보드</div>
              <div style={s.portalDesc}>영업팀 전체 KPI, 세일즈 코칭, 수수료 전사 뷰</div>
            </div>
            <span style={{ fontSize: 18, color: '#CBD5E1' }}>→</span>
          </button>

          <div style={{ marginTop: 24, textAlign: 'center', fontSize: 12, color: '#94A3B8' }}>
            문의: <a href="mailto:info@deepauto.ai" style={{ color: '#0F172A', fontWeight: 500, textDecoration: 'none' }}>info@deepauto.ai</a>
          </div>
        </div>
      </div>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  page: { display: 'flex', minHeight: '100vh', fontFamily: "'Noto Sans KR', 'IBM Plex Sans', system-ui, sans-serif" },
  left: { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '45%', padding: 48, background: '#0A1628', color: 'white' },
  brandTop: { display: 'flex', alignItems: 'center', gap: 12 },
  brandName: { fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.7)' },
  hero: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  heroTitle: { fontSize: 48, fontWeight: 800, lineHeight: 1.08, margin: 0, letterSpacing: '-2px' },
  heroSub: { marginTop: 24, fontSize: 16, lineHeight: 1.8, color: 'rgba(255,255,255,0.4)' },
  copyright: { fontSize: 12, color: 'rgba(255,255,255,0.2)', margin: 0 },
  right: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48, background: '#FAFBFC' },
  formWrap: { width: '100%', maxWidth: 420 },
  formTitle: { fontSize: 28, fontWeight: 800, color: '#0F172A', margin: '0 0 8px', letterSpacing: '-0.5px' },
  formSub: { fontSize: 14, color: '#94A3B8', margin: '0 0 32px' },
  portalCard: {
    display: 'flex', alignItems: 'center', gap: 14, width: '100%',
    padding: '18px 20px', marginBottom: 12,
    background: 'white', border: '1px solid #E5E7EB', borderRadius: 12,
    cursor: 'pointer', transition: 'all 0.2s ease',
    textAlign: 'left' as const, fontFamily: 'inherit',
  },
  portalIcon: { width: 44, height: 44, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  portalTitle: { fontSize: 15, fontWeight: 700, color: '#0F172A' },
  portalDesc: { fontSize: 12, color: '#94A3B8', marginTop: 2, fontWeight: 500, lineHeight: 1.4 },
}
