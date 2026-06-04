// pages/api/generate.js
import { generateNewsletter } from "../../lib/generateNewsletter"
import { DEFAULT_KEY_NUMBERS } from "../../lib/keyNumbers"

function getKeyNumbers() {
  try {
    const raw = process.env.KEY_NUMBERS_JSON
    if (raw) return JSON.parse(raw)
  } catch {}
  return DEFAULT_KEY_NUMBERS
}

function getIssueNumber() {
  try {
    const raw = process.env.ISSUE_NUMBER
    if (raw) return parseInt(raw, 10)
  } catch {}
  return 4
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

    res.status(200).json({ html, issueNumber: nextIssue, dateStr })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}
