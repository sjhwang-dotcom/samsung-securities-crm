import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import MerchantLayout from './components/MerchantLayout'
import PartnerLayout from './components/PartnerLayout'
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
import SalesAnalytics from './pages/merchant/SalesAnalytics'
import PartnerDashboard from './pages/partner/PartnerDashboard'
import PartnerPipeline from './pages/partner/PartnerPipeline'
import PartnerMerchants from './pages/partner/PartnerMerchants'
import PartnerResiduals from './pages/partner/PartnerResiduals'
import PartnerMarketing from './pages/partner/PartnerMarketing'
import PartnerTraining from './pages/partner/PartnerTraining'

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
          <Route path="/portal/sales" element={<SalesAnalytics />} />
          <Route path="/portal/statements" element={<Statements />} />
          <Route path="/portal/pci" element={<PCI />} />
          <Route path="/portal/equipment" element={<Equipment />} />
          <Route path="/portal/support" element={<Support />} />
          <Route path="/portal/products" element={<ProductsServices />} />
          <Route path="/portal/lumina" element={<AIAssistant />} />
        </Route>

        {/* Partner Portal */}
        <Route element={<PartnerLayout />}>
          <Route path="/partner" element={<PartnerDashboard />} />
          <Route path="/partner/pipeline" element={<PartnerPipeline />} />
          <Route path="/partner/merchants" element={<PartnerMerchants />} />
          <Route path="/partner/residuals" element={<PartnerResiduals />} />
          <Route path="/partner/marketing" element={<PartnerMarketing />} />
          <Route path="/partner/training" element={<PartnerTraining />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
