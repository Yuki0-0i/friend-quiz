// 《后会友期》8 位嘉宾性格测试 · 题目数据（v1118 重写版）
// 每题 4 个选项，每个选项带 type（主倾向，记 1.0 分）+ sub（次倾向，记 0.5 分）
// 选项顺序已打乱，不再 A=类型1 到底；措辞已做赞许性配平

export const intro = {
  title: 'Friendship Encore',
  subtitle: 'Who Are You Most Like?《后会友期｜你最像哪位嘉宾？》',
  tips: [
    '本测试为娱乐心理向，基于《后会友期》8位嘉宾节目里呈现的性格底色设计',
    '不是专业心理测验，不能作为人格/依恋诊断，仅供玩梗、互动',
    '共 10 道题，每题选 A / B / C / D 中最符合你的一项即可',
    '没有正确答案，凭第一直觉作答，测试结果更贴合哦',
  ],
  startBtn: '开始测试',
}

export const questions = [
  {
    q: '和朋友起了冲突、场面正尴尬，你身体先做出的是哪个动作？',
    options: [
      { label: 'A', text: '先离开一下，等情绪降下来再回去谈', type: 2, sub: 1 },
      { label: 'B', text: '立刻去打圆场，别让场面掉到地上', type: 1, sub: 4 },
      { label: 'C', text: '当场把话说开，憋着比吵更难熬', type: 3, sub: 4 },
      { label: 'D', text: '心里一紧，先想是不是自己做错了', type: 4, sub: 1 },
    ],
  },
  {
    q: '一段很好的友情慢慢变味，你默认会怎么做？',
    options: [
      { label: 'A', text: '接受它淡下去，彼此不打扰也算体面', type: 2, sub: 3 },
      { label: 'B', text: '找一次机会问清楚，到底是哪一步错了', type: 3, sub: 2 },
      { label: 'C', text: '想办法拉回来，能修就尽量修', type: 1, sub: 4 },
      { label: 'D', text: '说不出口，只能一个人反复想', type: 4, sub: 3 },
    ],
  },
  {
    q: '朋友连着几天向你倾倒很重的负面情绪，你的真实反应是？',
    options: [
      { label: 'A', text: '帮他捋事实、分清谁对谁错，捋顺了他会好受', type: 3, sub: 4 },
      { label: 'B', text: '先安抚住他，别让事情越滚越大', type: 1, sub: 4 },
      { label: 'C', text: '会跟着沉下去，甚至替他把难受也一起扛了', type: 4, sub: 1 },
      { label: 'D', text: '有压力，会想"我需要一点自己的空间"', type: 2, sub: 1 },
    ],
  },
  {
    q: '有一个和老友有关、多年没解开的心结，你通常怎么处理它？',
    options: [
      { label: 'A', text: '压着不提，提出来怕把现在的平和也弄坏', type: 1, sub: 4 },
      { label: 'B', text: '一定要有个说法，否则这件事在我这儿过不去', type: 3, sub: 4 },
      { label: 'C', text: '不再追究，答案是什么其实已经不重要', type: 2, sub: 3 },
      { label: 'D', text: '会反复回放当时的细节，越想越委屈', type: 4, sub: 2 },
    ],
  },
  {
    q: '争执里被对方指责，你的本能是？',
    options: [
      { label: 'A', text: '先反驳，把事实和我的版本摆清楚', type: 3, sub: 2 },
      { label: 'B', text: '第一反应是自查：是不是我真的伤到他了', type: 4, sub: 1 },
      { label: 'C', text: '不想吵，沉默或直接走开，等风头过去', type: 2, sub: 1 },
      { label: 'D', text: '先稳住对方，别让话赶话升级', type: 1, sub: 4 },
    ],
  },
  {
    q: '你心里对"好朋友"的期待，更接近哪一种？',
    options: [
      { label: 'A', text: '有问题别瞒我，坦诚比客气重要', type: 3, sub: 4 },
      { label: 'B', text: '我希望我是被单独对待、被优先的那个', type: 4, sub: 3 },
      { label: 'C', text: '彼此照应、客气体面，能长久就好', type: 1, sub: 4 },
      { label: 'D', text: '各自独立，不用时时刻刻绑在一起', type: 2, sub: 1 },
    ],
  },
  {
    q: '一段关系持续消耗你，你更可能怎么走？',
    options: [
      { label: 'A', text: '再给一段时间，看看它能不能自己变好', type: 1, sub: 4 },
      { label: 'B', text: '舍不得，明知难受也很难由我说结束', type: 4, sub: 1 },
      { label: 'C', text: '冷静评估，不合适就体面收尾', type: 2, sub: 3 },
      { label: 'D', text: '先摊开谈一次，对方不坦诚我才放手', type: 3, sub: 2 },
    ],
  },
  {
    q: '一群人聚会时，你最常处在的位置是？',
    options: [
      { label: 'A', text: '跟在大家的节奏里，很少主动说不同的意见', type: 4, sub: 1 },
      { label: 'B', text: '安静看着，不抢话，也不太想被点到', type: 2, sub: 1 },
      { label: 'C', text: '有想法就直说，绕弯子的话我说不出口', type: 3, sub: 2 },
      { label: 'D', text: '留意谁被冷落，把场子接住', type: 1, sub: 4 },
    ],
  },
  {
    q: '朋友之间掺进了利益和误会，你的处理原则是？',
    options: [
      { label: 'A', text: '人情放前面，能不伤和气就不伤', type: 1, sub: 4 },
      { label: 'B', text: '规则讲清楚，账说明白反而更长久', type: 2, sub: 3 },
      { label: 'C', text: '最介意隐瞒，有事提前讲比事后解释强', type: 3, sub: 2 },
      { label: 'D', text: '会难过——"好朋友不该变成这样"', type: 4, sub: 3 },
    ],
  },
  {
    q: '下面哪件事最容易让你长期内耗？',
    options: [
      { label: 'A', text: '怕自己没做好，让身边的人难受', type: 4, sub: 1 },
      { label: 'B', text: '被卷进浓烈、拉扯不清的情绪里', type: 2, sub: 1 },
      { label: 'C', text: '事情糊里糊涂翻篇，没有一个是非', type: 3, sub: 2 },
      { label: 'D', text: '感觉自己不够重要，被排在了后面', type: 4, sub: 3 },
    ],
  },
]
