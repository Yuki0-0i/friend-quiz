import { questions, simpleIndex } from '../data/questions.js'
import { keys, simpleKeys } from '../data/keys.js'

const LET = ['A', 'B', 'C', 'D']
const ORDER = ['张萌', '马天宇', '厉娜', '许飞', '文吉儿', '王子璇', '白小纯', '青稚']

function credit(group, userAns, keyAns) {
  if (userAns === keyAns) return 1
  const a = LET.indexOf(userAns)
  const b = LET.indexOf(keyAns)
  return group.some((g) => g.includes(a) && g.includes(b)) ? 0.5 : 0
}

export function rankGuests(answers, simple = false) {
  const idx = simple ? simpleIndex : questions.map((_, i) => i)
  const ks = simple ? simpleKeys : keys
  const n = idx.length
  const rows = ORDER.map((name) => {
    let raw = 0
    let diff = 0
    idx.forEach((qi, i) => {
      raw += credit(questions[qi].groups, answers[i], ks[name][i])
      if (answers[i] !== ks[name][i]) diff++
    })
    return {
      id: name,
      name,
      percent: Math.round((raw / n) * 100),
      diff,
      exact: diff === 0,
    }
  })
  rows.sort((a, b) => b.percent - a.percent || a.diff - b.diff || ORDER.indexOf(a.name) - ORDER.indexOf(b.name))
  return rows
}

export function matchResult(answers, simple = false) {
  const ranked = rankGuests(answers, simple)
  const top = ranked[0]
  return {
    top,
    ranked,
    badge: top.exact ? `满匹配 · ${simple ? 5 : 10} 题全中` : null,
    lowConfidence: top.percent < 45,
  }
}
