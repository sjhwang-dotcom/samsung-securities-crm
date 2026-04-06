import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import MerchantLayout from './components/MerchantLayout'
import Dashboard from './pages/Dashboard'
import ISOManagement from './pages/ISOManagement'
import AgenticCRM from './pages/AgenticCRM'
import VoiceAgent from './pages/VoiceAgent'
import MerchantPortal from './pages/MerchantPortal'
import PortfolioAnalytics from './pages/PortfolioAnalytics'
import RiskUnderwriting from './pages/RiskUnderwriting'
import ComplianceCenter from './pages/ComplianceCenter'
import Login from './pages/Login'
import Transactions from './pages/merchant/Transactions'
import Deposits from './pages/merchant/Deposits'
import Chargebacks from './pages/merchant/Chargebacks'
import Statements from './pages/merchant/Statements'
import PCI from './pages/merchant/PCI'
import Equipment from './pages/merchant/Equipment'
import Support from './pages/merchant/Support'
import Funding from './pages/merchant/Funding'
import Checking from './pages/merchant/Checking'
import Accounting from './pages/merchant/Accounting'
import PayrollPage from './pages/merchant/PayrollPage'
import HealthInsurance from './pages/merchant/HealthInsurance'
import BizInsurance from './pages/merchant/BizInsurance'
import Crypto from './pages/merchant/Crypto'
import Rewards from './pages/merchant/Rewards'

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
          <Route path="/risk" element={<RiskUnderwriting />} />
          <Route path="/compliance" element={<ComplianceCenter />} />
        </Route>

        {/* Merchant Portal */}
        <Route element={<MerchantLayout />}>
          <Route path="/portal" element={<MerchantPortal />} />
          <Route path="/portal/transactions" element={<Transactions />} />
          <Route path="/portal/deposits" element={<Deposits />} />
          <Route path="/portal/chargebacks" element={<Chargebacks />} />
          <Route path="/portal/statements" element={<Statements />} />
          <Route path="/portal/pci" element={<PCI />} />
          <Route path="/portal/equipment" element={<Equipment />} />
          <Route path="/portal/support" element={<Support />} />
          {/* Products & Services */}
          <Route path="/portal/funding" element={<Funding />} />
          <Route path="/portal/checking" element={<Checking />} />
          <Route path="/portal/accounting" element={<Accounting />} />
          <Route path="/portal/payroll" element={<PayrollPage />} />
          <Route path="/portal/insurance" element={<HealthInsurance />} />
          <Route path="/portal/biz-insurance" element={<BizInsurance />} />
          <Route path="/portal/crypto" element={<Crypto />} />
          <Route path="/portal/rewards" element={<Rewards />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
