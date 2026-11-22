// PATCH FIX FOR ARRAY INDEXES
window.addEventListener('DOMContentLoaded', () => {
  if (typeof renderSetupForm === 'function') renderSetupForm();
});

handleImageUpload = function(e) {
  const file = e.target.files[0];
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
      fighters[activeTab].image = c.toDataURL('image/png');
      persistLocalFighters();
      renderSetupForm();
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
};

const origStart = startBattle;
startBattle = function() {
  saveCurrentForm();
  if (animFrameId) cancelAnimationFrame(animFrameId);
  document.getElementById('koOverlay').classList.remove('show');
  document.getElementById('battleLog').innerHTML = '';
  const a1 = createBattleActor(fighters[0], 0);
  const a2 = createBattleActor(fighters[1], 1);
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

const origUpdate = updateBattle;
updateBattle = function() {
  if (!battleState) return;
  const st = battleState;
  st.actors[0].x = st.actors[0].x;
  origUpdate();
  const midX = (st.actors[0].x + st.actors[1].x) / 2;
  st.camX += (Math.max(0, Math.min(WORLD_W - VIEW_W, midX - VIEW_W / 2)) - st.camX) * 0.12;
  updateHpHud(st.actors[0], st.actors[1]);
};
