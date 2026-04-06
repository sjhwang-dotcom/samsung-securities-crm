import type { Merchant, Lead, AtRiskMerchant, ActivityItem, OnboardingApp, VoiceCall } from '../types'

export const dashboardKPIs = [
  { label: 'Total Merchants', value: '4,612', trend: '3.2%', trendDirection: 'up' as const, trendPositive: true, icon: 'Users', color: 'teal' },
  { label: 'Monthly Volume', value: '$32.1M', trend: '8.4%', trendDirection: 'up' as const, trendPositive: true, icon: 'DollarSign', color: 'indigo' },
  { label: 'Monthly Residuals', value: '$3.21M', trend: '8.4%', trendDirection: 'up' as const, trendPositive: true, icon: 'TrendingUp', color: 'emerald' },
  { label: 'Portfolio Churn', value: '1.4%', trend: '0.4%', trendDirection: 'down' as const, trendPositive: true, icon: 'UserMinus', color: 'emerald' },
  { label: 'Chargeback Rate', value: '0.35%', trend: '0.02%', trendDirection: 'down' as const, trendPositive: true, icon: 'AlertTriangle', color: 'amber' },
]

export const volumeData = [
  { month: "Apr '25", volume: 18.2, residuals: 1.82 },
  { month: "May '25", volume: 19.1, residuals: 1.91 },
  { month: "Jun '25", volume: 20.4, residuals: 2.04 },
  { month: "Jul '25", volume: 21.2, residuals: 2.12 },
  { month: "Aug '25", volume: 22.8, residuals: 2.28 },
  { month: "Sep '25", volume: 23.5, residuals: 2.35 },
  { month: "Oct '25", volume: 25.1, residuals: 2.51 },
  { month: "Nov '25", volume: 26.3, residuals: 2.63 },
  { month: "Dec '25", volume: 27.8, residuals: 2.78 },
  { month: "Jan '26", volume: 29.2, residuals: 2.92 },
  { month: "Feb '26", volume: 30.5, residuals: 3.05 },
  { month: "Mar '26", volume: 32.1, residuals: 3.21 },
]

export const categoryMixData = [
  { name: 'Restaurants', value: 34, color: '#0891B2' },
  { name: 'Retail', value: 22, color: '#4F46E5' },
  { name: 'Services', value: 18, color: '#10B981' },
  { name: 'Auto', value: 12, color: '#F59E0B' },
  { name: 'Health', value: 8, color: '#F43F5E' },
  { name: 'Other', value: 6, color: '#8B5CF6' },
]

export const isoPortfolio = [
  { name: 'Harlow Direct', merchants: '2,847', volume: '$18.4M', churn: '1.2%', penetration: '8.4%', status: 'Primary', statusColor: 'teal' },
  { name: 'Zenith Payments', merchants: '1,024', volume: '$8.9M', churn: '2.1%', penetration: '3.2%', status: 'Acquired Q4 2025', statusColor: 'emerald' },
  { name: 'Liberty Processing', merchants: '741', volume: '$4.8M', churn: '3.4%', penetration: '1.8%', status: 'Acquired Q1 2026', statusColor: 'emerald' },
]

export const atRiskMerchants: AtRiskMerchant[] = [
  { name: 'Sunrise Deli', riskScore: 87, volume: '$8,120', trend: '42%', severity: 'CRITICAL' },
  { name: 'Metro Tobacco', riskScore: 79, volume: '$5,340', trend: '28%', severity: 'HIGH' },
  { name: 'Lucky Nail Salon', riskScore: 72, volume: '$10,890', trend: '12%', severity: 'HIGH' },
  { name: 'Empire Florist', riskScore: 68, volume: '$0', trend: 'Stopped', severity: 'INACTIVE' },
  { name: 'Downtown Barber', riskScore: 61, volume: '$3,670', trend: '18%', severity: 'MODERATE' },
]

export const recentActivity: ActivityItem[] = [
  { text: "Bella's Bistro LLC application approved — Risk Score 72, Auto-approved", time: '2h ago' },
  { text: "Zenith Payments: 3 merchants flagged for PCI non-compliance", time: '5h ago' },
  { text: "Voice Agent: 847 calls completed today, 127 transfers, 15.1% transfer rate", time: 'Today' },
  { text: "Liberty Processing: merchant migration 92% complete (683/741)", time: 'Yesterday' },
  { text: "February residuals posted: $3.21M across 3 ISOs", time: 'Mar 5' },
]

export const leadPipeline: Record<string, Lead[]> = {
  'New': [
    { name: 'Queens Auto Repair', location: 'Jamaica, NY', mcc: '7538', estVolume: '$15K/mo', aiScore: 78 },
    { name: 'Fresh Bake Cafe', location: 'Astoria, NY', mcc: '5462', estVolume: '$8K/mo', aiScore: 65 },
    { name: 'Downtown Barber', location: 'Manhattan, NY', mcc: '7241', estVolume: '$5K/mo', aiScore: 52 },
  ],
  'Contacted': [
    { name: 'Park Slope Yoga', location: 'Brooklyn, NY', mcc: '7941', estVolume: '$12K/mo', aiScore: 71, detail: 'Follow up Wed' },
    { name: 'Liberty Tax', location: 'Staten Island, NY', mcc: '7216', estVolume: '$9K/mo', aiScore: 68, detail: 'Proposal sent Mar 10' },
    { name: 'Prestige Auto Wash', location: 'Bronx, NY', mcc: '7542', estVolume: '$18K/mo', aiScore: 74, detail: 'Meeting Mar 18' },
  ],
  'Proposal': [
    { name: 'Chez Antoine', location: 'Manhattan, NY', mcc: '5812', estVolume: '$22K/mo', aiScore: 82, detail: 'Savings: $340/mo' },
    { name: 'GreenLeaf Market', location: 'Williamsburg, NY', mcc: '5411', estVolume: '$35K/mo', aiScore: 88, detail: 'Savings: $520/mo' },
  ],
  'E-Sign Sent': [
    { name: 'Brooklyn Dry Cleaners #2', location: 'Bay Ridge, NY', mcc: '7216', estVolume: '$11K/mo', aiScore: 76, detail: 'Opened, not signed' },
    { name: 'Sunrise Pharmacy', location: 'Jackson Heights, NY', mcc: '5912', estVolume: '$28K/mo', aiScore: 81, detail: 'Sent Mar 14' },
  ],
  'Underwriting': [
    { name: 'Harlem Grocery #2', location: 'Harlem, NY', mcc: '5411', estVolume: '$19K/mo', aiScore: 70, detail: 'Risk Score: Pending' },
    { name: "King's Crown Jewelry", location: 'Manhattan, NY', mcc: '5944', estVolume: '$45K/mo', aiScore: 67, detail: 'High risk review' },
  ],
}

export const merchants: Merchant[] = [
  { name: "Mario's Pizzeria", mid: '5489 7821 0034', processor: 'Harlow Payments', equipment: 'PAX A920', monthlyVol: '$47,230', pciStatus: 'Compliant', status: 'Active' },
  { name: 'Harlem Grocery', mid: '5489 3310 0087', processor: 'Repay TSYS FEO', equipment: 'Clover Flex', monthlyVol: '$38,410', pciStatus: 'Compliant', status: 'Active' },
  { name: 'Brooklyn Dry Cleaners', mid: '5489 6647 0122', processor: 'EPSG', equipment: 'Dejavoo Z11', monthlyVol: '$22,890', pciStatus: 'Compliant', status: 'Active' },
  { name: 'Sunrise Deli', mid: '5489 4455 0091', processor: 'Harlow Payments', equipment: 'PAX A920', monthlyVol: '$18,770', pciStatus: 'Non-Compliant', status: 'Active' },
  { name: 'Lucky Nail Salon', mid: '5489 9901 0156', processor: 'EPSG Wells Fargo', equipment: 'Clover Flex', monthlyVol: '$12,440', pciStatus: 'Non-Compliant', status: 'Active' },
  { name: 'Metro Tobacco', mid: '5489 2277 0201', processor: 'Card Point/First Data', equipment: 'Virtual Terminal', monthlyVol: '$8,920', pciStatus: 'Non-Compliant', status: 'Active' },
  { name: 'Jade Garden', mid: '5489 8834 0178', processor: 'Harlow Payments', equipment: 'PAX A920', monthlyVol: '$31,560', pciStatus: 'Compliant', status: 'Active' },
  { name: 'Queens Auto Repair', mid: '—', processor: '—', equipment: 'Pending: Clover Flex', monthlyVol: '—', pciStatus: 'N/A', status: 'Boarding' },
  { name: 'Empire State Florist', mid: '5489 1102 0066', processor: 'Repay TSYS FEO', equipment: 'Dejavoo Z11', monthlyVol: '$0', pciStatus: 'N/A', status: 'Inactive' },
]

export const onboardingApps: OnboardingApp[] = [
  { merchant: "Bella's Bistro LLC", bank: 'Esquire Bank', submitted: 'Mar 28', stage: 'KYB/KYC Verification', riskScore: 72, riskLabel: 'Low Risk', status: 'In Progress', assigned: 'Sarah Chen' },
  { merchant: 'Queens Auto Repair', bank: 'Esquire Bank', submitted: 'Mar 14', stage: 'E-Sign', riskScore: null, riskLabel: 'Pending', status: 'Awaiting Signature', assigned: 'Mike Rodriguez' },
  { merchant: 'Harlem Grocery #2', bank: 'Esquire Bank', submitted: 'Mar 11', stage: 'Underwriting Review', riskScore: 58, riskLabel: 'Medium', status: 'In Review', assigned: 'Sarah Chen' },
  { merchant: "King's Crown Jewelry", bank: 'Esquire Bank', submitted: 'Mar 13', stage: 'High Risk Review', riskScore: 34, riskLabel: 'High Risk', status: 'Needs Docs', assigned: 'Sarah Chen' },
]

export const voiceCalls: VoiceCall[] = [
  { phone: '***-***-4821', merchant: 'Bella Vista Cafe', status: 'In Progress', duration: '1:42', stage: 'Qualifying', sentiment: 'Positive' },
  { phone: '***-***-3356', merchant: 'Unknown Business', status: 'Ringing', duration: '0:08', stage: 'Gatekeeper', sentiment: 'Neutral' },
  { phone: '***-***-7190', merchant: 'Park Auto Body', status: 'Transferred', duration: '3:21', stage: 'Owner Connected', sentiment: 'Positive' },
  { phone: '***-***-5544', merchant: 'Happy Nails', status: 'Completed', duration: '2:15', stage: 'Completed', sentiment: 'Neutral' },
  { phone: '***-***-8872', merchant: 'Golden Dragon', status: 'In Progress', duration: '0:55', stage: 'Gatekeeper', sentiment: 'Skeptical' },
  { phone: '***-***-1293', merchant: 'Joe\'s Diner', status: 'No Answer', duration: '0:32', stage: '—', sentiment: 'Neutral' },
  { phone: '***-***-6641', merchant: 'Metro Cleaners', status: 'Completed', duration: '4:08', stage: 'Completed', sentiment: 'Positive' },
  { phone: '***-***-9905', merchant: 'Brooklyn Florist', status: 'In Progress', duration: '2:01', stage: 'Owner Connected', sentiment: 'Positive' },
]

export const voiceHourlyData = [
  { hour: '8am', calls: 45, transferRate: 12 },
  { hour: '9am', calls: 78, transferRate: 14 },
  { hour: '10am', calls: 112, transferRate: 23.4 },
  { hour: '11am', calls: 98, transferRate: 16 },
  { hour: '12pm', calls: 62, transferRate: 11 },
  { hour: '1pm', calls: 89, transferRate: 15 },
  { hour: '2pm', calls: 105, transferRate: 18 },
  { hour: '3pm', calls: 95, transferRate: 17 },
  { hour: '4pm', calls: 87, transferRate: 14 },
  { hour: '5pm', calls: 56, transferRate: 10 },
  { hour: '6pm', calls: 20, transferRate: 8 },
]

export const callOutcomeData = [
  { name: 'Transfer Success', value: 15.1, color: '#10B981' },
  { name: 'Callback Scheduled', value: 8.3, color: '#0891B2' },
  { name: 'Not Interested', value: 31.2, color: '#F43F5E' },
  { name: 'Gatekeeper Block', value: 22.4, color: '#F59E0B' },
  { name: 'No Answer', value: 18.7, color: '#94A3B8' },
  { name: 'Voicemail', value: 4.3, color: '#8B5CF6' },
]

export const riskDistribution = [
  { range: '0-30', label: 'High Risk', pct: 4.2, color: '#F43F5E' },
  { range: '31-50', label: 'Medium-High', pct: 8.1, color: '#F59E0B' },
  { range: '51-70', label: 'Medium', pct: 22.4, color: '#EAB308' },
  { range: '71-85', label: 'Low', pct: 41.3, color: '#86EFAC' },
  { range: '86-100', label: 'Very Low', pct: 24.0, color: '#10B981' },
]

export const riskByMCC = [
  { mcc: '5944', label: 'Jewelry', avgScore: 42, color: '#F43F5E' },
  { mcc: '7542', label: 'Car Wash', avgScore: 51, color: '#F59E0B' },
  { mcc: '7941', label: 'Recreation', avgScore: 58, color: '#EAB308' },
  { mcc: '5812', label: 'Restaurants', avgScore: 71, color: '#86EFAC' },
  { mcc: '5411', label: 'Grocery', avgScore: 78, color: '#10B981' },
]

export const processorDistribution = [
  { name: 'Harlow Payments', volume: 14.2, pct: 44 },
  { name: 'Repay TSYS FEO', volume: 7.8, pct: 24 },
  { name: 'EPSG', volume: 5.1, pct: 16 },
  { name: 'EPSG Wells Fargo', volume: 3.2, pct: 10 },
  { name: 'Card Point/First Data', volume: 1.8, pct: 6 },
]

export const productPenetration = [
  { product: 'Embedded Financing', enrolled: 312, eligible: 4612, rate: '6.8%', revenue: '$468K' },
  { product: 'Banking (BaaS)', enrolled: 189, eligible: 4612, rate: '4.1%', revenue: '$113K' },
  { product: 'Payroll', enrolled: 156, eligible: 4612, rate: '3.4%', revenue: '$149K' },
  { product: 'Insurance', enrolled: 98, eligible: 4612, rate: '2.1%', revenue: '$78K' },
  { product: 'POS Upgrade', enrolled: 423, eligible: 4612, rate: '9.2%', revenue: '$211K' },
  { product: 'Loyalty Program', enrolled: 67, eligible: 4612, rate: '1.5%', revenue: '$34K' },
  { product: 'Gift Cards', enrolled: 234, eligible: 4612, rate: '5.1%', revenue: '$92K' },
  { product: 'Cash Advance', enrolled: 145, eligible: 4612, rate: '3.1%', revenue: '$187K' },
]

export const chargebackTrendData = [
  { month: "Apr '25", portfolio: 0.42, visa: 1.0, mc: 1.5 },
  { month: "Jun '25", portfolio: 0.40, visa: 1.0, mc: 1.5 },
  { month: "Aug '25", portfolio: 0.38, visa: 1.0, mc: 1.5 },
  { month: "Oct '25", portfolio: 0.37, visa: 1.0, mc: 1.5 },
  { month: "Dec '25", portfolio: 0.36, visa: 1.0, mc: 1.5 },
  { month: "Feb '26", portfolio: 0.35, visa: 1.0, mc: 1.5 },
]

export const merchantDeposits = [
  { date: 'Mar 14', amount: '$2,013.90', status: 'Deposited' },
  { date: 'Mar 13', amount: '$1,795.50', status: 'Deposited' },
  { date: 'Mar 12', amount: '$1,496.80', status: 'Deposited' },
  { date: 'Mar 11', amount: '$2,155.80', status: 'Deposited' },
]

export const luminaChatMessages = [
  { role: 'ai' as const, text: "Good morning, Sarah. I've completed my overnight analysis across all 3 ISOs. Key highlights:" },
  { role: 'ai' as const, text: "Portfolio volume is up 8.4% month-over-month to $32.1M. Zenith integration is tracking ahead of schedule — 96% of merchants migrated." },
  { role: 'ai' as const, text: "I've flagged 5 merchants for attrition risk. Sunrise Deli is the most urgent — volume dropped 42% and they haven't processed in 3 days. Recommend immediate outreach." },
  { role: 'user' as const, text: "What's driving the Sunrise Deli decline?" },
  { role: 'ai' as const, text: "Three factors: (1) PCI non-compliant for 94 days — they may be shopping processors, (2) a new competing deli opened 2 blocks away in January, (3) their average ticket dropped from $18 to $11 suggesting menu changes. I'd recommend calling with a retention offer — perhaps waive the PCI fee and offer a rate review." },
]

export const luminaInsights = [
  { title: 'Attrition Alert', text: '5 merchants flagged — $48K monthly volume at risk', severity: 'high' as const, time: '2h ago' },
  { title: 'Volume Milestone', text: 'Portfolio crossed $32M monthly volume for the first time', severity: 'positive' as const, time: '4h ago' },
  { title: 'Compliance Gap', text: '187 merchants PCI non-compliant — 142 auto-reminders sent', severity: 'medium' as const, time: 'Today' },
  { title: 'Migration Update', text: 'Liberty Processing integration at 92% — on track for Apr 15 completion', severity: 'info' as const, time: 'Yesterday' },
  { title: 'Cost Saving', text: 'Voice Agent saved $498K vs human openers this month', severity: 'positive' as const, time: 'Yesterday' },
]
