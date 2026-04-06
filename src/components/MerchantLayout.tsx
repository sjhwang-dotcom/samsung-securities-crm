import { useState } from 'react'
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  Home, ArrowLeftRight, FileText, Landmark, AlertTriangle,
  ShieldCheck, Monitor, HelpCircle, LogOut, Sparkles, Package,
  DollarSign, Building, Calculator, Users, Heart, Shield, Bitcoin, Gift, ChevronDown,
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
]

const productNav = [
  { to: '/portal/funding', icon: DollarSign, title: 'Business Funding' },
  { to: '/portal/checking', icon: Building, title: 'Business Checking' },
  { to: '/portal/accounting', icon: Calculator, title: 'Accounting' },
  { to: '/portal/payroll', icon: Users, title: 'Payroll' },
  { to: '/portal/insurance', icon: Heart, title: 'Health Insurance' },
  { to: '/portal/biz-insurance', icon: Shield, title: 'Business Insurance' },
  { to: '/portal/crypto', icon: Bitcoin, title: 'Crypto Payments' },
  { to: '/portal/rewards', icon: Gift, title: 'Rewards Program' },
]

const productPaths = productNav.map(p => p.to)

export default function MerchantLayout() {
  const [luminaOpen, setLuminaOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // Auto-expand if on a product route
  const isOnProductRoute = productPaths.some(p => location.pathname === p)
  const [productsExpanded, setProductsExpanded] = useState(isOnProductRoute)

  // Keep in sync with route changes
  if (isOnProductRoute && !productsExpanded) setProductsExpanded(true)

  return (
    <div className="harlow-shell">
      {/* ═══ NavRail ═══ */}
      <nav className="icon-rail" style={{ background: 'linear-gradient(185deg, #1E293B 0%, #0F172A 100%)' }}>
        <div className="icon-rail-logo">
          <div className="logo-mark" style={{ background: 'linear-gradient(135deg, #3B82F6, #6366F1)', fontSize: 11, fontWeight: 800 }}>MP</div>
        </div>

        <div className="icon-rail-nav">
          {/* Main nav */}
          {mainNav.map(item => {
            const isActive = item.end
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to)
            return (
              <NavLink key={item.to} to={item.to} end={item.end} title={item.title}
                className={`icon-rail-item ${isActive ? 'active' : ''}`}
                onClick={() => setProductsExpanded(false)}
              >
                <item.icon size={18} strokeWidth={1.8} />
                {item.badge && <span className="icon-rail-badge">{item.badge}</span>}
              </NavLink>
            )
          })}

          {/* Divider */}
          <div style={{ width: 28, height: 1, background: 'rgba(255,255,255,0.08)', margin: '6px 0' }} />

          {/* Products toggle */}
          <button
            title="Products & Services"
            className={`icon-rail-item ${isOnProductRoute ? 'active' : ''}`}
            onClick={() => setProductsExpanded(!productsExpanded)}
            style={{ position: 'relative' }}
          >
            <Package size={18} strokeWidth={1.8} />
            <ChevronDown
              size={10}
              strokeWidth={2.5}
              style={{
                position: 'absolute',
                bottom: 4,
                right: 8,
                color: 'rgba(255,255,255,0.4)',
                transform: productsExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }}
            />
          </button>

          {/* Products sub-menu (collapsible) */}
          <div style={{
            overflow: 'hidden',
            maxHeight: productsExpanded ? 320 : 0,
            transition: 'max-height 0.25s ease',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            paddingLeft: 6,
          }}>
            {productNav.map(item => {
              const isActive = location.pathname === item.to
              return (
                <NavLink key={item.to} to={item.to} title={item.title}
                  className={`icon-rail-item ${isActive ? 'active' : ''}`}
                  style={{ transform: 'scale(0.9)' }}
                >
                  <item.icon size={14} strokeWidth={1.8} />
                </NavLink>
              )
            })}
          </div>
        </div>

        <div className="icon-rail-bottom">
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
