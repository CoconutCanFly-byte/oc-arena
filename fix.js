window.addEventListener('load', () => {
  if (typeof renderSetupForm === 'function') renderSetupForm();
});

handleImageUpload = function(e) {
  const file = e.target.files.item(0);
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(ev) {
    const img = new Image();
    img.onload = function() {
      const c = document.createElement('canvas');
      const MAX = 280;
      let w = img.width, h = img.height;
      if (w > h && w > MAX) { h *= MAX / w; w = MAX; }
      else if (h > MAX) { w *= MAX / h; h = MAX; }
      c.width = w; c.height = h;
      const ctx2 = c.getContext('2d');
      ctx2.clearRect(0, 0, w, h);
      ctx2.drawImage(img, 0, 0, w, h);
      fighters.at(activeTab).image = c.toDataURL('image/png');
      persistLocalFighters();
      renderSetupForm();
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
};

startBattle = function() {
  saveCurrentForm();
  if (animFrameId) cancelAnimationFrame(animFrameId);
  document.getElementById('koOverlay').classList.remove('show');
  document.getElementById('battleLog').innerHTML = '';
  const a1 = createBattleActor(fighters.at(0), 0);
  const a2 = createBattleActor(fighters.at(1), 1);
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
};

const _oldUpdate = updateBattle;
updateBattle = function() {
  if (!battleState) return;
  const st = battleState;
  const a1 = st.actors.at(0);
  const a2 = st.actors.at(1);
  _oldUpdate();
  const midX = (a1.x + a2.x) / 2;
  st.camX += (Math.max(0, Math.min(WORLD_W - VIEW_W, midX - VIEW_W / 2)) - st.camX) * 0.12;
  updateHpHud(a1, a2);
  if (!st.over && Math.abs(a2.x - a1.x) < 105 && Math.abs(a2.y - a1.y) < 110) {
    const pushDir = (a2.x - a1.x) >= 0 ? 1 : -1;
    a1.vx = -pushDir * 15; a2.vx = pushDir * 15;
    a1.vy = -9; a2.vy = -9;
    const victim = Math.random() < 0.5 ? a1 : a2;
    const attacker = victim === a1 ? a2 : a1;
    applyDamage(victim, attacker, 8 + Math.floor(Math.random() * 8), '💥 โป๊ก! เต็มเหม่ง!');
  }
};
