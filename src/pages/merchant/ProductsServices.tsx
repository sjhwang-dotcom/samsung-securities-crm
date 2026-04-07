import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  DollarSign, Building, Calculator, Users, Heart, Shield, Bitcoin, Gift,
  Package, Search,
} from 'lucide-react'
import Funding from './Funding'
import Checking from './Checking'
import Accounting from './Accounting'
import PayrollPage from './PayrollPage'
import HealthInsurance from './HealthInsurance'
import BizInsurance from './BizInsurance'
import Crypto from './Crypto'
import Rewards from './Rewards'

type Tab = 'funding' | 'checking' | 'accounting' | 'payroll' | 'insurance' | 'biz-insurance' | 'crypto' | 'rewards'

const tabs: { id: Tab; label: string; icon: typeof DollarSign; status: string; statusColor: string }[] = [
  { id: 'funding', label: 'Business Funding', icon: DollarSign, status: 'Pre-Approved', statusColor: '#1578F7' },
  { id: 'checking', label: 'Checking', icon: Building, status: 'Active', statusColor: '#059669' },
  { id: 'accounting', label: 'Accounting', icon: Calculator, status: 'Available', statusColor: '#94A3B8' },
  { id: 'payroll', label: 'Payroll', icon: Users, status: 'Active', statusColor: '#059669' },
  { id: 'insurance', label: 'Health Insurance', icon: Heart, status: 'Available', statusColor: '#94A3B8' },
  { id: 'biz-insurance', label: 'Business Insurance', icon: Shield, status: 'Available', statusColor: '#94A3B8' },
  { id: 'crypto', label: 'Crypto Payments', icon: Bitcoin, status: 'Available', statusColor: '#94A3B8' },
  { id: 'rewards', label: 'Rewards', icon: Gift, status: 'Active', statusColor: '#059669' },
]

export default function ProductsServices() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab') as Tab | null
  const [activeTab, setActiveTab] = useState<Tab>(tabParam && tabs.some(t => t.id === tabParam) ? tabParam : 'funding')

  useEffect(() => {
    if (tabParam && tabs.some(t => t.id === tabParam)) {
      setActiveTab(tabParam)
    }
  }, [tabParam])

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab)
    setSearchParams({ tab })
  }

  return (
    <div className="dashboard-grid">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #1578F7, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Package size={16} color="white" strokeWidth={2} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>Products & Services</div>
            <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500 }}>
              {tabs.filter(t => t.status === 'Active').length} active · {tabs.filter(t => t.status === 'Pre-Approved').length} pre-approved · {tabs.filter(t => t.status === 'Available').length} available
            </div>
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#CBD5E1' }} />
          <input
            placeholder="Search products..."
            style={{
              background: 'white', border: '1px solid #E5E7EB', borderRadius: 10,
              paddingLeft: 34, paddingRight: 16, paddingTop: 9, paddingBottom: 9,
              fontSize: 13, outline: 'none', width: 220, color: '#334155',
            }}
          />
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #E5E7EB', overflowX: 'auto', flexShrink: 0 }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap',
              padding: '10px 14px', fontSize: 12,
              fontWeight: activeTab === tab.id ? 700 : 500,
              color: activeTab === tab.id ? '#1578F7' : '#64748B',
              background: 'none', border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid #1578F7' : '2px solid transparent',
              cursor: 'pointer', transition: 'all 0.15s ease',
            }}
          >
            <tab.icon size={14} strokeWidth={1.8} />
            {tab.label}
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: tab.statusColor,
              marginLeft: 2,
            }} />
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'funding' && <Funding />}
      {activeTab === 'checking' && <Checking />}
      {activeTab === 'accounting' && <Accounting />}
      {activeTab === 'payroll' && <PayrollPage />}
      {activeTab === 'insurance' && <HealthInsurance />}
      {activeTab === 'biz-insurance' && <BizInsurance />}
      {activeTab === 'crypto' && <Crypto />}
      {activeTab === 'rewards' && <Rewards />}
    </div>
  )
}
