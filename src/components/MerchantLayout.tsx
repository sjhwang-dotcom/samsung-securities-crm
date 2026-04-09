import { useState } from 'react'
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  Home, ArrowLeftRight, FileText, Landmark, AlertTriangle,
  ShieldCheck, Monitor, HelpCircle, LogOut, Sparkles, Package,
} from 'lucide-react'
import LuminaPanel from './LuminaPanel'

const mainNav = [
  { to: '/portal', icon: Home, title: 'Home', end: true },
  { to: '/portal/transactions', icon: ArrowLeftRight, title: 'Transactions' },
  { to: '/portal/deposits', icon: Landmark, title: 'Deposits' },
  { to: '/portal/chargebacks', icon: AlertTriangle, title: 'Chargebacks', badge: 1 },
  { to: '/portal/statements', icon: FileText, title: 'Statements' },
  { to: '/portal/pci', icon: ShieldCheck, title: 'PCI & Compliance' },
  { to: '/portal/equipment', icon: Monitor, title: 'Equipment' },
  { to: '/portal/products', icon: Package, title: 'Products & Services' },
]

export default function MerchantLayout() {
  const [luminaOpen, setLuminaOpen] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div className="harlow-shell">
      {/* ═══ NavRail ═══ */}
      <nav className="icon-rail" style={{ background: 'linear-gradient(185deg, #1E293B 0%, #0F172A 100%)' }}>
        <div className="icon-rail-logo">
          <div className="logo-mark" style={{ background: 'linear-gradient(135deg, #3B82F6, #6366F1)', fontSize: 11, fontWeight: 800 }}>MP</div>
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
                {item.badge && <span className="icon-rail-badge">{item.badge}</span>}
              </NavLink>
            )
          })}
        </div>

        <div className="icon-rail-bottom">
          <NavLink to="/portal/lumina" title="Lumina AI" className="icon-rail-item">
            <Sparkles size={18} strokeWidth={1.8} />
          </NavLink>
          <NavLink to="/portal/support" title="Support" className="icon-rail-item">
            <HelpCircle size={18} strokeWidth={1.8} />
          </NavLink>
          <button title="Switch Portal" className="icon-rail-item" onClick={() => navigate('/login')}>
            <LogOut size={18} strokeWidth={1.8} />
          </button>
          <div className="icon-rail-avatar" title="Mario Rossi" style={{ background: 'linear-gradient(135deg, #3B82F6, #6366F1)' }}>
            <span>MR</span>
          </div>
        </div>
      </nav>

      {/* ═══ Main Area ═══ */}
      <div className="harlow-main-wrapper">
        <header className="harlow-topbar">
          <div className="topbar-title-area">
            <h1 className="topbar-title">Mario's Pizzeria</h1>
            <p className="topbar-sub">Account #5489-7821-0034 · Harlow Payments</p>
          </div>
          <div className="topbar-actions">
            <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>March 14, 2026</span>
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
