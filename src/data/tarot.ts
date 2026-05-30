import type { Locale, ReadingMode, SpreadDefinition, TarotCard } from '../types';

export const locales: Array<{ id: Locale; label: string; short: string }> = [
  { id: 'zh-TW', label: '繁體中文', short: '繁' },
  { id: 'en', label: 'English', short: 'EN' },
  { id: 'ja', label: '日本語', short: '日' },
];

export const ui = {
  appName: {
    'zh-TW': 'Arcana Kin',
    en: 'Arcana Kin',
    ja: 'Arcana Kin',
  },
  subtitle: {
    'zh-TW': '多語系 3D 塔羅閱讀桌',
    en: 'Multilingual 3D Tarot Table',
    ja: '多言語 3D タロットテーブル',
  },
  language: {
    'zh-TW': '語言',
    en: 'Language',
    ja: '言語',
  },
  spread: {
    'zh-TW': '牌陣',
    en: 'Spread',
    ja: 'スプレッド',
  },
  lens: {
    'zh-TW': '閱讀視角',
    en: 'Reading Lens',
    ja: 'リーディング視点',
  },
  intention: {
    'zh-TW': '提問',
    en: 'Intention',
    ja: '問い',
  },
  intentionPlaceholder: {
    'zh-TW': '輸入你想照亮的主題',
    en: 'Name the theme you want to illuminate',
    ja: '照らしたいテーマを入力',
  },
  draw: {
    'zh-TW': '開始洗牌',
    en: 'Start Shuffle',
    ja: 'シャッフル開始',
  },
  recast: {
    'zh-TW': '重新洗牌',
    en: 'Recast',
    ja: '引き直す',
  },
  reset: {
    'zh-TW': '收回牌桌',
    en: 'Clear Table',
    ja: 'テーブルを戻す',
  },
  reading: {
    'zh-TW': '解讀',
    en: 'Reading',
    ja: '読み解き',
  },
  deckReady: {
    'zh-TW': '牌堆待命',
    en: 'Deck Ready',
    ja: 'デッキ待機中',
  },
  revealed: {
    'zh-TW': '已翻開',
    en: 'Revealed',
    ja: '公開済み',
  },
  hidden: {
    'zh-TW': '覆牌',
    en: 'Veiled',
    ja: '伏せ札',
  },
  upright: {
    'zh-TW': '正位',
    en: 'Upright',
    ja: '正位置',
  },
  reversed: {
    'zh-TW': '逆位',
    en: 'Reversed',
    ja: '逆位置',
  },
  keywords: {
    'zh-TW': '關鍵詞',
    en: 'Keywords',
    ja: 'キーワード',
  },
  openSource: {
    'zh-TW': '開源',
    en: 'Open Source',
    ja: 'オープンソース',
  },
  slots: {
    'zh-TW': '張',
    en: 'cards',
    ja: '枚',
  },
  emptyReading: {
    'zh-TW': '選擇牌陣後展開牌桌',
    en: 'Choose a spread to cast the table',
    ja: 'スプレッドを選んで展開',
  },
  activePrompt: {
    'zh-TW': '點選覆牌以翻開',
    en: 'Select a veiled card',
    ja: '伏せ札を選択',
  },
  complete: {
    'zh-TW': '牌陣完成',
    en: 'Spread Complete',
    ja: '展開完了',
  },
} as const;

export const beginnerUi = {
  guide: {
    'zh-TW': '新手引導',
    en: 'Beginner Guide',
    ja: '初心者ガイド',
  },
  guideOn: {
    'zh-TW': '開',
    en: 'On',
    ja: 'オン',
  },
  guideOff: {
    'zh-TW': '關',
    en: 'Off',
    ja: 'オフ',
  },
  startHere: {
    'zh-TW': '從這裡開始',
    en: 'Start Here',
    ja: 'ここから',
  },
  templates: {
    'zh-TW': '提問模板',
    en: 'Question Starters',
    ja: '問いの例',
  },
  recommended: {
    'zh-TW': '新手推薦',
    en: 'Beginner Pick',
    ja: '初心者向け',
  },
  defaultQuestion: {
    'zh-TW': '我現在最需要看清的是什麼？',
    en: 'What do I most need to understand right now?',
    ja: '今いちばん理解すべきことは何ですか？',
  },
  plainMeaning: {
    'zh-TW': '一句話',
    en: 'In Plain Words',
    ja: 'ひとことで',
  },
  nextMove: {
    'zh-TW': '下一步',
    en: 'Next Move',
    ja: '次の一手',
  },
  gentleNote: {
    'zh-TW': '把牌當成整理思路的鏡子，不用把它當成絕對預言。',
    en: 'Treat the cards as a mirror for reflection, not as a fixed prediction.',
    ja: 'カードは固定された予言ではなく、考えを映す鏡として扱ってください。',
  },
  revealNext: {
    'zh-TW': '翻開',
    en: 'Reveal',
    ja: '開く',
  },
  drawNext: {
    'zh-TW': '抽這張',
    en: 'Draw This',
    ja: 'このカードを引く',
  },
  drawFromDeck: {
    'zh-TW': '點牌堆抽牌',
    en: 'Click the deck',
    ja: 'デッキをクリック',
  },
  drawHint: {
    'zh-TW': '像開卡包一樣，自己從牌堆抽下一張。',
    en: 'Draw the next card yourself, like opening a card pack.',
    ja: 'カードパックを開くように、次の一枚を自分で引きます。',
  },
  revealHint: {
    'zh-TW': '牌已經到位置上了，點它翻開。',
    en: 'The card has landed. Click it to reveal.',
    ja: 'カードが位置に着きました。クリックして開きます。',
  },
  drawnLabel: {
    'zh-TW': '已抽',
    en: 'Drawn',
    ja: '引いた',
  },
  revealedLabel: {
    'zh-TW': '已讀',
    en: 'Read',
    ja: '読了',
  },
  waitingLabel: {
    'zh-TW': '待翻',
    en: 'Waiting',
    ja: '待機',
  },
  emptyTitle: {
    'zh-TW': '先選一個問題，剩下交給牌桌',
    en: 'Choose a question, then let the table open',
    ja: '問いをひとつ選び、テーブルを開きます',
  },
  emptyBody: {
    'zh-TW': '不確定怎麼問時，直接點一個模板；三張牌會用「來處、所在、去向」幫你整理。',
    en: 'If words are hard, pick a starter. Three cards will sort the theme into origin, presence, and direction.',
    ja: '言葉に迷う時は例を選んでください。三枚のカードが起点、現在、行き先に整理します。',
  },
  completeTitle: {
    'zh-TW': '三個位置都讀完了',
    en: 'The spread is complete',
    ja: 'スプレッドが完成しました',
  },
  completeBody: {
    'zh-TW': '最後看重複出現的關鍵詞，通常那就是這次閱讀最值得帶走的線索。',
    en: 'Now notice repeated keywords; they are usually the clearest thread to carry away.',
    ja: '最後に重なるキーワードを見てください。それが持ち帰るべき糸口です。',
  },
  applyTemplate: {
    'zh-TW': '套用',
    en: 'Use',
    ja: '使う',
  },
} as const;

export const beginnerSteps = [
  {
    id: 'question',
    labels: {
      'zh-TW': '問題',
      en: 'Question',
      ja: '問い',
    },
  },
  {
    id: 'cast',
    labels: {
      'zh-TW': '抽牌',
      en: 'Cast',
      ja: '展開',
    },
  },
  {
    id: 'read',
    labels: {
      'zh-TW': '閱讀',
      en: 'Read',
      ja: '読む',
    },
  },
];

export const questionTemplates = [
  {
    id: 'clarity',
    modeId: 'growth',
    text: {
      'zh-TW': '我現在最需要看清的是什麼？',
      en: 'What do I most need to understand right now?',
      ja: '今いちばん理解すべきことは何ですか？',
    },
  },
  {
    id: 'relationship',
    modeId: 'relationships',
    text: {
      'zh-TW': '這段關係下一步適合怎麼靠近？',
      en: 'What is the healthiest next step in this relationship?',
      ja: 'この関係で次に大切な一歩は何ですか？',
    },
  },
  {
    id: 'work',
    modeId: 'craft',
    text: {
      'zh-TW': '工作或創作現在該聚焦在哪裡？',
      en: 'Where should my work or creative energy focus now?',
      ja: '仕事や創作で今どこに集中すべきですか？',
    },
  },
  {
    id: 'choice',
    modeId: 'decision',
    text: {
      'zh-TW': '做這個決定前，我需要注意什麼？',
      en: 'What should I notice before making this decision?',
      ja: 'この選択の前に何へ注意すべきですか？',
    },
  },
];

export const beginnerActions = {
  upright: {
    'zh-TW': '今天先做一個小而明確的動作，讓這張牌的提醒落到現實。',
    en: 'Take one small, specific action today so this card becomes practical.',
    ja: '今日、小さく具体的な行動をひとつ選び、このカードを現実に移してください。',
  },
  reversed: {
    'zh-TW': '先放慢，不急著定論；把卡住的地方寫成一句可以面對的話。',
    en: 'Slow down before deciding; write the stuck point as one sentence you can face.',
    ja: '急いで決めず、詰まっている点を向き合える一文にしてください。',
  },
};

export const beginnerPositionCopy = {
  origin: {
    'zh-TW': '這張牌在看事情的起點，也可能是你帶進問題裡的舊模式。',
    en: 'This card looks at the starting point, including old patterns you may be bringing in.',
    ja: 'このカードは出発点と、問いに持ち込んでいる古いパターンを見ます。',
  },
  presence: {
    'zh-TW': '這張牌在看當下最活躍的能量，先不用判斷好壞。',
    en: 'This card shows the most active energy right now; do not rush to label it good or bad.',
    ja: 'このカードは今いちばん動いている力を示します。良し悪しを急がないでください。',
  },
  direction: {
    'zh-TW': '這張牌在看下一個方向，不是命令，而是一個可以試走的路標。',
    en: 'This card points to a direction, not an order; treat it as a path marker to test.',
    ja: 'このカードは命令ではなく、試せる道しるべとして次の方向を示します。',
  },
  fire: {
    'zh-TW': '這裡看行動力和想開始的衝動。',
    en: 'This position looks at action, drive, and the urge to begin.',
    ja: 'ここでは行動力と始めたい衝動を見ます。',
  },
  water: {
    'zh-TW': '這裡看情緒、關係和真正被觸動的地方。',
    en: 'This position looks at emotion, connection, and what is being touched.',
    ja: 'ここでは感情、関係性、心が動く場所を見ます。',
  },
  air: {
    'zh-TW': '這裡看想法、語言和需要被說清楚的事。',
    en: 'This position looks at thoughts, words, and what needs clarity.',
    ja: 'ここでは思考、言葉、明確にするべきことを見ます。',
  },
  earth: {
    'zh-TW': '這裡看資源、身體和能落地的安排。',
    en: 'This position looks at resources, the body, and grounded plans.',
    ja: 'ここでは資源、身体、現実的な計画を見ます。',
  },
  core: {
    'zh-TW': '這裡看整件事最核心的訊號。',
    en: 'This position shows the central signal of the whole reading.',
    ja: 'ここでは全体の中心となるサインを見ます。',
  },
  resistance: {
    'zh-TW': '這裡看阻力，也看你不想承認但正在消耗的部分。',
    en: 'This position shows resistance, including what quietly drains energy.',
    ja: 'ここでは抵抗と、静かに力を奪うものを見ます。',
  },
  resource: {
    'zh-TW': '這裡看已經能使用的支持。',
    en: 'This position shows support that is already available.',
    ja: 'ここではすでに使える支えを見ます。',
  },
  message: {
    'zh-TW': '這裡看最想被聽見的一句提醒。',
    en: 'This position shows the reminder that wants to be heard.',
    ja: 'ここでは聞かれたがっているメッセージを見ます。',
  },
  step: {
    'zh-TW': '這裡看下一個可執行的小步驟。',
    en: 'This position shows the next doable step.',
    ja: 'ここでは次に実行できる小さな一歩を見ます。',
  },
  self: {
    'zh-TW': '這裡看你在這件事裡的狀態。',
    en: 'This position shows your state inside this theme.',
    ja: 'ここではこのテーマの中でのあなたの状態を見ます。',
  },
  other: {
    'zh-TW': '這裡看外部的人、環境或回應。',
    en: 'This position shows the other person, environment, or response.',
    ja: 'ここでは相手、環境、外側の反応を見ます。',
  },
  threshold: {
    'zh-TW': '這裡看跨過去之前的門檻。',
    en: 'This position shows the threshold before moving through.',
    ja: 'ここでは進む前の境界を見ます。',
  },
  key: {
    'zh-TW': '這裡看能打開局面的關鍵。',
    en: 'This position shows the key that can open the situation.',
    ja: 'ここでは状況を開く鍵を見ます。',
  },
  invitation: {
    'zh-TW': '這裡看值得接受的邀請。',
    en: 'This position shows the invitation worth receiving.',
    ja: 'ここでは受け取る価値のある招待を見ます。',
  },
  integration: {
    'zh-TW': '這裡看如何把經驗整合回生活。',
    en: 'This position shows how to integrate the reading into life.',
    ja: 'ここでは読み解きを生活へ統合する方法を見ます。',
  },
} as const;

export const readingModes: ReadingMode[] = [
  {
    id: 'growth',
    labels: {
      'zh-TW': '成長',
      en: 'Growth',
      ja: '成長',
    },
    accent: '#56c7a3',
  },
  {
    id: 'relationships',
    labels: {
      'zh-TW': '關係',
      en: 'Relationships',
      ja: '関係性',
    },
    accent: '#e16f93',
  },
  {
    id: 'craft',
    labels: {
      'zh-TW': '創作',
      en: 'Creative Work',
      ja: '創作',
    },
    accent: '#f2b65d',
  },
  {
    id: 'decision',
    labels: {
      'zh-TW': '抉擇',
      en: 'Decision',
      ja: '選択',
    },
    accent: '#8ba7ff',
  },
];

export const spreads: SpreadDefinition[] = [
  {
    id: 'three-paths',
    labels: {
      'zh-TW': '三道光',
      en: 'Three Lights',
      ja: '三つの光',
    },
    description: {
      'zh-TW': '來處、所在、去向',
      en: 'Origin, presence, direction',
      ja: '起点、現在、行き先',
    },
    slots: [
      {
        id: 'origin',
        label: { 'zh-TW': '來處', en: 'Origin', ja: '起点' },
        x: -2.35,
        z: 0.15,
        rotation: -0.18,
      },
      {
        id: 'presence',
        label: { 'zh-TW': '所在', en: 'Presence', ja: '現在' },
        x: 0,
        z: -0.08,
        rotation: 0.02,
      },
      {
        id: 'direction',
        label: { 'zh-TW': '去向', en: 'Direction', ja: '行き先' },
        x: 2.35,
        z: 0.15,
        rotation: 0.18,
      },
    ],
  },
  {
    id: 'elemental-cross',
    labels: {
      'zh-TW': '四元素',
      en: 'Elemental Cross',
      ja: '四元素クロス',
    },
    description: {
      'zh-TW': '火、水、風、土的能量分布',
      en: 'Fire, water, air, and earth in motion',
      ja: '火・水・風・土の流れ',
    },
    slots: [
      {
        id: 'fire',
        label: { 'zh-TW': '火', en: 'Fire', ja: '火' },
        x: 0,
        z: -1.9,
        rotation: 0,
      },
      {
        id: 'water',
        label: { 'zh-TW': '水', en: 'Water', ja: '水' },
        x: 2.25,
        z: 0,
        rotation: 0.14,
      },
      {
        id: 'air',
        label: { 'zh-TW': '風', en: 'Air', ja: '風' },
        x: -2.25,
        z: 0,
        rotation: -0.14,
      },
      {
        id: 'earth',
        label: { 'zh-TW': '土', en: 'Earth', ja: '土' },
        x: 0,
        z: 1.9,
        rotation: 0,
      },
    ],
  },
  {
    id: 'constellation',
    labels: {
      'zh-TW': '星群',
      en: 'Constellation',
      ja: '星座',
    },
    description: {
      'zh-TW': '核心、阻力、資源、訊息、下一步',
      en: 'Core, resistance, resource, message, next step',
      ja: '核心、抵抗、資源、メッセージ、次の一手',
    },
    slots: [
      {
        id: 'core',
        label: { 'zh-TW': '核心', en: 'Core', ja: '核心' },
        x: 0,
        z: 0,
        rotation: 0,
      },
      {
        id: 'resistance',
        label: { 'zh-TW': '阻力', en: 'Resistance', ja: '抵抗' },
        x: -2.3,
        z: -1.25,
        rotation: -0.24,
      },
      {
        id: 'resource',
        label: { 'zh-TW': '資源', en: 'Resource', ja: '資源' },
        x: 2.3,
        z: -1.25,
        rotation: 0.24,
      },
      {
        id: 'message',
        label: { 'zh-TW': '訊息', en: 'Message', ja: 'メッセージ' },
        x: -1.25,
        z: 1.65,
        rotation: 0.2,
      },
      {
        id: 'step',
        label: { 'zh-TW': '下一步', en: 'Next Step', ja: '次の一手' },
        x: 1.25,
        z: 1.65,
        rotation: -0.2,
      },
    ],
  },
  {
    id: 'open-gate',
    labels: {
      'zh-TW': '門徑',
      en: 'Open Gate',
      ja: '開かれた門',
    },
    description: {
      'zh-TW': '自我、他者、門檻、鑰匙、邀請、整合',
      en: 'Self, other, threshold, key, invitation, integration',
      ja: '自己、他者、境界、鍵、招待、統合',
    },
    slots: [
      {
        id: 'self',
        label: { 'zh-TW': '自我', en: 'Self', ja: '自己' },
        x: -2.6,
        z: -1.55,
        rotation: -0.2,
      },
      {
        id: 'other',
        label: { 'zh-TW': '他者', en: 'Other', ja: '他者' },
        x: 2.6,
        z: -1.55,
        rotation: 0.2,
      },
      {
        id: 'threshold',
        label: { 'zh-TW': '門檻', en: 'Threshold', ja: '境界' },
        x: -1.35,
        z: 0.15,
        rotation: -0.1,
      },
      {
        id: 'key',
        label: { 'zh-TW': '鑰匙', en: 'Key', ja: '鍵' },
        x: 1.35,
        z: 0.15,
        rotation: 0.1,
      },
      {
        id: 'invitation',
        label: { 'zh-TW': '邀請', en: 'Invitation', ja: '招待' },
        x: -0.85,
        z: 1.95,
        rotation: 0.15,
      },
      {
        id: 'integration',
        label: { 'zh-TW': '整合', en: 'Integration', ja: '統合' },
        x: 0.85,
        z: 1.95,
        rotation: -0.15,
      },
    ],
  },
];

const majorCards: TarotCard[] = [
  {
    id: 'major-fool',
    arcana: 'major',
    glyph: '0',
    names: { 'zh-TW': '愚者', en: 'The Fool', ja: '愚者' },
    keywords: {
      'zh-TW': ['開端', '信任', '冒險'],
      en: ['beginning', 'trust', 'adventure'],
      ja: ['始まり', '信頼', '冒険'],
    },
    meaning: {
      'zh-TW': '新的道路正在打開，行動前不必把所有答案都握在手上。',
      en: 'A new road opens, and movement matters before every answer is known.',
      ja: '新しい道が開き、すべての答えより先に一歩が求められます。',
    },
    shadow: {
      'zh-TW': '天真需要與界線同行，否則自由會變成逃避。',
      en: 'Innocence needs a boundary, or freedom can become avoidance.',
      ja: '無邪気さには境界が必要で、自由が回避に変わり得ます。',
    },
    palette: ['#f5d27a', '#5bd0b3', '#26213f'],
  },
  {
    id: 'major-magician',
    arcana: 'major',
    glyph: 'I',
    names: { 'zh-TW': '魔術師', en: 'The Magician', ja: '魔術師' },
    keywords: {
      'zh-TW': ['意志', '工具', '顯化'],
      en: ['will', 'tools', 'manifestation'],
      ja: ['意志', '道具', '具現化'],
    },
    meaning: {
      'zh-TW': '你已經擁有可開始的資源，關鍵是把注意力集中成動作。',
      en: 'The needed tools are already present; focus turns them into action.',
      ja: '必要な道具はすでにあり、集中が行動へ変えていきます。',
    },
    shadow: {
      'zh-TW': '避免只追求掌控感，真正的力量來自清楚的承諾。',
      en: 'Control is not the same as power; clear commitment is the real lever.',
      ja: '支配感ではなく、明確な約束が本当の力になります。',
    },
    palette: ['#ef6f6c', '#ffe08a', '#2c1c1a'],
  },
  {
    id: 'major-priestess',
    arcana: 'major',
    glyph: 'II',
    names: { 'zh-TW': '女祭司', en: 'The High Priestess', ja: '女教皇' },
    keywords: {
      'zh-TW': ['直覺', '沉默', '隱知'],
      en: ['intuition', 'silence', 'hidden knowledge'],
      ja: ['直感', '沈黙', '秘めた知'],
    },
    meaning: {
      'zh-TW': '答案還在水面下，安靜觀察會比立即表態更有力量。',
      en: 'The answer is still below the surface; watch quietly before naming it.',
      ja: '答えは水面下にあり、名づける前の静かな観察が力になります。',
    },
    shadow: {
      'zh-TW': '神祕不該成為疏離，讓感受找到可以被理解的語言。',
      en: 'Mystery should not harden into distance; let feeling find language.',
      ja: '神秘は距離ではなく、感覚に言葉を与えてください。',
    },
    palette: ['#8ba7ff', '#e7d7ff', '#171b30'],
  },
  {
    id: 'major-empress',
    arcana: 'major',
    glyph: 'III',
    names: { 'zh-TW': '皇后', en: 'The Empress', ja: '女帝' },
    keywords: {
      'zh-TW': ['滋養', '創造', '身體'],
      en: ['nurture', 'creation', 'body'],
      ja: ['養育', '創造', '身体'],
    },
    meaning: {
      'zh-TW': '讓事情長出形體，照顧節奏與身體會讓創造更穩。',
      en: 'Let the work grow a body; care for rhythm and the body that carries it.',
      ja: '物事に形を与え、リズムと身体を大切にすると創造が安定します。',
    },
    shadow: {
      'zh-TW': '過度照顧可能掩蓋真正需求，留一點空氣給彼此。',
      en: 'Over-care can hide real needs; leave room for everyone to breathe.',
      ja: '世話のしすぎは本当の必要を隠します。余白を残してください。',
    },
    palette: ['#ef8aa7', '#7bd389', '#2b2421'],
  },
  {
    id: 'major-emperor',
    arcana: 'major',
    glyph: 'IV',
    names: { 'zh-TW': '皇帝', en: 'The Emperor', ja: '皇帝' },
    keywords: {
      'zh-TW': ['結構', '責任', '界線'],
      en: ['structure', 'responsibility', 'boundary'],
      ja: ['構造', '責任', '境界'],
    },
    meaning: {
      'zh-TW': '穩定來自清楚的承擔，規則可以成為保護而非壓迫。',
      en: 'Stability comes from clear responsibility; rules can protect, not only limit.',
      ja: '安定は明確な責任から生まれ、規則は制限だけでなく保護にもなります。',
    },
    shadow: {
      'zh-TW': '僵硬的秩序會失去生命，檢查哪些規則只是恐懼留下的殼。',
      en: 'Rigid order loses life; inspect which rules are shells left by fear.',
      ja: '硬直した秩序は生命力を失います。恐れから残った規則を見直してください。',
    },
    palette: ['#d65f45', '#f4b860', '#2c201d'],
  },
  {
    id: 'major-hierophant',
    arcana: 'major',
    glyph: 'V',
    names: { 'zh-TW': '教皇', en: 'The Hierophant', ja: '教皇' },
    keywords: {
      'zh-TW': ['傳承', '學習', '儀式'],
      en: ['tradition', 'learning', 'ritual'],
      ja: ['伝統', '学び', '儀式'],
    },
    meaning: {
      'zh-TW': '一套成熟方法正在支持你，先理解脈絡，再選擇是否改寫。',
      en: 'A mature method supports you; learn the lineage before rewriting it.',
      ja: '成熟した方法が支えています。書き換える前に流れを理解しましょう。',
    },
    shadow: {
      'zh-TW': '別讓規範替你思考，真正的學習會留下自主性。',
      en: 'Do not let convention think for you; real learning preserves agency.',
      ja: '慣習に思考を預けず、学びの中に主体性を残してください。',
    },
    palette: ['#b38df5', '#f6e2a5', '#1f1b2b'],
  },
  {
    id: 'major-lovers',
    arcana: 'major',
    glyph: 'VI',
    names: { 'zh-TW': '戀人', en: 'The Lovers', ja: '恋人' },
    keywords: {
      'zh-TW': ['選擇', '連結', '價值'],
      en: ['choice', 'bond', 'values'],
      ja: ['選択', '絆', '価値観'],
    },
    meaning: {
      'zh-TW': '真正的靠近需要價值對齊，也需要誠實選擇。',
      en: 'Real closeness asks for aligned values and an honest choice.',
      ja: '本当の近さには価値観の一致と正直な選択が必要です。',
    },
    shadow: {
      'zh-TW': '若只是追求被選中，可能會忽略自己真正想選什麼。',
      en: 'Wanting to be chosen can obscure what you actually choose.',
      ja: '選ばれたい思いが、自分の選択を見えにくくすることがあります。',
    },
    palette: ['#f17f9c', '#79d7c4', '#2b1e2a'],
  },
  {
    id: 'major-chariot',
    arcana: 'major',
    glyph: 'VII',
    names: { 'zh-TW': '戰車', en: 'The Chariot', ja: '戦車' },
    keywords: {
      'zh-TW': ['推進', '整合', '方向'],
      en: ['momentum', 'integration', 'direction'],
      ja: ['推進', '統合', '方向'],
    },
    meaning: {
      'zh-TW': '相反力量可以被整合成前進，方向比速度更重要。',
      en: 'Opposing forces can be harnessed; direction matters more than speed.',
      ja: '対立する力は前進へ統合できます。速度より方向が重要です。',
    },
    shadow: {
      'zh-TW': '只靠意志硬衝會消耗過快，聽見內在拉扯才能長跑。',
      en: 'Pure force burns quickly; hear the inner tension for endurance.',
      ja: '力だけでは燃え尽きます。内側の引っぱりを聞くことが持久力になります。',
    },
    palette: ['#58b6ff', '#f4c95d', '#172234'],
  },
  {
    id: 'major-strength',
    arcana: 'major',
    glyph: 'VIII',
    names: { 'zh-TW': '力量', en: 'Strength', ja: '力' },
    keywords: {
      'zh-TW': ['溫柔', '勇氣', '調伏'],
      en: ['gentleness', 'courage', 'taming'],
      ja: ['優しさ', '勇気', '調和'],
    },
    meaning: {
      'zh-TW': '柔軟不是退讓，而是能與本能合作的勇氣。',
      en: 'Softness is not surrender; it is courage that can work with instinct.',
      ja: '柔らかさは降参ではなく、本能と協力できる勇気です。',
    },
    shadow: {
      'zh-TW': '壓抑不會帶來真正的平靜，試著與衝動談判。',
      en: 'Repression will not make peace; negotiate with the impulse.',
      ja: '抑圧は平和を生みません。衝動と交渉してみてください。',
    },
    palette: ['#f0a55f', '#f8e7a3', '#2d211b'],
  },
  {
    id: 'major-hermit',
    arcana: 'major',
    glyph: 'IX',
    names: { 'zh-TW': '隱者', en: 'The Hermit', ja: '隠者' },
    keywords: {
      'zh-TW': ['內省', '燈火', '獨處'],
      en: ['reflection', 'lamp', 'solitude'],
      ja: ['内省', '灯り', '独りの時間'],
    },
    meaning: {
      'zh-TW': '退後一步不是消失，而是為了看見真正要守護的光。',
      en: 'Stepping back is not vanishing; it lets you see the light worth tending.',
      ja: '一歩退くことは消えることではなく、守るべき光を見ることです。',
    },
    shadow: {
      'zh-TW': '孤獨若變成封閉，就需要一盞能讓人靠近的小燈。',
      en: 'If solitude becomes sealed, place a small lamp where others can approach.',
      ja: '孤独が閉鎖になるなら、人が近づける小さな灯りを置いてください。',
    },
    palette: ['#b0d7d3', '#f5cf7a', '#172321'],
  },
  {
    id: 'major-wheel',
    arcana: 'major',
    glyph: 'X',
    names: { 'zh-TW': '命運之輪', en: 'Wheel of Fortune', ja: '運命の輪' },
    keywords: {
      'zh-TW': ['循環', '轉折', '機會'],
      en: ['cycle', 'turning point', 'chance'],
      ja: ['循環', '転機', '機会'],
    },
    meaning: {
      'zh-TW': '局勢正在轉動，掌握節奏比抓住舊位置更有用。',
      en: 'The situation is turning; reading the rhythm matters more than holding place.',
      ja: '状況は回っています。古い場所よりリズムを読むことが大切です。',
    },
    shadow: {
      'zh-TW': '把一切交給運氣會失去選擇權，找出你能調整的槓桿。',
      en: 'Leaving everything to luck forfeits choice; find the lever you can move.',
      ja: '運だけに任せると選択権を失います。動かせるてこを探してください。',
    },
    palette: ['#64c4ff', '#f2ca61', '#211b31'],
  },
  {
    id: 'major-justice',
    arcana: 'major',
    glyph: 'XI',
    names: { 'zh-TW': '正義', en: 'Justice', ja: '正義' },
    keywords: {
      'zh-TW': ['平衡', '事實', '責任'],
      en: ['balance', 'truth', 'accountability'],
      ja: ['均衡', '真実', '責任'],
    },
    meaning: {
      'zh-TW': '讓事實被看見，公平會從清楚的衡量開始。',
      en: 'Let the facts be seen; fairness begins with clear measurement.',
      ja: '事実を見えるようにしてください。公平は明確な測定から始まります。',
    },
    shadow: {
      'zh-TW': '若只追求判決，可能錯過修復關係的可能。',
      en: 'If you seek only a verdict, you may miss the chance to repair.',
      ja: '判決だけを求めると、修復の可能性を見落とすかもしれません。',
    },
    palette: ['#e6e0d4', '#8bd2bd', '#241f26'],
  },
  {
    id: 'major-hanged',
    arcana: 'major',
    glyph: 'XII',
    names: { 'zh-TW': '吊人', en: 'The Hanged One', ja: '吊るされた人' },
    keywords: {
      'zh-TW': ['暫停', '換位', '釋放'],
      en: ['pause', 'reversal', 'release'],
      ja: ['停止', '反転', '手放し'],
    },
    meaning: {
      'zh-TW': '暫停會讓新的角度浮現，現在的慢可能是在節省力氣。',
      en: 'A pause reveals a new angle; slowness may be conserving strength.',
      ja: '停止は新しい角度を見せます。遅さは力を蓄えることかもしれません。',
    },
    shadow: {
      'zh-TW': '犧牲若沒有人受益，就需要重新談條件。',
      en: 'If no one benefits from the sacrifice, renegotiate the terms.',
      ja: '犠牲から誰も得ないなら、条件を話し直してください。',
    },
    palette: ['#79c7d3', '#d9f0a3', '#1c2a2d'],
  },
  {
    id: 'major-death',
    arcana: 'major',
    glyph: 'XIII',
    names: { 'zh-TW': '死神', en: 'Death', ja: '死神' },
    keywords: {
      'zh-TW': ['結束', '轉化', '清理'],
      en: ['ending', 'transformation', 'clearing'],
      ja: ['終わり', '変容', '整理'],
    },
    meaning: {
      'zh-TW': '某種形式正在完成任務，清理會讓新生命有地方生長。',
      en: 'A form has finished its work; clearing space lets new life grow.',
      ja: 'ある形が役目を終えました。空間を空けると新しい生命が育ちます。',
    },
    shadow: {
      'zh-TW': '抗拒結束會讓過渡期拉長，請溫柔但明確地告別。',
      en: 'Resisting an ending lengthens transition; say goodbye gently and clearly.',
      ja: '終わりへの抵抗は移行を長引かせます。優しく明確に別れを告げてください。',
    },
    palette: ['#d7d0c8', '#7f5af0', '#171417'],
  },
  {
    id: 'major-temperance',
    arcana: 'major',
    glyph: 'XIV',
    names: { 'zh-TW': '節制', en: 'Temperance', ja: '節制' },
    keywords: {
      'zh-TW': ['調和', '混合', '耐心'],
      en: ['harmony', 'blending', 'patience'],
      ja: ['調和', '混合', '忍耐'],
    },
    meaning: {
      'zh-TW': '兩種不同需求可以調成新的比例，慢慢試比硬拼更準。',
      en: 'Different needs can become a new ratio; careful blending beats force.',
      ja: '異なる必要は新しい比率になります。力より丁寧な混合が有効です。',
    },
    shadow: {
      'zh-TW': '過度折衷可能讓重點變淡，確認你想保留的核心味道。',
      en: 'Too much compromise can dilute the point; protect the central flavor.',
      ja: '妥協しすぎると焦点が薄れます。中心の味わいを守ってください。',
    },
    palette: ['#72d6bd', '#f1d27b', '#1f2522'],
  },
  {
    id: 'major-devil',
    arcana: 'major',
    glyph: 'XV',
    names: { 'zh-TW': '惡魔', en: 'The Devil', ja: '悪魔' },
    keywords: {
      'zh-TW': ['執著', '慾望', '契約'],
      en: ['attachment', 'desire', 'contract'],
      ja: ['執着', '欲望', '契約'],
    },
    meaning: {
      'zh-TW': '看清讓你上癮的交換條件，慾望本身也能提供線索。',
      en: 'See the bargain behind the attachment; desire itself carries a clue.',
      ja: '執着の裏にある取引を見てください。欲望にも手がかりがあります。',
    },
    shadow: {
      'zh-TW': '羞恥會讓鎖更緊，誠實承認需要才有可能鬆綁。',
      en: 'Shame tightens the chain; honest need is where release begins.',
      ja: '恥は鎖を強めます。必要を正直に認めることから解放が始まります。',
    },
    palette: ['#ef5d60', '#b38df5', '#271616'],
  },
  {
    id: 'major-tower',
    arcana: 'major',
    glyph: 'XVI',
    names: { 'zh-TW': '高塔', en: 'The Tower', ja: '塔' },
    keywords: {
      'zh-TW': ['瓦解', '揭露', '釋放'],
      en: ['collapse', 'revelation', 'release'],
      ja: ['崩壊', '露見', '解放'],
    },
    meaning: {
      'zh-TW': '不穩的結構正在顯露裂縫，真相雖震動，卻能移除假支撐。',
      en: 'An unstable structure shows its cracks; truth shakes, then frees.',
      ja: '不安定な構造に亀裂が見えます。真実は揺らし、解放します。',
    },
    shadow: {
      'zh-TW': '別急著重建同一座塔，先問哪個基礎從未真正承重。',
      en: 'Do not rush to rebuild the same tower; test which foundation never held.',
      ja: '同じ塔を急いで建て直さず、支えていなかった基礎を確かめてください。',
    },
    palette: ['#ffcf5a', '#6ea7ff', '#1b1820'],
  },
  {
    id: 'major-star',
    arcana: 'major',
    glyph: 'XVII',
    names: { 'zh-TW': '星星', en: 'The Star', ja: '星' },
    keywords: {
      'zh-TW': ['希望', '療癒', '透明'],
      en: ['hope', 'healing', 'clarity'],
      ja: ['希望', '癒し', '透明さ'],
    },
    meaning: {
      'zh-TW': '在安靜處補水，長期的希望會比短暫刺激更可靠。',
      en: 'Restore yourself in quiet; durable hope is stronger than quick sparks.',
      ja: '静けさの中で回復してください。長く続く希望は一瞬の刺激より強いです。',
    },
    shadow: {
      'zh-TW': '只看遠方會忽略腳下的照顧，把願景接回日常。',
      en: 'Looking only far away can miss daily care; bring the vision back to earth.',
      ja: '遠くばかり見ると日々の世話を忘れます。願いを日常へ戻してください。',
    },
    palette: ['#9bdcff', '#f2f5a8', '#151c2a'],
  },
  {
    id: 'major-moon',
    arcana: 'major',
    glyph: 'XVIII',
    names: { 'zh-TW': '月亮', en: 'The Moon', ja: '月' },
    keywords: {
      'zh-TW': ['夢境', '不確定', '本能'],
      en: ['dream', 'uncertainty', 'instinct'],
      ja: ['夢', '不確かさ', '本能'],
    },
    meaning: {
      'zh-TW': '模糊不是錯誤，它提醒你慢一點，用感官辨認路徑。',
      en: 'Uncertainty is not failure; slow down and let the senses map the path.',
      ja: '曖昧さは失敗ではありません。ゆっくり感覚で道を探してください。',
    },
    shadow: {
      'zh-TW': '恐懼可能把影子放大，確認證據再回應。',
      en: 'Fear may enlarge shadows; verify evidence before responding.',
      ja: '恐れは影を大きくします。反応する前に根拠を確かめてください。',
    },
    palette: ['#b9a7ff', '#7fd5d1', '#171827'],
  },
  {
    id: 'major-sun',
    arcana: 'major',
    glyph: 'XIX',
    names: { 'zh-TW': '太陽', en: 'The Sun', ja: '太陽' },
    keywords: {
      'zh-TW': ['清晰', '喜悅', '生命力'],
      en: ['clarity', 'joy', 'vitality'],
      ja: ['明晰', '喜び', '生命力'],
    },
    meaning: {
      'zh-TW': '事情可以變得明亮直接，讓喜悅成為判斷力的一部分。',
      en: 'Things can become bright and direct; let joy inform judgment.',
      ja: '物事は明るく率直になれます。喜びを判断の一部にしてください。',
    },
    shadow: {
      'zh-TW': '過度樂觀可能忽略陰影，真正的明亮容得下複雜。',
      en: 'Over-optimism may skip shadows; real brightness can hold complexity.',
      ja: '楽観しすぎると影を見落とします。本当の明るさは複雑さを含めます。',
    },
    palette: ['#ffcc4d', '#ff8f70', '#2f2116'],
  },
  {
    id: 'major-judgement',
    arcana: 'major',
    glyph: 'XX',
    names: { 'zh-TW': '審判', en: 'Judgement', ja: '審判' },
    keywords: {
      'zh-TW': ['召喚', '覺醒', '回應'],
      en: ['calling', 'awakening', 'response'],
      ja: ['呼び声', '覚醒', '応答'],
    },
    meaning: {
      'zh-TW': '某個更大的呼喚正在靠近，回應它會重整你的敘事。',
      en: 'A larger calling approaches; answering it reorganizes the story.',
      ja: '大きな呼び声が近づいています。応えることで物語が組み直されます。',
    },
    shadow: {
      'zh-TW': '別把覺醒變成自責清單，更新身份也需要慈悲。',
      en: 'Do not turn awakening into a blame list; renewal also needs mercy.',
      ja: '覚醒を責めるリストにしないでください。更新には慈悲も必要です。',
    },
    palette: ['#f4a4c4', '#8bd2bd', '#201a22'],
  },
  {
    id: 'major-world',
    arcana: 'major',
    glyph: 'XXI',
    names: { 'zh-TW': '世界', en: 'The World', ja: '世界' },
    keywords: {
      'zh-TW': ['完成', '整合', '流動'],
      en: ['completion', 'integration', 'flow'],
      ja: ['完成', '統合', '流れ'],
    },
    meaning: {
      'zh-TW': '一個循環抵達完整，現在可以把經驗帶往更大的舞台。',
      en: 'A cycle reaches wholeness; carry what you learned into a wider field.',
      ja: 'ひとつの循環が完成します。学びをより広い場へ運んでください。',
    },
    shadow: {
      'zh-TW': '完成不代表停住，允許自己從終點自然轉入新的入口。',
      en: 'Completion is not stagnation; let the ending become a new entrance.',
      ja: '完成は停滞ではありません。終点を新しい入口にしてください。',
    },
    palette: ['#73d7a8', '#c5a7ff', '#18241f'],
  },
];

const suitData = {
  wands: {
    glyph: '✦',
    names: { 'zh-TW': '權杖', en: 'Wands', ja: 'ワンド' },
    theme: {
      'zh-TW': '意志與創造火花',
      en: 'will and creative fire',
      ja: '意志と創造の火',
    },
    keywords: {
      'zh-TW': ['行動', '熱情'],
      en: ['action', 'spark'],
      ja: ['行動', '情熱'],
    },
    palette: ['#ff8b5f', '#f4c95d', '#2a1814'] as [string, string, string],
  },
  cups: {
    glyph: '◌',
    names: { 'zh-TW': '聖杯', en: 'Cups', ja: 'カップ' },
    theme: {
      'zh-TW': '情感與關係流動',
      en: 'feeling and relational flow',
      ja: '感情と関係性の流れ',
    },
    keywords: {
      'zh-TW': ['感受', '連結'],
      en: ['feeling', 'bond'],
      ja: ['感情', 'つながり'],
    },
    palette: ['#64c4ff', '#8bd2bd', '#15232d'] as [string, string, string],
  },
  swords: {
    glyph: '◇',
    names: { 'zh-TW': '寶劍', en: 'Swords', ja: 'ソード' },
    theme: {
      'zh-TW': '思想與溝通鋒面',
      en: 'thought and communication',
      ja: '思考とコミュニケーション',
    },
    keywords: {
      'zh-TW': ['思考', '語言'],
      en: ['thought', 'truth'],
      ja: ['思考', '真実'],
    },
    palette: ['#b5d7f2', '#c5a7ff', '#171c2b'] as [string, string, string],
  },
  pentacles: {
    glyph: '⬡',
    names: { 'zh-TW': '錢幣', en: 'Pentacles', ja: 'ペンタクル' },
    theme: {
      'zh-TW': '身體、資源與現實',
      en: 'body, resources, and reality',
      ja: '身体、資源、現実',
    },
    keywords: {
      'zh-TW': ['資源', '落地'],
      en: ['resources', 'grounding'],
      ja: ['資源', '定着'],
    },
    palette: ['#7bd389', '#f2c66d', '#182419'] as [string, string, string],
  },
};

const ranks = [
  {
    id: 'ace',
    names: { 'zh-TW': '一', en: 'Ace', ja: 'エース' },
    keywords: {
      'zh-TW': ['種子', '潛能'],
      en: ['seed', 'potential'],
      ja: ['種', '可能性'],
    },
  },
  {
    id: 'two',
    names: { 'zh-TW': '二', en: 'Two', ja: '2' },
    keywords: {
      'zh-TW': ['選擇', '互動'],
      en: ['choice', 'exchange'],
      ja: ['選択', '交流'],
    },
  },
  {
    id: 'three',
    names: { 'zh-TW': '三', en: 'Three', ja: '3' },
    keywords: {
      'zh-TW': ['擴展', '合作'],
      en: ['growth', 'collaboration'],
      ja: ['拡張', '協力'],
    },
  },
  {
    id: 'four',
    names: { 'zh-TW': '四', en: 'Four', ja: '4' },
    keywords: {
      'zh-TW': ['穩定', '框架'],
      en: ['stability', 'frame'],
      ja: ['安定', '枠組み'],
    },
  },
  {
    id: 'five',
    names: { 'zh-TW': '五', en: 'Five', ja: '5' },
    keywords: {
      'zh-TW': ['摩擦', '調整'],
      en: ['friction', 'adjustment'],
      ja: ['摩擦', '調整'],
    },
  },
  {
    id: 'six',
    names: { 'zh-TW': '六', en: 'Six', ja: '6' },
    keywords: {
      'zh-TW': ['修復', '流動'],
      en: ['repair', 'flow'],
      ja: ['修復', '流れ'],
    },
  },
  {
    id: 'seven',
    names: { 'zh-TW': '七', en: 'Seven', ja: '7' },
    keywords: {
      'zh-TW': ['試煉', '策略'],
      en: ['test', 'strategy'],
      ja: ['試練', '戦略'],
    },
  },
  {
    id: 'eight',
    names: { 'zh-TW': '八', en: 'Eight', ja: '8' },
    keywords: {
      'zh-TW': ['動能', '技藝'],
      en: ['momentum', 'craft'],
      ja: ['勢い', '技'],
    },
  },
  {
    id: 'nine',
    names: { 'zh-TW': '九', en: 'Nine', ja: '9' },
    keywords: {
      'zh-TW': ['成熟', '邊界'],
      en: ['maturity', 'boundary'],
      ja: ['成熟', '境界'],
    },
  },
  {
    id: 'ten',
    names: { 'zh-TW': '十', en: 'Ten', ja: '10' },
    keywords: {
      'zh-TW': ['完成', '轉化'],
      en: ['completion', 'transition'],
      ja: ['完成', '移行'],
    },
  },
  {
    id: 'page',
    names: { 'zh-TW': '侍者', en: 'Page', ja: 'ペイジ' },
    keywords: {
      'zh-TW': ['學習', '訊息'],
      en: ['learning', 'message'],
      ja: ['学び', '知らせ'],
    },
  },
  {
    id: 'knight',
    names: { 'zh-TW': '騎士', en: 'Knight', ja: 'ナイト' },
    keywords: {
      'zh-TW': ['追尋', '速度'],
      en: ['pursuit', 'pace'],
      ja: ['追求', '速度'],
    },
  },
  {
    id: 'queen',
    names: { 'zh-TW': '皇后', en: 'Queen', ja: 'クイーン' },
    keywords: {
      'zh-TW': ['承載', '感知'],
      en: ['holding', 'attunement'],
      ja: ['受容', '感応'],
    },
  },
  {
    id: 'king',
    names: { 'zh-TW': '國王', en: 'King', ja: 'キング' },
    keywords: {
      'zh-TW': ['掌舵', '成熟'],
      en: ['stewardship', 'mastery'],
      ja: ['統率', '熟達'],
    },
  },
];

function createMinorCard(
  suit: keyof typeof suitData,
  rank: (typeof ranks)[number],
): TarotCard {
  const suitInfo = suitData[suit];
  const names = {
    'zh-TW': `${suitInfo.names['zh-TW']}${rank.names['zh-TW']}`,
    en: `${rank.names.en} of ${suitInfo.names.en}`,
    ja: `${suitInfo.names.ja}の${rank.names.ja}`,
  };

  return {
    id: `minor-${suit}-${rank.id}`,
    arcana: 'minor',
    suit,
    rank: rank.id,
    glyph: suitInfo.glyph,
    names,
    keywords: {
      'zh-TW': [...rank.keywords['zh-TW'], ...suitInfo.keywords['zh-TW']],
      en: [...rank.keywords.en, ...suitInfo.keywords.en],
      ja: [...rank.keywords.ja, ...suitInfo.keywords.ja],
    },
    meaning: {
      'zh-TW': `${names['zh-TW']}把${suitInfo.theme['zh-TW']}帶到眼前，提醒你觀察目前的能量比例。`,
      en: `${names.en} brings ${suitInfo.theme.en} into view and asks you to notice the current ratio of energy.`,
      ja: `${names.ja}は${suitInfo.theme.ja}を示し、今のエネルギー配分を見つめるよう促します。`,
    },
    shadow: {
      'zh-TW': `當${suitInfo.theme['zh-TW']}失衡時，先降低噪音，再決定下一個小動作。`,
      en: `When ${suitInfo.theme.en} falls out of balance, lower the noise before choosing the next small move.`,
      ja: `${suitInfo.theme.ja}が偏る時は、雑音を下げてから次の小さな動きを選んでください。`,
    },
    palette: suitInfo.palette,
  };
}

const minorCards = (Object.keys(suitData) as Array<keyof typeof suitData>).flatMap(
  (suit) => ranks.map((rank) => createMinorCard(suit, rank)),
);

export const tarotDeck: TarotCard[] = [...majorCards, ...minorCards];
