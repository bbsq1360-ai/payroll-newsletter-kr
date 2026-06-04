// pages/admin.js
import { useState, useEffect } from "react"
import Head from "next/head"

export default function Admin() {
  const [password, setPassword] = useState("")
  const [authed, setAuthed] = useState(false)
  const [authError, setAuthError] = useState("")
  const [keyNumbers, setKeyNumbers] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState("")
  const [envValue, setEnvValue] = useState("")

  async function login(e) {
    e.preventDefault()
    setAuthError("")
    const res = await fetch("/api/keynumbers")
    const data = await res.json()
    const check = await fetch("/api/keynumbers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, keyNumbers: data })
    })
    if (check.ok) {
      setAuthed(true)
      setKeyNumbers(data)
    } else {
      setAuthError("비밀번호가 올바르지 않습니다.")
    }
  }

  async function save() {
    setSaving(true)
    setSaved(false)
    setSaveError("")
    setEnvValue("")
    const res = await fetch("/api/keynumbers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, keyNumbers })
    })
    if (res.ok) {
      const data = await res.json()
      setSaved(true)
      setEnvValue(data.envValue)
    } else {
      const data = await res.json()
      setSaveError(data.error || "저장 실패")
    }
    setSaving(false)
  }

  function updateField(key, subKey, value) {
    setKeyNumbers(prev => ({
      ...prev,
      [key]: { ...prev[key], [subKey]: value }
    }))
  }

  const fields = [
    { key: "minWage", title: "최저시급" },
    { key: "pensionRate", title: "국민연금 요율" },
    { key: "healthRate", title: "건강보험 요율" },
    { key: "pensionCeilingCurrent", title: "국민연금 기준소득 상한 (현행)" },
    { key: "pensionCeilingNext", title: "국민연금 기준소득 상한 (다음 적용)" },
    { key: "unemploymentCap", title: "실업급여 상한" }
  ]

  return (
    <>
      <Head><title>관리자 — 급여 뉴스레터</title></Head>
      <div style={styles.page}>
        <header style={styles.header}>
          <div style={styles.headerInner}>
            <div>
              <h1 style={styles.title}>⚙️ 관리자 페이지</h1>
              <p style={styles.sub}>TODAY'S KEY NUMBERS 수치 관리</p>
            </div>
            <a href="/" style={styles.backBtn}>← 뉴스레터로 돌아가기</a>
          </div>
        </header>

        <main style={styles.main}>
          {!authed ? (
            <div style={styles.loginCard}>
              <h2 style={styles.loginTitle}>🔐 관리자 로그인</h2>
              <p style={styles.loginSub}>접근하려면 관리자 비밀번호가 필요합니다</p>
              <form onSubmit={login} style={styles.loginForm}>
                <input
                  type="password"
                  placeholder="비밀번호 입력"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={styles.input}
                  autoFocus
                />
                {authError && <p style={styles.errorText}>{authError}</p>}
                <button type="submit" style={styles.loginBtn}>로그인</button>
              </form>
            </div>
          ) : (
            <div>
              <div style={styles.notice}>
                💡 수치를 수정하고 저장하면, 아래에 나타나는 값을 Vercel 환경변수 <strong>KEY_NUMBERS_JSON</strong>에 붙여넣으세요.
              </div>

              {keyNumbers && fields.map(({ key, title }) => (
                <div key={key} style={styles.fieldCard}>
                  <h3 style={styles.fieldTitle}>{title}</h3>
                  <div style={styles.fieldRow}>
                    <div style={styles.fieldItem}>
                      <label style={styles.label}>표시 값 (굵은 숫자)</label>
                      <input
                        style={styles.input}
                        value={keyNumbers[key]?.value || ""}
                        onChange={e => updateField(key, "value", e.target.value)}
                      />
                    </div>
                    <div style={styles.fieldItem}>
                      <label style={styles.label}>부제 (작은 글씨)</label>
                      <input
                        style={styles.input}
                        value={keyNumbers[key]?.sub || ""}
                        onChange={e => updateField(key, "sub", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div style={styles.saveRow}>
                {saveError && <p style={styles.errorText}>{saveError}</p>}
                <button
                  onClick={save}
                  disabled={saving}
                  style={{ ...styles.saveBtn, ...(saving ? styles.saveBtnDisabled : {}) }}
                >
                  {saving ? "처리 중..." : "💾 저장하기"}
                </button>
              </div>

              {saved && envValue && (
                <div style={styles.envBox}>
                  <p style={styles.envTitle}>✅ 저장 완료! 아래 순서로 Vercel에 반영하세요</p>
                  <ol style={styles.envSteps}>
                    <li>Vercel 대시보드 → Settings → Environment Variables 접속</li>
                    <li><strong>KEY_NUMBERS_JSON</strong> 환경변수 값을 아래 내용으로 교체</li>
                    <li>저장 후 Redeploy 클릭</li>
                  </ol>
                  <textarea
                    readOnly
                    value={envValue}
                    style={styles.envTextarea}
                    onClick={e => e.target.select()}
                  />
                  <p style={styles.envHint}>👆 클릭하면 전체 선택됩니다. Ctrl+C로 복사하세요.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Noto Sans KR', -apple-system, sans-serif; background: #f4f5f7; }
      `}</style>
    </>
  )
}

const styles = {
  page: { minHeight: "100vh" },
  header: { background: "#0A1628", padding: "1.5rem 1rem" },
  headerInner: { maxWidth: 760, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" },
  title: { fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 4 },
  sub: { fontSize: 13, color: "#8899AA" },
  backBtn: { fontSize: 13, color: "#8899AA", textDecoration: "none", padding: "6px 14px", border: "1px solid #2a3a4a", borderRadius: 8 },
  main: { maxWidth: 760, margin: "0 auto", padding: "2rem 1rem" },
  loginCard: { background: "#fff", borderRadius: 16, border: "1px solid #e8e8e8", padding: "2.5rem", maxWidth: 420, margin: "2rem auto", textAlign: "center" },
  loginTitle: { fontSize: 20, fontWeight: 700, color: "#111", marginBottom: 8 },
  loginSub: { fontSize: 13, color: "#888", marginBottom: 24 },
  loginForm: { display: "flex", flexDirection: "column", gap: 12 },
  loginBtn: { background: "#0A1628", color: "#fff", border: "none", borderRadius: 8, padding: "11px", fontSize: 14, fontWeight: 600, cursor: "pointer" },
  notice: { background: "#E6F1FB", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#185FA5", marginBottom: 20 },
  fieldCard: { background: "#fff", borderRadius: 12, border: "1px solid #e8e8e8", padding: "1.25rem", marginBottom: 12 },
  fieldTitle: { fontSize: 14, fontWeight: 600, color: "#111", marginBottom: 12 },
  fieldRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  fieldItem: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 11, color: "#888", fontWeight: 500 },
  input: { padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 13, color: "#111", outline: "none", fontFamily: "inherit", width: "100%" },
  saveRow: { display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12, marginTop: 8 },
  saveBtn: { background: "#1D9E75", color: "#fff", border: "none", borderRadius: 10, padding: "12px 28px", fontSize: 14, fontWeight: 600, cursor: "pointer" },
  saveBtnDisabled: { background: "#aaa", cursor: "not-allowed" },
  errorText: { fontSize: 13, color: "#E24B4A" },
  envBox: { background: "#fff", borderRadius: 12, border: "1px solid #e8e8e8", padding: "1.5rem", marginTop: 20 },
  envTitle: { fontSize: 14, fontWeight: 600, color: "#1D9E75", marginBottom: 12 },
  envSteps: { fontSize: 13, color: "#444", lineHeight: 2, paddingLeft: 20, marginBottom: 16 },
  envTextarea: { width: "100%", height: 120, padding: "10px", borderRadius: 8, border: "1px solid #ddd", fontSize: 11, fontFamily: "monospace", color: "#333", resize: "none", background: "#f8f9fa" },
  envHint: { fontSize: 12, color: "#888", marginTop: 8 }
}
