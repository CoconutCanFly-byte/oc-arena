const SB_URL = 'https://fcruiozuldhohcivfosx.supabase.co';
const SB_KEY = 'sb_publishable_g7_EjZW4iCy3P7TqamhwMg_8Brgtwkk';
const supabaseClient = window.supabase.createClient(SB_URL, SB_KEY);
let currentUser = null;
let lang = 'th';
let activeTab = 0;

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
const loadedImages = { day: [], night: [] };
['day', 'night'].forEach(m => {
  MAP_FILES[m].forEach(l => {
    const img = new Image();
    img.src = encodeURI(l.file);
    loadedImages[m].push({ img, p: l.p, cloud: l.cloud });
  });
});

const TRAITS = [
  { id: 'brat', th: 'เด็กเปรต', en: 'Bratty' },
  { id: 'clingy', th: 'ขี้อ้อน', en: 'Clingy' },
  { id: 'tsundere', th: 'ซึนเดเระ', en: 'Tsundere' },
  { id: 'sleepy', th: 'ขี้เซา', en: 'Sleepy' },
  { id: 'glutton', th: 'ตะกละ', en: 'Glutton' },
  { id: 'arrogant', th: 'หยิ่ง', en: 'Arrogant' },
  { id: 'timid', th: 'ขี้กลัว', en: 'Timid' },
  { id: 'hyper', th: 'ไฮเปอร์', en: 'Hyper' }
];

const I18N = {
  th: {
    appTitle: 'OC โขกเหม่ง Arena', welcomeTitle: 'สังเวียนจับ OC โขกเหม่ง!',
    welcomeDesc: 'ไม่มีปั้นลูก วัดดวงล้วนๆ นั่งเชียร์ดูน้องวิ่งโขกหัวและปาอิโมจิใส่กันจนหมุนติ้วออกจอ!',
    btnGuest: 'เข้าเล่นทันที (ไม่ต้องล็อกอิน)', cloudTitle: '☁️ บัญชีอีเมล (เซฟข้อมูลบนคลาวด์)',
    btnLogin: 'เข้าสู่ระบบ', btnSignup: 'สมัครสมาชิก', mapSelectLabel: 'เลือกเวลาฉาก:',
    mapAuto: 'ตามเวลาจริง (Auto)', mapDay: 'แมพเช้า (Day)', mapNight: 'แมพมืด (Night)',
    fighter1: 'ตัวละครซ้าย (P1)', fighter2: 'ตัวละครขวา (P2)', btnUpload: 'อัปโหลดรูป OC (รองรับ PNG ใส)',
    labelName: 'ชื่อตัวละคร', pronounTitle: 'สรรพนาม (พิมพ์กำหนดเอง)', pMe: 'แทนตัวเอง',
    pYou: 'เรียกอีกฝั่ง', pThey: 'เรียกกลุ่ม', traitTitle: 'นิสัย (เลือกผสมได้สูงสุด 4)',
    traitNote: 'กำหนดลีลาการวิ่ง โขกเหม่ง แย่งของ และอิโมจิอารมณ์บนหัว',
    dialogueTitle: 'คลังคำพูดตามอารมณ์', btnClearAll: 'ลบคำตั้งต้นทั้งหมด',
    dialogueNote: 'ใช้ {me}, {you}, {they} แทรกในประโยคได้ หรือลบออกทั้งหมดเพื่อพิมพ์เองล้วนๆ',
    evHeadbutt: 'ตอนพุ่งโขก', evThrow: 'ตอนปาของ', evMiss: 'ตอนปาวืด',
    evHurt: 'ตอนโดนตี/โกรธ', evStun: 'ตอนสตั้นมึนหัว', evWin: 'ตอนชนะ',
    btnResetDiag: 'รีเซ็ตคำตั้งต้น', btnSaveCloud: 'เซฟลงคลาวด์',
    btnStartBattle: 'เริ่มศึกโขกเหม่ง! (นั่งเชียร์อย่างเดียว)', cheer1: 'เชียร์ซ้าย', cheer2: 'เชียร์ขวา',
    btnRematch: 'ตีกันอีกรอบ', btnEdit: 'ตั้งค่า', btnBackSetup: 'กลับหน้าตั้งค่า', btnRestart: 'เริ่มยกใหม่',
    winnerSuffix: ' ชนะ!'
  },
  en: {
    appTitle: 'OC Headbutt Arena', welcomeTitle: 'OC Headbutt & Emoji Arena!',
    welcomeDesc: 'Pure RNG & zero grinding! Watch OCs headbutt & throw emojis until someone spins out!',
    btnGuest: 'Play Now (Guest Mode)', cloudTitle: '☁️ Email Account (Cloud Save)',
    btnLogin: 'Log In', btnSignup: 'Sign Up', mapSelectLabel: 'Arena Time:',
    mapAuto: 'Auto (Local Time)', mapDay: 'Day Map', mapNight: 'Night Map',
    fighter1: 'Left OC (P1)', fighter2: 'Right OC (P2)', btnUpload: 'Upload OC Image (PNG)',
    labelName: 'Character Name', pronounTitle: 'Custom Pronouns', pMe: 'Self',
    pYou: 'Opponent', pThey: 'Group', traitTitle: 'Traits (Pick up to 4)',
    traitNote: 'Controls movement, headbutts, item grabbing & head emojis',
    dialogueTitle: 'Custom Emotional Dialogues', btnClearAll: 'Delete All Defaults',
    dialogueNote: 'Use {me}, {you}, {they} tags, or delete all defaults for 100% custom lines.',
    evHeadbutt: 'Headbutt', evThrow: 'Throw Item', evMiss: 'Missed Throw',
    evHurt: 'Hurt / Angry', evStun: 'Stunned', evWin: 'Victory',
    btnResetDiag: 'Reset Defaults', btnSaveCloud: 'Cloud Save',
    btnStartBattle: 'Start Brawl! (Spectate Only)', cheer1: 'Cheer Left', cheer2: 'Cheer Right',
    btnRematch: 'Rematch', btnEdit: 'Setup', btnBackSetup: 'Back to Setup', btnRestart: 'Restart',
    winnerSuffix: ' WINS!'
  }
};

function defaultDiags(l) {
  return l === 'en' ? [
    { event: 'headbutt', text: 'Take this headbutt from {me}, {you}!' },
    { event: 'throw', text: 'Eat this {you}!!' },
    { event: 'miss', text: 'Tch! {you} got lucky!' },
    { event: 'hurt', text: 'How dare {you} hit {me}?!' },
    { event: 'stun', text: 'Ugh... {me} sees stars...' },
    { event: 'win', text: 'Bow down to {me}, {you}!' }
  ] : [
    { event: 'headbutt', text: 'รับพลังโขกเหม่งของ{me}ไปซะ {you}!' },
    { event: 'throw', text: 'กินนี่เข้าไปซะ {you}!!' },
    { event: 'miss', text: 'ชิ! {you}แค่โชคดีหลบได้หรอก!' },
    { event: 'hurt', text: 'บังอาจมากนะ{you} ที่กล้าทำร้าย{me}!' },
    { event: 'stun', text: 'โอ๊ย... {me}เห็นดาวเต็มหัวเลย...' },
    { event: 'win', text: 'สมน้ำหน้า{you} กล้าดียังไงมาสู้กับ{me}!' }
  ];
}

let fighters = [
  { name: 'น้องเปรตซ่า', image: '', pronouns: { me: 'ข้า', you: 'เจ้า', they: 'พวกเจ้า' }, traits: { brat: 100, hyper: 60 }, dialogues: defaultDiags('th') },
  { name: 'เจ้าก้อนมึน', image: '', pronouns: { me: 'กู', you: 'มึง', they: 'พวกมัน' }, traits: { sleepy: 80, glutton: 70 }, dialogues: defaultDiags('th') }
];
function toggleTheme() {
  document.body.classList.toggle('dark');
  document.getElementById('btnTheme').textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
}
function toggleLang() {
  lang = lang === 'th' ? 'en' : 'th';
  document.getElementById('btnLang').textContent = lang === 'th' ? 'EN' : 'TH';
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.getAttribute('data-i18n');
    if (I18N[lang][k]) el.textContent = I18N[lang][k];
  });
  renderSetupForm();
}
function showView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}
function loadYoutubeMusic() {
  const m = document.getElementById('ytLinkInput').value.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  if (m) {
    const vid = m.at(1);
    document.getElementById('ytPlayerWrap').style.display = 'block';
    document.getElementById('ytIframe').src = `https://youtube.com{vid}?autoplay=1&loop=1&playlist=${vid}`;
  }
}
function enterGuestMode() {
  const s = localStorage.getItem('oc_arena_f2');
  if (s) { try { fighters = JSON.parse(s); } catch(e) {} }
  showView('viewSetup');
  renderSetupForm();
}
async function handleAuth(type) {
  const email = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPass').value.trim();
  const msg = document.getElementById('authMsg');
  msg.textContent = '...';
  const res = type === 'signup' ? await supabaseClient.auth.signUp({ email, password }) : await supabaseClient.auth.signInWithPassword({ email, password });
  if (res.error) { msg.textContent = res.error.message; return; }
  currentUser = res.data.user;
  document.getElementById('btnLogout').style.display = 'inline-block';
  document.getElementById('btnCloudSave').style.display = 'inline-flex';
  const { data } = await supabaseClient.from('pets').select('*').eq('user_id', currentUser.id).limit(1);
  if (data && data.length > 0) {
    const r = data.at(0);
    const p1 = fighters.at(0);
    p1.name = r.name || p1.name;
    p1.image = r.image_url || '';
    if (r.traits) { p1.traits = r.traits.traits || p1.traits; p1.pronouns = r.traits.pronouns || p1.pronouns; p1.dialogues = r.traits.dialogues || p1.dialogues; }
  }
  showView('viewSetup');
  renderSetupForm();
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
  const f = fighters.at(0);
  const { data } = await supabaseClient.from('pets').select('id').eq('user_id', currentUser.id).limit(1);
  const payload = { user_id: currentUser.id, name: f.name, image_url: f.image, traits: { traits: f.traits, pronouns: f.pronouns, dialogues: f.dialogues } };
  if (data && data.length > 0) await supabaseClient.from('pets').update(payload).eq('id', data.at(0).id);
  else await supabaseClient.from('pets').insert(payload);
  alert(lang === 'th' ? 'เซฟ P1 ลงคลาวด์แล้ว!' : 'Saved P1!');
}
function switchFighterTab(idx) {
  activeTab = idx;
  document.getElementById('tabP1').classList.toggle('active', idx === 0);
  document.getElementById('tabP2').classList.toggle('active', idx === 1);
  renderSetupForm();
}
function saveCurrentForm() {
  const f = fighters.at(activeTab);
  f.name = document.getElementById('charName').value || 'OC';
  f.pronouns.me = document.getElementById('pMe').value || 'ข้า';
  f.pronouns.you = document.getElementById('pYou').value || 'เจ้า';
  f.pronouns.they = document.getElementById('pThey').value || 'พวกเจ้า';
  localStorage.setItem('oc_arena_f2', JSON.stringify(fighters));
}
function renderSetupForm() {
  const f = fighters.at(activeTab);
  document.getElementById('charName').value = f.name;
  document.getElementById('pMe').value = f.pronouns.me;
  document.getElementById('pYou').value = f.pronouns.you;
  document.getElementById('pThey').value = f.pronouns.they;
  document.getElementById('avatarPreview').innerHTML = f.image ? `<img src="${f.image}"/>` : `<span style="font-size:3rem;">${activeTab === 0 ? '👾' : '👹'}</span>`;

  const grid = document.getElementById('traitsGrid');
  const keys = Object.keys(f.traits);
  grid.innerHTML = '';
  TRAITS.forEach(t => {
    const sel = keys.includes(t.id);
    const chip = document.createElement('div');
    chip.className = `trait-chip ${sel ? 'selected' : ''} ${!sel && keys.length >= 4 ? 'disabled' : ''}`;
    chip.innerHTML = `<span>${t[lang]}</span><span>${sel ? '✓' : '+'}</span>`;
    chip.onclick = () => {
      if (f.traits[t.id] !== undefined) delete f.traits[t.id];
      else if (Object.keys(f.traits).length < 4) f.traits[t.id] = 80;
      localStorage.setItem('oc_arena_f2', JSON.stringify(fighters));
      renderSetupForm();
    };
    grid.appendChild(chip);
  });

  const sliders = document.getElementById('slidersArea');
  sliders.innerHTML = '';
  keys.forEach(k => {
    const tObj = TRAITS.find(x => x.id === k);
    if (!tObj) return;
    const row = document.createElement('div');
    row.className = 'slider-row';
    row.innerHTML = `<div class="slider-header"><span>${tObj[lang]}</span><span id="v_${k}">${f.traits[k]}%</span></div><input type="range" min="10" max="100" value="${f.traits[k]}" oninput="fighters.at(activeTab).traits['${k}']=+this.value;document.getElementById('v_${k}').textContent=this.value+'%';localStorage.setItem('oc_arena_f2',JSON.stringify(fighters));"/>`;
    sliders.appendChild(row);
  });

  const dList = document.getElementById('dialogueList');
  dList.innerHTML = '';
  const evMap = { headbutt: I18N[lang].evHeadbutt, throw: I18N[lang].evThrow, miss: I18N[lang].evMiss, hurt: I18N[lang].evHurt, stun: I18N[lang].evStun, win: I18N[lang].evWin };
  f.dialogues.forEach((d, i) => {
    const div = document.createElement('div');
    div.className = 'dialogue-item';
    div.innerHTML = `<span class="dialogue-tag">${evMap[d.event] || d.event}</span><span class="dialogue-text">${d.text}</span><button class="btn btn-danger" onclick="fighters.at(activeTab).dialogues.splice(${i},1);localStorage.setItem('oc_arena_f2',JSON.stringify(fighters));renderSetupForm();">✕</button>`;
    dList.appendChild(div);
  });
}
function handleImageUpload(e) {
  const file = e.target.files.item(0);
  if (!file) return;
  const r = new FileReader();
  r.onload = ev => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      let w = img.width, h = img.height, M = 280;
      if (w > h && w > M) { h *= M / w; w = M; } else if (h > M) { w *= M / h; h = M; }
      c.width = w; c.height = h;
      c.getContext('2d').drawImage(img, 0, 0, w, h);
      fighters.at(activeTab).image = c.toDataURL('image/png');
      localStorage.setItem('oc_arena_f2', JSON.stringify(fighters));
      renderSetupForm();
    };
    img.src = ev.target.result;
  };
  r.readAsDataURL(file);
}
function addDialogue() {
  const txt = document.getElementById('newDiagText').value.trim();
  if (!txt) return;
  fighters.at(activeTab).dialogues.unshift({ event: document.getElementById('newDiagEvent').value, text: txt });
  document.getElementById('newDiagText').value = '';
  localStorage.setItem('oc_arena_f2', JSON.stringify(fighters));
  renderSetupForm();
}
function clearAllDialogues() { fighters.at(activeTab).dialogues = []; localStorage.setItem('oc_arena_f2', JSON.stringify(fighters)); renderSetupForm(); }
function resetDefaultDialogues() { fighters.at(activeTab).dialogues = defaultDiags(lang); localStorage.setItem('oc_arena_f2', JSON.stringify(fighters)); renderSetupForm(); }
const canvas = document.getElementById('arenaCanvas');
const ctx = canvas.getContext('2d');
let animId = null, st = null;
const ITEMS = [
  { icon: '🩴', t: 'dmg', v: 12 }, { icon: '🧱', t: 'dmg', v: 18 }, { icon: '🍳', t: 'dmg', v: 16 },
  { icon: '💩', t: 'dmg', v: 10 }, { icon: '🌵', t: 'dmg', v: 15 }, { icon: '🍌', t: 'stun', v: 8 },
  { icon: '💣', t: 'dmg', v: 24 }, { icon: '🍗', t: 'heal', v: 18 }, { icon: '🧋', t: 'heal', v: 15 }
];

function startBattle() {
  saveCurrentForm();
  if (animId) cancelAnimationFrame(animId);
  document.getElementById('koOverlay').classList.remove('show');
  document.getElementById('battleLog').innerHTML = '';
  const mk = (d, s) => {
    const im = new Image(); if (d.image) im.src = d.image;
    return { s, d, im, hasIm: !!d.image, hp: 100, x: s === 0 ? 320 : 805, y: 980, vx: 0, vy: 0, face: s === 0 ? 1 : -1, jumps: 0, sx: 1, sy: 1, ang: 0, ko: false, stun: 0, emo: '', emoT: 0, sp: '', spT: 0, cd: 30 };
  };
  const a1 = mk(fighters.at(0), 0), a2 = mk(fighters.at(1), 1);
  document.getElementById('hudName1').textContent = a1.d.name;
  document.getElementById('hudName2').textContent = a2.d.name;
  const sel = document.getElementById('mapTimeSelect').value;
  const mode = (sel === 'day' || sel === 'night') ? sel : (new Date().getHours() >= 6 && new Date().getHours() < 18 ? 'day' : 'night');
  st = { a1, a2, items: [], projs: [], efs: [], camX: 112, cloudX: 0, spawnT: 80, mode, over: false };
  updateHud();
  showView('viewBattle');
  logMsg(lang === 'th' ? '🔔 ระฆังดัง! เริ่มศึกโขกเหม่ง!' : '🔔 Brawl started!');
  loop();
}
function backToSetup() { if (animId) cancelAnimationFrame(animId); showView('viewSetup'); }
function cheerSide(s) { if (!st) return; const a = s === 0 ? st.a1 : st.a2; st.efs.push({ x: a.x, y: a.y - 170, txt: '💖', col: '#ff6b9d', life: 40 }); }
function logMsg(t) { const d = document.createElement('div'); d.className = 'log-entry'; d.textContent = t; document.getElementById('battleLog').prepend(d); }
function updateHud() {
  const h1 = Math.max(0, Math.round(st.a1.hp)), h2 = Math.max(0, Math.round(st.a2.hp));
  document.getElementById('hudHpText1').textContent = h1; document.getElementById('hudHpText2').textContent = h2;
  document.getElementById('hudHpBar1').style.width = h1 + '%'; document.getElementById('hudHpBar2').style.width = h2 + '%';
}
function say(a, ev) {
  const p = a.d.dialogues.filter(x => x.event === ev);
  if (!p.length) return;
  a.sp = p.at(Math.floor(Math.random() * p.length)).text.replace(/\{me\}/g, a.d.pronouns.me).replace(/\{you\}/g, a.d.pronouns.you).replace(/\{they\}/g, a.d.pronouns.they);
  a.spT = 95;
}
function hit(vic, atk, dmg, lbl) {
  vic.hp = Math.max(0, vic.hp - dmg); updateHud();
  st.efs.push({ x: vic.x, y: vic.y - 140, txt: `${lbl} (-${dmg})`, col: '#ff5964', life: 45 });
  vic.emo = '💢'; vic.emoT = 60;
  if (vic.stun <= 0) say(vic, 'hurt');
  logMsg(`${atk.d.name} อัด ${vic.d.name} (-${dmg})`);
  if (vic.hp <= 0 && !st.over) {
    st.over = true; vic.ko = true; vic.vy = -26; vic.vx = (vic.x >= atk.x ? 1 : -1) * 16;
    say(atk, 'win'); logMsg(`🏆 ${atk.d.name} ชนะน็อก!`);
    setTimeout(() => { document.getElementById('winnerText').textContent = atk.d.name + I18N[lang].winnerSuffix; document.getElementById('koOverlay').classList.add('show'); }, 1100);
  }
}

function loop() {
  st.cloudX = (st.cloudX + 0.35) % 1125;
  st.camX += (Math.max(0, Math.min(225, (st.a1.x + st.a2.x) / 2 - 450)) - st.camX) * 0.08;
  if (!st.over && --st.spawnT <= 0 && st.items.length < 2) {
    const it = ITEMS.at(Math.floor(Math.random() * ITEMS.length));
    st.items.push({ ...it, x: 180 + Math.random() * 765, y: 250, vy: 0, g: false });
    st.spawnT = 140 + Math.random() * 100;
  }
  st.items.forEach(it => { if (!it.g) { it.vy += 0.6; it.y += it.vy; if (it.y >= 955) { it.y = 955; it.g = true; } } });

  [st.a1, st.a2].forEach(me => {
    const opp = me === st.a1 ? st.a2 : st.a1;
    me.sx += (1 - me.sx) * 0.15; me.sy += (1 - me.sy) * 0.15;
    if (me.spT > 0) me.spT--; if (me.emoT > 0) me.emoT--;
    if (me.ko) { me.x += me.vx; me.y += me.vy; me.vy += 0.45; me.ang += 0.32 * (me.vx >= 0 ? 1 : -1); return; }
    if (me.stun > 0) { me.stun--; me.emo = '💫'; me.emoT = 5; me.vx *= 0.85; }
    else if (!st.over) {
      me.face = opp.x >= me.x ? 1 : -1;
      if (st.items.length > 0 && Math.random() < 0.7) {
        const it = st.items.at(0);
        me.vx += (it.x > me.x ? 1 : -1) * 0.75;
        if (Math.abs(it.x - me.x) < 65 && Math.abs(it.y - me.y) < 110) {
          st.items.shift();
          if (it.t === 'heal') { me.hp = Math.min(100, me.hp + it.v); updateHud(); me.emo = '✨'; me.emoT = 50; st.efs.push({ x: me.x, y: me.y - 140, txt: `+${it.v} HP!`, col: '#38c172', life: 40 }); }
          else {
            const miss = Math.random() < 0.35;
            st.projs.push({ icon: it.icon, t: it.t, v: it.v, s: me.s, x: me.x, y: me.y - 80, vx: (opp.x - me.x) / 36, vy: miss ? -26 : -17.5, rot: 0 });
            me.sx = 1.25; me.sy = 0.8; say(me, 'throw'); logMsg(`${me.d.name} ปา ${it.icon}!`);
          }
        }
      } else if (--me.cd <= 0) {
        if (Math.random() < 0.4 && me.jumps < 2) { me.vy = -21; me.vx = me.face * 11; me.jumps++; me.sx = 0.8; me.sy = 1.25; say(me, 'headbutt'); }
        else { me.vx = me.face * 13; me.sx = 1.2; me.sy = 0.85; if (Math.random() < 0.4) say(me, 'headbutt'); }
        me.cd = 38 + Math.random() * 30;
      }
    }
    me.vx *= 0.88; me.x += me.vx; me.vy += 0.95; me.y += me.vy;
    if (me.y >= 980) { me.y = 980; me.vy = 0; me.jumps = 0; }
    if (me.x < 110) { me.x = 110; me.vx = Math.abs(me.vx); }
    if (me.x > 1015) { me.x = 1015; me.vx = -Math.abs(me.vx); }
  });

  if (!st.over && Math.abs(st.a2.x - st.a1.x) < 105 && Math.abs(st.a2.y - st.a1.y) < 110) {
    const dir = st.a2.x >= st.a1.x ? 1 : -1;
    st.a1.vx = -dir * 14; st.a2.vx = dir * 14; st.a1.vy = -8; st.a2.vy = -8;
    const vic = Math.random() < 0.5 ? st.a1 : st.a2;
    hit(vic, vic === st.a1 ? st.a2 : st.a1, 8 + Math.floor(Math.random() * 7), '💥 โป๊ก!');
  }

  for (let i = st.projs.length - 1; i >= 0; i--) {
    const p = st.projs.at(i);
    p.x += p.vx; p.y += p.vy; p.vy += 0.75; p.rot += 0.25;
    const tar = p.s === 0 ? st.a2 : st.a1, thr = p.s === 0 ? st.a1 : st.a2;
    if (!st.over && !tar.ko && Math.abs(p.x - tar.x) < 75 && Math.abs(p.y - (tar.y - 80)) < 95) {
      st.projs.splice(i, 1);
      if (p.t === 'stun') { tar.stun = 85; say(tar, 'stun'); }
      hit(tar, thr, p.v, p.icon);
    } else if (p.y > 1020 || p.x < -100 || p.x > 1225) {
      st.projs.splice(i, 1);
      if (!st.over) { st.efs.push({ x: tar.x, y: tar.y - 160, txt: '💨 วืดดด!', col: '#a89fb8', life: 40 }); say(thr, 'miss'); }
    }
  }

  ctx.clearRect(0, 0, 900, 1200);
  loadedImages[st.mode].forEach(l => {
    if (l.img.complete && l.img.naturalWidth > 0) {
      const dx = -st.camX * l.p;
      if (l.cloud) { const cx = (dx + st.cloudX) % 1125; ctx.drawImage(l.img, cx, 0, 1125, 1200); ctx.drawImage(l.img, cx - 1125, 0, 1125, 1200); }
      else ctx.drawImage(l.img, dx, 0, 1125, 1200);
    }
  });

  ctx.save(); ctx.translate(-st.camX, 0);
  ctx.font = '56px sans-serif'; ctx.textAlign = 'center';
  st.items.forEach(it => ctx.fillText(it.icon, it.x, it.y + Math.sin(Date.now() * 0.008) * 6));

  [st.a1, st.a2].forEach(a => {
    if (!a.ko) { ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.beginPath(); ctx.ellipse(a.x, 988, 55, 14, 0, 0, Math.PI * 2); ctx.fill(); }
    ctx.save(); ctx.translate(a.x, a.y - 85); ctx.rotate(a.ang); ctx.scale(a.sx * a.face, a.sy);
    if (a.hasIm && a.im.complete && a.im.naturalWidth > 0) { const dw = 185 * (a.im.naturalWidth / a.im.naturalHeight); ctx.drawImage(a.im, -dw / 2, -92.5, dw, 185); }
    else { ctx.font = '130px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(a.s === 0 ? '👾' : '👹', 0, 0); }
    ctx.restore();
    if (a.emoT > 0) { ctx.font = '48px sans-serif'; ctx.fillText(a.emo, a.x + 45, a.y - 185); }
    if (a.spT > 0 && a.sp) {
      ctx.font = '700 26px Mali, sans-serif';
      const bw = Math.min(360, ctx.measureText(a.sp).width + 36);
      const bx = Math.max(20, Math.min(1105 - bw, a.x - bw / 2));
      ctx.fillStyle = 'rgba(255,255,255,0.95)'; ctx.strokeStyle = '#3b2e35'; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.roundRect(bx, a.y - 265, bw, 52, 16); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#3b2e35'; ctx.fillText(a.sp, bx + bw / 2, a.y - 230);
    }
  });

  st.projs.forEach(p => { ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.font = '54px sans-serif'; ctx.fillText(p.icon, 0, 0); ctx.restore(); });
  for (let i = st.efs.length - 1; i >= 0; i--) {
    const e = st.efs.at(i); e.y -= 2.2;
    ctx.font = '800 34px Mali, sans-serif'; ctx.lineWidth = 6; ctx.strokeStyle = '#fff'; ctx.strokeText(e.txt, e.x, e.y); ctx.fillStyle = e.col; ctx.fillText(e.txt, e.x, e.y);
    if (--e.life <= 0) st.efs.splice(i, 1);
  }
  ctx.restore();
  animId = requestAnimationFrame(loop);
}
