export interface KPI {
  label: string
  value: string
  trend: string
  trendDirection: 'up' | 'down'
  trendPositive: boolean
  icon: string
  color: string
}

export interface Merchant {
  name: string
  mid: string
  processor: string
  equipment: string
  monthlyVol: string
  pciStatus: 'Compliant' | 'Non-Compliant' | 'N/A'
  status: 'Active' | 'Boarding' | 'Inactive'
}

export interface Lead {
  name: string
  location: string
  mcc: string
  estVolume: string
  aiScore: number
  detail?: string
}

export interface AtRiskMerchant {
  name: string
  riskScore: number
  volume: string
  trend: string
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'INACTIVE'
}

export interface ActivityItem {
  text: string
  time: string
}

export interface ChatMessage {
  role: 'ai' | 'user'
  text: string
}

export interface OnboardingApp {
  merchant: string
  bank: string
  submitted: string
  stage: string
  riskScore: number | null
  riskLabel: string
  status: string
  assigned: string
}

export interface VoiceCall {
  phone: string
  merchant: string
  status: string
  duration: string
  stage: string
  sentiment: string
}
