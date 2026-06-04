// pages/api/keynumbers.js
import { DEFAULT_KEY_NUMBERS, ADMIN_PASSWORD } from "../../lib/keyNumbers"

function getKeyNumbers() {
  try {
    const raw = process.env.KEY_NUMBERS_JSON
    if (raw) return JSON.parse(raw)
  } catch {}
  return DEFAULT_KEY_NUMBERS
}

export default function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json(getKeyNumbers())
  }

  if (req.method === "POST") {
    const { password, keyNumbers } = req.body
    if (password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: "비밀번호가 올바르지 않습니다." })
    }
    // 환경변수 업데이트 안내 반환
    return res.status(200).json({
      ok: true,
      envValue: JSON.stringify(keyNumbers)
    })
  }

  res.status(405).end()
}
