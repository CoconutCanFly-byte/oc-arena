// =====================================================
//  ศึกโขกเหม่ง OC — ไฟล์เดียวจบ (แทน game.js / fix.js / app.js เดิม)
// =====================================================

// ---------- ตั้งค่า ----------
const SB_URL = 'https://fcruiozuldhohcivfosx.supabase.co';
const SB_KEY = 'sb_publishable_g7_EjZW4iCy3P7TqamhwMg_8Brgtwkk';
let sb = null;
try {
  if (window.supabase) sb = window.supabase.createClient(SB_URL, SB_KEY);
} catch (e) {
  console.warn('Supabase ใช้ไม่ได้ เล่นแบบ guest ได้ตามปกติ', e);
}
let currentUser = null;

const WORLD_W = 1125;
const VIEW_W = 900;
const VIEW_H = 1200;
const GROUND_Y = 980;
const MAX_TRAITS = 4;
const STORE_KEY = 'oc_arena_f2';
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

let lang = 'th';
let activeTab = 0;

// ---------- ฉากหลัง ----------
const MAP_FILES = {
  day: [
    { file: 'ฟ้าเช้า 600_20261122155739.png', p: 0.1, cloud: false },
    { file: 'เมฆเช้า 600_20261122155741.png', p: 0.2, cloud: true },
    { file: 'เขาหลังสุด 600_20261122155744.png', p: 0.35, cloud: false },
    { file: 'เขาหน้าสุด 600_20261122155747.png', p: 0.6, cloud: false },
    { file: 'หญ้าเช้า 600_20261122155749.png', p: 1.0, cloud: false }
  ],
  night: [
    { file: 'ฟ้ามืด 600_20261122155752.png', p: 0.1, cloud: false },
    { file: 'เมฆมืด 600_20261122160141.png', p: 0.2, cloud: true },
    { file: 'เขามืด 600_20261122155755.png', p: 0.45, cloud: false },
    { file: 'หญ้ามืด 600_20261122155757.png', p: 1.0, cloud: false }
  ]
};
const mapImages = { day: [], night: [] };
for (const mode of Object.keys(MAP_FILES)) {
  for (const l of MAP_FILES[mode]) {
    const img = new Image();
    img.onerror = () => console.warn('โหลดรูปฉากไม่ได้:', l.file);
    img.src = encodeURI(l.file);
    mapImages[mode].push({ img, p: l.p, cloud: l.cloud });
  }
}

// ---------- ข้อความ 2 ภาษา ----------
const I18N = {
  th: {
    appTitle: 'ศึกโขกเหม่ง OC',
    welcomeTitle: 'ศึกโขกเหม่ง OC',
    welcomeDesc: 'ใส่ OC สองตัว แล้วนั่งดูมันวิ่งโขกหัว ปาของใส่กันเอง ใครรอดใครแพ้ก็ดูดวงเอา',
    btnGuest: 'เข้าเล่นเลย ไม่ต้องล็อกอิน',
    cloudTitle: '☁️ ล็อกอินเพื่อเซฟบนคลาวด์',
    btnLogin: 'ล็อกอิน',
    btnSignup: 'สมัคร',
    mapSelectLabel: 'ฉากหลัง:',
    mapAuto: 'ตามเวลาเครื่อง',
    mapDay: 'กลางวัน',
    mapNight: 'กลางคืน',
    fighter1: 'ฝั่งซ้าย (P1)',
    fighter2: 'ฝั่งขวา (P2)',
    btnUpload: 'อัปรูป OC (PNG พื้นใสสวยสุด)',
    labelName: 'ชื่อ',
    pronounTitle: 'สรรพนาม',
    pMe: 'เรียกตัวเอง',
    pYou: 'เรียกอีกฝ่าย',
    pThey: 'เรียกรวมๆ',
    traitTitle: 'นิสัย (เลือกได้ไม่เกิน 4)',
    traitNote: 'นิสัยมีผลกับความไว การพุ่งโขก การแย่งของ และอิโมจิเหนือหัว',
    dialogueTitle: 'คำพูดตอนต่างๆ',
    btnClearAll: 'ลบหมด',
    dialogueNote: 'ใส่ {me} {you} {they} ในประโยคได้ จะถูกแทนด้วยสรรพนามที่ตั้งไว้',
    evHeadbutt: 'พุ่งโขก',
    evThrow: 'ปาของ',
    evMiss: 'ปาพลาด',
    evHurt: 'โดนตี',
    evStun: 'มึนหัว',
    evWin: 'ชนะ',
    btnResetDiag: 'คืนค่าเดิม',
    btnSaveCloud: 'เซฟขึ้นคลาวด์',
    btnStartBattle: 'เริ่มเลย!',
    cheer1: 'เชียร์ซ้าย',
    cheer2: 'เชียร์ขวา',
    btnRematch: 'เอาอีกยก',
    btnEdit: 'แก้ตัวละคร',
    btnBackSetup: 'กลับไปตั้งค่า',
    btnRestart: 'เริ่มใหม่',
    winnerSuffix: ' ชนะ!',
    // ข้อความในเกม
    logStart: '🔔 ตีกันเลย!',
    logEat: '{n} กิน {i} (+{v} HP)',
    logThrow: '{n} ปา {i} ใส่ {o}',
    logMiss: '{n} ปา {i} ไม่โดน',
    logHit: '{a} อัด {v} (-{d})',
    logKO: '🏆 {a} น็อกสำเร็จ',
    fxClash: '💥 โป๊ก!',
    fxMiss: '💨 วืด!',
    fxDouble: '💫 กระโดดสองชั้น!',
    // ข้อความแจ้งเตือน
    needLogin: 'ใส่อีเมลกับรหัสผ่านก่อนนะ',
    signupCheck: 'สมัครแล้ว เปิดอีเมลกดยืนยันก่อน แล้วค่อยกลับมาล็อกอิน',
    badYoutube: 'ลิงก์ YouTube ไม่ถูกต้อง',
    savedCloud: 'เซฟ P1 ขึ้นคลาวด์แล้ว',
    saveFail: 'เซฟไม่สำเร็จ: ',
    loadFail: 'ดึงข้อมูลจากคลาวด์ไม่ได้: '
  },
  en: {
    appTitle: 'OC Headbutt Arena',
    welcomeTitle: 'OC Headbutt Arena',
    welcomeDesc: 'Set up two OCs and watch them headbutt and throw stuff at each other. Pure luck, no controls.',
    btnGuest: 'Play now, no login',
    cloudTitle: '☁️ Log in to save to the cloud',
    btnLogin: 'Log in',
    btnSignup: 'Sign up',
    mapSelectLabel: 'Background:',
    mapAuto: 'Match my clock',
    mapDay: 'Day',
    mapNight: 'Night',
    fighter1: 'Left (P1)',
    fighter2: 'Right (P2)',
    btnUpload: 'Upload OC (transparent PNG works best)',
    labelName: 'Name',
    pronounTitle: 'Pronouns',
    pMe: 'Self',
    pYou: 'Other side',
    pThey: 'Everyone',
    traitTitle: 'Traits (up to 4)',
    traitNote: 'Traits change speed, how often they charge, item grabbing and the emoji over their head',
    dialogueTitle: 'Lines for each moment',
    btnClearAll: 'Clear all',
    dialogueNote: 'Use {me} {you} {they} in a line and they get swapped for the pronouns you set.',
    evHeadbutt: 'Charge',
    evThrow: 'Throw',
    evMiss: 'Missed',
    evHurt: 'Got hit',
    evStun: 'Dizzy',
    evWin: 'Win',
    btnResetDiag: 'Restore defaults',
    btnSaveCloud: 'Save to cloud',
    btnStartBattle: "Let's go!",
    cheer1: 'Cheer left',
    cheer2: 'Cheer right',
    btnRematch: 'One more round',
    btnEdit: 'Edit OCs',
    btnBackSetup: 'Back to setup',
    btnRestart: 'Restart',
    winnerSuffix: ' wins!',
    logStart: '🔔 Fight!',
    logEat: '{n} ate {i} (+{v} HP)',
    logThrow: '{n} threw {i} at {o}',
    logMiss: "{n}'s {i} missed",
    logHit: '{a} hit {v} (-{d})',
    logKO: '🏆 {a} got the knockout',
    fxClash: '💥 BONK!',
    fxMiss: '💨 MISS!',
    fxDouble: '💫 Double jump!',
    needLogin: 'Enter an email and password first',
    signupCheck: 'Signed up. Confirm the email we sent, then log in.',
    badYoutube: 'That YouTube link looks wrong',
    savedCloud: 'P1 saved to the cloud',
    saveFail: "Couldn't save: ",
    loadFail: "Couldn't load from the cloud: "
  }
};
const tr = key => (I18N[lang] && I18N[lang][key]) || key;
const fmt = (s, vars) => s.replace(/\{(\w+)\}/g, (m, k) => (vars[k] !== undefined ? vars[k] : m));

// ---------- นิสัย ----------
const TRAITS = [
  { id: 'brat', th: 'เด็กเปรต', en: 'Bratty', emo: '😈' },
  { id: 'clingy', th: 'ขี้อ้อน', en: 'Clingy', emo: '🥺' },
  { id: 'tsundere', th: 'ซึนเดเระ', en: 'Tsundere', emo: '😤' },
  { id: 'sleepy', th: 'ขี้เซา', en: 'Sleepy', emo: '💤' },
  { id: 'glutton', th: 'ตะกละ', en: 'Glutton', emo: '🤤' },
  { id: 'arrogant', th: 'หยิ่ง', en: 'Arrogant', emo: '😏' },
  { id: 'timid', th: 'ขี้กลัว', en: 'Timid', emo: '😰' },
  { id: 'hyper', th: 'ไฮเปอร์', en: 'Hyper', emo: '⚡' }
];

// ---------- คำพูดตั้งต้น ----------
function defaultDiags(l) {
  if (l === 'en') {
    return [
      { event: 'headbutt', text: 'Headbutt incoming, {you}!' },
      { event: 'headbutt', text: '{me} has a hard head, just so you know' },
      { event: 'throw', text: 'Catch, {you}!' },
      { event: 'throw', text: 'Present from {me}~' },
      { event: 'miss', text: "Huh? Why didn't that land?" },
      { event: 'miss', text: 'I just slipped. Round two!' },
      { event: 'hurt', text: 'Ow! That actually hurt, {you}!' },
      { event: 'hurt', text: "You're so dead, {you}" },
      { event: 'stun', text: 'Seeing stars here...' },
      { event: 'stun', text: 'Why is the ground spinning...' },
      { event: 'win', text: '{me} wins~ Go train some more, {you}' },
      { event: 'win', text: 'Well? How was that, {you}?' }
    ];
  }
  return [
    { event: 'headbutt', text: 'รับโขกไปหนึ่งที {you}!' },
    { event: 'headbutt', text: 'เหม่ง{me}แข็งนะ จะบอกให้' },
    { event: 'throw', text: 'เอาไปกินซะ {you}!' },
    { event: 'throw', text: 'ของฝากจาก{me}~' },
    { event: 'miss', text: 'เอ๊ะ ทำไมไม่โดนล่ะ' },
    { event: 'miss', text: 'แค่ลื่นเฉยๆ เดี๋ยวเอาใหม่' },
    { event: 'hurt', text: 'โอ๊ย! {you}ตีแรงไปแล้ว' },
    { event: 'hurt', text: 'เดี๋ยวเถอะ {you}' },
    { event: 'stun', text: '{me}เห็นดาวเต็มเลย...' },
    { event: 'stun', text: 'โลกมันหมุนอ่ะ...' },
    { event: 'win', text: '{me}ชนะแล้ว~ {you}กลับไปฝึกมาใหม่นะ' },
    { event: 'win', text: 'ว่าไงล่ะ {you}' }
  ];
}

function makeDefaultFighters() {
  return [
    { name: 'น้องเปรตซ่า', image: '', pronouns: { me: 'ข้า', you: 'เจ้า', they: 'พวกเจ้า' }, traits: { brat: 100, hyper: 60 }, dialogues: defaultDiags('th') },
    { name: 'เจ้าก้อนมึน', image: '', pronouns: { me: 'กู', you: 'มึง', they: 'พวกมัน' }, traits: { sleepy: 80, glutton: 70 }, dialogues: defaultDiags('th') }
  ];
}

// กันข้อมูลเก่าใน localStorage / คลาวด์ที่โครงสร้างไม่ครบ
function normalizeFighter(f, def) {
  const out = { ...def };
  if (!f || typeof f !== 'object') return out;
  if (typeof f.name === 'string' && f.name) out.name = f.name;
  if (typeof f.image === 'string') out.image = f.image;
  if (f.pronouns && typeof f.pronouns === 'object') out.pronouns = { ...def.pronouns, ...f.pronouns };
  if (f.traits && typeof f.traits === 'object' && !Array.isArray(f.traits)) out.traits = { ...f.traits };
  if (Array.isArray(f.dialogues)) out.dialogues = f.dialogues.filter(d => d && d.event && typeof d.text === 'string');
  return out;
}

let fighters = makeDefaultFighters();

function persist() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(fighters)); } catch (e) { /* รูปใหญ่เกินโควตา ก็ข้ามไป */ }
}
function loadLocal() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY));
    if (Array.isArray(saved) && saved.length >= 2) {
      const defs = makeDefaultFighters();
      fighters = [normalizeFighter(saved[0], defs[0]), normalizeFighter(saved[1], defs[1])];
    }
  } catch (e) { /* ข้อมูลเสีย ใช้ค่าเริ่มต้น */ }
}

// =====================================================
//  UI ทั่วไป
// =====================================================
function applyTexts() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const v = I18N[lang][el.getAttribute('data-i18n')];
    if (v) el.textContent = v;
  });
}
function toggleTheme() {
  document.body.classList.toggle('dark');
  document.getElementById('btnTheme').textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
}
function toggleLang() {
  lang = lang === 'th' ? 'en' : 'th';
  document.getElementById('btnLang').textContent = lang === 'th' ? 'EN' : 'TH';
  applyTexts();
  renderSetupForm();
}
function showView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}
function loadYoutubeMusic() {
  const url = document.getElementById('ytLinkInput').value.trim();
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|shorts\/)|[?&]v=)([a-zA-Z0-9_-]{11})/);
  if (!m) { alert(tr('badYoutube')); return; }
  const vid = m[1];
  document.getElementById('ytPlayerWrap').style.display = 'block';
  document.getElementById('ytIframe').src =
    `https://www.youtube.com/embed/${vid}?autoplay=1&loop=1&playlist=${vid}`;
}
function enterGuestMode() {
  showView('viewSetup');
  renderSetupForm();
}

// =====================================================
//  บัญชี / คลาวด์
// =====================================================
function setUser(user) {
  currentUser = user;
  document.getElementById('btnLogout').style.display = user ? 'inline-block' : 'none';
  document.getElementById('btnCloudSave').style.display = user ? 'inline-flex' : 'none';
}

async function loadFromCloud() {
  if (!sb || !currentUser) return;
  const { data, error } = await sb.from('pets').select('*').eq('user_id', currentUser.id).limit(1);
  if (error) { alert(tr('loadFail') + error.message); return; }
  if (data && data.length > 0) {
    const r = data[0];
    const p1 = fighters[0];
    if (r.name) p1.name = r.name;
    p1.image = r.image_url || '';
    if (r.traits) {
      if (r.traits.traits) p1.traits = r.traits.traits;
      if (r.traits.pronouns) p1.pronouns = { ...p1.pronouns, ...r.traits.pronouns };
      if (Array.isArray(r.traits.dialogues)) p1.dialogues = r.traits.dialogues;
    }
    persist();
  }
}

async function handleAuth(type) {
  const msg = document.getElementById('authMsg');
  if (!sb) { msg.textContent = 'โหลด Supabase ไม่สำเร็จ (เช็กลิงก์ CDN ใน index.html)'; return; }
  const email = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPass').value.trim();
  if (!email || !password) { msg.textContent = tr('needLogin'); return; }
  msg.textContent = '...';

  const res = type === 'signup'
    ? await sb.auth.signUp({ email, password })
    : await sb.auth.signInWithPassword({ email, password });

  if (res.error) { msg.textContent = res.error.message; return; }

  // เปิดยืนยันอีเมลไว้ → สมัครเสร็จแต่ยังไม่มี session
  if (!res.data.session) { msg.textContent = tr('signupCheck'); return; }

  msg.textContent = '';
  setUser(res.data.user);
  await loadFromCloud();
  showView('viewSetup');
  renderSetupForm();
}

async function logoutUser() {
  if (sb) await sb.auth.signOut();
  setUser(null);
  showView('viewAuth');
}

async function saveToSupabase() {
  if (!sb || !currentUser) return;
  const f = fighters[0];
  const payload = {
    user_id: currentUser.id,
    name: f.name,
    image_url: f.image,
    traits: { traits: f.traits, pronouns: f.pronouns, dialogues: f.dialogues }
  };
  const found = await sb.from('pets').select('id').eq('user_id', currentUser.id).limit(1);
  if (found.error) { alert(tr('saveFail') + found.error.message); return; }
  const res = found.data && found.data.length > 0
    ? await sb.from('pets').update(payload).eq('id', found.data[0].id)
    : await sb.from('pets').insert(payload);
  if (res.error) { alert(tr('saveFail') + res.error.message); return; }
  alert(tr('savedCloud'));
}

async function restoreSession() {
  if (!sb) return;
  try {
    const { data } = await sb.auth.getSession();
    if (data && data.session) {
      setUser(data.session.user);
      await loadFromCloud();
      showView('viewSetup');
      renderSetupForm();
    }
  } catch (e) { /* ไม่มี session ก็ไม่เป็นไร */ }
}

// =====================================================
//  ฟอร์มตั้งค่าตัวละคร
// =====================================================
function switchFighterTab(idx) {
  activeTab = idx;
  document.getElementById('tabP1').classList.toggle('active', idx === 0);
  document.getElementById('tabP2').classList.toggle('active', idx === 1);
  renderSetupForm();
}

function saveCurrentForm() {
  const f = fighters[activeTab];
  f.name = document.getElementById('charName').value || (activeTab === 0 ? 'P1' : 'P2');
  f.pronouns.me = document.getElementById('pMe').value || 'ข้า';
  f.pronouns.you = document.getElementById('pYou').value || 'เจ้า';
  f.pronouns.they = document.getElementById('pThey').value || 'พวกเจ้า';
  persist();
}

function renderSetupForm() {
  const f = fighters[activeTab];
  document.getElementById('charName').value = f.name;
  document.getElementById('pMe').value = f.pronouns.me;
  document.getElementById('pYou').value = f.pronouns.you;
  document.getElementById('pThey').value = f.pronouns.they;

  const preview = document.getElementById('avatarPreview');
  preview.innerHTML = '';
  if (f.image) {
    const im = document.createElement('img');
    im.src = f.image;
    preview.appendChild(im);
  } else {
    const sp = document.createElement('span');
    sp.style.fontSize = '3rem';
    sp.textContent = activeTab === 0 ? '👾' : '👹';
    preview.appendChild(sp);
  }

  // นิสัย
  const keys = Object.keys(f.traits);
  const grid = document.getElementById('traitsGrid');
  grid.innerHTML = '';
  TRAITS.forEach(t => {
    const sel = keys.includes(t.id);
    const chip = document.createElement('div');
    chip.className = 'trait-chip' + (sel ? ' selected' : '') + (!sel && keys.length >= MAX_TRAITS ? ' disabled' : '');
    chip.innerHTML = `<span>${t[lang]}</span><span>${sel ? '✓' : '+'}</span>`;
    chip.addEventListener('click', () => {
      if (f.traits[t.id] !== undefined) delete f.traits[t.id];
      else if (Object.keys(f.traits).length < MAX_TRAITS) f.traits[t.id] = 80;
      persist();
      renderSetupForm();
    });
    grid.appendChild(chip);
  });

  const sliders = document.getElementById('slidersArea');
  sliders.innerHTML = '';
  keys.forEach(k => {
    const t = TRAITS.find(x => x.id === k);
    if (!t) return;
    const row = document.createElement('div');
    row.className = 'slider-row';
    row.innerHTML = `<div class="slider-header"><span>${t[lang]}</span><span class="sv">${f.traits[k]}%</span></div>
      <input type="range" min="10" max="100" value="${f.traits[k]}" />`;
    const input = row.querySelector('input');
    const label = row.querySelector('.sv');
    input.addEventListener('input', () => {
      f.traits[k] = parseInt(input.value, 10);
      label.textContent = input.value + '%';
      persist();
    });
    sliders.appendChild(row);
  });

  renderDialogueList();
}

function renderDialogueList() {
  const f = fighters[activeTab];
  const list = document.getElementById('dialogueList');
  list.innerHTML = '';
  const evLabel = {
    headbutt: tr('evHeadbutt'), throw: tr('evThrow'), miss: tr('evMiss'),
    hurt: tr('evHurt'), stun: tr('evStun'), win: tr('evWin')
  };
  f.dialogues.forEach((d, i) => {
    const item = document.createElement('div');
    item.className = 'dialogue-item';

    const tag = document.createElement('span');
    tag.className = 'dialogue-tag';
    tag.textContent = evLabel[d.event] || d.event;

    const text = document.createElement('span');
    text.className = 'dialogue-text';
    text.textContent = d.text; // ใช้ textContent กัน HTML แปลกๆ ที่พิมพ์เข้ามา

    const del = document.createElement('button');
    del.className = 'btn btn-danger';
    del.textContent = '✕';
    del.addEventListener('click', () => {
      f.dialogues.splice(i, 1);
      persist();
      renderDialogueList();
    });

    item.append(tag, text, del);
    list.appendChild(item);
  });
}

function addDialogue() {
  const input = document.getElementById('newDiagText');
  const txt = input.value.trim();
  if (!txt) return;
  fighters[activeTab].dialogues.unshift({ event: document.getElementById('newDiagEvent').value, text: txt });
  input.value = '';
  persist();
  renderDialogueList();
}
function clearAllDialogues() {
  fighters[activeTab].dialogues = [];
  persist();
  renderDialogueList();
}
function resetDefaultDialogues() {
  fighters[activeTab].dialogues = defaultDiags(lang);
  persist();
  renderDialogueList();
}

function handleImageUpload(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    const img = new Image();
    img.onload = () => {
      const MAX = 280;
      let w = img.width, h = img.height;
      if (w > h && w > MAX) { h *= MAX / w; w = MAX; }
      else if (h > MAX) { w *= MAX / h; h = MAX; }
      const c = document.createElement('canvas');
      c.width = Math.round(w);
      c.height = Math.round(h);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); // ไม่เติมพื้นหลัง PNG ใสจะยังใสอยู่
      fighters[activeTab].image = c.toDataURL('image/png');
      persist();
      renderSetupForm();
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
  e.target.value = ''; // เลือกไฟล์เดิมซ้ำได้
}

// =====================================================
//  การต่อสู้
// =====================================================
const canvas = document.getElementById('arenaCanvas');
const ctx = canvas.getContext('2d');

let animId = null;
let koTimer = null;
let st = null;

const ITEMS = [
  { icon: '🩴', t: 'dmg', v: 12 },
  { icon: '🧱', t: 'dmg', v: 18 },
  { icon: '🍳', t: 'dmg', v: 16 },
  { icon: '💩', t: 'dmg', v: 10 },
  { icon: '🌵', t: 'dmg', v: 15 },
  { icon: '🍌', t: 'stun', v: 8 },
  { icon: '💣', t: 'dmg', v: 24 },
  { icon: '🍗', t: 'heal', v: 18 },
  { icon: '🧋', t: 'heal', v: 15 }
];

function activeMapMode() {
  const sel = document.getElementById('mapTimeSelect').value;
  if (sel === 'day' || sel === 'night') return sel;
  const hr = new Date().getHours();
  return hr >= 6 && hr < 18 ? 'day' : 'night';
}

function makeActor(data, side) {
  const img = new Image();
  if (data.image) img.src = data.image;
  const T = data.traits || {};
  const hyper = T.hyper || 0, brat = T.brat || 0, sleepy = T.sleepy || 0;
  return {
    side, d: data, tr: T, img, hasImg: !!data.image,
    hp: 100,
    x: side === 0 ? 320 : WORLD_W - 320, y: GROUND_Y,
    vx: 0, vy: 0, face: side === 0 ? 1 : -1, jumps: 0,
    sx: 1, sy: 1, ang: 0, ko: false, stun: 0,
    emo: '', emoT: 0, sp: '', spT: 0,
    cd: 30 + Math.random() * 30,
    // ไฮเปอร์/เปรตวิ่งไวขึ้น ขี้เซาช้าลง
    speed: clamp(1 + (hyper * 0.004 + brat * 0.002) - sleepy * 0.004, 0.6, 1.5),
    // ตัวคูณช่วงพักระหว่างท่า ยิ่งน้อยยิ่งรัวไว
    rest: clamp(1 - hyper * 0.003 + sleepy * 0.004, 0.6, 1.5)
  };
}

function startBattle() {
  saveCurrentForm();
  if (animId) cancelAnimationFrame(animId);
  if (koTimer) { clearTimeout(koTimer); koTimer = null; }
  document.getElementById('koOverlay').classList.remove('show');
  document.getElementById('battleLog').innerHTML = '';

  const a1 = makeActor(fighters[0], 0);
  const a2 = makeActor(fighters[1], 1);
  document.getElementById('hudName1').textContent = a1.d.name;
  document.getElementById('hudName2').textContent = a2.d.name;

  st = {
    actors: [a1, a2], items: [], projs: [], efs: [],
    camX: (WORLD_W - VIEW_W) / 2, cloudX: 0,
    spawnT: 80, clashCd: 0, mode: activeMapMode(), over: false
  };
  updateHud();
  showView('viewBattle');
  logMsg(tr('logStart'));
  loop();
}

function backToSetup() {
  if (animId) cancelAnimationFrame(animId);
  animId = null;
  if (koTimer) { clearTimeout(koTimer); koTimer = null; }
  showView('viewSetup');
}

function cheerSide(side) {
  if (!st) return;
  const a = st.actors[side];
  const icons = ['💖', '🔥', '📣', '✨', '🎉'];
  spawnFx(a.x + (Math.random() * 60 - 30), a.y - 170, icons[Math.floor(Math.random() * icons.length)], '#ff6b9d');
}

function logMsg(t) {
  const d = document.createElement('div');
  d.className = 'log-entry';
  d.textContent = t;
  document.getElementById('battleLog').prepend(d);
}

function updateHud() {
  const [a1, a2] = st.actors;
  const h1 = Math.max(0, Math.round(a1.hp)), h2 = Math.max(0, Math.round(a2.hp));
  document.getElementById('hudHpText1').textContent = h1;
  document.getElementById('hudHpText2').textContent = h2;
  document.getElementById('hudHpBar1').style.width = h1 + '%';
  document.getElementById('hudHpBar2').style.width = h2 + '%';
}

function say(a, ev, dur = 95) {
  const pool = a.d.dialogues.filter(x => x.event === ev);
  if (!pool.length) return;
  const raw = pool[Math.floor(Math.random() * pool.length)].text;
  a.sp = raw
    .replace(/\{me\}/g, a.d.pronouns.me)
    .replace(/\{you\}/g, a.d.pronouns.you)
    .replace(/\{they\}/g, a.d.pronouns.they);
  a.spT = dur;
}
function emote(a, emoji, dur = 60) { a.emo = emoji; a.emoT = dur; }
function spawnFx(x, y, txt, col = '#ffbe55') { st.efs.push({ x, y, txt, col, life: 45 }); }

// ดาเมจจริงหลังคิดนิสัยของคนตี
function calcDmg(atk, base) {
  let d = base;
  d *= 1 + (atk.tr.arrogant || 0) / 500;                    // หยิ่ง: แรงขึ้นสูงสุด 20%
  if (atk.hp < 40) d *= 1 + (atk.tr.tsundere || 0) / 400;   // ซึนเดเระ: เลือดน้อยแล้วโหดขึ้น
  return Math.round(d);
}

function hit(vic, atk, dmg, label) {
  vic.hp = Math.max(0, vic.hp - dmg);
  updateHud();
  spawnFx(vic.x, vic.y - 140, `${label} (-${dmg})`, '#ff5964');
  emote(vic, (vic.tr.tsundere || 0) > 50 ? '😤' : '💢', 65);
  if (vic.stun <= 0) say(vic, 'hurt', 90);
  logMsg(fmt(tr('logHit'), { a: atk.d.name, v: vic.d.name, d: dmg }));

  if (vic.hp <= 0 && !st.over) {
    st.over = true;
    vic.ko = true;
    vic.vy = -26;
    vic.vx = (vic.x >= atk.x ? 1 : -1) * 16;
    say(atk, 'win', 200);
    logMsg(fmt(tr('logKO'), { a: atk.d.name }));
    koTimer = setTimeout(() => {
      document.getElementById('winnerText').textContent = atk.d.name + tr('winnerSuffix');
      document.getElementById('koOverlay').classList.add('show');
    }, 1100);
  }
}

// เลือกของที่ตัวนี้อยากได้ (ใกล้สุดในกลุ่มที่อยากได้)
function pickItem(me) {
  const base = 0.55 + (me.tr.brat || 0) / 250 - (me.tr.arrogant || 0) / 300;
  let best = null, bestD = Infinity;
  for (const it of st.items) {
    const wantsHeal = it.t === 'heal' && (me.hp < 80 || (me.tr.glutton || 0) > 40);
    const wantsOther = it.t !== 'heal' && it.roll[me.side] < base;
    if (!wantsHeal && !wantsOther) continue;
    const d = Math.abs(it.x - me.x);
    if (d < bestD) { bestD = d; best = it; }
  }
  return best;
}

function stepActor(me, opp) {
  me.sx += (1 - me.sx) * 0.15;
  me.sy += (1 - me.sy) * 0.15;
  if (me.spT > 0) me.spT--;
  if (me.emoT > 0) me.emoT--;

  if (me.ko) {
    me.x += me.vx; me.y += me.vy; me.vy += 0.45;
    me.ang += 0.32 * (me.vx >= 0 ? 1 : -1);
    return;
  }

  if (me.stun > 0) {
    me.stun--;
    emote(me, '💫', 5);
    me.vx *= 0.85;
  } else if (!st.over) {
    me.face = opp.x >= me.x ? 1 : -1;
    const item = pickItem(me);

    if (item) {
      me.vx += (item.x > me.x ? 1 : -1) * 0.75 * me.speed;
      if (Math.abs(item.x - me.x) < 65 && Math.abs(item.y - me.y) < 110) {
        st.items = st.items.filter(x => x !== item);
        if (item.t === 'heal') {
          const heal = Math.round(item.v * (1 + (me.tr.glutton || 0) / 330)); // ตะกละ: กินแล้วฟื้นเยอะขึ้น
          me.hp = Math.min(100, me.hp + heal);
          updateHud();
          emote(me, '✨', 60);
          spawnFx(me.x, me.y - 140, `+${heal} HP!`, '#38c172');
          logMsg(fmt(tr('logEat'), { n: me.d.name, i: item.icon, v: heal }));
        } else {
          const miss = Math.random() < 0.35;
          st.projs.push({
            icon: item.icon, t: item.t, v: item.v, s: me.side,
            x: me.x, y: me.y - 80,
            vx: (opp.x - me.x) / 42, vy: miss ? -26 : -17.5, rot: 0
          });
          me.sx = 1.25; me.sy = 0.8;
          say(me, 'throw', 90);
          logMsg(fmt(tr('logThrow'), { n: me.d.name, i: item.icon, o: opp.d.name }));
        }
      }
    } else if (--me.cd <= 0) {
      const dist = Math.abs(opp.x - me.x);
      const timid = me.tr.timid || 0, sleepy = me.tr.sleepy || 0;
      const hyper = me.tr.hyper || 0, clingy = me.tr.clingy || 0;
      let nextCd = 38 + Math.random() * 30;

      if (timid > 50 && dist < 260 && Math.random() * 100 < timid * 0.7) {
        me.vx = -me.face * 15;                   // ขี้กลัว: ถอยหนี
        emote(me, '💦', 45);
        nextCd = 45;
      } else if (sleepy > 0 && Math.random() < sleepy / 400) {
        me.vx *= 0.3;                            // ขี้เซา: หลับยืน
        emote(me, '💤', 60);
        nextCd = 70;
      } else if (me.jumps < 2 && Math.random() < 0.25 + hyper / 250) {
        me.vy = -21; me.vx = me.face * 11 * me.speed; me.jumps++;
        me.sx = 0.8; me.sy = 1.25;
        if (me.jumps === 2) spawnFx(me.x, me.y, tr('fxDouble'), '#7c83fd');
        else say(me, 'headbutt', 85);
      } else {
        me.vx = me.face * 13 * me.speed;
        me.sx = 1.2; me.sy = 0.85;
        if (Math.random() < 0.4) say(me, 'headbutt', 85);
      }

      if (clingy > 40 && dist > 300) nextCd *= 0.7;  // ขี้อ้อน: เข้าหาถี่ขึ้นตอนอยู่ไกล
      me.cd = nextCd * me.rest;

      // บางจังหวะโชว์อิโมจิตามนิสัย
      const owned = TRAITS.filter(t => me.tr[t.id] !== undefined);
      if (owned.length && me.emoT <= 0 && Math.random() < 0.3) {
        emote(me, owned[Math.floor(Math.random() * owned.length)].emo, 50);
      }
    }
  }

  me.vx *= 0.88; me.x += me.vx;
  me.vy += 0.95; me.y += me.vy;
  if (me.y >= GROUND_Y) {
    if (me.vy > 5) { me.sx = 1.18; me.sy = 0.84; }
    me.y = GROUND_Y; me.vy = 0; me.jumps = 0;
  }
  if (me.x < 110) { me.x = 110; me.vx = Math.abs(me.vx); }
  if (me.x > WORLD_W - 110) { me.x = WORLD_W - 110; me.vx = -Math.abs(me.vx); }
}

function update() {
  const [a1, a2] = st.actors;
  st.cloudX = (st.cloudX + 0.35) % WORLD_W;

  const targetCam = clamp((a1.x + a2.x) / 2 - VIEW_W / 2, 0, WORLD_W - VIEW_W);
  st.camX += (targetCam - st.camX) * 0.1;

  // ของตก (นับถอยหลังเฉพาะตอนมีที่ว่าง)
  if (!st.over && st.items.length < 2 && --st.spawnT <= 0) {
    const proto = ITEMS[Math.floor(Math.random() * ITEMS.length)];
    st.items.push({
      ...proto,
      x: 180 + Math.random() * (WORLD_W - 360), y: 250, vy: 0, g: false,
      roll: [Math.random(), Math.random()] // ความอยากได้ของแต่ละฝั่ง สุ่มครั้งเดียวต่อชิ้น
    });
    st.spawnT = 140 + Math.random() * 100;
  }
  st.items.forEach(it => {
    if (!it.g) {
      it.vy += 0.6; it.y += it.vy;
      if (it.y >= GROUND_Y - 25) { it.y = GROUND_Y - 25; it.g = true; }
    }
  });

  stepActor(a1, a2);
  stepActor(a2, a1);

  // ชนกัน (มี cooldown กันโดนรัวหลายทีในเฟรมติดกัน)
  if (st.clashCd > 0) st.clashCd--;
  if (!st.over && st.clashCd <= 0 && Math.abs(a2.x - a1.x) < 105 && Math.abs(a2.y - a1.y) < 110) {
    const s1 = Math.abs(a1.vx) + (a1.y < GROUND_Y ? 6 : 0);
    const s2 = Math.abs(a2.vx) + (a2.y < GROUND_Y ? 6 : 0);
    const dir = a2.x >= a1.x ? 1 : -1;

    let atk, vic;
    if (Math.abs(s1 - s2) < 1) { atk = Math.random() < 0.5 ? a1 : a2; }
    else { atk = s1 > s2 ? a1 : a2; }  // ใครพุ่งมาแรงกว่าเป็นคนตี
    vic = atk === a1 ? a2 : a1;

    a1.vx = -dir * 14; a2.vx = dir * 14;
    a1.vy = -8; a2.vy = -8;
    a1.sx = a2.sx = 0.75; a1.sy = a2.sy = 1.25;
    st.clashCd = 30;
    hit(vic, atk, calcDmg(atk, 8 + Math.floor(Math.random() * 8)), tr('fxClash'));
  }

  // ของที่ปาออกไป
  for (let i = st.projs.length - 1; i >= 0; i--) {
    const p = st.projs[i];
    p.x += p.vx; p.y += p.vy; p.vy += 0.75; p.rot += 0.25;
    const tar = st.actors[1 - p.s];
    const thr = st.actors[p.s];

    if (!st.over && !tar.ko && Math.abs(p.x - tar.x) < 75 && Math.abs(p.y - (tar.y - 80)) < 95) {
      st.projs.splice(i, 1);
      tar.vx = (p.vx >= 0 ? 1 : -1) * 14;
      tar.sx = 1.3; tar.sy = 0.7;
      if (p.t === 'stun') { tar.stun = 85; say(tar, 'stun', 95); }
      hit(tar, thr, calcDmg(thr, p.v), p.icon);
    } else if (p.y > GROUND_Y + 40 || p.x < -100 || p.x > WORLD_W + 100) {
      st.projs.splice(i, 1);
      if (!st.over) {
        spawnFx(tar.x, tar.y - 160, tr('fxMiss'), '#a89fb8');
        say(thr, 'miss', 85);
        logMsg(fmt(tr('logMiss'), { n: thr.d.name, i: p.icon }));
      }
    }
  }

  for (let i = st.efs.length - 1; i >= 0; i--) {
    const e = st.efs[i];
    e.y -= 2.2;
    if (--e.life <= 0) st.efs.splice(i, 1);
  }
}

// ---------- วาด ----------
// ตัดบรรทัดตามตัวอักษร (ภาษาไทยไม่มีช่องว่าง) โดยไม่ผ่าสระ/วรรณยุกต์ออกจากพยัญชนะ
function splitChars(text) {
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    return Array.from(new Intl.Segmenter('th', { granularity: 'grapheme' }).segment(text), s => s.segment);
  }
  return Array.from(text);
}

function drawSpeechBubble(x, y, text) {
  ctx.save();
  ctx.font = '700 26px Mali, sans-serif';
  const maxW = 340;
  const lines = [];
  let cur = '';
  for (const ch of splitChars(text)) {
    if (cur && ctx.measureText(cur + ch).width > maxW) { lines.push(cur); cur = ch; }
    else cur += ch;
  }
  if (cur) lines.push(cur);

  const lineH = 34;
  const boxW = Math.max(...lines.map(l => ctx.measureText(l).width)) + 34;
  const boxH = lines.length * lineH + 22;
  const bx = clamp(x - boxW / 2, 20, WORLD_W - boxW - 20);
  const by = Math.max(20, y - boxH);

  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  ctx.strokeStyle = '#3b2e35';
  ctx.lineWidth = 4;
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(bx, by, boxW, boxH, 18); else ctx.rect(bx, by, boxW, boxH);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#3b2e35';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  lines.forEach((ln, i) => ctx.fillText(ln, bx + boxW / 2, by + 12 + i * lineH));
  ctx.restore();
}

function draw() {
  ctx.clearRect(0, 0, VIEW_W, VIEW_H);

  for (const l of mapImages[st.mode]) {
    if (!(l.img.complete && l.img.naturalWidth > 0)) continue;
    const dx = -st.camX * l.p;
    if (l.cloud) {
      const cx = (((dx + st.cloudX) % WORLD_W) + WORLD_W) % WORLD_W; // ให้เป็นค่าบวกเสมอ ไม่เกิดช่องโหว่
      ctx.drawImage(l.img, cx, 0, WORLD_W, VIEW_H);
      ctx.drawImage(l.img, cx - WORLD_W, 0, WORLD_W, VIEW_H);
    } else {
      ctx.drawImage(l.img, dx, 0, WORLD_W, VIEW_H);
    }
  }

  ctx.save();
  ctx.translate(-st.camX, 0);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.font = '56px sans-serif';
  const bob = Math.sin(Date.now() * 0.008) * 6;
  st.items.forEach(it => ctx.fillText(it.icon, it.x, it.y + bob));

  st.actors.forEach(a => {
    if (!a.ko) {
      const sc = Math.max(0.4, 1 - (GROUND_Y - a.y) / 400);
      ctx.fillStyle = 'rgba(0,0,0,0.22)';
      ctx.beginPath();
      ctx.ellipse(a.x, GROUND_Y + 8, 55 * sc, 14 * sc, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.save();
    ctx.translate(a.x, a.y - 85);
    ctx.rotate(a.ang);
    ctx.scale(a.sx * a.face, a.sy);
    if (a.hasImg && a.img.complete && a.img.naturalWidth > 0) {
      const dh = 185;
      const dw = dh * (a.img.naturalWidth / a.img.naturalHeight);
      ctx.drawImage(a.img, -dw / 2, -dh / 2, dw, dh);
    } else {
      ctx.font = '130px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#000';
      ctx.fillText(a.side === 0 ? '👾' : '👹', 0, 0);
    }
    ctx.restore();

    if (a.emoT > 0 && a.emo) {
      ctx.font = '48px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const wob = a.emo === '💫' ? Math.sin(Date.now() * 0.02) * 14 : 0;
      ctx.fillText(a.emo, a.x + 45 + wob, a.y - 185);
    }
    if (a.spT > 0 && a.sp) drawSpeechBubble(a.x, a.y - 215, a.sp);
  });

  st.projs.forEach(p => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.font = '54px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(p.icon, 0, 0);
    ctx.restore();
  });

  st.efs.forEach(e => {
    ctx.save();
    ctx.font = '800 34px Mali, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#fff';
    ctx.strokeText(e.txt, e.x, e.y);
    ctx.fillStyle = e.col;
    ctx.fillText(e.txt, e.x, e.y);
    ctx.restore();
  });

  ctx.restore();
}

function loop() {
  update();
  draw();
  animId = requestAnimationFrame(loop);
}

// ---------- เริ่มทำงาน ----------
loadLocal();
applyTexts();
renderSetupForm();
restoreSession();
