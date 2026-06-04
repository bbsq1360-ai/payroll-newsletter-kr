// lib/generateNewsletter.js

export async function generateNewsletter(keyNumbers, issueNumber, dateStr) {
  const Anthropic = (await import("@anthropic-ai/sdk")).default

  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  })

  const knHTML = `
    <div class="knums">
      <div class="knc"><div class="knl">${keyNumbers.minWage.label}</div><div class="knv">${keyNumbers.minWage.value}</div><div class="kns">${keyNumbers.minWage.sub}</div></div>
      <div class="knc"><div class="knl">${keyNumbers.pensionRate.label}</div><div class="knv">${keyNumbers.pensionRate.value}</div><div class="kns">${keyNumbers.pensionRate.sub}</div></div>
      <div class="knc"><div class="knl">${keyNumbers.healthRate.label}</div><div class="knv">${keyNumbers.healthRate.value}</div><div class="kns">${keyNumbers.healthRate.sub}</div></div>
    </div>
    <div class="knums">
      <div class="knc"><div class="knl">${keyNumbers.pensionCeilingCurrent.label}</div><div class="knv">${keyNumbers.pensionCeilingCurrent.value}</div><div class="kns">${keyNumbers.pensionCeilingCurrent.sub}</div></div>
      <div class="knc"><div class="knl">${keyNumbers.pensionCeilingNext.label}</div><div class="knv">${keyNumbers.pensionCeilingNext.value}</div><div class="kns">${keyNumbers.pensionCeilingNext.sub}</div></div>
      <div class="knc"><div class="knl">${keyNumbers.unemploymentCap.label}</div><div class="knv">${keyNumbers.unemploymentCap.value}</div><div class="kns">${keyNumbers.unemploymentCap.sub}</div></div>
    </div>
  `

  const prompt = `
당신은 한국 급여/노동법 전문가입니다. 오늘 날짜(${dateStr}) 기준으로 최신 한국 노동법·급여 뉴스를 반영한 Payroll & Labor Law Newsletter Issue #${issueNumber}를 작성해주세요.

아래 HTML/CSS 구조를 반드시 그대로 사용하고, 웹 검색을 통해 최신 이슈를 포함하세요.

TODAY'S KEY NUMBERS는 아래 고정값을 그대로 사용하세요 (수정 금지):
${knHTML}

## 작성 규칙

1. 각 항목은 반드시 아래 6가지 포함:
   - [관련법] 태그 (.tlaw)
   - [현재 상태] 태그 (.tst + 색상 클래스)
   - 🇰🇷 한국어 설명 (.iko)
   - 🇺🇸 영어 설명 (.ien)
   - 출처 링크 (.isrc) — 최소 1개, 반드시 실제 URL
   - → 액션 (.iact)

2. 분류 기준:
   - 🔴 URGENT: 현재 단속 중이거나 즉시 조치 필요
   - 🟡 IMPORTANT: 시행 확정, 급여 시스템 반영 필요
   - 🟢 FYI: 입법 추진 중, 모니터링 필요

3. 신규 항목에는 <span class="new-tag">NEW</span> 추가

4. 상태 태그 색상:
   - ts-red: 단속 중, URGENT
   - ts-amb: 시행 중, 국회 통과
   - ts-grn: 추진 중, FYI
   - ts-blu: 정부 발표

## CSS (변경 금지)

<style id="nl-style">
.nl{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:680px;padding:0 0 2rem}
.hbar{background:#f8f9fa;border-radius:12px;padding:1rem 1.25rem;margin-bottom:1rem;border:.5px solid #e0e0e0}
.htop{display:flex;align-items:center;gap:10px;margin-bottom:6px}
.chtag{font-size:13px;font-weight:500;color:#185FA5;background:#E6F1FB;padding:2px 10px;border-radius:100px}
.hmeta{font-size:12px;color:#666}
.div{border:none;border-top:.5px solid #e0e0e0;margin:.75rem 0}
.knums{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:10px}
.knc{background:#f8f9fa;border-radius:8px;padding:.75rem 1rem;text-align:center;border:.5px solid #e0e0e0}
.knl{font-size:11px;color:#888;margin-bottom:4px}
.knv{font-size:18px;font-weight:500;color:#111}
.kns{font-size:11px;color:#888;margin-top:2px}
.stitle{font-size:15px;font-weight:500;color:#111;margin-bottom:.5rem}
.tldr{background:#f8f9fa;border-left:3px solid #378ADD;border-radius:0 8px 8px 0;padding:.75rem 1rem;margin-bottom:1rem}
.titem{font-size:13px;color:#111;padding:3px 0}
.icard{border-radius:8px;padding:.875rem 1rem;margin-bottom:.625rem;border:.5px solid #e0e0e0;background:#fff}
.icard.urg{border-left:3px solid #E24B4A}
.icard.imp{border-left:3px solid #EF9F27}
.icard.fyi{border-left:3px solid #1D9E75}
.ihead{display:flex;align-items:flex-start;gap:8px;margin-bottom:8px;flex-wrap:wrap}
.dot{width:10px;height:10px;border-radius:50%;margin-top:4px;flex-shrink:0}
.dr{background:#E24B4A}.da{background:#EF9F27}.dg{background:#1D9E75}
.itr{display:flex;align-items:center;gap:6px;flex-wrap:wrap;flex:1}
.ititle{font-size:14px;font-weight:500;color:#111}
.tlaw{font-size:11px;font-weight:500;padding:2px 7px;border-radius:100px;background:#f0f0f0;color:#555;border:.5px solid #ddd;white-space:nowrap}
.tst{font-size:11px;font-weight:500;padding:2px 7px;border-radius:100px;white-space:nowrap}
.ts-red{background:#FCEBEB;color:#A32D2D}
.ts-amb{background:#FAEEDA;color:#854F0B}
.ts-grn{background:#EAF3DE;color:#3B6D11}
.ts-blu{background:#E6F1FB;color:#185FA5}
.iko{font-size:13px;color:#111;margin:4px 0;line-height:1.6}
.ien{font-size:12px;color:#666;margin:2px 0 6px;font-style:italic;line-height:1.5}
.isrc{font-size:12px;color:#666;margin-bottom:6px;display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.isrc a{color:#185FA5;text-decoration:none;display:inline-flex;align-items:center;gap:3px;border:.5px solid #ddd;border-radius:4px;padding:1px 7px;font-size:11px;background:#f8f9fa}
.iact{font-size:12px;font-weight:500;background:#f8f9fa;border-radius:4px;padding:4px 8px;color:#111;display:inline-block}
.shdr{display:flex;align-items:center;gap:8px;margin-bottom:.5rem;padding-bottom:4px;border-bottom:.5px solid #e0e0e0}
.badge{font-size:11px;font-weight:500;padding:2px 8px;border-radius:100px}
.br{background:#FCEBEB;color:#A32D2D}
.ba{background:#FAEEDA;color:#854F0B}
.bg_{background:#EAF3DE;color:#3B6D11}
.new-tag{font-size:10px;font-weight:500;padding:1px 6px;border-radius:100px;background:#E6F1FB;color:#185FA5;margin-left:2px;vertical-align:middle}
.footer{font-size:11px;color:#aaa;text-align:center;margin-top:1.5rem;padding-top:.75rem;border-top:.5px solid #e0e0e0}
</style>

## 출력 형식

아래 HTML 골격을 그대로 사용하고, TODAY'S KEY NUMBERS는 위에서 제공한 고정값을 그대로 삽입하세요.
순수 HTML만 출력하세요. 마크다운, 코드블록, 설명 텍스트 없이 HTML만.

<div class="nl">

<!-- 헤더 -->
<div class="hbar">
  <div class="htop">
    <span class="chtag"># payroll-labor-law-kr</span>
    <span class="hmeta">주간 급여 & 노동법 뉴스레터</span>
  </div>
  <div class="hmeta">📅 ${dateStr} &nbsp;|&nbsp; Issue #${issueNumber} &nbsp;|&nbsp; 매주 월~금 오전 9시 &nbsp;|&nbsp; 대상: 급여 실무 담당자 · Payroll Practitioners</div>
</div>

<!-- KEY NUMBERS -->
<div style="margin-bottom:1rem">
  <div class="stitle">📊 TODAY'S KEY NUMBERS</div>
  ${knHTML}
</div>

<!-- TL;DR -->
<div class="tldr">
  <div style="font-size:12px;font-weight:500;color:#666;margin-bottom:6px">⚡ TL;DR — 오늘 꼭 알아야 할 것</div>
  <!-- 각 항목 분류에 맞는 색깔 점을 사용하세요 -->
  <!-- URGENT(빨간점): <div style="display:flex;align-items:center;gap:6px;font-size:13px;color:#111;padding:3px 0"><div style="width:8px;height:8px;border-radius:50%;background:#E24B4A;flex-shrink:0"></div>요약 내용</div> -->
  <!-- IMPORTANT(주황점): <div style="display:flex;align-items:center;gap:6px;font-size:13px;color:#111;padding:3px 0"><div style="width:8px;height:8px;border-radius:50%;background:#EF9F27;flex-shrink:0"></div>요약 내용</div> -->
  <!-- FYI(초록점): <div style="display:flex;align-items:center;gap:6px;font-size:13px;color:#111;padding:3px 0"><div style="width:8px;height:8px;border-radius:50%;background:#1D9E75;flex-shrink:0"></div>요약 내용</div> -->
</div>

<hr class="div">

<!-- URGENT 섹션 (항목 없으면 섹션 전체 생략) -->
<div style="margin-bottom:1rem">
  <div class="shdr">
    <span style="font-size:16px">🔴</span>
    <span class="stitle" style="margin:0">URGENT — 즉시 조치 필요</span>
    <span class="badge br">긴급</span>
  </div>
  <!-- 항목 카드 -->
</div>

<hr class="div">

<!-- IMPORTANT 섹션 -->
<div style="margin-bottom:1rem">
  <div class="shdr">
    <span style="font-size:16px">🟡</span>
    <span class="stitle" style="margin:0">IMPORTANT — 급여·인사 시스템 반영 필요</span>
    <span class="badge ba">중요</span>
  </div>
  <!-- 항목 카드 -->
</div>

<hr class="div">

<!-- FYI 섹션 -->
<div style="margin-bottom:1rem">
  <div class="shdr">
    <span style="font-size:16px">🟢</span>
    <span class="stitle" style="margin:0">FYI — 입법 동향 모니터링</span>
    <span class="badge bg_">참고</span>
  </div>
  <!-- 항목 카드 -->
</div>

<hr class="div">

<!-- 푸터 참고 사이트 -->
<div style="font-size:12px;color:#666;background:#f8f9fa;border-radius:8px;padding:.75rem 1rem;line-height:1.7;margin-bottom:.75rem">
  📌 <strong>참고 사이트:</strong>
  <a href="https://www.moel.go.kr" target="_blank" style="color:#185FA5;text-decoration:none;margin:0 4px">고용노동부</a> ·
  <a href="https://www.moleg.go.kr/" target="_blank" style="color:#185FA5;text-decoration:none;margin:0 4px">법제처</a> ·
  <a href="https://total.comwel.or.kr/" target="_blank" style="color:#185FA5;text-decoration:none;margin:0 4px">근로복지공단</a> ·
  <a href="https://www.labortoday.co.kr" target="_blank" style="color:#185FA5;text-decoration:none;margin:0 4px">매일노동뉴스</a> ·
  <a href="https://www.nhis.or.kr" target="_blank" style="color:#185FA5;text-decoration:none;margin:0 4px">건강보험공단</a> ·
  <a href="https://www.nps.or.kr" target="_blank" style="color:#185FA5;text-decoration:none;margin:0 4px">국민연금공단</a>
</div>

<div class="footer">매주 월~금 오전 9시 발송 &nbsp;|&nbsp; Generated by Claude AI &nbsp;|&nbsp; 문의: #payroll-helpdesk</div>
</div>
`

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4000,
    tools: [{ type: "web_search_20250305", name: "web_search" }],
    messages: [{ role: "user", content: prompt }]
  })

  // 텍스트 블록만 추출
  const html = response.content
    .filter(block => block.type === "text")
    .map(block => block.text)
    .join("")

  return html.trim()
}
