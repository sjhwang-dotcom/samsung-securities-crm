import { useState } from 'react'
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  Search, Bell, Settings, RefreshCw, LogOut,
  LayoutDashboard, Building2, MessageSquare, Award,
  TrendingUp, FileText, Calendar, AlertTriangle, Shield,
  Sparkles,
} from 'lucide-react'
import LuminaPanel from './LuminaPanel'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, title: '대시보드' },
  { to: '/clients', icon: Building2, title: '고객 관리' },
  { to: '/activity', icon: MessageSquare, title: '활동 관리' },
  { to: '/broker-vote', icon: Award, title: '브로커 보트' },
  { to: '/revenue', icon: TrendingUp, title: '수익 분석' },
  { to: '/research', icon: FileText, title: '리서치' },
  { to: '/corporate-access', icon: Calendar, title: '기업탐방' },
  { to: '/risk', icon: AlertTriangle, title: '이탈 경고' },
  { to: '/compliance', icon: Shield, title: '컴플라이언스' },
]

const pageTitles: Record<string, { title: string; sub: string }> = {
  '/dashboard': { title: '영업 대시보드', sub: '기관영업 실시간 현황 — 수수료, 고객, 브로커 보트, AI 인사이트' },
  '/clients': { title: '고객 관리 (Client 360)', sub: '기관 고객 프로필, 니즈 추출, 액션 추천' },
  '/activity': { title: '활동 관리', sub: '인터랙션 로그, 니즈 추출 파이프라인, 팔로업 큐' },
  '/broker-vote': { title: '브로커 보트 분석', sub: '카테고리별 점수, 트렌드, 보트 시즌 준비' },
  '/revenue': { title: '수익 분석', sub: '수수료 트렌드, 고객 수익성, 딜 참여' },
  '/research': { title: '리서치 배포', sub: '리포트 배포 현황, 고객 관심 매칭, 커버리지 갭' },
  '/corporate-access': { title: '기업탐방 관리', sub: 'NDR, Conference, 전문가 통화 일정 및 ROI' },
  '/risk': { title: '이탈 조기 경보', sub: '다중 신호 기반 이탈 위험 감지 및 개입 추천' },
  '/compliance': { title: '컴플라이언스 센터', sub: '정보교류차단, 고객정보관리, 감사 추적' },
}

export default function Layout() {
  const [luminaOpen, setLuminaOpen] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()
  const currentPage = pageTitles[location.pathname] || pageTitles['/dashboard']

  return (
    <div className="harlow-shell">
      {/* ═══ NavRail — Icon-only dark sidebar ═══ */}
      <nav className="icon-rail">
        <div className="icon-rail-logo">
          <div className="logo-mark" style={{ background: 'linear-gradient(135deg, #034EA2 0%, #2B7DE9 100%)' }}>
            SS
          </div>
        </div>

        <div className="icon-rail-nav">
          {navItems.map(item => {
            const isActive = location.pathname.startsWith(item.to)
            return (
              <NavLink
                key={item.to}
                to={item.to}
                title={item.title}
                className={`icon-rail-item ${isActive ? 'active' : ''}`}
              >
                <item.icon size={18} strokeWidth={1.8} />
              </NavLink>
            )
          })}
        </div>

        <div className="icon-rail-bottom">
          <NavLink to="/settings" title="설정" className="icon-rail-item">
            <Settings size={18} strokeWidth={1.8} />
          </NavLink>
          <button title="포탈 전환" className="icon-rail-item" onClick={() => navigate('/login')}>
            <LogOut size={18} strokeWidth={1.8} />
          </button>
          <div className="icon-rail-avatar" title="김영호">
            <span>김</span>
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
              <button className="time-filter-btn">7일</button>
              <button className="time-filter-btn active">30일</button>
              <button className="time-filter-btn">90일</button>
              <button className="time-filter-btn">12개월</button>
            </div>
            <button className="topbar-refresh-btn" title="새로고침">
              <RefreshCw size={14} strokeWidth={2} />
            </button>
            <button className="topbar-icon-btn" title="알림">
              <Bell size={16} strokeWidth={1.8} />
              <span className="topbar-notif-dot" />
            </button>
            <button className="topbar-icon-btn" title="검색">
              <Search size={16} strokeWidth={1.8} />
            </button>
            {!luminaOpen && (
              <button
                className="topbar-lumina-btn"
                onClick={() => setLuminaOpen(true)}
                title="루미나"
              >
                <Sparkles size={14} strokeWidth={2} />
                루미나
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
          <span>마지막 갱신: 2분 전</span>
          <span className="statusbar-sep">|</span>
          <span>15명 세일즈 · 300 기관 고객</span>
          <span className="statusbar-sep">|</span>
          <span>AI 인사이트 15분마다 갱신</span>
          <span className="statusbar-sep">|</span>
          <span className="statusbar-auth">모든 액션은 사람의 승인 필요</span>
        </footer>
      </div>

      {/* ═══ AI Assistant Panel ═══ */}
      {luminaOpen && <LuminaPanel onClose={() => setLuminaOpen(false)} />}
    </div>
  )
}
