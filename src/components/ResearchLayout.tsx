import { useState } from 'react'
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  Search, Bell, LogOut,
  LayoutDashboard,
  Sparkles,
} from 'lucide-react'
import LuminaPanel from './LuminaPanel'

const navItems = [
  { to: '/research-portal', icon: LayoutDashboard, title: '대시보드' },
]

export default function ResearchLayout() {
  const [luminaOpen, setLuminaOpen] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div className="harlow-shell">
      <nav className="icon-rail">
        <div className="icon-rail-logo">
          <div className="logo-mark" style={{ background: 'linear-gradient(135deg, #034EA2, #2B7DE9)' }}>
            SS
          </div>
        </div>
        <div className="icon-rail-nav">
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} title={item.title} className={`icon-rail-item ${location.pathname.startsWith(item.to) ? 'active' : ''}`}>
              <item.icon size={18} strokeWidth={1.8} />
            </NavLink>
          ))}
        </div>
        <div className="icon-rail-bottom">
          <button title="포탈 전환" className="icon-rail-item" onClick={() => navigate('/login')}>
            <LogOut size={18} strokeWidth={1.8} />
          </button>
          <div className="icon-rail-avatar" title="리서치센터"><span>리</span></div>
        </div>
      </nav>

      <div className="harlow-main-wrapper">
        <header className="harlow-topbar">
          <div className="topbar-title-area">
            <h1 className="topbar-title">리서치 포탈</h1>
            <p className="topbar-sub">리포트 발행 현황, 고객 반응, 리서치 영향력 분석</p>
          </div>
          <div className="topbar-actions">
            <button className="topbar-icon-btn" title="알림"><Bell size={16} strokeWidth={1.8} /></button>
            <button className="topbar-icon-btn" title="검색"><Search size={16} strokeWidth={1.8} /></button>
            {!luminaOpen && (
              <button className="topbar-lumina-btn" onClick={() => setLuminaOpen(true)} title="루미나">
                <Sparkles size={14} strokeWidth={2} /> 루미나
              </button>
            )}
          </div>
        </header>
        <main className="harlow-content"><Outlet /></main>
        <footer className="harlow-statusbar">
          <span>리서치센터 · 25건 발행 · 평균 오픈율 64%</span>
        </footer>
      </div>

      {luminaOpen && <LuminaPanel onClose={() => setLuminaOpen(false)} />}
    </div>
  )
}
