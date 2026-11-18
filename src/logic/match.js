import { questions } from '../data/questions.js'
import { results } from '../data/results.js'

// 8 人并列时的固定顺序（确定性、可复现）
const ORDER = ['zhangmeng', 'matianyu', 'lina', 'xufei', 'wenjier', 'wangzixuan', 'baixiaochun', 'qingzhi']

// 计分：每个选项 type 记 1.0 分，sub 记 0.5 分
export function scoreAnswers(answers) {
  const s = { 1: 0, 2: 0, 3: 0, 4: 0 }
  answers.forEach(({ type, sub }) => {
    if (s[type] !== undefined) s[type] += 1
    if (s[sub] !== undefined && sub !== type) s[sub] += 0.5
  })
  return s
}

function byId(id) {
  return results.find((g) => g.id === id)
}

// 并列（cosine 相同到 3 位小数）时：先比该人主类型的用户原始分，再按固定顺序
function tieBreak(a, b, s) {
  const pa = byId(a.id)
  const pb = byId(b.id)
  const da = s[pa.typeCode] ?? 0
  const db = s[pb.typeCode] ?? 0
  if (da !== db) return db - da
  return ORDER.indexOf(a.id) - ORDER.indexOf(b.id)
}

// 8 位嘉宾余弦相似度计分
export function rankGuests(answersOrScores) {
  const s = Array.isArray(answersOrScores) ? scoreAnswers(answersOrScores) : answersOrScores
  const u = [s[1], s[2], s[3], s[4]]
  const nu = Math.hypot(...u) || 1

  const raw = results.map((g) => {
    const p = g.profile
    const dot = u.reduce((a, v, i) => a + v * p[i], 0)
    const np = Math.hypot(...p)
    return { id: g.id, name: g.name, color: g.color, cos: dot / (nu * np) }
  })

  const maxCos = Math.max(...raw.map((r) => r.cos), 1e-6)
  return raw
    .map((r) => ({ ...r, percent: Math.round((r.cos / maxCos) * 100) }))
    .sort((a, b) => {
      // 取 cos 到 3 位小数比较
      const ac = Math.round(a.cos * 1000)
      const bc = Math.round(b.cos * 1000)
      if (bc !== ac) return bc - ac
      return tieBreak(a, b, s)
    })
}

export function matchResult(answers) {
  const ranked = rankGuests(answers)
  return {
    result: byId(ranked[0].id),
    scores: scoreAnswers(answers),
    ranked,
    note: null,
  }
}

export { questions, results }
