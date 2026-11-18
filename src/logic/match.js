import { questions } from '../data/questions.js'
import { results, mappingRules } from '../data/results.js'

// 计分：4 大倾向累计分
export function scoreAnswers(answers) {
  const scores = { 1: 0, 2: 0, 3: 0, 4: 0 }
  answers.forEach((type) => {
    if (scores[type] !== undefined) scores[type] += 1
  })
  return scores
}

// 匹配：最高分定大类，次高分细分同大类
export function matchResult(answers) {
  const scores = scoreAnswers(answers)

  // 找出最高分和次高分（含并列处理）
  const sorted = Object.keys(scores).sort((a, b) => scores[b] - scores[a])
  const primary = Number(sorted[0])
  const primaryScore = scores[primary]

  // 次高分：取除 primary 外最高分；若并列，取第一个
  const secondaryCandidates = sorted.filter((t) => Number(t) !== primary)
  const secondary = Number(secondaryCandidates[0])

  // 在 mappingRules 中查找规则
  const rule = mappingRules.find((r) => r.primary === primary && r.secondary === secondary)

  let result
  if (rule) {
    result = results.find((r) => r.id === rule.match.resultId)
  } else {
    // 兜底：直接取该类第一个
    const fallback = results.find((r) => r.typeCode === primary)
    result = fallback || results[0]
  }

  const note = rule ? rule.match.note : null

  return { result, scores, primary, secondary, note }
}

// 8 位嘉宾相似度权重计分：
// 主类型得分全额计入，次类型得分折半计入，归一化成百分比
export function rankGuests(answers) {
  const scores = scoreAnswers(answers)

  const guestScores = results.map((g) => {
    let raw = scores[g.typeCode]
    if (g.secondaryTypes && g.secondaryTypes.length) {
      g.secondaryTypes.forEach((st) => {
        if (st !== g.typeCode) raw += scores[st] * 0.5
      })
    }
    return { id: g.id, name: g.name, color: g.color, raw }
  })

  // 归一化到百分比（相对最高分 = 100% 比例展示）
  const maxRaw = Math.max(...guestScores.map((s) => s.raw), 1)
  const ranked = guestScores
    .map((g) => ({ ...g, percent: Math.round((g.raw / maxRaw) * 100) }))
    .sort((a, b) => b.percent - a.percent)

  return ranked
}

export { questions, results }
