import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()

  return (
    <div style={s.page}>
      {/* Left — Branding */}
      <div style={s.left}>
        <div style={s.brandTop}>
          <div style={s.logoMark}>H</div>
          <span style={s.brandName}>Harlow Payments</span>
        </div>
        <div style={s.hero}>
          <h1 style={s.heroTitle}>Agentic<br />Merchant<br />Platform</h1>
          <p style={s.heroSub}>AI-powered payment processing,<br />merchant management, and portfolio intelligence.</p>
        </div>
        <p style={s.copyright}>© 2026 Harlow Payments × DeepAuto. All rights reserved.</p>
      </div>

      {/* Right — Portal Selector */}
      <div style={s.right}>
        <div style={s.formWrap}>
          <h2 style={s.formTitle}>Welcome</h2>
          <p style={s.formSub}>Select your portal to continue</p>

          {/* Harlow Platform */}
          <button style={s.portalCard} onClick={() => navigate('/')}
            onMouseOver={e => { (e.currentTarget as HTMLElement).style.borderColor = '#1578F7'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(21,120,247,0.12)' }}
            onMouseOut={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E5E7EB'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}
          >
            <div style={{ ...s.portalIcon, background: 'linear-gradient(135deg, #121212, #1578F7)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>
            </div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={s.portalTitle}>Harlow Platform</div>
              <div style={s.portalDesc}>ISO management, portfolio analytics, risk & compliance</div>
            </div>
            <span style={{ fontSize: 18, color: '#CBD5E1' }}>→</span>
          </button>

          {/* Merchant Portal */}
          <button style={s.portalCard} onClick={() => navigate('/portal')}
            onMouseOver={e => { (e.currentTarget as HTMLElement).style.borderColor = '#3B82F6'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(59,130,246,0.12)' }}
            onMouseOut={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E5E7EB'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}
          >
            <div style={{ ...s.portalIcon, background: 'linear-gradient(135deg, #1E3A5F, #3B82F6)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
            </div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={s.portalTitle}>Merchant Portal</div>
              <div style={s.portalDesc}>Transaction reports, deposits, products & services, PCI compliance</div>
            </div>
            <span style={{ fontSize: 18, color: '#CBD5E1' }}>→</span>
          </button>

          <div style={{ marginTop: 24, textAlign: 'center', fontSize: 12, color: '#94A3B8' }}>
            Need help? <a href="mailto:support@harlowpayments.com" style={{ color: '#0F172A', fontWeight: 500, textDecoration: 'none' }}>support@harlowpayments.com</a>
          </div>
        </div>
      </div>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  page: { display: 'flex', minHeight: '100vh', fontFamily: "'Inter', system-ui, sans-serif" },
  left: { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '45%', padding: 48, background: '#0F172A', color: 'white' },
  brandTop: { display: 'flex', alignItems: 'center', gap: 12 },
  logoMark: { width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #1578F7, #609FFF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900, color: 'white' },
  brandName: { fontSize: 15, fontWeight: 500, color: 'rgba(255,255,255,0.6)' },
  hero: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  heroTitle: { fontSize: 48, fontWeight: 800, lineHeight: 1.08, margin: 0, letterSpacing: '-2px' },
  heroSub: { marginTop: 24, fontSize: 16, lineHeight: 1.6, color: 'rgba(255,255,255,0.4)' },
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
