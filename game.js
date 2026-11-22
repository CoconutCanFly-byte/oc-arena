// ================= 1. SUPABASE & MAP LAYERS =================
const SB_URL = 'https://supabase.co';
const SB_KEY = 'sb_publishable_g7_EjZW4iCy3P7TqamhwMg_8Brgtwkk';
const supabaseClient = window.supabase.createClient(SB_URL, SB_KEY);
let currentUser = null;

const MAP_FILES = {
  day: [
    { file: 'ฟ้าเช้า 600_20261122155739.png', parallax: 0.1, isCloud: false },
    { file: 'เมฆเช้า 600_20261122155741.png', parallax: 0.2, isCloud: true },
    { file: 'เขาหลังสุด 600_20261122155744.png', parallax: 0.35, isCloud: false },
    { file: 'เขาหน้าสุด 600_20261122155747.png', parallax: 0.6, isCloud: false },
    { file: 'หญ้าเช้า 600_20261122155749.png', parallax: 1.0, isCloud: false }
  ],
  night: [
    { file: 'ฟ้ามืด 600_20261122155752.png', parallax: 0.1, isCloud: false },
    { file: 'เมฆมืด 600_20261122160141.png', parallax: 0.2, isCloud: true },
    { file: 'เขามืด 600_20261122155755.png', parallax: 0.45, isCloud: false },
    { file: 'หญ้ามืด 600_20261122155757.png', parallax: 1.0, isCloud: false }
  ]
};

const loadedImages = { day: [], night: [] };
function preloadMaps() {
  ['day', 'night'].forEach(mode => {
    MAP_FILES[mode].forEach(layer => {
      const img = new Image();
      img.src = encodeURI(layer.file);
      loadedImages[mode].push({ img, parallax: layer.parallax, isCloud: layer.isCloud });
    });
  });
}
preloadMaps();

let lang = 'th';
const I18N = {
  th: {
    appTitle: 'OC โขกเหม่ง Arena',
    welcomeTitle: 'สังเวียนจับ OC โขกเหม่ง!',
    welcomeDesc: 'ไม่มีปั้นลูก วัดดวงล้วนๆ นั่งเชียร์ดูน้องวิ่งโขกหัวและปาอิโมจิใส่กันจนหมุนติ้วออกจอ!',
    btnGuest: 'เข้าเล่นทันที (ไม่ต้องล็อกอิน)',
    cloudTitle: '☁️ บัญชีอีเมล (เซฟข้อมูลบนคลาวด์)',
    btnLogin: 'เข้าสู่ระบบ',
    btnSignup: 'สมัครสมาชิก',
    mapSelectLabel: 'เลือกเวลาฉาก:',
    mapAuto: 'ตามเวลาจริง (Auto)',
    mapDay: 'แมพเช้า (Day)',
    mapNight: 'แมพมืด (Night)',
    fighter1: 'ตัวละครซ้าย (P1)',
    fighter2: 'ตัวละครขวา (P2)',
    btnUpload: 'อัปโหลดรูป OC (รองรับ PNG ใส)',
    labelName: 'ชื่อตัวละคร',
    pronounTitle: 'สรรพนาม (พิมพ์กำหนดเอง)',
    pMe: 'แทนตัวเอง',
    pYou: 'เรียกอีกฝั่ง',
    pThey: 'เรียกกลุ่ม',
    traitTitle: 'นิสัย (เลือกผสมได้สูงสุด 4)',
    traitNote: 'กำหนดลีลาการวิ่ง โขกเหม่ง แย่งของ และอิโมจิอารมณ์บนหัว',
    dialogueTitle: 'คลังคำพูดตามอารมณ์',
    btnClearAll: 'ลบคำตั้งต้นทั้งหมด',
    dialogueNote: 'ใช้ {me}, {you}, {they} แทรกในประโยคได้ หรือลบออกทั้งหมดเพื่อพิมพ์เองล้วนๆ',
    evHeadbutt: 'ตอนพุ่งโขก',
    evThrow: 'ตอนปาของ',
    evMiss: 'ตอนปาวืด',
    evHurt: 'ตอนโดนตี/โกรธ',
    evStun: 'ตอนสตั้นมึนหัว',
    evWin: 'ตอนชนะ',
    btnResetDiag: 'รีเซ็ตคำตั้งต้น',
    btnSaveCloud: 'เซฟลงคลาวด์',
    btnStartBattle: 'เริ่มศึกโขกเหม่ง!',
    cheer1: 'เชียร์ซ้าย',
    cheer2: 'เชียร์ขวา',
    btnRematch: 'ตีกันอีกรอบ',
    btnEdit: 'ตั้งค่า',
    btnBackSetup: 'กลับหน้าตั้งค่า',
    btnRestart: 'เริ่มยกใหม่',
    winnerSuffix: ' ชนะ!'
  },
  en: {
    appTitle: 'OC Headbutt Arena',
    welcomeTitle: 'OC Headbutt & Emoji Arena!',
    welcomeDesc: 'Pure RNG & zero grinding! Sit back and watch your OCs headbutt and throw emojis until someone spins out of the screen!',
    btnGuest: 'Play Now (Guest Mode)',
    cloudTitle: '☁️ Email Account (Cloud Save)',
    btnLogin: 'Log In',
    btnSignup: 'Sign Up',
    mapSelectLabel: 'Arena Time:',
    mapAuto: 'Auto (Local Time)',
    mapDay: 'Day Map',
    mapNight: 'Night Map',
    fighter1: 'Left OC (P1)',
    fighter2: 'Right OC (P2)',
    btnUpload: 'Upload OC Image (Transparent PNG)',
    labelName: 'Character Name',
    pronounTitle: 'Custom Pronouns',
    pMe: 'Self',
    pYou: 'Opponent',
    pThey: 'Group',
    traitTitle: 'Traits (Pick up to 4)',
    traitNote: 'Controls movement, headbutt frequency, item grabbing, and head emojis',
    dialogueTitle: 'Custom Emotional Dialogues',
    btnClearAll: 'Delete All Defaults',
    dialogueNote: 'Use {me}, {you}, {they} tags, or delete all defaults to write 100% custom lines.',
    evHeadbutt: 'Headbutt',
    evThrow: 'Throw Item',
    evMiss: 'Missed Throw',
    evHurt: 'Hurt / Angry',
    evStun: 'Stunned',
    evWin: 'Victory',
    btnResetDiag: 'Reset Defaults',
    btnSaveCloud: 'Cloud Save',
    btnStartBattle: 'Start Brawl!',
    cheer1: 'Cheer Left',
    cheer2: 'Cheer Right',
    btnRematch: 'Rematch',
    btnEdit: 'Setup',
    btnBackSetup: 'Back to Setup',
    btnRestart: 'Restart',
    winnerSuffix: ' WINS!!'
  }
};

const TRAITS_LIST = [
  { id: 'brat', th: 'เด็กเปรต', en: 'Bratty' },
  { id: 'clingy', th: 'ขี้อ้อน', en: 'Clingy' },
  { id: 'tsundere', th: 'ซึนเดเระ', en: 'Tsundere' },
  { id: 'sleepy', th: 'ขี้เซา', en: 'Sleepy' },
  { id: 'glutton', th: 'ตะกละ', en: 'Glutton' },
  { id: 'arrogant', th: 'หยิ่ง', en: 'Arrogant' },
  { id: 'timid', th: 'ขี้กลัว', en: 'Timid' },
  { id: 'hyper', th: 'ไฮเปอร์', en: 'Hyper' }
];

function getDefaultDialogues(l) {
  if (l === 'en') {
    return [
      { event: 'headbutt', text: 'Take this headbutt from {me}, {you}!' },
      { event: 'throw', text: 'Eat this {you}!!' },
      { event: 'miss', text: 'Tch! {you} got lucky!' },
      { event: 'hurt', text: 'How dare {you} hit {me}?!' },
      { event: 'stun', text: 'Ugh... {me} sees stars...' },
      { event: 'win', text: 'Bow down to {me}, {you}!' }
    ];
  }
  return [
    { event: 'headbutt', text: 'รับพลังโขกเหม่งของ{me}ไปซะ {you}!' },
    { event: 'throw', text: 'กินนี่เข้าไปซะ {you}!!' },
    { event: 'miss', text: 'ชิ! {you}แค่โชคดีหลบได้หรอก!' },
    { event: 'hurt', text: 'บังอาจมากนะ{you} ที่กล้าทำร้าย{me}!' },
    { event: 'stun', text: 'โอ๊ย... {me}เห็นดาวเต็มหัวเลย...' },
    { event: 'win', text: 'สมน้ำหน้า{you} กล้าดียังไงมาสู้กับ{me}!' }
  ];
}

let activeTab = 0;
let fighters = [
  {
    name: 'น้องเปรตซ่า',
    image: '',
    pronouns: { me: 'ข้า', you: 'เจ้า', they: 'พวกเจ้า' },
    traits: { brat: 100, hyper: 60 },
    dialogues: getDefaultDialogues('th')
  },
  {
    name: 'เจ้าก้อนมึน',
    image: '',
    pronouns: { me: 'กู', you: 'มึง', they: 'พวกมัน' },
    traits: { sleepy: 80, glutton: 70 },
    dialogues: getDefaultDialogues('th')
  }
];

function loadLocalFighters() {
  const saved = localStorage.getItem('oc_arena_fighters');
  if (saved) { try { fighters = JSON.parse(saved); } catch(e) {} }
}
function persistLocalFighters() {
  localStorage.setItem('oc_arena_fighters', JSON.stringify(fighters));
}
// ================= 2. UI, AUTH, YOUTUBE & SETUP FORM =================
function toggleTheme() {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  document.getElementById('btnTheme').textContent = isDark ? '☀️' : '🌙';
}

function toggleLang() {
  lang = lang === 'th' ? 'en' : 'th';
  document.getElementById('btnLang').textContent = lang === 'th' ? 'EN' : 'TH';
  applyTranslations();
  renderSetupForm();
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (I18N[lang][key]) el.textContent = I18N[lang][key];
  });
}

function showView(viewId) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(viewId).classList.add('active');
}

function loadYoutubeMusic() {
  const url = document.getElementById('ytLinkInput').value.trim();
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  if (match && match[1]) {
    document.getElementById('ytPlayerWrap').style.display = 'block';
    document.getElementById('ytIframe').src = `https://youtube.com{match[1]}?autoplay=1&loop=1&playlist=${match[1]}`;
  } else {
    alert(lang === 'th' ? 'กรุณาวางลิงก์ YouTube ที่ถูกต้อง' : 'Invalid YouTube URL');
  }
}

function enterGuestMode() {
  loadLocalFighters();
  showView('viewSetup');
  renderSetupForm();
}

async function handleAuth(type) {
  const email = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPass').value.trim();
  const msg = document.getElementById('authMsg');
  msg.textContent = '...';
  if (!email || !password) { msg.textContent = 'Please enter email & password'; return; }

  let res;
  if (type === 'signup') {
    res = await supabaseClient.auth.signUp({ email, password });
  } else {
    res = await supabaseClient.auth.signInWithPassword({ email, password });
  }

  if (res.error) {
    msg.textContent = res.error.message;
  } else {
    currentUser = res.data.user;
    document.getElementById('btnLogout').style.display = 'inline-block';
    document.getElementById('btnCloudSave').style.display = 'inline-flex';
    await loadFromSupabase();
    showView('viewSetup');
    renderSetupForm();
  }
}

async function logoutUser() {
  await supabaseClient.auth.signOut();
  currentUser = null;
  document.getElementById('btnLogout').style.display = 'none';
  document.getElementById('btnCloudSave').style.display = 'none';
  showView('viewAuth');
}

async function saveToSupabase() {
  if (!currentUser) return;
  const f = fighters[0];
  const { data: existing } = await supabaseClient.from('pets').select('id').eq('user_id', currentUser.id).limit(1);
  const payload = {
    user_id: currentUser.id,
    name: f.name,
    image_url: f.image,
    traits: { traits: f.traits, pronouns: f.pronouns, dialogues: f.dialogues }
  };
  if (existing && existing.length > 0) {
    await supabaseClient.from('pets').update(payload).eq('id', existing[0].id);
  } else {
    await supabaseClient.from('pets').insert(payload);
  }
  alert(lang === 'th' ? 'บันทึก P1 ลงคลาวด์เรียบร้อย!' : 'Saved P1 to Cloud!');
}

async function loadFromSupabase() {
  if (!currentUser) return;
  const { data } = await supabaseClient.from('pets').select('*').eq('user_id', currentUser.id).limit(1);
  if (data && data.length > 0) {
    const row = data[0];
    fighters[0].name = row.name || fighters[0].name;
    fighters[0].image = row.image_url || '';
    if (row.traits) {
      fighters[0].traits = row.traits.traits || fighters[0].traits;
      fighters[0].pronouns = row.traits.pronouns || fighters[0].pronouns;
      fighters[0].dialogues = row.traits.dialogues || fighters[0].dialogues;
    }
  }
}

function switchFighterTab(idx) {
  activeTab = idx;
  document.getElementById('tabP1').classList.toggle('active', idx === 0);
  document.getElementById('tabP2').classList.toggle('active', idx === 1);
  renderSetupForm();
}

function renderSetupForm() {
  const f = fighters[activeTab];
  document.getElementById('charName').value = f.name;
  document.getElementById('pMe').value = f.pronouns.me;
  document.getElementById('pYou').value = f.pronouns.you;
  document.getElementById('pThey').value = f.pronouns.they;

  const preview = document.getElementById('avatarPreview');
  if (f.image) {
    preview.innerHTML = `<img src="${f.image}" />`;
  } else {
    preview.innerHTML = `<span style="font-size:3rem;">${activeTab === 0 ? '👾' : '👹'}</span>`;
  }

  const grid = document.getElementById('traitsGrid');
  const selectedKeys = Object.keys(f.traits);
  grid.innerHTML = '';
  TRAITS_LIST.forEach(t => {
    const isSelected = selectedKeys.includes(t.id);
    const isDisabled = !isSelected && selectedKeys.length >= 4;
    const chip = document.createElement('div');
    chip.className = `trait-chip ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`;
    chip.innerHTML = `<span>${t[lang]}</span><span>${isSelected ? '✓' : '+'}</span>`;
    chip.onclick = () => toggleTrait(t.id);
    grid.appendChild(chip);
  });

  const sliders = document.getElementById('slidersArea');
  sliders.innerHTML = '';
  selectedKeys.forEach(k => {
    const tObj = TRAITS_LIST.find(x => x.id === k);
    if (!tObj) return;
    const val = f.traits[k];
    const row = document.createElement('div');
    row.className = 'slider-row';
    row.innerHTML = `
      <div class="slider-header"><span>${tObj[lang]}</span><span id="val_${k}">${val}%</span></div>
      <input type="range" min="10" max="100" value="${val}" oninput="updateTraitVal('${k}', this.value)" />
    `;
    sliders.appendChild(row);
  });

  renderDialogueList();
}

function saveCurrentForm() {
  const f = fighters[activeTab];
  f.name = document.getElementById('charName').value || (activeTab === 0 ? 'P1' : 'P2');
  f.pronouns.me = document.getElementById('pMe').value || 'ข้า';
  f.pronouns.you = document.getElementById('pYou').value || 'เจ้า';
  f.pronouns.they = document.getElementById('pThey').value || 'พวกเจ้า';
  persistLocalFighters();
}

function toggleTrait(id) {
  const f = fighters[activeTab];
  if (f.traits[id] !== undefined) {
    delete f.traits[id];
  } else if (Object.keys(f.traits).length < 4) {
    f.traits[id] = 80;
  }
  persistLocalFighters();
  renderSetupForm();
}

function updateTraitVal(id, val) {
  fighters[activeTab].traits[id] = parseInt(val);
  document.getElementById(`val_${id}`).textContent = `${val}%`;
  persistLocalFighters();
}

function handleImageUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(ev) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const MAX_SIZE = 280;
      let w = img.width, h = img.height;
      if (w > h && w > MAX_SIZE) { h *= MAX_SIZE / w; w = MAX_SIZE; }
      else if (h > MAX_SIZE) { w *= MAX_SIZE / h; h = MAX_SIZE; }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      fighters[activeTab].image = canvas.toDataURL('image/png');
      persistLocalFighters();
      renderSetupForm();
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
}

function renderDialogueList() {
  const list = document.getElementById('dialogueList');
  const f = fighters[activeTab];
  list.innerHTML = '';
  const evLabels = {
    headbutt: I18N[lang].evHeadbutt,
    throw: I18N[lang].evThrow,
    miss: I18N[lang].evMiss,
    hurt: I18N[lang].evHurt,
    stun: I18N[lang].evStun,
    win: I18N[lang].evWin
  };
  f.dialogues.forEach((d, idx) => {
    const item = document.createElement('div');
    item.className = 'dialogue-item';
    item.innerHTML = `
      <span class="dialogue-tag">${evLabels[d.event] || d.event}</span>
      <span class="dialogue-text">${d.text}</span>
      <button class="btn btn-danger" onclick="removeDialogue(${idx})">✕</button>
    `;
    list.appendChild(item);
  });
}

function addDialogue() {
  const ev = document.getElementById('newDiagEvent').value;
  const txt = document.getElementById('newDiagText').value.trim();
  if (!txt) return;
  fighters[activeTab].dialogues.unshift({ event: ev, text: txt });
  document.getElementById('newDiagText').value = '';
  persistLocalFighters();
  renderDialogueList();
}

function removeDialogue(idx) {
  fighters[activeTab].dialogues.splice(idx, 1);
  persistLocalFighters();
  renderDialogueList();
}

function clearAllDialogues() {
  fighters[activeTab].dialogues = [];
  persistLocalFighters();
  renderDialogueList();
}

function resetDefaultDialogues() {
  fighters[activeTab].dialogues = getDefaultDialogues(lang);
  persistLocalFighters();
  renderDialogueList();
}
// ================= 3A. BATTLE SETUP & HELPERS =================
const canvas = document.getElementById('arenaCanvas');
const ctx = canvas.getContext('2d');
const WORLD_W = 1125;
const VIEW_W = 900;
const VIEW_H = 1200;
const GROUND_Y = 980;

let animFrameId = null;
let battleState = null;

const EMOJI_ITEMS = [
  { icon: '🩴', type: 'dmg', dmg: 12 },
  { icon: '🧱', type: 'dmg', dmg: 18 },
  { icon: '🍳', type: 'dmg', dmg: 16 },
  { icon: '💩', type: 'dmg', dmg: 10 },
  { icon: '🌵', type: 'dmg', dmg: 15 },
  { icon: '🍌', type: 'stun', dmg: 8 },
  { icon: '💣', type: 'dmg', dmg: 24 },
  { icon: '🍗', type: 'heal', heal: 18 },
  { icon: '🧋', type: 'heal', heal: 15 }
];

function getActiveMapMode() {
  const sel = document.getElementById('mapTimeSelect').value;
  if (sel === 'day' || sel === 'night') return sel;
  const hr = new Date().getHours();
  return (hr >= 6 && hr < 18) ? 'day' : 'night';
}

function formatSpeech(fighter, eventType) {
  const pool = fighter.dialogues.filter(d => d.event === eventType);
  if (pool.length === 0) return null;
  const raw = pool[Math.floor(Math.random() * pool.length)].text;
  return raw
    .replace(/\{me\}/g, fighter.pronouns.me)
    .replace(/\{you\}/g, fighter.pronouns.you)
    .replace(/\{they\}/g, fighter.pronouns.they);
}

function addLog(msg) {
  const logBox = document.getElementById('battleLog');
  const div = document.createElement('div');
  div.className = 'log-entry';
  div.textContent = msg;
  logBox.prepend(div);
}

function cheerSide(side) {
  if (!battleState) return;
  const actor = battleState.actors[side];
  const hearts = ['💖', '🔥', '📣', '✨', '🎉'];
  const icon = hearts[Math.floor(Math.random() * hearts.length)];
  spawnEffect(actor.x + (Math.random() * 60 - 30), actor.y - 170, icon, '#ff6b9d');
}

function createBattleActor(fData, side) {
  const imgObj = new Image();
  if (fData.image) imgObj.src = fData.image;
  const tr = fData.traits || {};
  const speedBonus = ((tr.hyper || 0) + (tr.brat || 0)) * 0.025 - ((tr.sleepy || 0) * 0.02);
  return {
    side, data: fData, img: imgObj, hasImg: !!fData.image,
    hp: 100, maxHp: 100,
    x: side === 0 ? 320 : WORLD_W - 320, y: GROUND_Y,
    vx: 0, vy: 0, facing: side === 0 ? 1 : -1, jumps: 0,
    scaleX: 1, scaleY: 1, angle: 0, isKO: false, stunTimer: 0,
    emotion: '', emotionTimer: 0, speech: '', speechTimer: 0,
    aiCooldown: 30 + Math.random() * 30,
    baseSpeed: Math.max(3.5, 6 + speedBonus)
  };
}

function startBattle() {
  saveCurrentForm();
  if (animFrameId) cancelAnimationFrame(animFrameId);
  document.getElementById('koOverlay').classList.remove('show');
  document.getElementById('battleLog').innerHTML = '';

  const a1 = createBattleActor(fighters, 0);
  const a2 = createBattleActor(fighters, 1);

  document.getElementById('hudName1').textContent = a1.data.name;
  document.getElementById('hudName2').textContent = a2.data.name;
  updateHpHud(a1, a2);

  battleState = {
    actors: [a1, a2], items: [], projectiles: [], effects: [],
    camX: (WORLD_W - VIEW_W) / 2, cloudOffset: 0,
    itemSpawnTimer: 90, mapMode: getActiveMapMode(), over: false
  };

  showView('viewBattle');
  addLog(lang === 'th' ? '🔔 ระฆังดัง! เริ่มศึกโขกเหม่ง!' : '🔔 Ding! The brawl begins!');
  battleLoop();
}

function backToSetup() {
  if (animFrameId) cancelAnimationFrame(animFrameId);
  showView('viewSetup');
}

function updateHpHud(a1, a2) {
  const h1 = Math.max(0, Math.round(a1.hp));
  const h2 = Math.max(0, Math.round(a2.hp));
  document.getElementById('hudHpText1').textContent = h1;
  document.getElementById('hudHpText2').textContent = h2;
  document.getElementById('hudHpBar1').style.width = `${h1}%`;
  document.getElementById('hudHpBar2').style.width = `${h2}%`;
}

function triggerSpeech(actor, eventType, duration = 110) {
  const txt = formatSpeech(actor.data, eventType);
  if (txt) { actor.speech = txt; actor.speechTimer = duration; }
}

function triggerEmotion(actor, emoji, duration = 70) {
  actor.emotion = emoji; actor.emotionTimer = duration;
}

function spawnEffect(x, y, text, color = '#ffbe55') {
  battleState.effects.push({ x, y, text, color, life: 45, vy: -2.2 });
}

function battleLoop() {
  updateBattle();
  drawBattle();
  animFrameId = requestAnimationFrame(battleLoop);
}
// ================= 3B. BATTLE AI & PHYSICS UPDATE =================
function updateBattle() {
  const st = battleState;
  st.cloudOffset = (st.cloudOffset + 0.35) % WORLD_W;

  const midX = (st.actors.x + st.actors.x) / 2;
  const targetCamX = Math.max(0, Math.min(WORLD_W - VIEW_W, midX - VIEW_W / 2));
  st.camX += (targetCamX - st.camX) * 0.08;

  if (!st.over) {
    st.itemSpawnTimer--;
    if (st.itemSpawnTimer <= 0 && st.items.length < 2) {
      const proto = EMOJI_ITEMS[Math.floor(Math.random() * EMOJI_ITEMS.length)];
      st.items.push({
        ...proto, x: 180 + Math.random() * (WORLD_W - 360),
        y: 250, vy: 0, grounded: false
      });
      st.itemSpawnTimer = 150 + Math.random() * 120;
    }
  }

  st.items.forEach(it => {
    if (!it.grounded) {
      it.vy += 0.6; it.y += it.vy;
      if (it.y >= GROUND_Y - 25) { it.y = GROUND_Y - 25; it.grounded = true; }
    }
  });

  st.actors.forEach((me, idx) => {
    const opp = st.actors[1 - idx];
    me.scaleX += (1 - me.scaleX) * 0.15;
    me.scaleY += (1 - me.scaleY) * 0.15;
    if (me.speechTimer > 0) me.speechTimer--;
    if (me.emotionTimer > 0) me.emotionTimer--;

    if (me.isKO) {
      me.x += me.vx; me.y += me.vy; me.vy += 0.45;
      me.angle += 0.32 * (me.vx >= 0 ? 1 : -1);
      return;
    }

    if (me.stunTimer > 0) {
      me.stunTimer--; me.emotion = '💫'; me.emotionTimer = 5; me.vx *= 0.85;
    } else if (!st.over) {
      me.facing = opp.x >= me.x ? 1 : -1;
      me.aiCooldown--;

      let targetItem = null;
      if (st.items.length > 0) {
        const glutton = me.data.traits.glutton || 0;
        const brat = me.data.traits.brat || 0;
        targetItem = st.items.find(it => (it.type === 'heal' && (me.hp < 75 || glutton > 40)) || brat > 30 || Math.random() < 0.65);
      }

      if (targetItem) {
        const dir = targetItem.x > me.x ? 1 : -1;
        me.vx += dir * 0.7;
        if (Math.abs(targetItem.x - me.x) < 65 && Math.abs(targetItem.y - me.y) < 110) {
          st.items = st.items.filter(x => x !== targetItem);
          if (targetItem.type === 'heal') {
            me.hp = Math.min(me.maxHp, me.hp + targetItem.heal);
            updateHpHud(st.actors, st.actors);
            triggerEmotion(me, '✨', 60);
            spawnEffect(me.x, me.y - 140, `+${targetItem.heal} HP!`, '#38c172');
            addLog(`${me.data.name} กิน ${targetItem.icon} (+${targetItem.heal} HP)`);
          } else {
            const isMiss = Math.random() < 0.35;
            const dist = opp.x - me.x;
            const throwVx = dist / 36;
            const throwVy = isMiss ? -25 - Math.random() * 6 : -17.5;
            st.projectiles.push({
              icon: targetItem.icon, type: targetItem.type, dmg: targetItem.dmg,
              ownerSide: me.side, x: me.x, y: me.y - 80, vx: throwVx, vy: throwVy, rot: 0
            });
            me.scaleX = 1.25; me.scaleY = 0.8;
            triggerSpeech(me, 'throw', 90);
            addLog(`${me.data.name} ปา ${targetItem.icon} ใส่ ${opp.data.name}!`);
          }
        }
      } else if (me.aiCooldown <= 0) {
        const tr = me.data.traits;
        const roll = Math.random() * 100;
        const timid = tr.timid || 0;
        const hyper = tr.hyper || 0;

        if (timid > 50 && Math.abs(opp.x - me.x) < 260 && roll < timid * 0.7) {
          me.vx = -me.facing * 15;
          triggerEmotion(me, '💦', 45);
          me.aiCooldown = 45;
        } else if (roll < 35 + hyper * 0.25) {
          if (me.jumps < 2) {
            me.vy = -21; me.vx = me.facing * (me.baseSpeed + 5); me.jumps++;
            me.scaleX = 0.8; me.scaleY = 1.25;
            if (me.jumps === 2) spawnEffect(me.x, me.y, '💫 Double Jump!', '#7c83fd');
            else triggerSpeech(me, 'headbutt', 85);
          }
          me.aiCooldown = 35;
        } else {
          me.vx = me.facing * (me.baseSpeed + 7);
          me.scaleX = 1.2; me.scaleY = 0.85;
          if (Math.random() < 0.4) triggerSpeech(me, 'headbutt', 85);
          me.aiCooldown = 40 + Math.random() * 35;
        }
      }
    }

    me.vx *= 0.88; me.x += me.vx; me.vy += 0.95; me.y += me.vy;
    if (me.y >= GROUND_Y) {
      if (me.vy > 5) { me.scaleX = 1.18; me.scaleY = 0.84; }
      me.y = GROUND_Y; me.vy = 0; me.jumps = 0;
    }
    if (me.x < 110) { me.x = 110; me.vx = Math.abs(me.vx); }
    if (me.x > WORLD_W - 110) { me.x = WORLD_W - 110; me.vx = -Math.abs(me.vx); }
  });

  if (!st.over) {
    const a1 = st.actors, a2 = st.actors;
    const dx = a2.x - a1.x;
    if (Math.abs(dx) < 105 && Math.abs(a2.y - a1.y) < 110) {
      const speed1 = Math.abs(a1.vx) + (a1.y < GROUND_Y ? 6 : 0);
      const speed2 = Math.abs(a2.vx) + (a2.y < GROUND_Y ? 6 : 0);
      const pushDir = dx >= 0 ? 1 : -1;

      a1.vx = -pushDir * 14; a2.vx = pushDir * 14;
      a1.vy = -8; a2.vy = -8;
      a1.scaleX = 0.75; a1.scaleY = 1.25; a2.scaleX = 0.75; a2.scaleY = 1.25;

      const attacker = speed1 >= speed2 ? a1 : a2;
      const victim = attacker === a1 ? a2 : a1;
      applyDamage(victim, attacker, 8 + Math.floor(Math.random() * 8), '💥 โป๊ก! เต็มเหม่ง!');
    }
  }

  for (let i = st.projectiles.length - 1; i >= 0; i--) {
    const p = st.projectiles[i];
    p.x += p.vx; p.y += p.vy; p.vy += 0.75; p.rot += 0.25;
    const target = st.actors[1 - p.ownerSide];
    const thrower = st.actors[p.ownerSide];

    if (!st.over && !target.isKO && Math.abs(p.x - target.x) < 75 && Math.abs(p.y - (target.y - 80)) < 95) {
      st.projectiles.splice(i, 1);
      target.vx = (p.vx >= 0 ? 1 : -1) * 14;
      target.scaleX = 1.3; target.scaleY = 0.7;
      if (p.type === 'stun') { target.stunTimer = 85; triggerSpeech(target, 'stun', 95); }
      applyDamage(target, thrower, p.dmg, `${p.icon} -${p.dmg}!`);
      continue;
    }

    if (p.y > GROUND_Y + 40 || p.x < -100 || p.x > WORLD_W + 100) {
      st.projectiles.splice(i, 1);
      if (!st.over) {
        spawnEffect(target.x, target.y - 160, lang === 'th' ? '💨 วืดดด!' : '💨 MISS!', '#a89fb8');
        triggerSpeech(thrower, 'miss', 85);
        addLog(`${thrower.data.name} ปา ${p.icon} วืดข้ามหัว!`);
      }
    }
  }

  for (let i = st.effects.length - 1; i >= 0; i--) {
    const ef = st.effects[i];
    ef.y += ef.vy; ef.life--;
    if (ef.life <= 0) st.effects.splice(i, 1);
  }
}

function applyDamage(victim, attacker, dmg, hitLabel) {
  victim.hp = Math.max(0, victim.hp - dmg);
  updateHpHud(battleState.actors, battleState.actors);
  spawnEffect(victim.x, victim.y - 140, `${hitLabel} (-${dmg})`, '#ff5964');
  triggerEmotion(victim, '💢', 65);
  if (victim.stunTimer <= 0) triggerSpeech(victim, 'hurt', 90);
  addLog(`${attacker.data.name} อัด ${victim.data.name} (-${dmg} HP)`);

  if (victim.hp <= 0 && !battleState.over) {
    battleState.over = true;
    victim.isKO = true;
    victim.vy = -26;
    victim.vx = (victim.x >= attacker.x ? 1 : -1) * 16;
    triggerSpeech(attacker, 'win', 200);
    addLog(`🏆 ${attacker.data.name} ชนะน็อก!`);

    setTimeout(() => {
      document.getElementById('winnerText').textContent = attacker.data.name + I18N[lang].winnerSuffix;
      document.getElementById('koOverlay').classList.add('show');
    }, 1100);
  }
}
// ================= 3C. CANVAS RENDERING & INIT =================
function drawBattle() {
  const st = battleState;
  ctx.clearRect(0, 0, VIEW_W, VIEW_H);

  const layers = loadedImages[st.mapMode];
  layers.forEach(layer => {
    if (layer.img.complete && layer.img.naturalWidth > 0) {
      let drawX = -st.camX * layer.parallax;
      if (layer.isCloud) {
        const cx = ((drawX + st.cloudOffset) % WORLD_W);
        ctx.drawImage(layer.img, cx, 0, WORLD_W, VIEW_H);
        ctx.drawImage(layer.img, cx - WORLD_W, 0, WORLD_W, VIEW_H);
      } else {
        ctx.drawImage(layer.img, drawX, 0, WORLD_W, VIEW_H);
      }
    }
  });

  ctx.save();
  ctx.translate(-st.camX, 0);

  ctx.font = '56px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  st.items.forEach(it => {
    const bob = Math.sin(Date.now() * 0.008) * 6;
    ctx.fillText(it.icon, it.x, it.y + bob);
  });

  st.actors.forEach(actor => {
    if (!actor.isKO) {
      const shadowScale = Math.max(0.4, 1 - (GROUND_Y - actor.y) / 400);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
      ctx.beginPath();
      ctx.ellipse(actor.x, GROUND_Y + 8, 55 * shadowScale, 14 * shadowScale, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.save();
    ctx.translate(actor.x, actor.y - 85);
    ctx.rotate(actor.angle);
    ctx.scale(actor.scaleX * actor.facing, actor.scaleY);

    if (actor.hasImg && actor.img.complete && actor.img.naturalWidth > 0) {
      const aspect = actor.img.naturalWidth / actor.img.naturalHeight;
      const drawH = 185;
      const drawW = drawH * aspect;
      ctx.drawImage(actor.img, -drawW / 2, -drawH / 2, drawW, drawH);
    } else {
      ctx.font = '130px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(actor.side === 0 ? '👾' : '👹', 0, 0);
    }
    ctx.restore();

    if (actor.emotionTimer > 0 && actor.emotion) {
      ctx.font = '48px sans-serif';
      ctx.textAlign = 'center';
      const wobble = actor.emotion === '💫' ? Math.sin(Date.now() * 0.02) * 14 : 0;
      ctx.fillText(actor.emotion, actor.x + 45 + wobble, actor.y - 185);
    }

    if (actor.speechTimer > 0 && actor.speech) {
      drawSpeechBubble(actor.x, actor.y - 215, actor.speech);
    }
  });

  st.projectiles.forEach(p => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.font = '54px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(p.icon, 0, 0);
    ctx.restore();
  });

  st.effects.forEach(ef => {
    ctx.save();
    ctx.font = '800 34px Mali, sans-serif';
    ctx.textAlign = 'center';
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#ffffff';
    ctx.strokeText(ef.text, ef.x, ef.y);
    ctx.fillStyle = ef.color;
    ctx.fillText(ef.text, ef.x, ef.y);
    ctx.restore();
  });

  ctx.restore();
}

function drawSpeechBubble(x, y, text) {
  ctx.save();
  ctx.font = '700 26px Mali, sans-serif';
  const maxWidth = 340;
  const words = text.split('');
  let lines = [];
  let currentLine = '';

  for (let ch of words) {
    const test = currentLine + ch;
    if (ctx.measureText(test).width > maxWidth) {
      lines.push(currentLine);
      currentLine = ch;
    } else {
      currentLine = test;
    }
  }
  if (currentLine) lines.push(currentLine);

  const lineHeight = 34;
  const boxW = Math.min(maxWidth + 32, Math.max(...lines.map(l => ctx.measureText(l).width)) + 34);
  const boxH = lines.length * lineHeight + 22;
  const bx = Math.max(stClamp(x - boxW / 2, 20, WORLD_W - boxW - 20), 20);
  const by = Math.max(20, y - boxH);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.strokeStyle = '#3b2e35';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(bx, by, boxW, boxH, 18);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#3b2e35';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  lines.forEach((line, i) => {
    ctx.fillText(line, bx + boxW / 2, by + 12 + i * lineHeight);
  });
  ctx.restore();
}

function stClamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

applyTranslations();
