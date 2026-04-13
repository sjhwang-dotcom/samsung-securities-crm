import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import ResearchLayout from './components/ResearchLayout'
import ExecLayout from './components/ExecLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ClientManagement from './pages/ClientManagement'
import ActivityManagement from './pages/ActivityManagement'
import BrokerVote from './pages/BrokerVote'
import RevenueIntelligence from './pages/RevenueIntelligence'
import ResearchDistribution from './pages/ResearchDistribution'
import CorporateAccess from './pages/CorporateAccess'
import AttritionWarning from './pages/AttritionWarning'
import ComplianceCenter from './pages/ComplianceCenter'
import MorningBriefing from './pages/MorningBriefing'
import ResearchPortal from './pages/ResearchPortal'
import ExecDashboard from './pages/ExecDashboard'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login / Portal Selector */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* 세일즈 플랫폼 (메인) */}
        <Route element={<Layout />}>
          <Route path="/briefing" element={<MorningBriefing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clients" element={<ClientManagement />} />
          <Route path="/activity" element={<ActivityManagement />} />
          <Route path="/broker-vote" element={<BrokerVote />} />
          <Route path="/revenue" element={<RevenueIntelligence />} />
          <Route path="/research" element={<ResearchDistribution />} />
          <Route path="/corporate-access" element={<CorporateAccess />} />
          <Route path="/risk" element={<AttritionWarning />} />
          <Route path="/compliance" element={<ComplianceCenter />} />
        </Route>

        {/* 리서치 포탈 */}
        <Route element={<ResearchLayout />}>
          <Route path="/research-portal" element={<ResearchPortal />} />
        </Route>

        {/* 경영진 대시보드 */}
        <Route element={<ExecLayout />}>
          <Route path="/exec" element={<ExecDashboard />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
