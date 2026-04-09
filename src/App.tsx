import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import MerchantLayout from './components/MerchantLayout'
import Dashboard from './pages/Dashboard'
import ISOManagement from './pages/ISOManagement'
import AgenticCRM from './pages/AgenticCRM'
import VoiceAgent from './pages/VoiceAgent'
import MerchantPortal from './pages/MerchantPortal'
import PortfolioAnalytics from './pages/PortfolioAnalytics'
import FundingManagement from './pages/FundingManagement'
import RiskUnderwriting from './pages/RiskUnderwriting'
import ComplianceCenter from './pages/ComplianceCenter'
import Login from './pages/Login'
import Transactions from './pages/merchant/Transactions'
import Statements from './pages/merchant/Statements'
import PCI from './pages/merchant/PCI'
import Equipment from './pages/merchant/Equipment'
import Support from './pages/merchant/Support'
import ProductsServices from './pages/merchant/ProductsServices'
import AIAssistant from './pages/merchant/AIAssistant'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login / Portal Selector */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Harlow Platform */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/iso" element={<ISOManagement />} />
          <Route path="/crm" element={<AgenticCRM />} />
          <Route path="/voice" element={<VoiceAgent />} />
          <Route path="/analytics" element={<PortfolioAnalytics />} />
          <Route path="/funding-mgmt" element={<FundingManagement />} />
          <Route path="/risk" element={<RiskUnderwriting />} />
          <Route path="/compliance" element={<ComplianceCenter />} />
        </Route>

        {/* Merchant Portal */}
        <Route element={<MerchantLayout />}>
          <Route path="/portal" element={<MerchantPortal />} />
          <Route path="/portal/transactions" element={<Transactions />} />
          <Route path="/portal/statements" element={<Statements />} />
          <Route path="/portal/pci" element={<PCI />} />
          <Route path="/portal/equipment" element={<Equipment />} />
          <Route path="/portal/support" element={<Support />} />
          <Route path="/portal/products" element={<ProductsServices />} />
          <Route path="/portal/lumina" element={<AIAssistant />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
