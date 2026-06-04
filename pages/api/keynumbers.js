// pages/api/keynumbers.js
import { DEFAULT_KEY_NUMBERS, ADMIN_PASSWORD } from "../../lib/keyNumbers"
import fs from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const DATA_FILE = path.join(DATA_DIR, "keyNumbers.json")

function getKeyNumbers() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"))
    }
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

    try {
      if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
      fs.writeFileSync(DATA_FILE, JSON.stringify(keyNumbers, null, 2))
      return res.status(200).json({ ok: true })
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  res.status(405).end()
}
