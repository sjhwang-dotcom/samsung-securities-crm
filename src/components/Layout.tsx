import { useState } from 'react'
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import harlowLogo from '../assets/harlow-logo.svg'
import {
  Search, Bell, Settings, RefreshCw, LogOut,
  LayoutDashboard, Building2, ClipboardList, Phone,
  TrendingUp, Shield, CheckCircle,
  Sparkles, Banknote,
} from 'lucide-react'
import LuminaPanel from './LuminaPanel'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, title: 'Dashboard' },
  { to: '/crm', icon: ClipboardList, title: 'Agentic CRM' },
  { to: '/voice', icon: Phone, title: 'Voice Agent', live: true },
  { to: '/iso', icon: Building2, title: 'ISOs' },
  { to: '/analytics', icon: TrendingUp, title: 'Analytics' },
  { to: '/funding-mgmt', icon: Banknote, title: 'Funding' },
  { to: '/risk', icon: Shield, title: 'Risk & UW' },
  { to: '/compliance', icon: CheckCircle, title: 'Compliance' },
]

const pageTitles: Record<string, { title: string; sub: string }> = {
  '/': { title: 'Portfolio Command Center', sub: 'Real-time overview across all portfolio companies' },
  '/crm': { title: 'Agentic CRM', sub: 'Full merchant lifecycle — lead to go-live' },
  '/voice': { title: 'Voice Agent Command Center', sub: 'Real-time AI calling operations' },
  '/risk': { title: 'Agentic Risk Intelligence', sub: 'Transaction-based risk scoring and monitoring' },
  '/compliance': { title: 'Compliance Intelligence', sub: 'Automated regulatory monitoring' },
  '/analytics': { title: 'Agentic Portfolio Intelligence', sub: 'Cross-ISO performance analytics' },
  '/funding-mgmt': { title: 'Funding Management', sub: 'MCA portfolio and merchant cash advance operations' },
  '/iso': { title: 'ISO Portfolio Companies', sub: 'Manage portfolio companies and integrations' },
  '/portal': { title: 'Merchant Portal', sub: 'Self-service merchant interface' },
}

export default function Layout() {
  const [luminaOpen, setLuminaOpen] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()
  const currentPage = pageTitles[location.pathname] || pageTitles['/']

  return (
    <div className="harlow-shell">
      {/* ═══ NavRail — Icon-only dark sidebar ═══ */}
      <nav className="icon-rail">
        <div className="icon-rail-logo">
          <img src={harlowLogo} alt="Harlow" style={{ width: 32, height: 32, borderRadius: 8 }} />
        </div>

        <div className="icon-rail-nav">
          {navItems.map(item => {
            const isActive = item.to === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.to)
            return (
              <NavLink
                key={item.to}
                to={item.to}
                title={item.title}
                className={`icon-rail-item ${isActive ? 'active' : ''}`}
              >
                <item.icon size={18} strokeWidth={1.8} />
                {item.live && <span className="icon-rail-badge">LIVE</span>}
              </NavLink>
            )
          })}
        </div>

        <div className="icon-rail-bottom">
          <NavLink to="/settings" title="Settings" className="icon-rail-item">
            <Settings size={18} strokeWidth={1.8} />
          </NavLink>
          <button title="Switch Portal" className="icon-rail-item" onClick={() => navigate('/login')}>
            <LogOut size={18} strokeWidth={1.8} />
          </button>
          <div className="icon-rail-avatar" title="Sarah Chen">
            <span>SC</span>
          </div>
        </div>
      </nav>

      {/* ═══ Main Area ═══ */}
      <div className="harlow-main-wrapper">
        {/* Top Bar */}
        <header className="harlow-topbar">
          <div className="topbar-title-area">
            <h1 className="topbar-title">{currentPage.title}</h1>
            <p className="topbar-sub">{currentPage.sub}</p>
          </div>
          <div className="topbar-actions">
            <div className="topbar-time-filters">
              <button className="time-filter-btn">7d</button>
              <button className="time-filter-btn active">30d</button>
              <button className="time-filter-btn">90d</button>
              <button className="time-filter-btn">12m</button>
            </div>
            <button className="topbar-refresh-btn" title="Refresh">
              <RefreshCw size={14} strokeWidth={2} />
            </button>
            <button className="topbar-icon-btn" title="Notifications">
              <Bell size={16} strokeWidth={1.8} />
              <span className="topbar-notif-dot" />
            </button>
            <button className="topbar-icon-btn" title="Search">
              <Search size={16} strokeWidth={1.8} />
            </button>
            {!luminaOpen && (
              <button
                className="topbar-lumina-btn"
                onClick={() => setLuminaOpen(true)}
                title="Open Lumina"
              >
                <Sparkles size={14} strokeWidth={2} />
                Lumina
              </button>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="harlow-content">
          <Outlet />
        </main>

        {/* Status Bar */}
        <footer className="harlow-statusbar">
          <span>Last refreshed: 2 min ago</span>
          <span className="statusbar-sep">|</span>
          <span>Data across 3 ISOs, 4,612 merchants</span>
          <span className="statusbar-sep">|</span>
          <span>AI insights update every 15 min</span>
          <span className="statusbar-sep">|</span>
          <span className="statusbar-auth">Human authority required for all actions</span>
        </footer>
      </div>

      {/* ═══ Lumina Panel ═══ */}
      {luminaOpen && <LuminaPanel onClose={() => setLuminaOpen(false)} />}
    </div>
  )
}
