import { useState } from 'react'
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, ClipboardList, Store, DollarSign, FileText,
  GraduationCap, HelpCircle, LogOut, Sparkles,
} from 'lucide-react'
import LuminaPanel from './LuminaPanel'

const mainNav = [
  { to: '/partner', icon: LayoutDashboard, title: 'Home', end: true },
  { to: '/partner/pipeline', icon: ClipboardList, title: 'Pipeline' },
  { to: '/partner/merchants', icon: Store, title: 'Merchants' },
  { to: '/partner/residuals', icon: DollarSign, title: 'Residuals' },
  { to: '/partner/marketing', icon: FileText, title: 'Marketing' },
  { to: '/partner/training', icon: GraduationCap, title: 'Training' },
]

export default function PartnerLayout() {
  const [luminaOpen, setLuminaOpen] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div className="harlow-shell">
      {/* NavRail */}
      <nav className="icon-rail" style={{ background: 'linear-gradient(185deg, #1E293B 0%, #0F172A 100%)' }}>
        <div className="icon-rail-logo">
          <div className="logo-mark" style={{ background: 'linear-gradient(135deg, #10B981, #059669)', fontSize: 11, fontWeight: 800 }}>PP</div>
        </div>

        <div className="icon-rail-nav">
          {mainNav.map(item => {
            const isActive = item.end
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to)
            return (
              <NavLink key={item.to} to={item.to} end={item.end} title={item.title}
                className={`icon-rail-item ${isActive ? 'active' : ''}`}
              >
                <item.icon size={18} strokeWidth={1.8} />
              </NavLink>
            )
          })}
        </div>

        <div className="icon-rail-bottom">
          <NavLink to="/partner" title="Support" className="icon-rail-item" end>
            <HelpCircle size={18} strokeWidth={1.8} />
          </NavLink>
          <button title="Switch Portal" className="icon-rail-item" onClick={() => navigate('/login')}>
            <LogOut size={18} strokeWidth={1.8} />
          </button>
          <div className="icon-rail-avatar" title="Jake Wilson" style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
            <span>JW</span>
          </div>
        </div>
      </nav>

      {/* Main Area */}
      <div className="harlow-main-wrapper">
        <header className="harlow-topbar">
          <div className="topbar-title-area">
            <h1 className="topbar-title">Jake Wilson | Acme Financial Partners</h1>
            <p className="topbar-sub">Partner since Oct 2024</p>
          </div>
          <div className="topbar-actions">
            <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>April 9, 2026</span>
            {!luminaOpen && (
              <button className="topbar-lumina-btn" onClick={() => setLuminaOpen(true)} title="Ask Lumina">
                <Sparkles size={14} strokeWidth={2} />
                Lumina
              </button>
            )}
          </div>
        </header>

        <main className="harlow-content">
          <Outlet />
        </main>

        <footer className="harlow-statusbar">
          <span>Your data is encrypted and PCI DSS Level 1 compliant</span>
          <span className="statusbar-sep">|</span>
          <span>Need help? Call 1-800-HARLOW</span>
        </footer>
      </div>

      {luminaOpen && <LuminaPanel onClose={() => setLuminaOpen(false)} />}
    </div>
  )
}
