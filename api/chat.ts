import Anthropic from '@anthropic-ai/sdk'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// Context data per page — summarized from DuckDB exports
const pageContext: Record<string, string> = {
  '/dashboard': `You are on the Portfolio Command Center dashboard.
Key metrics: 4,612 merchants across 3 ISOs (Harlow Direct 2,847, Zenith 1,024, Liberty 741).
Monthly volume: $31.1M (Mar 2026), up 3.5% MoM. Monthly residuals: $3.21M.
Portfolio churn: 3.3%. Chargeback rate: 0.31%.
ISOs: Harlow Direct (Primary, 100% split, $18.4M vol), Zenith (Acquired Q4 2025, 70% split, $8.9M), Liberty (Acquired Q1 2026, 60% split, $4.8M).
At-risk merchants flagged for attrition. Health matrix shows Liberty has "Watch" on churn.
Waterfall bridge: Starting $28.5M → +$1.8M Organic → +$1.2M Zenith → +$0.8M Products → -$0.2M Churn → $32.1M Current.`,

  '/crm': `You are on the Agentic CRM page.
Pipeline: 200 leads across 8 stages (Lead→Proposal→Application→Underwriting→Approval→Boarding→Equipment→Go-Live).
Win rate: 67%. Avg deal velocity: 18 days. Pipeline value: ~$209K/mo estimated.
Lead sources: Voice Agent 40%, Referral 25%, Website 15%, Walk-in 10%, Cold Call 10%.
Agent leaderboard: David Goldfarb (34 deals, 68%), Sarah Chen (28, 72%), Mike Rodriguez (21, 61%), Kate Palmarini (18, 65%).
Onboarding: 4 active applications. Auto-approve rate: 42%. Avg processing time: 3.2h.
My Merchants: 4,612 total, 95% Active, 2% Boarding, 3% Inactive.
Residuals: March projected $3,847, Feb paid $3,635, 12-month total $41,218.
Support: 6 open tickets, avg resolution 4.2h, 38% AI auto-resolved.`,

  '/voice': `You are on the Voice Agent Command Center.
Today: 847 calls, 47 active, 15.1% transfer rate, avg duration 2m34s, cost $42.35.
Monthly: 24,812 calls, $498K savings vs human team ($500K/mo vs $1,270/mo AI).
Best hour: 2-3 PM. Cost per transfer: $0.33 (vs $16.67 human).
Top scripts: Restaurant Savings Hook (41.2% win), Rate Comparison Direct (38.7%), PCI Compliance Angle (35.4%).
Outcomes: Not Interested 30.7%, Gatekeeper 22.4%, No Answer 18.7%, Transfer 14.8%, Callback 8.6%, Voicemail 4.8%.
AI self-improving: latest optimizer deployed v12 opener with empathy phrase (+3.2% transfer rate).
Settings: ElevenLabs Turbo v2.5, Sarah voice, 9am-6pm ET weekdays, max 50 concurrent, TCPA compliant.`,

  '/iso': `You are on the ISO Portfolio Management page.
3 ISOs total. Combined volume: $32.1M/month, 4,612 merchants.
Harlow Direct: Primary ISO, 2,847 merchants, $18.4M volume, 1.2% churn, 100% split, buy rate 1.95%.
Zenith Payments: Acquired Q4 2025 for $12.5M (4.2x multiple), 1,024 merchants, $8.9M vol, 2.1% churn, 70% split, integration 96%.
Liberty Processing: Acquired Q1 2026 for $4.8M (3.1x multiple), 741 merchants, $4.8M vol, 3.4% churn, 60% split, integration 92%.
Bank partner: Esquire Bank. BIN sponsors vary by ISO.
Top categories: Restaurants 34%, Retail 21%, Services 18%, Auto 12%, Health 8%, Other 6%.`,

  '/analytics': `You are on Agentic Portfolio Intelligence.
Portfolio health score: 87/100. Dimensions: Revenue Growth 92, Margin 88, Churn 78, Volume Stability 90, Compliance 87.
Volume trend: $18.0M (Apr'25) → $31.1M (Mar'26), 72% YoY growth.
Processor distribution: Harlow Payments 44%, Repay TSYS FEO 24%, EPSG 16%, EPSG Wells Fargo 10%, Card Point 6%.
Product penetration avg 4.7%. Top: POS Upgrade 9.2%, Embedded Financing 6.8%, Gift Cards 5.1%.
Chargeback rate trending down: 0.42% (Apr'25) → 0.31% (Mar'26). Well below Visa 1.0% threshold.
Risk: 65% of merchants score 71-100 (Low/Very Low risk). 4.2% are High Risk (0-30).`,

  '/risk': `You are on Agentic Risk Intelligence.
Portfolio risk score: 72/100, up 3 pts from last month.
Chargeback rate: 0.82% portfolio average. Well below Visa 1.0% and MC 1.5% thresholds.
PCI compliance: 87% compliant, 47 non-compliant, 68 pending, 41 expired.
High risk merchants: 7 flagged. Auto-resolved: 88.1% of alerts. Avg response time: 14 min.
Risk distribution: Very Low (86-100) 24%, Low (71-85) 41.3%, Medium (51-70) 22.4%, Medium-High (31-50) 8.1%, High (0-30) 4.2%.
Risk by MCC: Jewelry avg 42, Car Wash 51, Recreation 58, Restaurants 71, Grocery 78.
OFAC screening: 4,612 scanned monthly, 3 matches found, 2 auto-cleared, 1 pending.
Underwriting queue: 5 pending applications.`,

  '/compliance': `You are on Compliance Intelligence.
PCI DSS: SAQ-A annual renewal, quarterly ASV scans, P2PE validation, employee training.
TCPA: DNC list synced every 6 hours, two-party consent enforced, time-of-day restrictions.
KYB/KYC: Annual business verification, beneficial ownership updates, monthly OFAC screening, quarterly SAR review.
All systems currently compliant. Employee security training due May 1, 2026.`,

  '/portal/sales': `You are on the POS Sales Analytics page for Mario's Italian Kitchen (pizzeria).
POS app installed on PAX A920. 25 menu items across 9 categories.
Last 30 days: 4,364 items sold, $51K+ revenue, 56% from Pizza category.
Top seller: Pepperoni Pizza (568 sold, $9,650). Avg basket: $11.68.
Peak hours: 7-8pm. Busiest days: Friday & Saturday (+40% vs weekday).
Profit margin: 56%. Card vs cash: 80/20%.
Beverage attach rate: only 15% of orders. Cross-sell opportunity: +$3,500/mo.
Categories: Pizza $30K, Pasta $4.5K, Entree $4.2K, Calzone $3K, Appetizer $2.9K, Beverages $2.6K.
Highest margin items: Garlic Knots (83%), Soda Can (82%), Pizza Slice Cheese (77%).`,

  '/portal': `You are on the Merchant Portal (Mario's Italian Kitchen).
MID: 4400-1892-7731. Status: Active. Processor: Harlow Payments. Equipment: PAX A920.
This month volume: $47,230 (+8.2% vs Feb). Last deposit: $2,013.90 today.
1,342 transactions this month. Avg ticket: $35.19. Approval rate: 98.7%.
Open chargebacks: 1 ($487.50 due Mar 26). Effective rate: 2.69%.
Pre-approved for $25,000 business funding (1.15 factor rate).
Active products: Business Checking (1.5% APY), Gift Cards, Payroll (3 employees).
PCI compliant through Dec 2026.`,

  '/partner': `You are on the Partner Portal for Jake Wilson of Acme Financial Partners.
Partner since October 2024. 34 active merchants. Monthly residuals: $4,218. YTD earnings: $38,420.
Pipeline: 15 active leads — 4 Lead, 4 Proposal, 3 Application, 1 Boarding, 3 Live.
Conversion rate: 28% (above network avg 22%). Pipeline value: $285K/mo estimated.
Top merchants: Harbor Seafood ($32K/mo), Nob Hill Bistro ($28K/mo), Coastal Cafe ($28.4K/mo).
Residual split: 60/40 (standard). Next payout: Apr 15, est. $4,218.
Completed 2/5 training courses. Not yet certified (need 3 more courses for 70% split upgrade).
Strongest vertical: Restaurants (35% conversion). Marketing link: 142 clicks, 18 form completions this month.`,
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    return res.status(200).end()
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { messages, currentPage } = req.body as {
    messages: { role: 'user' | 'assistant'; content: string }[]
    currentPage: string
  }

  if (!messages?.length) return res.status(400).json({ error: 'No messages provided' })

  // Build context from current page
  const ctx = pageContext[currentPage] || pageContext['/dashboard'] || ''

  const systemPrompt = `You are Lumina, the AI superagent for Harlow Payments — a PE-backed payment processing platform managing 3 ISOs and 4,612 merchants.

You have access to the following real-time data context based on the user's current view:

${ctx}

Guidelines:
- Be concise and data-driven. Lead with numbers and insights.
- Reference specific merchants, ISOs, and metrics from the context.
- Suggest actionable next steps when appropriate.
- Use dollar amounts, percentages, and trends from the data.
- If asked about something outside your context, say you'd need to check that data.
- Format important numbers in bold when relevant.
- Keep responses under 150 words unless the user asks for detail.
- You speak in a professional but friendly tone, like a senior analyst briefing an executive.`

  try {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.setHeader('Transfer-Encoding', 'chunked')
    res.setHeader('Access-Control-Allow-Origin', '*')

    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    })

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        res.write(event.delta.text)
      }
    }

    res.end()
  } catch (error: any) {
    console.error('Claude API error:', error)
    res.status(500).json({ error: error.message || 'API error' })
  }
}
