import Anthropic from '@anthropic-ai/sdk'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// Context data per page — Samsung Securities Agentic CRM
const pageContext: Record<string, string> = {
  '/dashboard': `삼성증권 기관영업 대시보드.
주요 지표: 300개 기관 고객 (자산운용사 12, 연기금 4, 보험사 5, 은행신탁 4, 외국인기관 5 등), 15명 세일즈.
월간 수수료: 16.7억원 (전월 대비 +5.3%). 평균 브로커 보트 점수: 7.2/10 (전기 대비 +0.3).
이탈 위험 고객: 12곳 (CRITICAL 3, WARNING 4, WATCH 5). 위험 수수료 약 2.5억원/월.
AI 니즈 추출: 847건 (전월 대비 +12.5%). 액션 완료율: 82.3%.
고객 등급: Platinum 5, Gold 8, Silver 10, Bronze 7.
수수료 구성: High-touch 58.7%, DMA 25.1%, Algo 16.2%.
주요 이슈: 한국밸류자산운용 이탈 위험 CRITICAL, 반도체 섹터 니즈 급증, 보트 시즌 D-45.`,

  '/clients': `고객 관리 (Client 360) 페이지.
300개 기관 고객의 상세 프로필, 핵심 인물, 인터랙션 이력, AI 추출 니즈, 추천 액션을 관리.
주요 고객: 미래에셋자산운용(Platinum, AUM 52조), 국민연금(Platinum, AUM 900조), 삼성자산운용(Platinum, AUM 38조).
각 기관별 2-3명의 핵심 인물(CIO, PM, 트레이더)이 등록되어 있으며 의사결정 구조를 매핑.
AI가 모든 인터랙션에서 고객 니즈를 자동 추출하고 카테고리(종목추천/리서치요청/기업탐방 등)별로 분류.`,

  '/activity': `활동 관리 페이지.
일평균 인터랙션: 통화 23건, 블룸버그 45건, 이메일 12건, 미팅 2건 = 총 80건 이상.
AI 니즈 추출: 인터랙션당 평균 2.5개 니즈 자동 추출 (기존 수동 0.5개 대비 5배).
팔로업 큐: 미완료 액션 30건 중 URGENT 5건, THIS_WEEK 12건.
최근 주요 인터랙션: 미래에셋 박정현 PM 방산 리서치 요청, 국민연금 리밸런싱 미팅 요청, BlackRock 한국 매크로 뷰 요청.`,

  '/broker-vote': `브로커 보트 분석 페이지.
2025 H2 결과: 평균 7.2점 (전기 대비 +0.3). 30개 기관의 보트 결과 보유.
카테고리별: 리서치 7.8, 세일즈 7.5, 트레이딩 7.0, 기업탐방 6.4, 이벤트 6.8.
약점: 기업탐방(6.4)과 이벤트(6.8) — NDR 확대 및 소그룹 세미나 도입 필요.
보트-수수료 상관관계: 보트 1점 상승 시 연간 수수료 약 3억원 증가 추정.
보트 시즌 준비: 상위 20개 고객 중 5곳의 서비스 기록 부족.`,

  '/revenue': `수익 분석 페이지.
월간 수수료: 16.7억원. 분기 수수료: 50.1억원. 연간 수수료: 200억원 (전년 대비 +8.2%).
High-touch 58.7%, DMA 25.1%, Algo 16.2%.
Platinum 고객(5곳)이 전체 수익의 42%, Gold(8곳) 28%, Silver(10곳) 20%, Bronze(7곳) 10%.
고객당 평균 수수료: Platinum 14억/년, Gold 7억/년, Silver 4억/년, Bronze 2.8억/년.
딜 참여: 올해 IPO 3건, 블록딜 5건, 세컨더리 2건.`,

  '/research': `리서치 배포 페이지.
이번 달 발행: 25건 (기업분석 12, 산업분석 5, 전략 3, 매크로 3, 퀀트 2).
평균 오픈율: 64%. 반도체 섹터 최고(82%), 매크로 최저(45%).
커버리지 갭: 방산(83%), 원전/에너지(88%), AI/로보틱스(73%) — 고객 니즈 대비 리서치 공급 부족.
추천: 방산 섹터 커버리지 강화, 한화에어로/현대로템/LIG넥스원 수요 높음.`,

  '/corporate-access': `기업탐방 관리 페이지.
이번 달 이벤트: 15건 (NDR 4, Conference 2, 1:1 Meeting 5, Site Visit 2, Expert Call 2).
완료 10건, 예정 4건, 취소 1건. 평균 피드백: 4.2/5.0.
ROI 최고: Expert Call (비용 대비 12x), 1:1 미팅 (8.5x). ROI 최저: Conference (2.1x).
수수료 기여: 기업탐방 전체 월 1.2억원 기여.`,

  '/risk': `이탈 조기 경보 페이지.
12곳 이탈 위험: CRITICAL 3곳 (한국밸류, 교보생명, 우리은행신탁), WARNING 4곳, WATCH 5곳.
위험 점수 산출: 참여도(25%) + 수익궤적(25%) + 보트신호(20%) + 경쟁압력(15%) + 커버리지갭(10%) + 인사변동(5%).
위험 수수료: 월 2.5억원 (전체의 15%).
조기 감지: 기존 3-6개월 후 → 현재 2-4주 전 감지. 85% 정확도.`,

  '/compliance': `컴플라이언스 센터.
정보교류차단(Chinese Wall): 제한 종목 3건 (카카오뱅크, HD현대중공업, 크래프톤).
모든 추천 액션에서 제한 종목 자동 필터링. 차단 로그 실시간 기록.
고객정보관리: RBAC 기반 접근 통제. 금감원 검사 대응 일괄 추출 기능.
감사 추적: 2,847건 이벤트 로그. 암호화 해시 체인 무결성 보장.
컴플라이언스 점수: 96% (업계 평균 88%).`,

  '/research-portal': `리서치 포탈.
리포트 발행 현황, 고객 반응 분석, 애널리스트 성과, 섹터별 분포.
25건 발행, 평균 오픈율 64%. 반도체 섹터 리포트가 가장 높은 반응.`,

  '/exec': `경영진 대시보드.
영업팀 전체 KPI: 15명 세일즈, 월 16.7억원 수수료, 평균 보트 7.2점, 액션 완료율 82%.
팀별 성과, 개인별 성과 랭킹, 수수료 트렌드, 브로커 보트 카테고리별 분석.`,
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { messages, currentPage } = req.body

  const context = pageContext[currentPage] || pageContext['/dashboard'] || ''

  const systemPrompt = `당신은 삼성증권 기관영업본부의 AI 어시스턴트 "Deep Agent"입니다.
DeepAuto.ai의 Agentic Intelligence Platform 기반으로, 기관 고객 관리, 브로커 보트 분석, 수수료 최적화, 이탈 예방을 지원합니다.

역할:
- 기관영업 세일즈에게 실시간 인사이트와 액션 추천 제공
- 고객 니즈를 분석하고 최적의 서비스 전략 제안
- 브로커 보트 점수 개선 전략 조언
- 이탈 위험 고객에 대한 조기 경보 및 개입 방안 추천
- 한국 자본시장 규제(자본시장법, 정보교류차단 등) 준수

응답 규칙:
- 한국어로 응답 (영어 고유명사는 그대로)
- 간결하고 실행 가능한 조언 위주
- 숫자와 데이터 기반 분석
- 마크다운 포맷 사용 (볼드, 리스트 등)

현재 페이지 컨텍스트:
${context}`

  try {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.setHeader('Transfer-Encoding', 'chunked')

    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((m: any) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      })),
    })

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        res.write(event.delta.text)
      }
    }

    res.end()
  } catch (error: any) {
    console.error('Claude API error:', error)
    if (!res.headersSent) {
      res.status(500).json({ error: error.message })
    } else {
      res.end()
    }
  }
}
