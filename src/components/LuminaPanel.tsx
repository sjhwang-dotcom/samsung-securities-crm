import { useState, useEffect, useCallback, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { Send, FileText, MessageSquare, Loader2, Sparkles } from 'lucide-react'
import Markdown from 'react-markdown'

interface LuminaPanelProps {
  onClose?: () => void
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

const API_URL = '/api/chat'

export default function LuminaPanel({ onClose }: LuminaPanelProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'documents' | 'pdf-preview'>('chat')
  const [panelWidth, setPanelWidth] = useState(() => Math.max(Math.round(window.innerWidth * 0.3), 420))
  const [isResizing, setIsResizing] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [pdfTitle, setPdfTitle] = useState('')

  const openPdf = (url: string, title: string) => {
    setPdfUrl(url)
    setPdfTitle(title)
    setActiveTab('pdf-preview')
  }

  const tabs = [
    { id: 'chat' as const, label: '대화', Icon: MessageSquare },
    { id: 'documents' as const, label: '문서', Icon: FileText },
  ]

  const startResizing = useCallback(() => setIsResizing(true), [])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isResizing) return
      const w = window.innerWidth - e.clientX
      if (w >= 380 && w <= window.innerWidth * 0.65) setPanelWidth(w)
    }
    const onUp = () => {
      setIsResizing(false)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
    if (isResizing) {
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
      document.addEventListener('mousemove', onMove)
      document.addEventListener('mouseup', onUp)
    }
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }
  }, [isResizing])

  return (
    <aside className="lumina-panel" style={{ width: panelWidth, minWidth: panelWidth }}>
      {/* Resize handle */}
      <div
        onMouseDown={startResizing}
        style={{
          position: 'absolute', left: -3, top: 0, bottom: 0, width: 6,
          cursor: 'col-resize', zIndex: 10,
          background: isResizing ? 'rgba(3,78,162,0.2)' : 'transparent',
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => { if (!isResizing) (e.target as HTMLElement).style.background = 'rgba(3,78,162,0.12)' }}
        onMouseLeave={e => { if (!isResizing) (e.target as HTMLElement).style.background = 'transparent' }}
      />

      {/* Header */}
      <div className="lumina-header">
        <div className="lumina-title-row">
          <div className="lumina-logo" style={{ background: 'linear-gradient(135deg, #034EA2, #2B7DE9)' }}>
            <Sparkles size={16} color="white" />
          </div>
          <div className="lumina-title-text">
            <span className="lumina-title">루미나</span>
            <span className="lumina-badge">Deep Agent</span>
          </div>
          {onClose && (
            <button onClick={onClose} className="lumina-close-btn" title="닫기">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <div className="lumina-tabs">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`lumina-tab ${activeTab === t.id ? 'active' : ''}`}
            >
              <t.Icon size={13} strokeWidth={2} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'chat' && <ChatTab />}
      {activeTab === 'documents' && <div className="lumina-content"><DocumentsTab onOpenPdf={openPdf} /></div>}
      {activeTab === 'pdf-preview' && pdfUrl && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ padding: '8px 12px', background: '#F8FAFC', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <button onClick={() => setActiveTab('documents')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#034EA2', fontWeight: 600, padding: '2px 6px' }}>← 목록</button>
            <span style={{ fontSize: 11, color: '#475569', fontWeight: 500, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pdfTitle}</span>
          </div>
          <iframe src={pdfUrl} style={{ flex: 1, border: 'none', width: '100%' }} title={pdfTitle} />
        </div>
      )}
    </aside>
  )
}

/* ═══ Pre-seeded conversations per page (Korean) ═══ */
const seedConversations: Record<string, ChatMessage[]> = {
  '/dashboard': [
    { role: 'assistant', content: "안녕하세요, 김영호 차장님. 오늘의 AI 분석 결과를 정리했습니다. 3가지 주요 사항이 있습니다." },
    { role: 'user', content: "3가지가 뭐야?" },
    { role: 'assistant', content: "1. **이탈 위험**: 한국밸류자산운용 참여도가 급감했습니다(위험점수 88). 3개월간 통화 빈도 60% 감소, 브로커 보트 리서치 점수 하락. 즉시 연락을 권장합니다.\n\n2. **니즈 급증**: 반도체 섹터 관련 고객 니즈가 전주 대비 35% 증가했습니다. SK하이닉스 HBM 관련 심층 리포트 배포를 추천합니다.\n\n3. **보트 시즌 준비**: 2026 H1 보트까지 D-45입니다. 상위 20개 고객 중 5곳의 서비스 기록이 부족합니다. 기업탐방 초대를 우선 검토하세요." },
    { role: 'user', content: "오늘 우선 연락할 고객은?" },
    { role: 'assistant', content: "**우선순위 3곳**:\n\n1. **미래에셋자산운용** 박정현 PM — 어제 블룸버그로 방산 섹터 리서치 요청. 한화에어로 목표가 업데이트 배포 필요 (URGENT)\n2. **국민연금** 이승재 CIO — 2분기 리밸런싱 관련 미팅 요청 건 회신 필요 (THIS WEEK)\n3. **한국밸류자산운용** 최동환 PM — 이탈 위험 CRITICAL. 반도체 섹터 뷰 공유 겸 관계 회복 통화 추천" },
  ],
  '/clients': [
    { role: 'assistant', content: "고객 관리 페이지입니다. 현재 **300개 기관** 고객 중 Platinum 5곳, Gold 8곳, Silver 10곳, Bronze 7곳입니다." },
    { role: 'user', content: "미래에셋 최근 관심사가 뭐야?" },
    { role: 'assistant', content: "미래에셋자산운용의 최근 30일 AI 분석 결과:\n\n- **반도체**: SK하이닉스 HBM 수요 전망, 삼성전자 파운드리 수주 현황 (5건)\n- **2차전지**: LG에너지솔루션 북미 공장 가동률, 양극재 가격 동향 (3건)\n- **방산**: 한화에어로스페이스 수주잔고 분석 요청 (2건)\n- **ESG**: KCGS 등급 변동 관련 의견 요청 (1건)\n\n가장 긴급한 니즈는 **한화에어로 목표가 업데이트**입니다. 박정현 PM이 오늘 오전 통화에서 직접 요청했습니다." },
  ],
  '/activity': [
    { role: 'assistant', content: "오늘 활동 요약: 통화 **23건**, 블룸버그 **45건**, 이메일 **12건**, 미팅 **2건**. AI가 추출한 니즈 **18건** 중 8건이 팔로업 필요합니다." },
    { role: 'user', content: "미완료 액션 중 긴급한 건은?" },
    { role: 'assistant', content: "**URGENT 액션 3건**:\n\n1. 삼성자산운용 → 반도체 Q3 전망 리포트 배포 (기한: 오늘)\n2. 국민연금 → 2분기 리밸런싱 미팅 일정 확정 (기한: 내일)\n3. BlackRock Korea → 한국 시장 매크로 뷰 영문 자료 전달 (기한: 4/14)" },
  ],
  '/broker-vote': [
    { role: 'assistant', content: "2025 H2 브로커 보트 결과: 평균 **7.2점** (전기 대비 +0.3). 리서치 카테고리가 가장 강하고(7.8), 기업탐방이 가장 약합니다(6.4)." },
    { role: 'user', content: "보트 점수 개선 전략은?" },
    { role: 'assistant', content: "**카테고리별 개선 전략**:\n\n1. **기업탐방 (6.4 → 목표 7.5)**: NDR 횟수 30% 확대, 고객 관심 섹터 맞춤 이벤트 기획. 특히 국민연금/사학연금은 대형주 경영진 미팅 선호\n2. **이벤트 (6.8 → 목표 7.3)**: 섹터별 소규모 딥다이브 세미나 신설. 기존 대형 컨퍼런스보다 소그룹 포맷이 만족도 높음\n3. **트레이딩 (7.0 → 목표 7.5)**: 알고 실행 품질 개선, 대형 블록딜 참여 확대\n\n**Quick Win**: 국민연금 보트 점수가 6.8로 낮은데, 기업탐방 카테고리가 5.2입니다. 삼성전자 IR 미팅 1회만 성사시켜도 0.5점 이상 개선 가능합니다." },
  ],
  '/revenue': [
    { role: 'assistant', content: "월간 수수료 **16.7억원** (전월 대비 +5.3%). High-touch 58.7%, DMA 25.1%, Algo 16.2%. Platinum 고객이 전체 수익의 42%를 차지합니다." },
    { role: 'user', content: "수익성 낮은 고객은?" },
    { role: 'assistant', content: "**Cost-to-serve 대비 수익이 낮은 고객 5곳**:\n\n1. 프랭클린템플턴 — 수수료 800만원/월 vs 서비스 비용 1,200만원 (적자)\n2. 이스트스프링 — 수수료 600만원/월 vs 서비스 비용 900만원\n3. 피델리티 — 수수료 1,100만원/월 vs 서비스 비용 1,300만원\n\n다만 외국인 기관은 **브랜드 레퍼런스 가치**가 있으므로, 서비스 수준을 낮추기보다 DMA/Algo 비중을 높여 비용 구조를 개선하는 것을 추천합니다." },
  ],
  '/research': [
    { role: 'assistant', content: "리서치 배포 현황: 이번 달 **25건** 발행, 평균 오픈율 **64%**. 반도체 섹터 리포트가 가장 높은 오픈율(82%)을 기록했습니다." },
    { role: 'user', content: "커버리지 갭이 있는 섹터는?" },
    { role: 'assistant', content: "고객 니즈 대비 리서치 공급이 부족한 섹터:\n\n1. **방산/우주항공**: 니즈 12건 vs 리포트 2건 (갭 83%)\n2. **원전/에너지**: 니즈 8건 vs 리포트 1건 (갭 88%)\n3. **AI/로보틱스**: 니즈 15건 vs 리포트 4건 (갭 73%)\n\n리서치팀에 방산 섹터 커버리지 강화를 건의하는 것을 추천합니다. 특히 한화에어로, 현대로템, LIG넥스원에 대한 수요가 높습니다." },
  ],
  '/corporate-access': [
    { role: 'assistant', content: "이번 달 기업탐방 **15건** 중 완료 10건, 예정 4건, 취소 1건. 평균 피드백 점수 **4.2/5.0**입니다." },
    { role: 'user', content: "ROI가 가장 높은 이벤트 유형은?" },
    { role: 'assistant', content: "이벤트 유형별 ROI:\n\n1. **1:1 미팅**: 수수료 기여 평균 1,200만원/건 (비용 대비 8.5x)\n2. **NDR**: 수수료 기여 평균 2,500만원/건 (비용 대비 5.2x)\n3. **Expert Call**: 수수료 기여 평균 500만원/건 (비용 대비 12x) — 가성비 최고\n4. **Conference**: 수수료 기여 평균 3,000만원/건 (비용 대비 2.1x) — 가성비 낮음\n\n**추천**: Expert Call 빈도를 늘리세요. 비용 대비 효과가 가장 높고, 고객 만족도(4.5/5.0)도 최상위입니다." },
  ],
  '/risk': [
    { role: 'assistant', content: "이탈 위험 고객 **12곳**: CRITICAL 3곳, WARNING 4곳, WATCH 5곳. 위험 수수료 총 **2.5억원/월**입니다." },
    { role: 'user', content: "CRITICAL 고객 상세 알려줘" },
    { role: 'assistant', content: "**CRITICAL 3곳**:\n\n1. **한국밸류자산운용** (위험점수 88)\n   - 참여도 60% 감소, 보트 리서치 5.8점\n   - 원인: 경쟁사 반도체 커버리지 강화\n   - 추천: SK하이닉스 딥다이브 + 기업탐방 초대\n\n2. **교보생명** (위험점수 85)\n   - 수수료 3개월 연속 하락 (-22%)\n   - 원인: DMA 비중 급증, 인사이동\n   - 추천: 신임 PM 관계 구축 미팅\n\n3. **우리은행신탁** (위험점수 82)\n   - 6개월간 미팅 0건\n   - 원인: 커버리지 공백 (전임 담당자 퇴사)\n   - 추천: 즉시 인사 방문 + 서비스 재개" },
  ],
  '/compliance': [
    { role: 'assistant', content: "컴플라이언스 현황: 정보교류차단 활성 알림 **3건**, 고객정보 접근 로그 정상, 감사 요청 없음." },
    { role: 'user', content: "현재 제한 종목은?" },
    { role: 'assistant', content: "**정보교류차단 제한 종목 3건**:\n\n1. **카카오뱅크** — IB 딜 관련 (2026-03-15~)\n   → 해당 종목 언급/추천 자동 차단 중\n2. **HD현대중공업** — 블록딜 관련 (2026-04-01~)\n   → 관련 리서치 배포 일시 중단\n3. **크래프톤** — M&A 자문 관련 (2026-04-10~)\n   → 신규 제한, 영업팀 알림 발송 완료\n\n모든 차단은 자동 적용되며, 관련 추천 액션에서 자동 필터링됩니다." },
  ],
}

/* ═══ Chat Tab with Claude API ═══ */
function ChatTab() {
  const location = useLocation()
  const path = location.pathname
  const currentPage = seedConversations[path] ? path : '/dashboard'
  const seed = seedConversations[currentPage] || seedConversations['/dashboard'] || []

  const [messages, setMessages] = useState<ChatMessage[]>(seed)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const prevPageRef = useRef(currentPage)

  useEffect(() => {
    if (prevPageRef.current !== currentPage) {
      prevPageRef.current = currentPage
      const newSeed = seedConversations[currentPage] || seedConversations['/dashboard'] || []
      setMessages(newSeed)
    }
  }, [currentPage])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || isLoading) return

    const userMsg: ChatMessage = { role: 'user', content: text }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          currentPage,
        }),
      })

      if (!res.ok) throw new Error(`API error: ${res.status}`)

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let assistantText = ''
      setMessages(prev => [...prev, { role: 'assistant', content: '' }])

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })
          assistantText += chunk
          setMessages(prev => {
            const updated = [...prev]
            updated[updated.length - 1] = { role: 'assistant', content: assistantText }
            return updated
          })
        }
      }
    } catch (err: any) {
      console.error('AI chat error:', err)
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: `연결 오류가 발생했습니다: ${err.message}. 다시 시도해주세요.` },
      ])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const pageLabels: Record<string, string> = {
    '/dashboard': '영업 대시보드',
    '/clients': '고객 관리',
    '/activity': '활동 관리',
    '/broker-vote': '브로커 보트 분석',
    '/revenue': '수익 분석',
    '/research': '리서치 배포',
    '/corporate-access': '기업탐방 관리',
    '/risk': '이탈 조기 경보',
    '/compliance': '컴플라이언스 센터',
    '/research-portal': '리서치 포탈',
    '/exec': '경영진 대시보드',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <div style={{
        padding: '8px 16px', background: '#F8FAFC', borderBottom: '1px solid #F1F5F9', flexShrink: 0,
        fontSize: 11, color: '#64748B', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }} />
        현재: {pageLabels[currentPage] || currentPage}
      </div>

      <div className="lumina-chat" style={{ flex: 1, overflowY: 'auto' }}>
        {messages.map((msg, i) => (
          <div key={i} className={`lumina-msg ${msg.role === 'user' ? 'user' : 'ai'}`}>
            {msg.role === 'assistant' && (
              <div className="lumina-msg-avatar" style={{ background: 'linear-gradient(135deg, #034EA2, #2B7DE9)' }}>
                <Sparkles size={14} color="white" />
              </div>
            )}
            <div>
              <div className={`lumina-msg-bubble ${msg.role === 'user' ? 'user' : 'ai'}`}>
                {msg.content ? (
                  <div className="lumina-markdown">
                    <Markdown>{msg.content}</Markdown>
                  </div>
                ) : (isLoading && i === messages.length - 1 ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94A3B8' }}>
                    <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> 분석 중...
                  </span>
                ) : null)}
              </div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="lumina-input-area" style={{ flexShrink: 0 }}>
        <div className="lumina-input-wrapper">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="루미나에게 물어보세요..."
            className="lumina-input"
            disabled={isLoading}
          />
          <button
            className="lumina-send-btn"
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            style={{ opacity: isLoading || !input.trim() ? 0.4 : 1 }}
          >
            {isLoading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ═══ Documents Tab ═══ */
function DocumentsTab({ onOpenPdf }: { onOpenPdf: (url: string, title: string) => void }) {
  const sections = [
    {
      label: '리서치 리포트',
      items: [
        { title: '반도체 산업 2H26 전망', date: '2026-04-10', type: 'PDF', pages: '42p', url: '/reports/semiconductor-2h26.pdf' },
        { title: 'SK하이닉스 — HBM4 수혜 분석', date: '2026-04-08', type: 'PDF', pages: '28p', url: '/reports/semiconductor-2h26.pdf' },
        { title: '2차전지 밸류체인 심층분석', date: '2026-04-05', type: 'PDF', pages: '35p', url: '/reports/semiconductor-2h26.pdf' },
        { title: '한화에어로스페이스 — 수주잔고 분석', date: '2026-04-03', type: 'PDF', pages: '18p', url: '/reports/semiconductor-2h26.pdf' },
        { title: '삼성전자 1Q26 프리뷰', date: '2026-04-01', type: 'PDF', pages: '15p', url: '/reports/semiconductor-2h26.pdf' },
      ],
    },
    {
      label: '브로커 보트',
      items: [
        { title: '2025 H2 브로커 보트 결과 분석', date: '2026-01-15', type: 'PDF', pages: '24p', url: '/reports/broker-vote-2025h2.pdf' },
        { title: '보트 시즌 준비 체크리스트', date: '2026-03-01', type: 'PDF', pages: '8p', url: '/reports/broker-vote-2025h2.pdf' },
        { title: '고객별 서비스 기록 요약', date: '2026-04-01', type: 'PDF', pages: '120p', url: '/reports/broker-vote-2025h2.pdf' },
      ],
    },
    {
      label: '수익 분석',
      items: [
        { title: '2026년 3월 수수료 실적 보고서', date: '2026-04-05', type: 'PDF', pages: '12p', url: '/reports/monthly-commission.pdf' },
        { title: '이탈 조기 경보 리포트', date: '2026-04-01', type: 'PDF', pages: '18p', url: '/reports/attrition-warning.pdf' },
      ],
    },
    {
      label: '컴플라이언스',
      items: [
        { title: '2026년 4월 컴플라이언스 월간 보고', date: '2026-04-01', type: 'PDF', pages: '6p', url: '/reports/compliance-monthly.pdf' },
        { title: '고객정보관리 감사 보고서', date: '2026-03-15', type: 'PDF', pages: '12p', url: '/reports/compliance-monthly.pdf' },
        { title: '금감원 검사 대응 자료', date: '2026-02-28', type: 'PDF', pages: '48p', url: '/reports/compliance-monthly.pdf' },
      ],
    },
  ]

  return (
    <div className="lumina-reports">
      {sections.map((section, si) => (
        <div key={si}>
          <div style={{ padding: '12px 16px 6px', fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {section.label}
          </div>
          {section.items.map((item, i) => (
            <div
              key={i}
              className="lumina-report-item"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                if ((item as any).url) {
                  onOpenPdf((item as any).url, item.title)
                }
              }}
            >
              <div className="lumina-report-icon">
                <FileText size={16} color="#034EA2" strokeWidth={1.8} />
              </div>
              <div className="lumina-report-info">
                <div className="lumina-report-title">{item.title}</div>
                <div className="lumina-report-meta">{item.date} · {item.pages}</div>
              </div>
              <span className="lumina-report-status" style={{ color: (item as any).url ? '#034EA2' : '#94A3B8', fontWeight: (item as any).url ? 600 : 400 }}>
                {(item as any).url ? '보기' : item.type}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
