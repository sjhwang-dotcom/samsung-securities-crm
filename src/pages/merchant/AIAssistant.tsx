import { useState, useRef, useEffect } from 'react'
import {
  Bot, Send, Sparkles, TrendingUp, DollarSign, AlertTriangle,
  Gift, Users, Percent, CreditCard, Landmark, Shield,
  ChevronRight, ArrowUpRight, Clock, Zap, CheckCircle,
} from 'lucide-react'
import {} from '../../components/ui'
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

/* ── Merchant context data ── */
const merchantCtx = {
  name: "Mario's Pizzeria",
  mid: '4400-1892-7731',
  owner: 'Mario Rossi',
  monthVolume: '$47,230',
  monthTxns: '1,342',
  avgTicket: '$35.19',
  effectiveRate: '2.69%',
  approvalRate: '98.7%',
  lastDeposit: '$2,013.90',
  chargebacks: 1,
  cbAmount: '$487.50',
  cbDue: 'Mar 26',
  rewardsPts: '12,450',
  payrollNext: 'Mar 28',
  payrollEmployees: 4,
  fundingBalance: '$3,167.40',
  fundingDaily: '$95.83',
  pciStatus: 'Compliant',
  equipment: 'PAX A920',
}

const salesTrendData = [
  { month: 'Oct', volume: 38200 }, { month: 'Nov', volume: 41100 }, { month: 'Dec', volume: 44800 },
  { month: 'Jan', volume: 43500 }, { month: 'Feb', volume: 45100 }, { month: 'Mar', volume: 47230 },
]

/* ── Mock AI responses keyed by prompt text ── */
const mockResponses: Record<string, { text: string; card?: 'sales' | 'chargeback' | 'payroll' | 'rate' | 'funding' | 'rewards' }> = {
  'How are my sales trending?': {
    text: `Great news, Mario! Your March volume is at ${merchantCtx.monthVolume} -- that's up 8.2% versus February and your strongest month in the last 6. You've processed ${merchantCtx.monthTxns} transactions with an average ticket of ${merchantCtx.avgTicket}.\n\nSaturday continues to be your best day, and I'm seeing your dinner rush start about 30 minutes earlier this month. Your weekend specials campaign appears to be driving solid growth.`,
    card: 'sales',
  },
  'Explain my chargeback': {
    text: `You have ${merchantCtx.chargebacks} open chargeback for ${merchantCtx.cbAmount} filed on a Visa card ending in 4821. The reason code is "Merchandise Not Received."\n\nThe response deadline is ${merchantCtx.cbDue} -- that's 12 days away. I'd recommend uploading delivery confirmation or a signed receipt as evidence. If you don't respond, the amount will be auto-debited from your next deposit.\n\nWould you like me to walk you through the evidence upload process?`,
    card: 'chargeback',
  },
  'When is my next payroll?': {
    text: `Your next automated payroll run is scheduled for ${merchantCtx.payrollNext}. It will cover ${merchantCtx.payrollEmployees} employees.\n\nYour last payroll on March 13 was $5,307.06 total and processed without any issues. All direct deposits cleared within 24 hours. You also earned 200 bonus reward points for that payroll run.\n\nWant me to show a breakdown of your employee allocations?`,
    card: 'payroll',
  },
  'How can I reduce my effective rate?': {
    text: `Your current effective rate is ${merchantCtx.effectiveRate} on Interchange Plus pricing. Here are a few ways to bring it down:\n\n1. **Chip & PIN over swipe** -- You're seeing some keyed-in transactions that carry higher interchange. Encouraging dip/tap can save ~0.15%.\n2. **Batch earlier** -- Settling before 10 PM ensures you capture the best rate tiers.\n3. **Monitor downgrades** -- I found 3 transactions last month that downgraded to EIRF. Sending Level II data (tax amount + PO) would prevent this.\n\nImplementing all three could lower your effective rate to approximately 2.48%.`,
    card: 'rate',
  },
  'Show my funding status': {
    text: `You were pre-approved for up to $25,000 in business funding. Here's your current status:\n\n- **Outstanding balance:** ${merchantCtx.fundingBalance}\n- **Daily repayment:** ${merchantCtx.fundingDaily}/day\n- **Factor rate:** 1.15\n- **Estimated payoff:** April 23, 2026\n\nYour daily repayments are being deducted automatically from your deposits. You're on track and in good standing. Once paid off, you'll be eligible for a renewal up to $35,000 based on your volume growth.`,
    card: 'funding',
  },
  'What rewards can I redeem?': {
    text: `You have **${merchantCtx.rewardsPts} points** available in your Harlow Rewards account. Here's what you can redeem:\n\n- **Statement credit:** 10,000 pts = $100 off processing fees\n- **Equipment upgrade:** 15,000 pts = free terminal accessory\n- **Gift cards:** Starting at 5,000 pts ($50 value)\n- **Charitable donation:** Any amount to partner nonprofits\n\nYou earned 2,847 points this month from processing volume and a payroll bonus. At your current pace, you'll hit 15,000 points by mid-April.`,
    card: 'rewards',
  },
}

const defaultResponse = {
  text: `I looked into that for you, Mario. Based on your current account data, everything looks healthy. Your processing volume is trending up, deposits are settling same-day, and your PCI compliance is current.\n\nIs there something specific I can dig into? I can pull up details on your transactions, deposits, chargebacks, funding, payroll, or rewards.`,
}

const suggestedPrompts = [
  { label: 'How are my sales trending?', icon: TrendingUp, color: '#1578F7' },
  { label: 'Explain my chargeback', icon: AlertTriangle, color: '#EF4444' },
  { label: 'When is my next payroll?', icon: Users, color: '#0891B2' },
  { label: 'How can I reduce my effective rate?', icon: Percent, color: '#10B981' },
  { label: 'Show my funding status', icon: DollarSign, color: '#F59E0B' },
  { label: 'What rewards can I redeem?', icon: Gift, color: '#8B5CF6' },
]

interface Message {
  id: number
  role: 'user' | 'assistant'
  text: string
  card?: 'sales' | 'chargeback' | 'payroll' | 'rate' | 'funding' | 'rewards'
  typing?: boolean
}

const tooltipStyle = { borderRadius: 10, fontSize: 11, border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }

/* ═══════════════════════════════════════════════════════════════
   Inline Data Cards rendered inside chat bubbles
   ═══════════════════════════════════════════════════════════════ */

function SalesTrendCard() {
  return (
    <div style={{ marginTop: 12, background: '#F8FAFC', borderRadius: 10, padding: 14, border: '1px solid #E2E8F0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        <TrendingUp size={13} color="#1578F7" />
        <span style={{ fontSize: 11, fontWeight: 700, color: '#0F172A' }}>6-Month Volume Trend</span>
      </div>
      <div style={{ height: 110 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={salesTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={(v: any) => `$${(v / 1000).toFixed(0)}K`} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`$${v.toLocaleString()}`, 'Volume']} />
            <defs>
              <linearGradient id="aiVolGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1578F7" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#1578F7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="volume" stroke="#1578F7" fill="url(#aiVolGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        <span style={{ fontSize: 10, color: '#64748B', fontWeight: 500 }}>Oct 2025 - Mar 2026</span>
        <span style={{ fontSize: 10, color: '#059669', fontWeight: 700 }}>+23.6% overall</span>
      </div>
    </div>
  )
}

function ChargebackCard() {
  return (
    <div style={{ marginTop: 12, background: '#FEF2F2', borderRadius: 10, padding: 14, border: '1px solid #FECACA' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <AlertTriangle size={13} color="#EF4444" />
        <span style={{ fontSize: 11, fontWeight: 700, color: '#0F172A' }}>Open Chargeback</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 11 }}>
        <div><span style={{ color: '#94A3B8', fontWeight: 500 }}>Amount</span><br /><span style={{ fontWeight: 700, color: '#EF4444' }}>$487.50</span></div>
        <div><span style={{ color: '#94A3B8', fontWeight: 500 }}>Card</span><br /><span style={{ fontWeight: 600, color: '#0F172A' }}>Visa ****4821</span></div>
        <div><span style={{ color: '#94A3B8', fontWeight: 500 }}>Reason</span><br /><span style={{ fontWeight: 600, color: '#0F172A' }}>Merch. Not Received</span></div>
        <div><span style={{ color: '#94A3B8', fontWeight: 500 }}>Due Date</span><br /><span style={{ fontWeight: 700, color: '#EF4444' }}>Mar 26, 2026</span></div>
      </div>
      <button style={{
        marginTop: 10, width: '100%', padding: '8px 0', borderRadius: 7, border: 'none',
        background: '#EF4444', color: 'white', fontWeight: 700, fontSize: 11, cursor: 'pointer',
      }}>
        Upload Evidence Now
      </button>
    </div>
  )
}

function PayrollCard() {
  return (
    <div style={{ marginTop: 12, background: '#F0FDFA', borderRadius: 10, padding: 14, border: '1px solid #CCFBF1' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <Users size={13} color="#0891B2" />
        <span style={{ fontSize: 11, fontWeight: 700, color: '#0F172A' }}>Next Payroll Run</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#0F172A' }}>Mar 28</div>
          <div style={{ fontSize: 10, color: '#64748B', fontWeight: 500 }}>4 employees -- Auto-run</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0891B2' }}>~$5,307</div>
          <div style={{ fontSize: 10, color: '#64748B', fontWeight: 500 }}>Estimated total</div>
        </div>
      </div>
    </div>
  )
}

function RateCard() {
  return (
    <div style={{ marginTop: 12, background: '#F0FDF4', borderRadius: 10, padding: 14, border: '1px solid #BBF7D0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <Percent size={13} color="#10B981" />
        <span style={{ fontSize: 11, fontWeight: 700, color: '#0F172A' }}>Rate Optimization</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 500 }}>Current</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#0F172A' }}>2.69%</div>
        </div>
        <ChevronRight size={16} color="#94A3B8" />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 500 }}>Potential</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#10B981' }}>2.48%</div>
        </div>
        <div style={{ flex: 1, textAlign: 'right' }}>
          <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 500 }}>Monthly Savings</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#10B981' }}>~$99</div>
        </div>
      </div>
    </div>
  )
}

function FundingCard() {
  return (
    <div style={{ marginTop: 12, background: '#FFFBEB', borderRadius: 10, padding: 14, border: '1px solid #FDE68A' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <DollarSign size={13} color="#F59E0B" />
        <span style={{ fontSize: 11, fontWeight: 700, color: '#0F172A' }}>Funding Status</span>
      </div>
      <div style={{ marginBottom: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#64748B', fontWeight: 500, marginBottom: 4 }}>
          <span>Remaining Balance</span>
          <span>$3,167 of $25,000</span>
        </div>
        <div style={{ height: 6, background: '#FDE68A', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ width: '87.3%', height: '100%', background: '#F59E0B', borderRadius: 3 }} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: 10 }}>
        <div><span style={{ color: '#94A3B8' }}>Daily repayment</span><br /><span style={{ fontWeight: 700, color: '#0F172A' }}>$95.83</span></div>
        <div><span style={{ color: '#94A3B8' }}>Est. payoff</span><br /><span style={{ fontWeight: 700, color: '#0F172A' }}>Apr 23, 2026</span></div>
      </div>
    </div>
  )
}

function RewardsCard() {
  return (
    <div style={{ marginTop: 12, background: '#F5F3FF', borderRadius: 10, padding: 14, border: '1px solid #DDD6FE' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <Gift size={13} color="#8B5CF6" />
        <span style={{ fontSize: 11, fontWeight: 700, color: '#0F172A' }}>Rewards Balance</span>
      </div>
      <div style={{ textAlign: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: '#8B5CF6' }}>12,450</div>
        <div style={{ fontSize: 10, color: '#64748B', fontWeight: 500 }}>points available</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        {[
          { label: '$100 Statement Credit', pts: '10,000 pts', ready: true },
          { label: 'Terminal Accessory', pts: '15,000 pts', ready: false },
          { label: '$50 Gift Card', pts: '5,000 pts', ready: true },
          { label: 'Charity Donation', pts: 'Any amount', ready: true },
        ].map(r => (
          <div key={r.label} style={{
            padding: '6px 8px', borderRadius: 6,
            background: r.ready ? 'white' : '#F8FAFC',
            border: `1px solid ${r.ready ? '#DDD6FE' : '#E2E8F0'}`,
            opacity: r.ready ? 1 : 0.6,
          }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: '#0F172A' }}>{r.label}</div>
            <div style={{ fontSize: 9, color: '#94A3B8', fontWeight: 500 }}>{r.pts}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

const cardComponents: Record<string, () => React.ReactElement> = {
  sales: SalesTrendCard,
  chargeback: ChargebackCard,
  payroll: PayrollCard,
  rate: RateCard,
  funding: FundingCard,
  rewards: RewardsCard,
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: 'assistant',
      text: `Good afternoon, Mario! I'm Lumina, your AI business assistant. I have full context on ${merchantCtx.name} -- your processing data, deposits, chargebacks, funding, payroll, rewards, and more.\n\nHow can I help you today?`,
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const nextId = useRef(1)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const sendMessage = (text: string) => {
    if (!text.trim() || isTyping) return
    const userMsg: Message = { id: nextId.current++, role: 'user', text: text.trim() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    // Simulate AI response delay
    const matched = mockResponses[text.trim()]
    setTimeout(() => {
      const aiMsg: Message = {
        id: nextId.current++,
        role: 'assistant',
        text: matched?.text || defaultResponse.text,
        card: matched?.card,
      }
      setMessages(prev => [...prev, aiMsg])
      setIsTyping(false)
    }, 800 + Math.random() * 600)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const healthScore = 92

  return (
    <div style={{ display: 'flex', gap: 0, height: '100%', overflow: 'hidden' }}>
      {/* ═══ LEFT: Chat Area ═══ */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Chat header */}
        <div style={{
          padding: '16px 24px', borderBottom: '1px solid #E5E7EB', background: 'white',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #1578F7, #6366F1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(21,120,247,0.25)',
          }}>
            <Sparkles size={16} color="white" strokeWidth={2} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
              Lumina AI
            </div>
            <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
              Online -- Context: {merchantCtx.name}
            </div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 6,
              background: '#E8F0FE', color: '#1578F7',
            }}>
              <Zap size={10} style={{ marginRight: 3, verticalAlign: 'middle' }} />
              Full Context
            </span>
          </div>
        </div>

        {/* Chat messages */}
        <div style={{
          flex: 1, overflow: 'auto', padding: '20px 24px',
          background: '#F8FAFC',
          display: 'flex', flexDirection: 'column', gap: 16,
        }}>
          {messages.map(msg => (
            <div key={msg.id} style={{
              display: 'flex', gap: 10,
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}>
              {msg.role === 'assistant' && (
                <div style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  background: 'linear-gradient(135deg, #1578F7, #6366F1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginTop: 2,
                }}>
                  <Bot size={13} color="white" />
                </div>
              )}
              <div>
                <div style={{
                  padding: '12px 16px', borderRadius: 12, fontSize: 13, lineHeight: 1.65,
                  fontWeight: 500, whiteSpace: 'pre-wrap',
                  ...(msg.role === 'user'
                    ? { background: '#0F172A', color: 'white', borderBottomRightRadius: 4 }
                    : { background: 'white', color: '#1E293B', border: '1px solid #E2E8F0', borderBottomLeftRadius: 4, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }
                  ),
                }}>
                  {msg.text.split('**').map((part, i) =>
                    i % 2 === 0 ? part : <strong key={i}>{part}</strong>
                  )}
                </div>
                {/* Inline data card */}
                {msg.card && cardComponents[msg.card] && (() => {
                  const CardComp = cardComponents[msg.card!]
                  return <CardComp />
                })()}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                background: 'linear-gradient(135deg, #1578F7, #6366F1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Bot size={13} color="white" />
              </div>
              <div style={{
                padding: '12px 16px', borderRadius: 12, background: 'white',
                border: '1px solid #E2E8F0', borderBottomLeftRadius: 4,
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                <span className="ai-typing-dot" style={{ animationDelay: '0ms' }} />
                <span className="ai-typing-dot" style={{ animationDelay: '150ms' }} />
                <span className="ai-typing-dot" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          {/* Suggested prompts (only show if 1 message) */}
          {messages.length === 1 && !isTyping && (
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Suggested Questions
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {suggestedPrompts.map(sp => (
                  <button
                    key={sp.label}
                    onClick={() => sendMessage(sp.label)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '12px 14px', borderRadius: 10,
                      background: 'white', border: '1px solid #E2E8F0',
                      cursor: 'pointer', textAlign: 'left',
                      transition: 'all 0.15s ease',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = sp.color;
                      (e.currentTarget as HTMLElement).style.boxShadow = `0 2px 8px ${sp.color}18`
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = '#E2E8F0';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'
                    }}
                  >
                    <div style={{
                      width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                      background: `${sp.color}12`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <sp.icon size={14} color={sp.color} strokeWidth={2} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>{sp.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input area */}
        <div style={{
          padding: '14px 24px', borderTop: '1px solid #E5E7EB', background: 'white',
        }}>
          {/* Quick prompt pills (show after first exchange) */}
          {messages.length > 1 && (
            <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
              {suggestedPrompts
                .filter(sp => !messages.some(m => m.text === sp.label))
                .slice(0, 4)
                .map(sp => (
                  <button
                    key={sp.label}
                    onClick={() => sendMessage(sp.label)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      padding: '5px 12px', borderRadius: 20,
                      background: '#F1F5F9', border: '1px solid #E2E8F0',
                      cursor: 'pointer', fontSize: 11, fontWeight: 600, color: '#475569',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = '#E8F0FE';
                      (e.currentTarget as HTMLElement).style.borderColor = '#1578F7';
                      (e.currentTarget as HTMLElement).style.color = '#1578F7';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = '#F1F5F9';
                      (e.currentTarget as HTMLElement).style.borderColor = '#E2E8F0';
                      (e.currentTarget as HTMLElement).style.color = '#475569';
                    }}
                  >
                    <sp.icon size={11} strokeWidth={2} />
                    {sp.label}
                  </button>
                ))}
            </div>
          )}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: '#F8FAFC', borderRadius: 12, padding: '4px 4px 4px 16px',
            border: '1px solid #E2E8F0',
            transition: 'border-color 0.15s ease',
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Lumina about your business..."
              style={{
                flex: 1, border: 'none', background: 'transparent', outline: 'none',
                fontSize: 13, fontWeight: 500, color: '#0F172A',
                fontFamily: "'Inter', system-ui, sans-serif",
              }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
              style={{
                width: 36, height: 36, borderRadius: 10, border: 'none',
                background: input.trim() && !isTyping
                  ? 'linear-gradient(135deg, #1578F7, #6366F1)'
                  : '#E2E8F0',
                color: input.trim() && !isTyping ? 'white' : '#94A3B8',
                cursor: input.trim() && !isTyping ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
            >
              <Send size={15} strokeWidth={2} />
            </button>
          </div>
          <div style={{ fontSize: 10, color: '#CBD5E1', textAlign: 'center', marginTop: 8, fontWeight: 500 }}>
            Lumina has full context on your merchant account, transactions, and services
          </div>
        </div>
      </div>

      {/* ═══ RIGHT: Context Panel ═══ */}
      <div style={{
        width: 280, minWidth: 280, borderLeft: '1px solid #E5E7EB', background: 'white',
        overflow: 'auto', display: 'flex', flexDirection: 'column',
      }}>
        {/* Health Score */}
        <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid #F1F5F9' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
            Merchant Health
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%', position: 'relative',
              background: `conic-gradient(#10B981 ${healthScore * 3.6}deg, #E2E8F0 0deg)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: '50%', background: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column',
              }}>
                <span style={{ fontSize: 18, fontWeight: 800, color: '#10B981' }}>{healthScore}</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>Excellent</div>
              <div style={{ fontSize: 10, color: '#64748B', fontWeight: 500, lineHeight: 1.5 }}>
                Processing healthy<br />
                PCI compliant<br />
                Deposits on-time
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{ padding: '14px 16px', borderBottom: '1px solid #F1F5F9' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
            Quick Stats
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { icon: TrendingUp, label: 'Monthly Volume', value: merchantCtx.monthVolume, color: '#1578F7', sub: '+8.2%' },
              { icon: CreditCard, label: 'Transactions', value: merchantCtx.monthTxns, color: '#4F46E5', sub: '134 today' },
              { icon: Landmark, label: 'Last Deposit', value: merchantCtx.lastDeposit, color: '#3B82F6', sub: 'Today' },
              { icon: ArrowUpRight, label: 'Avg Ticket', value: merchantCtx.avgTicket, color: '#0891B2', sub: '+$1.20' },
              { icon: Percent, label: 'Effective Rate', value: merchantCtx.effectiveRate, color: '#10B981', sub: 'IC Plus' },
              { icon: CheckCircle, label: 'Approval Rate', value: merchantCtx.approvalRate, color: '#059669', sub: '+0.3%' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: 7, flexShrink: 0,
                  background: `${s.color}12`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <s.icon size={11} color={s.color} strokeWidth={2} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 500 }}>{s.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{s.value}</div>
                </div>
                <span style={{ fontSize: 9, fontWeight: 600, color: '#059669' }}>{s.sub}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div style={{ padding: '14px 16px', borderBottom: '1px solid #F1F5F9' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
            Alerts
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{
              padding: '10px 12px', borderRadius: 8,
              background: '#FEF2F2', border: '1px solid #FECACA',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <AlertTriangle size={11} color="#EF4444" />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#EF4444' }}>Chargeback Due</span>
              </div>
              <div style={{ fontSize: 10, color: '#64748B', fontWeight: 500 }}>
                $487.50 -- Response due {merchantCtx.cbDue}
              </div>
            </div>
            <div style={{
              padding: '10px 12px', borderRadius: 8,
              background: '#FFFBEB', border: '1px solid #FDE68A',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <Clock size={11} color="#F59E0B" />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#92400E' }}>Payroll Upcoming</span>
              </div>
              <div style={{ fontSize: 10, color: '#64748B', fontWeight: 500 }}>
                {merchantCtx.payrollEmployees} employees -- {merchantCtx.payrollNext}
              </div>
            </div>
            <div style={{
              padding: '10px 12px', borderRadius: 8,
              background: '#F0FDF4', border: '1px solid #BBF7D0',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <Shield size={11} color="#10B981" />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#065F46' }}>PCI Compliant</span>
              </div>
              <div style={{ fontSize: 10, color: '#64748B', fontWeight: 500 }}>
                Valid through Dec 2026
              </div>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
            Account
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { label: 'Merchant', value: merchantCtx.name },
              { label: 'MID', value: merchantCtx.mid },
              { label: 'Owner', value: merchantCtx.owner },
              { label: 'Terminal', value: merchantCtx.equipment },
              { label: 'Rewards', value: `${merchantCtx.rewardsPts} pts` },
              { label: 'Funding Bal.', value: merchantCtx.fundingBalance },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                <span style={{ color: '#94A3B8', fontWeight: 500 }}>{item.label}</span>
                <span style={{ fontWeight: 600, color: '#0F172A' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
