<template>
  <div class="app">
    <!-- 右上角动态气泡 -->
    <transition name="bubble">
      <div v-if="bubbleVisible" class="bubble">
        <span class="bubble-emoji">💬</span>
        <div class="bubble-text">
          <div class="bubble-main">已有 1000+ 人做完测试</div>
          <div class="bubble-sub">快来测测你最像谁～</div>
        </div>
      </div>
    </transition>

    <!-- 嘉宾语录弹幕（循环飘过） -->
    <div class="danmaku-layer">
      <transition-group name="danmaku">
      <div
        v-for="d in danmakuList"
        :key="d.key"
        class="danmaku"
        :style="{ '--dcolor': d.color, animationDuration: d.duration, top: d.top }"
      >
        <span class="danmaku-name">{{ d.name }}：</span>{{ d.quote }}
      </div>
      </transition-group>
    </div>

    <!-- 测前须知 -->
    <section v-if="stage === 'intro'" class="page intro-page">
      <div class="card intro-card">
        <div class="logo-badge">
          <span class="logo-emoji">🎬</span>
        </div>
        <h1 class="title">{{ intro.title }}</h1>
        <p class="subtitle">{{ intro.subtitle }}</p>
        <div class="tips">
          <p v-for="(t, i) in intro.tips" :key="i" class="tip">
            <span class="tip-num">{{ i + 1 }}</span>{{ t }}
          </p>
        </div>
        <button class="btn-start" @click="startTest">{{ intro.startBtn }}</button>
        <p class="footnote">本测试仅用于娱乐互动，不构成任何心理诊断</p>
      </div>
    </section>

    <!-- 答题 -->
    <section v-else-if="stage === 'quiz'" class="page quiz-page">
      <div class="quiz-progress">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
        <span class="progress-text">{{ currentIndex + 1 }} / {{ questions.length }}</span>
      </div>

      <transition name="slide" mode="out-in">
        <div class="card quiz-card" :key="currentIndex">
          <div class="q-head">
            <span class="q-badge">{{ currentIndex + 1 }}</span>
            <h2 class="q-title">{{ currentQuestion.q }}</h2>
          </div>
          <div class="options">
            <button
              v-for="opt in currentQuestion.options"
              :key="opt.label"
              class="option"
              @click="selectAnswer(opt)"
            >
              <span class="opt-label">{{ opt.label }}</span>
              <span class="opt-text">{{ opt.text }}</span>
            </button>
          </div>
        </div>
      </transition>

      <div class="quiz-nav">
        <button v-if="currentIndex > 0" class="btn-prev" @click="prevQuestion">← 上一题</button>
        <span v-else></span>
        <span class="answered-dot" v-if="answers[currentIndex]">已选择</span>
      </div>
    </section>

    <!-- 匹配中 -->
    <section v-else-if="stage === 'matching'" class="page matching-page">
      <div class="card matching-card">
        <div class="matching-loader">
          <span class="dot d1"></span>
          <span class="dot d2"></span>
          <span class="dot d3"></span>
        </div>
        <h2 class="matching-title">正在匹配你的答案…</h2>
        <p class="matching-sub">正在从 8 位嘉宾中寻找和你最像的那一位</p>
      </div>
    </section>

    <!-- 结果 -->
    <section v-else class="page result-page">
      <div class="result-wrap">
        <!-- 答题回顾（可折叠） -->
        <div class="card review-card">
          <button class="review-toggle" @click="reviewOpen = !reviewOpen">
            <span>{{ reviewOpen ? '收起' : '展开' }}我的答题回顾</span>
            <span class="review-arrow" :class="{ open: reviewOpen }">▼</span>
          </button>
          <div v-show="reviewOpen" class="review-body">
            <div v-for="(q, i) in questions" :key="i" class="review-item">
              <span class="review-num">{{ i + 1 }}</span>
              <div class="review-content">
                <div class="review-q">{{ q.q }}</div>
                <div class="review-a" :class="'pick-' + answers[i]">
                  <span class="review-label">{{ q.options[answers[i] - 1].label }}</span>
                  {{ q.options[answers[i] - 1].text }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card result-card" :style="{ '--accent': accentColor }">
          <div class="result-tag">{{ result.tag }}</div>
          <div class="result-name">{{ result.name }}</div>
          <div class="result-score">
            <span class="score-num">{{ topScore.percent }}</span>
            <span class="score-unit">% 相似</span>
          </div>
          <p class="result-summary">{{ result.summary }}</p>
          <div class="result-meta">
            <span class="meta-chip">{{ result.typeLabel }}</span>
            <span class="meta-chip">{{ result.attachment }}</span>
          </div>
        </div>

        <!-- 8 位嘉宾相似度排行榜 -->
        <div class="card rank-card">
          <h3 class="card-title"><span class="tick"></span>8 位嘉宾相似度排行</h3>
          <div class="rank-list">
            <div
              v-for="(g, i) in guestRank"
              :key="g.id"
              class="rank-item"
              :class="{ top: i === 0 }"
            >
              <span class="rank-no">{{ i + 1 }}</span>
              <span class="rank-name" :style="{ color: g.color }">{{ g.name }}</span>
              <div class="rank-bar">
                <div
                  class="rank-fill"
                  :style="{ width: g.percent + '%', background: g.color }"
                ></div>
              </div>
              <span class="rank-percent">{{ g.percent }}%</span>
            </div>
          </div>
        </div>

        <div class="card analysis-card">
          <h3 class="card-title"><span class="tick"></span>行为线索</h3>
          <p class="analysis-text">{{ result.behavior }}</p>

          <h3 class="card-title"><span class="tick"></span>性格底色</h3>
          <p class="analysis-text">{{ result.trait }}</p>

          <h3 class="card-title"><span class="tick"></span>心理学视角</h3>
          <ul class="notes">
            <li v-for="(n, i) in result.notes" :key="i" class="note">{{ n }}</li>
          </ul>
        </div>

        <!-- 追逃配对提示 -->
        <div v-if="pairNote" class="card pair-card">
          <h3 class="card-title"><span class="tick"></span>{{ pairNote.title }}</h3>
          <p class="analysis-text">{{ pairNote.desc }}</p>
        </div>

        <!-- 心理学共性规律 -->
        <div class="card insights-card">
          <h3 class="card-title"><span class="tick"></span>心理学层面的共性规律</h3>
          <div v-for="(ins, i) in psychologyInsights" :key="i" class="insight">
            <div class="ins-title">{{ ins.title }}</div>
            <p class="ins-text">{{ ins.text }}</p>
          </div>
        </div>

        <!-- 参考文献 -->
        <div class="card ref-card">
          <h3 class="card-title"><span class="tick"></span>参考文献</h3>
          <ol class="ref-list">
            <li v-for="(r, i) in references" :key="i">{{ r }}</li>
          </ol>
        </div>

        <div class="result-actions">
          <button class="btn-restart" @click="restart">再测一次</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { intro, questions } from './data/questions.js'
import { matchResult, rankGuests } from './logic/match.js'
import {
  results,
  psychologyInsights,
  references,
  pairNotes,
} from './data/results.js'

const stage = ref('intro')

// 右上角气泡：循环「出现 → 停留 → 消失 → 等待」。
const bubbleVisible = ref(true)
let bubbleTimer = null
function bubbleLoop() {
  bubbleVisible.value = true
  bubbleTimer = setTimeout(() => {
    bubbleVisible.value = false
    bubbleTimer = setTimeout(bubbleLoop, 5000)
  }, 4200)
}

onMounted(() => {
  bubbleLoop()
  startDanmaku()
})
onBeforeUnmount(() => {
  clearTimeout(bubbleTimer)
  clearTimeout(matchTimer)
  clearTimeout(danmakuTimer)
})

let matchTimer = null
const currentIndex = ref(0)
const answers = ref([])
const reviewOpen = ref(false)

const currentQuestion = computed(() => questions[currentIndex.value])
const progress = computed(() => ((currentIndex.value) / questions.length) * 100)

// ------- 嘉宾语录弹幕（循环飘过） -------
const danmakuList = ref([])
let danmakuTimer = null
let danmakuSeq = 0

function startDanmaku() {
  const pool = results.map((g) => ({ name: g.name, color: g.color, quote: g.quote }))
  let idx = 0
  function spawnOne() {
    const item = pool[idx % pool.length]
    const duration = (12 + Math.random() * 6).toFixed(1) + 's'
    const key = 'dm-' + danmakuSeq++
    // 在页面 15%~70% 高度随机分布，避免多条重叠
    const top = (15 + Math.random() * 55).toFixed(1) + '%'
    const el = { key, name: item.name, color: item.color, quote: item.quote, duration, top, life: 18000 }
    danmakuList.value.push(el)
    // 飘完自动移除
    setTimeout(() => {
      danmakuList.value = danmakuList.value.filter((d) => d.key !== key)
    }, 18000)
    idx++
    // 间隔 2.6~4s 再飘一条
    danmakuTimer = setTimeout(spawnOne, 2600 + Math.random() * 1400)
  }
  spawnOne()
}

function startTest() {
  stage.value = 'quiz'
  currentIndex.value = 0
  answers.value = []
}

function selectAnswer(opt) {
  answers.value[currentIndex.value] = opt.type
  if (currentIndex.value < questions.length - 1) {
    currentIndex.value++
  } else {
    stage.value = 'matching'
    matchTimer = setTimeout(showResult, 1400)
  }
}

function prevQuestion() {
  if (currentIndex.value > 0) currentIndex.value--
}

function showResult() {
  stage.value = 'result'
}

const match = computed(() => matchResult(answers.value))
const result = computed(() => match.value.result)
const guestRank = computed(() => rankGuests(answers.value))
const topScore = computed(() => guestRank.value[0] || { name: '', percent: 0 })

const accentColor = computed(() => {
  const colors = ['#ff7a9e', '#5da9ff', '#7bd0c1', '#ae85ca']
  const idx = (match.value.primary - 1) % colors.length
  return colors[idx]
})

const pairNote = computed(() => {
  const r = result.value
  if (r.id === 'lina') return pairNotes.lina_xufei
  if (r.id === 'wenjier') return pairNotes.wenjier_wangzixuan
  return null
})

function restart() {
  clearTimeout(matchTimer)
  stage.value = 'intro'
  currentIndex.value = 0
  answers.value = []
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  font-family: 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
  background:
    radial-gradient(1000px 600px at 15% -10%, rgba(255, 122, 158, 0.12), transparent 60%),
    radial-gradient(900px 500px at 90% 5%, rgba(93, 169, 255, 0.12), transparent 55%),
    linear-gradient(180deg, #fdf6f8 0%, #f6f8fd 100%);
  color: #383838;
  padding: 32px 20px 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.page {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 760px;
}

.card {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 6px 30px rgba(60, 60, 90, 0.08);
  padding: 32px;
  margin-bottom: 20px;
}

/* ---------- Intro ---------- */
.intro-page {
  margin-top: 6vh;
}
.intro-card {
  text-align: center;
  padding: 40px 34px;
}
.logo-badge {
  width: 72px;
  height: 72px;
  margin: 0 auto 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 34px;
  background: linear-gradient(135deg, #ff7a9e, #ffb57e);
  box-shadow: 0 8px 24px rgba(255, 122, 158, 0.3);
}
.title {
  font-size: 30px;
  font-weight: 800;
  margin: 0 0 6px;
  letter-spacing: 0.02em;
  background: linear-gradient(135deg, #e85d8a, #b06ce0);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.subtitle {
  color: #8a8aa0;
  font-size: 15px;
  margin: 0 0 24px;
}
.tips {
  text-align: left;
  background: #faf7ff;
  border-radius: 14px;
  padding: 18px 22px;
  margin-bottom: 26px;
}
.tip {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin: 0 0 12px;
  font-size: 14px;
  color: #555;
  line-height: 1.6;
}
.tip:last-child { margin-bottom: 0; }
.tip-num {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff7a9e, #ffb57e);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 1px;
}
.btn-start {
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 999px;
  font-size: 17px;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  background: linear-gradient(135deg, #ff7a9e, #b06ce0);
  box-shadow: 0 6px 20px rgba(255, 122, 158, 0.35);
  transition: transform 0.2s, box-shadow 0.2s;
}
.btn-start:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 26px rgba(255, 122, 158, 0.45);
}
.footnote {
  margin: 16px 0 0;
  font-size: 12px;
  color: #b0b0c0;
}

/* ---------- Quiz ---------- */
.quiz-page {
  margin-top: 3vh;
}
.quiz-progress {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}
.progress-bar {
  flex: 1;
  height: 8px;
  border-radius: 999px;
  background: #e9e9f2;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #ff7a9e, #b06ce0);
  transition: width 0.3s;
}
.progress-text {
  font-size: 13px;
  color: #8a8aa0;
  font-weight: 600;
}
.quiz-card {
  min-height: 320px;
}
.q-head {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  margin-bottom: 22px;
}
.q-badge {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 15px;
  color: #fff;
  background: linear-gradient(135deg, #ff7a9e, #b06ce0);
}
.q-title {
  margin: 2px 0 0;
  font-size: 18px;
  line-height: 1.6;
  font-weight: 700;
}
.options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.option {
  display: flex;
  align-items: center;
  gap: 14px;
  text-align: left;
  padding: 14px 18px;
  border-radius: 14px;
  border: 1.5px solid #eceaf2;
  background: #fbfaff;
  cursor: pointer;
  font-size: 14.5px;
  color: #444;
  line-height: 1.55;
  transition: all 0.18s;
}
@media (hover: hover) {
  .option:hover {
    border-color: #ff7a9e;
    background: #fff5f8;
    transform: translateX(3px);
  }
  .option:hover .opt-label {
    background: #ff7a9e;
    border-color: #ff7a9e;
    color: #fff;
  }
}
.option:active {
  transform: scale(0.99);
}
.opt-label {
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1.5px solid #ffb7c9;
  color: #e85d8a;
  font-weight: 800;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.18s;
}
.quiz-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
}
.btn-prev {
  border: none;
  background: transparent;
  color: #8a8aa0;
  font-size: 14px;
  cursor: pointer;
  padding: 8px 12px;
}
.btn-prev:hover {
  color: #e85d8a;
}
.answered-dot {
  font-size: 12px;
  color: #8a8aa0;
  background: #eef0ff;
  padding: 4px 12px;
  border-radius: 999px;
}

/* ---------- Result ---------- */
.result-wrap {
  margin-top: 2vh;
}
.result-card {
  text-align: center;
  background: linear-gradient(160deg, #fff, var(--accent) 120%);
  border: 1px solid rgba(255, 122, 158, 0.15);
  padding: 40px 34px 34px;
}
.result-tag {
  display: inline-block;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #fff;
  background: linear-gradient(135deg, #ff7a9e, #b06ce0);
  padding: 6px 18px;
  border-radius: 999px;
  margin-bottom: 14px;
}
.result-name {
  font-size: 34px;
  font-weight: 800;
  letter-spacing: 0.04em;
  margin-bottom: 6px;
}
.result-summary {
  color: #555;
  font-size: 15px;
  line-height: 1.9;
  max-width: 560px;
  margin: 0 auto 18px;
}
.result-meta {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}
.meta-chip {
  font-size: 12px;
  color: #7a7a90;
  background: #f3f3fb;
  border: 1px solid #e6e6f0;
  padding: 5px 12px;
  border-radius: 999px;
}
.analysis-card,
.pair-card,
.overview-card,
.insights-card,
.ref-card {
  padding: 26px 30px;
}
.card-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 17px;
  font-weight: 800;
  margin: 22px 0 12px;
}
.card-title:first-child {
  margin-top: 0;
}
.tick {
  width: 10px;
  height: 20px;
  border-radius: 3px;
  background: linear-gradient(180deg, #ff7a9e, #b06ce0);
  display: inline-block;
}
.analysis-text {
  color: #555;
  font-size: 14.5px;
  line-height: 1.85;
  margin: 0 0 10px;
}
.notes {
  list-style: none;
  margin: 0;
  padding: 0;
}
.note {
  position: relative;
  padding: 7px 0 7px 18px;
  color: #555;
  font-size: 14px;
  line-height: 1.7;
  border-bottom: 1px dashed #eee;
}
.note:last-child { border-bottom: none; }
.note::before {
  content: '';
  position: absolute;
  left: 2px;
  top: 16px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ff7a9e;
}
.overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}
.overview-item {
  background: #faf7ff;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 14px 16px;
}
.ov-name {
  font-weight: 800;
  font-size: 15px;
  color: #e85d8a;
  margin-bottom: 4px;
}
.ov-type {
  font-size: 12.5px;
  color: #666;
  margin-bottom: 3px;
}
.ov-style {
  font-size: 12px;
  color: #8a8aa0;
}
.insight {
  margin-bottom: 16px;
  padding: 14px 16px;
  background: #faf7ff;
  border-left: 3px solid #ff7a9e;
  border-radius: 8px;
}
.ins-title {
  font-weight: 700;
  font-size: 14px;
  color: #c94f78;
  margin-bottom: 4px;
}
.ins-text {
  color: #555;
  font-size: 13.5px;
  line-height: 1.7;
  margin: 0;
}
.ref-list {
  margin: 0;
  padding-left: 20px;
  color: #666;
  font-size: 13px;
  line-height: 1.8;
}
.result-actions {
  text-align: center;
  margin-top: 8px;
}
.btn-restart {
  padding: 13px 36px;
  border: none;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  background: linear-gradient(135deg, #ff7a9e, #b06ce0);
  box-shadow: 0 6px 18px rgba(255, 122, 158, 0.3);
  transition: transform 0.2s;
}
.btn-restart:hover {
  transform: translateY(-2px);
}

/* transition */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.25s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateX(24px);
}

@media (max-width: 560px) {
  .app { padding: 20px 14px 48px; }
  .card { padding: 24px 20px; }
  .title { font-size: 24px; }
  .bubble {
    top: 12px;
    right: 12px;
    padding: 9px 14px;
  }
  .bubble-main { font-size: 13px; }
  .bubble-sub { display: none; }
  .bubble-emoji { font-size: 18px; }
  .danmaku {
    font-size: 12.5px;
    padding: 5px 11px;
    border-width: 1px;
  }
}

/* ---------- 答题回顾 ---------- */
.review-card {
  padding: 0;
  overflow: hidden;
}
.review-toggle {
  width: 100%;
  padding: 14px 22px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14.5px;
  font-weight: 700;
  color: #383838;
}
.review-toggle:hover {
  background: #faf7ff;
}
.review-arrow {
  font-size: 11px;
  color: #8a8aa0;
  transition: transform 0.25s;
}
.review-arrow.open {
  transform: rotate(180deg);
  color: #e85d8a;
}
.review-body {
  border-top: 1px dashed #eee;
  padding: 8px 22px 18px;
}
.review-item {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px dashed #f0f0f6;
}
.review-item:last-child {
  border-bottom: none;
}
.review-num {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  background: #f3ecff;
  color: #b06ce0;
  font-weight: 800;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.review-content {
  flex: 1;
}
.review-q {
  font-size: 13.5px;
  color: #444;
  font-weight: 600;
  margin-bottom: 5px;
}
.review-a {
  font-size: 13px;
  color: #6a6a80;
  line-height: 1.6;
}
.review-label {
  display: inline-block;
  font-weight: 800;
  color: #e85d8a;
  margin-right: 6px;
}

/* ---------- 匹配中 ---------- */
.matching-page {
  margin-top: 14vh;
}
.matching-card {
  text-align: center;
  padding: 60px 34px;
}
.matching-loader {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 22px;
}
.dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #ff7a9e;
  animation: bounce 1s infinite ease-in-out;
}
.dot.d2 { background: #b06ce0; animation-delay: 0.15s; }
.dot.d3 { background: #5da9ff; animation-delay: 0.3s; }
@keyframes bounce {
  0%, 100% { transform: translateY(0); opacity: 0.6; }
  50% { transform: translateY(-10px); opacity: 1; }
}
.matching-title {
  font-size: 20px;
  font-weight: 800;
  color: #383838;
  margin: 0 0 6px;
}
.matching-sub {
  font-size: 14px;
  color: #8a8aa0;
  margin: 0;
}

/* ---------- 嘉宾语录弹幕 ---------- */
.danmaku-layer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}
.danmaku {
  position: absolute;
  left: 0;
  transform: translateX(-110%);
  white-space: nowrap;
  font-size: 15px;
  font-weight: 600;
  color: var(--dcolor, #e85d8a);
  background: rgba(255, 255, 255, 0.75);
  border: 1.5px solid var(--dcolor, #e85d8a);
  padding: 7px 16px;
  border-radius: 999px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
  opacity: 0.72;
  animation: danmaku-move linear forwards;
}
.danmaku-name {
  font-weight: 800;
}
@keyframes danmaku-move {
  from { transform: translateX(-110%); }
  to { transform: translateX(calc(100vw + 60px)); }
}
.danmaku-enter-active,
.danmaku-leave-active {
  transition: all 0.3s ease;
}
.danmaku-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

/* ---------- 结果页：相似度分数 + 排行 ---------- */
.result-score {
  margin: 10px auto 12px;
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 6px;
}
.score-num {
  font-size: 46px;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(135deg, var(--accent), #b06ce0);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.score-unit {
  font-size: 15px;
  font-weight: 700;
  color: #8a8aa0;
}
.rank-card {
  padding: 24px 28px;
}
.rank-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.rank-item {
  display: flex;
  align-items: center;
  gap: 12px;
}
.rank-item.top .rank-name {
  font-weight: 900;
  transform: scale(1.08);
}
.rank-no {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 8px;
  background: #f3f0f8;
  color: #8a8aa0;
  font-weight: 700;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.rank-item.top .rank-no {
  background: linear-gradient(135deg, #ff7a9e, #b06ce0);
  color: #fff;
}
.rank-name {
  flex-shrink: 0;
  width: 64px;
  font-size: 14px;
  font-weight: 700;
}
.rank-bar {
  flex: 1;
  height: 12px;
  border-radius: 999px;
  background: #f0eef4;
  overflow: hidden;
}
.rank-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.5s ease;
}
.rank-percent {
  flex-shrink: 0;
  width: 44px;
  text-align: right;
  font-size: 13px;
  font-weight: 700;
  color: #666;
}

/* ---------- 右上角气泡 ---------- */
.bubble {
  position: fixed;
  top: 18px;
  right: 18px;
  z-index: 90;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  border-radius: 999px;
  background: #fff;
  box-shadow: 0 8px 28px rgba(232, 93, 138, 0.28);
  border: 1.5px solid #ffd7e1;
  cursor: default;
}
.bubble-emoji {
  font-size: 22px;
}
.bubble-main {
  font-size: 14px;
  font-weight: 800;
  color: #e85d8a;
  line-height: 1.3;
}
.bubble-sub {
  font-size: 12px;
  color: #8a8aa0;
  line-height: 1.3;
}
.bubble-enter-active,
.bubble-leave-active {
  transition: all 0.4s ease;
}
.bubble-enter-from,
.bubble-leave-to {
  opacity: 0;
  transform: translateY(-12px) scale(0.9);
}
</style>
