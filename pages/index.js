// pages/index.js
import { useState } from "react"
import Head from "next/head"

const NL_CSS = `
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
`

export default function Home() {
  const [html, setHtml] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function generate() {
    setLoading(true)
    setError("")
    setHtml("")
    try {
      const res = await fetch("/api/generate", { method: "POST" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "생성 실패")
      setHtml(data.html)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>한국 급여·노동법 뉴스레터</title>
        <meta name="description" content="AI가 생성하는 한국 급여·노동법 주간 뉴스레터" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={s.page}>
        <header style={s.header}>
          <div style={s.headerInner}>
            <div>
              <div style={s.htag}># payroll-labor-law-kr</div>
              <h1 style={s.htitle}>한국 급여·노동법 뉴스레터</h1>
              <p style={s.hsub}>AI가 최신 노동법·급여 이슈를 실시간으로 정리합니다</p>
            </div>
            <button
              onClick={generate}
              disabled={loading}
              style={loading ? {...s.btn, ...s.btnDisabled} : s.btn}
            >
              {loading
                ? <span style={s.btnInner}><span style={s.spinner} />뉴스레터 생성 중...</span>
                : <span style={s.btnInner}>✦ 오늘의 뉴스레터 생성</span>
              }
            </button>
          </div>
        </header>

        <main style={s.main}>
          {!html && !loading && !error && (
            <div style={s.empty}>
              <div style={s.emptyIcon}>📋</div>
              <p style={s.emptyTitle}>버튼을 눌러 오늘의 뉴스레터를 생성하세요</p>
              <p style={s.emptySub}>
                Claude AI가 최신 한국 노동법·급여 이슈를 검색하고<br />
                실무 담당자를 위한 뉴스레터를 자동으로 작성합니다
              </p>
              <div style={s.emptyTags}>
                <span style={s.etag}>🔴 URGENT 즉시 조치</span>
                <span style={s.etag}>🟡 IMPORTANT 시스템 반영</span>
                <span style={s.etag}>🟢 FYI 동향 모니터링</span>
              </div>
            </div>
          )}

          {loading && (
            <div style={s.loadingBox}>
              <div style={s.loadingSpinner} />
              <p style={s.loadingTitle}>뉴스레터 생성 중</p>
              <p style={s.loadingSub}>
                최신 노동법·급여 뉴스를 검색하고 정리하는 중입니다<br />
                약 30~60초 소요됩니다
              </p>
            </div>
          )}

          {error && (
            <div style={s.errorBox}>
              <p style={s.errorTitle}>⚠️ 오류가 발생했습니다</p>
              <p style={s.errorMsg}>{error}</p>
              <button onClick={generate} style={s.retryBtn}>다시 시도</button>
            </div>
          )}

          {html && (
            <div style={s.nlWrap}>
              <style dangerouslySetInnerHTML={{ __html: NL_CSS }} />
              <div dangerouslySetInnerHTML={{ __html: html }} />
            </div>
          )}
        </main>

        <footer style={s.footer}>
          <p>Generated by Claude AI &nbsp;·&nbsp; <a href="/admin" style={s.footerLink}>관리자</a></p>
        </footer>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: auto; }
        body { font-family: 'Noto Sans KR', -apple-system, sans-serif; background: #f4f5f7; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  )
}

const s = {
  page: { display: "flex", flexDirection: "column", minHeight: "100vh" },
  header: { background: "#0A1628", padding: "1.5rem 2rem", flexShrink: 0 },
  headerInner: {
    maxWidth: 760, margin: "0 auto",
    display: "flex", alignItems: "center",
    justifyContent: "space-between", gap: "1rem", flexWrap: "wrap"
  },
  htag: {
    fontSize: 12, fontWeight: 500,
    color: "#378ADD", background: "rgba(55,138,221,0.15)",
    padding: "3px 10px", borderRadius: 100,
    display: "inline-block", marginBottom: 6
  },
  htitle: { fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 4 },
  hsub: { fontSize: 13, color: "#8899AA" },
  btn: {
    background: "#378ADD", color: "#fff", border: "none",
    borderRadius: 10, padding: "11px 22px",
    fontSize: 14, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap"
  },
  btnDisabled: { background: "#2a5f8a", cursor: "not-allowed" },
  btnInner: { display: "flex", alignItems: "center", gap: 8 },
  spinner: {
    width: 14, height: 14,
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff", borderRadius: "50%",
    animation: "spin 0.8s linear infinite", display: "inline-block"
  },
  main: { flex: 1, maxWidth: 760, margin: "0 auto", padding: "2rem 1rem", width: "100%" },
  empty: { textAlign: "center", padding: "4rem 1rem" },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: 600, color: "#1a1a2e", marginBottom: 8 },
  emptySub: { fontSize: 14, color: "#666", lineHeight: 1.7, marginBottom: 24 },
  emptyTags: { display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" },
  etag: {
    fontSize: 12, padding: "5px 12px",
    background: "#fff", border: "1px solid #e0e0e0",
    borderRadius: 100, color: "#444"
  },
  loadingBox: {
    textAlign: "center", padding: "4rem 1rem",
    background: "#fff", borderRadius: 16, border: "1px solid #e8e8e8"
  },
  loadingSpinner: {
    width: 40, height: 40,
    border: "3px solid #e0e0e0", borderTopColor: "#378ADD",
    borderRadius: "50%", animation: "spin 1s linear infinite",
    margin: "0 auto 1.5rem"
  },
  loadingTitle: { fontSize: 16, fontWeight: 600, color: "#111", marginBottom: 8 },
  loadingSub: { fontSize: 13, color: "#888", lineHeight: 1.8 },
  errorBox: {
    textAlign: "center", padding: "2rem",
    background: "#fff5f5", border: "1px solid #fcc", borderRadius: 12
  },
  errorTitle: { fontSize: 16, fontWeight: 600, color: "#c0392b", marginBottom: 8 },
  errorMsg: { fontSize: 13, color: "#666", marginBottom: 16 },
  retryBtn: {
    background: "#E24B4A", color: "#fff", border: "none",
    borderRadius: 8, padding: "8px 20px", fontSize: 13, cursor: "pointer"
  },
  nlWrap: {
    background: "#fff", borderRadius: 16,
    border: "1px solid #e8e8e8", padding: "2rem",
    boxShadow: "0 2px 12px rgba(0,0,0,0.04)"
  },
  footer: {
    textAlign: "center", padding: "1.5rem",
    fontSize: 12, color: "#aaa",
    borderTop: "1px solid #e8e8e8", background: "#fff", flexShrink: 0
  },
  footerLink: { color: "#aaa", textDecoration: "none" }
}
