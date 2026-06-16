// ===================================================
// PATH & BASE DETECTION (store/ aware)
// ===================================================
const B = '';  // all store pages at same level

// ===================================================
// STORE IDENTITY (from URL param, persisted to sessionStorage)
// ===================================================
const STORE_MAP = {
  umeda:       { name: '大阪梅田店',   code: 'FC001' },
  shinsaibashi:{ name: '大阪心斎橋店', code: 'FC002' },
};
(function() {
  const p = new URLSearchParams(location.search).get('store');
  if (p && STORE_MAP[p]) sessionStorage.setItem('currentStore', p);
})();
function getCurrentStore() {
  const key = sessionStorage.getItem('currentStore') || 'umeda';
  return STORE_MAP[key] || STORE_MAP.umeda;
}

// ===================================================
// STORE ROLE (mock demo)
// ===================================================
const STORE_ROLE_OPTIONS = [
  { value: 'owner', label: 'オーナー' },
  { value: 'staff', label: 'スタッフ' },
];

function getStoreRole() {
  return localStorage.getItem('storeRole') || 'owner';
}
function setStoreRole(role) {
  localStorage.setItem('storeRole', role);
  location.reload();
}

// ===================================================
// STORE APP SIDEBAR
// ===================================================
const STORE_NAV_ITEMS = [
  { section: 'メニュー' },
  { key: 'dashboard', label: 'ダッシュボード',   icon: '⬡',  href: 'dashboard.html' },
  { key: 'daily',     label: '日次入力',         icon: '📱', href: 'daily.html' },
  { key: 'monthly',   label: '月次報告',         icon: '📋', href: 'monthly-report.html', ownerOnly: true },
  { section: 'データ' },
  { key: 'daily-list', label: '日次データ一覧',  icon: '📊', href: 'daily-list.html' },
  { key: 'accounts',   label: 'アカウント一覧',  icon: '👥', href: 'accounts.html', ownerOnly: true },
];

const STORE_PROFILES = {
  owner: { name: '山田 太郎', sub: '大阪梅田店 / FCオーナー', avatarChar: '山' },
  staff: { name: '田中 花子', sub: '大阪梅田店 / スタイリスト', avatarChar: '田' },
};

function renderStoreSidebar(activeKey) {
  const role = getStoreRole();
  const profile = STORE_PROFILES[role] || STORE_PROFILES.owner;
  const roleLabel = STORE_ROLE_OPTIONS.find(o => o.value === role)?.label || role;
  const store = getCurrentStore();
  const roleSwitcherOpts = STORE_ROLE_OPTIONS.map(o =>
    `<option value="${o.value}"${o.value === role ? ' selected' : ''}>${o.label}</option>`
  ).join('');

  let navHTML = '';
  for (const item of STORE_NAV_ITEMS) {
    if (item.section) {
      navHTML += `<div class="nav-section-label">${item.section}</div>`;
    } else {
      if (item.ownerOnly && role !== 'owner') continue;
      const cls = item.key === activeKey ? ' active' : '';
      navHTML += `<a class="nav-item${cls}" href="${item.href}">
        <span style="margin-right:6px;">${item.icon}</span>${item.label}
      </a>`;
    }
  }

  const html = `<aside class="sidebar">
    <div class="sidebar-header">
      <div class="logo">
        <div class="logo-icon">✦</div>
        <div>
          <div class="logo-text">DEARS</div>
          <div style="font-size:10px;color:var(--text-3);margin-top:1px;">店舗アプリ</div>
        </div>
      </div>
      <div style="margin-top:10px;padding:8px 10px;background:var(--accent);border-radius:8px;display:flex;align-items:center;gap:8px;">
        <span style="font-size:14px;">🏪</span>
        <div>
          <div style="font-size:12px;font-weight:700;color:#fff;line-height:1.2;">${store.name}</div>
          <div style="font-size:10px;color:rgba(255,255,255,.7);margin-top:1px;">${store.code}</div>
        </div>
      </div>
    </div>
    <nav class="sidebar-nav">
      ${navHTML}
      <hr class="nav-divider" />
      <div class="nav-external-label">管理画面</div>
      <a class="nav-item-external" href="../admin/dashboard.html" target="_blank">
        <span class="nav-icon">⬡</span><span>本部管理画面</span>
        <span style="margin-left:auto;font-size:10px;">↗</span>
      </a>
    </nav>
    <div class="sidebar-footer">
      <div style="border-top:1px solid var(--border-mid);">
        <a class="user-info" href="mypage.html" style="padding:12px 14px 8px;text-decoration:none;color:inherit;display:flex;align-items:center;gap:10px;cursor:pointer;" title="マイページ">
          <div class="user-avatar">${profile.avatarChar}</div>
          <div style="flex:1;min-width:0;">
            <div class="user-name">${profile.name}</div>
            <div class="user-role">${profile.sub}</div>
          </div>
          <span style="font-size:12px;color:var(--text-3);">›</span>
        </a>
        <div style="padding:0 14px 10px;">
          <div style="font-size:10px;color:var(--text-3);margin-bottom:4px;">デモ：ロール切替</div>
          <select class="select-input" style="width:100%;font-size:12px;" onchange="setStoreRole(this.value)">
            ${roleSwitcherOpts}
          </select>
        </div>
      </div>
    </div>
  </aside>`;

  const mount = document.getElementById('sidebar-mount');
  if (mount) mount.outerHTML = html;
}
