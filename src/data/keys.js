// 《后会友期》8 位嘉宾标准答案矩阵（v2 钥匙算法）
// 10 题标准答案，按 questions.js 顺序对应

import { simpleIndex } from './questions.js'

export const keys = {
  张萌: 'CABCABDCBC',
  马天宇: 'CBBBBDCCAD',
  厉娜: 'DCCDACDDCB',
  许飞: 'ADDBDBABDA',
  文吉儿: 'BBACCABACA',
  王子璇: 'BAAACDBAAD',
  白小纯: 'ACCADCABBB',
  青稚: 'DDDDBACDDC',
}

// 简版 key：取 Q1 Q2 Q4 Q5 Q6
export const simpleKeys = Object.fromEntries(
  Object.entries(keys).map(([n, k]) => [n, simpleIndex.map((i) => k[i]).join('')])
)
