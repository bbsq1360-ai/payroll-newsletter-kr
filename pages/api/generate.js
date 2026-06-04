// pages/api/generate.js
import { generateNewsletter } from "../../lib/generateNewsletter"
import { DEFAULT_KEY_NUMBERS } from "../../lib/keyNumbers"
import fs from "fs"
import path from "path"

const DATA_FILE = path.join(process.cwd(), "data", "keyNumbers.json")
const ISSUE_FILE = path.join(process.cwd(), "data", "issueNumber.json")

function getKeyNumbers() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"))
    }
  } catch {}
  return DEFAULT_KEY_NUMBERS
}

function getIssueNumber() {
  try {
    if (fs.existsSync(ISSUE_FILE)) {
      const data = JSON.parse(fs.readFileSync(ISSUE_FILE, "utf8"))
      return data.current || 4
    }
  } catch {}
  return 4
}

function incrementIssueNumber(current) {
  const dir = path.join(process.cwd(), "data")
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(ISSUE_FILE, JSON.stringify({ current: current + 1 }))
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()

  try {
    const keyNumbers = getKeyNumbers()
    const currentIssue = getIssueNumber()
    const nextIssue = currentIssue + 1

    const now = new Date()
    const dateStr = now.toLocaleDateString("ko-KR", {
      year: "numeric", month: "long", day: "numeric", weekday: "long"
    })

    const html = await generateNewsletter(keyNumbers, nextIssue, dateStr)

    incrementIssueNumber(currentIssue)

    res.status(200).json({ html, issueNumber: nextIssue, dateStr })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}
