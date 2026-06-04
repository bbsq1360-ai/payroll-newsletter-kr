// lib/keyNumbers.js
// KEY NUMBERS 기본값 — 관리자 페이지에서 수정 가능

export const DEFAULT_KEY_NUMBERS = {
  minWage: {
    label: "최저시급 (2026)",
    value: "10,320원",
    sub: "↑ +2.9% · 월 2,156,880원"
  },
  pensionRate: {
    label: "국민연금 요율",
    value: "9.5%",
    sub: "↑ from 9.0% · 2026.01.01 시행"
  },
  healthRate: {
    label: "건강보험 요율",
    value: "7.19%",
    sub: "↑ from 7.09% · 각 3.595%"
  },
  pensionCeilingCurrent: {
    label: "국민연금 기준소득 상한 (현행)",
    value: "637만원",
    sub: "~2026.06.30 적용"
  },
  pensionCeilingNext: {
    label: "국민연금 기준소득 상한 (7월~)",
    value: "659만원",
    sub: "↑ +3.4% · 2026.07.01 시행"
  },
  unemploymentCap: {
    label: "실업급여 상한",
    value: "68,100원",
    sub: "일 기준"
  }
}

export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin1234"
