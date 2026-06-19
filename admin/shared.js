// ===================================================
// PATH & BASE DETECTION (admin/ aware)
// ===================================================
(function() {
  const parts = window.location.pathname.split('/').filter(Boolean);
  const adminIdx = parts.findIndex(p => p === 'admin');
  const depth = adminIdx >= 0 ? parts.length - adminIdx - 2 : 0;
  window.B = depth > 0 ? '../'.repeat(depth) : '';
})();
const B = window.B;

// ===================================================
// ROLE (mock demo switcher)
// ===================================================
function getCurrentRole() {
  return localStorage.getItem('mockRole') || 'honbu-edit';
}
function setCurrentRole(role) {
  localStorage.setItem('mockRole', role);
  location.reload();
}
const ROLE_SWITCHER_OPTIONS = [
  { value: 'honbu-edit', label: '本部（編集）' },
  { value: 'honbu-view', label: '本部（閲覧）' },
];

// ===================================================
// SIDEBAR
// ===================================================
const NAV_ITEMS = [
  { section: 'メイン' },
  { key: 'dashboard', label: 'ダッシュボード', icon: '⬡', href: `${B}dashboard.html` },
  { key: 'pl',        label: 'PL',              icon: '◈', href: `${B}pl.html` },
  { section: 'マスタ管理' },
  { key: 'stores',    label: '店舗マスタ',     icon: '◉', href: `${B}stores.html` },
  { key: 'accounts',  label: 'アカウント管理', icon: '◎', href: `${B}accounts.html` },
  { section: '予算・実績' },
  { key: 'budget',    label: '予算管理',       href: `${B}budget.html`, roles: ['honbu-edit','honbu-view','admin'] },
  { key: 'monthly',   label: '月次報告確認',   href: `${B}monthly.html` },
  { section: '広告' },
  { key: 'ads',       label: '広告データ連携', icon: '▣', href: `${B}ads.html` },
];

function renderSidebar(activeKey) {
  const role = getCurrentRole();
  const roleLabel = ROLE_SWITCHER_OPTIONS.find(o => o.value === role)?.label || role;
  const avatarChar = role === 'owner' ? 'オ' : role === 'staff' ? 'ス' : '本';
  const roleSwitcherOpts = ROLE_SWITCHER_OPTIONS.map(o =>
    `<option value="${o.value}"${o.value === role ? ' selected' : ''}>${o.label}</option>`
  ).join('');

  let navHTML = '';
  for (const item of NAV_ITEMS) {
    if (item.section) {
      navHTML += `<div class="nav-section-label">${item.section}</div>`;
    } else {
      if (item.roles && !item.roles.includes(role)) continue;
      const cls = item.key === activeKey ? ' active' : '';
      const badge = item.badge ? `<span class="nav-badge">${item.badge}</span>` : '';
      navHTML += `<a class="nav-item${cls}" href="${item.href}">${item.label}${badge}</a>`;
    }
  }
  const html = `<aside class="sidebar">
    <div class="sidebar-header">
      <div class="logo">
        <div class="logo-icon">✦</div>
        <div><div class="logo-text">DEARS 本部管理</div></div>
      </div>
    </div>
    <nav class="sidebar-nav">
      ${navHTML}
      <hr class="nav-divider" />
      <div class="nav-external-label">店舗向けアプリ</div>
      <a class="nav-item-external" href="${B}../store/">
        <span class="nav-icon">🏪</span><span>店舗入力アプリ</span>
        <span style="margin-left:auto;font-size:10px;"></span>
      </a>
    </nav>
    <div class="sidebar-footer">
      <div style="border-top:1px solid var(--border-mid);">
        <a class="user-info user-info-link" href="${B}mypage.html" style="display:flex;align-items:center;gap:8px;padding:12px 14px 8px;text-decoration:none;">
          <div class="user-avatar">${avatarChar}</div>
          <div style="flex:1;min-width:0;">
            <div class="user-name">${roleLabel}</div>
            <div class="user-role">ログイン中</div>
          </div>
          <span class="user-info-arrow">›</span>
        </a>
        <div style="padding:0 14px 10px;">
          <div style="font-size:10px;color:var(--text-3);margin-bottom:4px;">デモ：ロール切替</div>
          <select class="select-input" style="width:100%;font-size:12px;" onchange="setCurrentRole(this.value)">
            ${roleSwitcherOpts}
          </select>
        </div>
      </div>
    </div>
  </aside>`;
  const mount = document.getElementById('sidebar-mount');
  if (mount) mount.outerHTML = html;
}

// ===================================================
// STORE DATA
// ===================================================
const STORE_DATA = [
  {
    id: 'ST001', name: '表参道店', type: 'direct', status: 'active',
    corp: '株式会社DEARS', owner: '—', area: '東京',
    joined: '2018年4月', tel: '03-1234-5678',
    pref: '東京都', city: '渋谷区', addr: '神宮前4-1-1', building: 'DEARSビル 2F',
    rent: 320000, parking: 0,
    hpb_url: 'https://beauty.hotpepper.jp/slnH000000001/',
    hp_url: 'https://dears.co.jp/omotesando/',
    line_channel_id: '1234567890', line_token: 'eyJhbGciOiJIUzI1NiJ9.xxxx',
    meta_adset_id: 'act_123456789_adset_001', google_campaign_id: '9876543210',
  },
  {
    id: 'ST002', name: '渋谷店', type: 'direct', status: 'active',
    corp: '株式会社DEARS', owner: '—', area: '東京',
    joined: '2019年2月', tel: '03-2345-6789',
    pref: '東京都', city: '渋谷区', addr: '道玄坂2-25-12', building: '渋谷Mビル 3F',
    rent: 290000, parking: 0,
    hpb_url: 'https://beauty.hotpepper.jp/slnH000000002/',
    hp_url: 'https://dears.co.jp/shibuya/',
    line_channel_id: '2345678901', line_token: 'eyJhbGciOiJIUzI1NiJ9.yyyy',
    meta_adset_id: 'act_123456789_adset_002', google_campaign_id: '8765432109',
  },
  {
    id: 'ST003', name: '新宿店', type: 'direct', status: 'active',
    corp: '株式会社DEARS', owner: '—', area: '東京',
    joined: '2019年9月', tel: '03-3456-7890',
    pref: '東京都', city: '新宿区', addr: '新宿3-14-1', building: 'ルミネ新宿 4F',
    rent: 310000, parking: 0,
    hpb_url: 'https://beauty.hotpepper.jp/slnH000000003/',
    hp_url: 'https://dears.co.jp/shinjuku/',
    line_channel_id: '3456789012', line_token: 'eyJhbGciOiJIUzI1NiJ9.zzzz',
    meta_adset_id: 'act_123456789_adset_003', google_campaign_id: '7654321098',
  },
  {
    id: 'FC001', name: '大阪梅田店', type: 'fc', status: 'active',
    corp: '株式会社ヤマダビューティ', owner: '山田 太郎', area: '大阪',
    joined: '2020年6月', tel: '06-1234-5678',
    pref: '大阪府', city: '大阪市北区', addr: '梅田1-13-1', building: '大阪梅田ビル 5F',
    rent: 280000, parking: 30000,
    hpb_url: 'https://beauty.hotpepper.jp/slnH000000004/',
    hp_url: '',
    line_channel_id: '4567890123', line_token: 'eyJhbGciOiJIUzI1NiJ9.aaaa',
    meta_adset_id: 'act_987654321_adset_001', google_campaign_id: '6543210987',
  },
  {
    id: 'FC002', name: '名古屋栄店', type: 'fc', status: 'active',
    corp: '田中ビューティ合同会社', owner: '田中 花子', area: '名古屋',
    joined: '2020年11月', tel: '052-234-5678',
    pref: '愛知県', city: '名古屋市中区', addr: '栄3-4-5', building: 'SAKAE BLDG 2F',
    rent: 240000, parking: 20000,
    hpb_url: 'https://beauty.hotpepper.jp/slnH000000005/',
    hp_url: '',
    line_channel_id: '5678901234', line_token: 'eyJhbGciOiJIUzI1NiJ9.bbbb',
    meta_adset_id: 'act_987654321_adset_002', google_campaign_id: '5432109876',
  },
  {
    id: 'FC003', name: '心斎橋店', type: 'fc', status: 'active',
    corp: '合同会社シンサイバシスタイル', owner: '鈴木 二郎', area: '大阪',
    joined: '2021年3月', tel: '06-2345-6789',
    pref: '大阪府', city: '大阪市中央区', addr: '心斎橋筋1-2-3', building: 'SHINSAIBASHI 3F',
    rent: 220000, parking: 0,
    hpb_url: 'https://beauty.hotpepper.jp/slnH000000006/',
    hp_url: '',
    line_channel_id: '6789012345', line_token: 'eyJhbGciOiJIUzI1NiJ9.cccc',
    meta_adset_id: 'act_987654321_adset_003', google_campaign_id: '4321098765',
  },
  {
    id: 'FC007', name: '福岡天神店', type: 'fc', status: 'active',
    corp: 'スズキスタイル株式会社', owner: '鈴木 一郎', area: '福岡',
    joined: '2021年8月', tel: '092-345-6789',
    pref: '福岡県', city: '福岡市中央区', addr: '天神2-5-55', building: 'ソラリアビル 6F',
    rent: 380000, parking: 50000,
    hpb_url: 'https://beauty.hotpepper.jp/slnH000000007/',
    hp_url: '',
    line_channel_id: '7890123456', line_token: 'eyJhbGciOiJIUzI1NiJ9.dddd',
    meta_adset_id: 'act_987654321_adset_007', google_campaign_id: '3210987654',
  },
  {
    id: 'FC009', name: '京都四条店', type: 'fc', status: 'inactive',
    corp: '佐藤ヘア株式会社', owner: '佐藤 美咲', area: '京都',
    joined: '2022年1月', tel: '075-456-7890',
    pref: '京都府', city: '京都市下京区', addr: '四条河原町3-1', building: '四条ビル 2F',
    rent: 200000, parking: 0,
    hpb_url: '', hp_url: '',
    line_channel_id: '', line_token: '',
    meta_adset_id: '', google_campaign_id: '',
  },
];

// ===================================================
// ACCOUNT DATA
// ===================================================
const ACCOUNT_DATA = [
  { id:'ADM001', name:'システム管理者',    role:'admin',  email:'admin@dears.co.jp',             store:'—（全店）',  status:'active',   lastLogin:'2025-05-31' },
  { id:'HQ001',  name:'田中 本部（CMO）', role:'honbu',  email:'tanaka@dears.co.jp',             store:'—（全店）',  status:'active',   lastLogin:'2025-05-31' },
  { id:'HQ002',  name:'山本 花子',        role:'honbu',  email:'yamamoto@dears.co.jp',           store:'—（全店）',  status:'active',   lastLogin:'2025-05-30' },
  { id:'HQ003',  name:'佐々木 健',        role:'honbu',  email:'sasaki@dears.co.jp',             store:'—（全店）',  status:'active',   lastLogin:'2025-05-28' },
  { id:'OW001',  name:'山田 太郎',        role:'owner',  email:'yamada@fc001.dears.co.jp',       store:'大阪梅田店', status:'active',   lastLogin:'2025-05-29' },
  { id:'OW002',  name:'田中 花子',        role:'owner',  email:'tanaka.h@fc002.dears.co.jp',     store:'名古屋栄店', status:'active',   lastLogin:'2025-05-27' },
  { id:'OW003',  name:'鈴木 二郎',        role:'owner',  email:'suzuki.j@fc003.dears.co.jp',     store:'心斎橋店',   status:'active',   lastLogin:'2025-05-25' },
  { id:'OW004',  name:'鈴木 一郎',        role:'owner',  email:'suzuki.i@fc007.dears.co.jp',     store:'福岡天神店', status:'active',   lastLogin:'2025-05-20' },
  { id:'OW005',  name:'佐藤 美咲',        role:'owner',  email:'sato@fc009.dears.co.jp',         store:'京都四条店', status:'inactive', lastLogin:'2025-02-10' },
  { id:'ST001A', name:'田中 花子',        role:'staff',  email:'tanaka.hanako@st001.dears.co.jp',store:'表参道店',   status:'active',   lastLogin:'2025-05-31' },
  { id:'ST001B', name:'佐藤 健太',        role:'staff',  email:'sato.k@st002.dears.co.jp',       store:'表参道店',   status:'active',   lastLogin:'2025-05-31' },
  { id:'FC001A', name:'田中 花子（スタッフ）',role:'staff',email:'tanaka.h.s@fc001.dears.co.jp', store:'大阪梅田店', status:'active',   lastLogin:'2025-05-30' },
  { id:'FC007A', name:'中村 さくら',      role:'staff',  email:'nakamura@fc007.dears.co.jp',     store:'福岡天神店', status:'active',   lastLogin:'2025-05-19' },
];

const ROLE_CONFIG = {
  admin:        { label:'Admin',        cls:'role-admin',       desc:'全機能・システム設定' },
  'honbu-edit': { label:'本部（編集）', cls:'role-honbu',       desc:'予算設定・全店閲覧・レポート' },
  'honbu-view': { label:'本部（閲覧）', cls:'role-honbu-view',  desc:'全店閲覧・レポート（編集不可）' },
  honbu:        { label:'本部',         cls:'role-honbu',       desc:'予算設定・全店閲覧・レポート' },
  owner:        { label:'オーナー',     cls:'role-owner',       desc:'担当店舗閲覧・月次入力' },
  staff:        { label:'スタッフ',     cls:'role-staff',       desc:'担当店舗日次入力のみ' },
};

// ===================================================
// PL DATA
// ===================================================
const PL_GROUPS = [
  {
    id: 'empty_seats', label: '空き席数',
    cols: [
      { id: 'empty_seats', label: '空き席数', summary: true },
    ]
  },
  {
    id: 'staff', label: 'スタッフ人数合計',
    cols: [
      { id: 'staff_total', label: 'スタッフ人数合計（オーナー含む）', summary: true },
      { id: 'po',          label: 'プレイヤーオーナー在籍',           fmt: 'bool' },
      { id: 'ft_count',    label: 'フルタイムのスタッフ数' },
      { id: 'pat_count',   label: 'PAタイムのスタッフ数' },
    ]
  },
  {
    id: 'occ', label: '稼働率合計',
    cols: [
      { id: 'occ',     label: '稼働率合計',             summary: true, fmt: 'pct1' },
      { id: 'occ_ft',  label: 'フルタイムのスタッフ稼働率',            fmt: 'pct1' },
      { id: 'occ_pat', label: 'PAタイムのスタッフ稼働率',              fmt: 'pct1' },
      { id: 'occ_ow',  label: 'オーナーの稼働率',                      fmt: 'pct1' },
    ]
  },
  {
    id: 'labor_prod', label: '人事生産性合計（税抜）',
    cols: [
      { id: 'labor_prod',     label: '人事生産性合計（税抜）',         summary: true, fmt: 'yen' },
      { id: 'labor_prod_ft',  label: 'フルタイムのスタッフ人事生産性',                fmt: 'yen' },
      { id: 'labor_prod_pat', label: 'PAタイムのスタッフ人事生産性',                  fmt: 'yen' },
      { id: 'labor_prod_ow',  label: 'オーナーの人事生産性',                          fmt: 'yen' },
    ]
  },
  {
    id: 'prod', label: '生産性合計（税抜）',
    cols: [
      { id: 'prod_val',     label: '生産性合計（税抜）',               summary: true, fmt: 'yen' },
      { id: 'prod_val_ft',  label: 'フルタイムのスタッフ生産性',                      fmt: 'yen' },
      { id: 'prod_val_pat', label: 'PAタイムのスタッフ生産性',                        fmt: 'yen' },
      { id: 'prod_val_ow',  label: 'オーナーの生産性',                               fmt: 'yen' },
    ]
  },
  {
    id: 'unit_price', label: '平均客単価合計（税抜）',
    cols: [
      { id: 'unit_price',     label: '平均客単価合計（税抜）',         summary: true, fmt: 'yen' },
      { id: 'unit_price_ft',  label: 'フルタイムのスタッフ平均客単価',               fmt: 'yen' },
      { id: 'unit_price_pat', label: 'PAタイムのスタッフ平均客単価',                  fmt: 'yen' },
      { id: 'unit_price_ow',  label: 'オーナーの平均客単価',                         fmt: 'yen' },
    ]
  },
  {
    id: 'tech_unit', label: '平均技術単価合計（税抜）',
    cols: [
      { id: 'tech_unit',     label: '平均技術単価合計（税抜）',        summary: true, fmt: 'yen' },
      { id: 'tech_unit_ft',  label: 'フルタイムのスタッフ平均技術単価',              fmt: 'yen' },
      { id: 'tech_unit_pat', label: 'PAタイムのスタッフ平均技術単価',                fmt: 'yen' },
      { id: 'tech_unit_ow',  label: 'オーナーの平均技術単価',                        fmt: 'yen' },
    ]
  },
  {
    id: 'retail_unit', label: '平均店販単価合計（税抜）',
    cols: [
      { id: 'retail_unit',     label: '平均店販単価合計（税抜）',      summary: true, fmt: 'yen' },
      { id: 'retail_unit_ft',  label: 'フルタイムのスタッフ平均店販単価',            fmt: 'yen' },
      { id: 'retail_unit_pat', label: 'PAタイムのスタッフ平均店販単価',              fmt: 'yen' },
      { id: 'retail_unit_ow',  label: 'オーナーの平均店販単価',                      fmt: 'yen' },
    ]
  },
  {
    id: 'retail_ratio', label: '店販比率合計',
    cols: [
      { id: 'retail_ratio',     label: '店販比率合計',                summary: true, fmt: 'pct1' },
      { id: 'retail_ratio_ft',  label: 'フルタイムのスタッフ店販比率',              fmt: 'pct1' },
      { id: 'retail_ratio_pat', label: 'PAタイムのスタッフ店販比率',                fmt: 'pct1' },
      { id: 'retail_ratio_ow',  label: 'オーナーの店販比率',                        fmt: 'pct1' },
    ]
  },
  {
    id: 'sales', label: '総売上（税抜）',
    cols: [
      { id: 'sales',              label: '総売上（税抜）',             summary: true, fmt: 'num' },
      { id: 'sales_ft',           label: 'フルタイムスタッフの総売上',               fmt: 'num' },
      { id: 'sales_pat',          label: 'PAタイムスタッフの総売上',                 fmt: 'num' },
      { id: 'sales_ow',           label: 'オーナーの総売上',                         fmt: 'num' },
      { id: 'sales_tech',         label: '技術売上合計',                             fmt: 'num' },
      { id: 'ft_tech',            label: '　フルタイムスタッフの技術売上',           fmt: 'num' },
      { id: 'pat_tech',           label: '　PAタイムスタッフの技術売上',             fmt: 'num' },
      { id: 'ow_tech',            label: '　オーナーの技術売上',                     fmt: 'num' },
      { id: 'sales_retail',       label: '店販売上合計',                             fmt: 'num' },
      { id: 'ft_retail',          label: '　フルタイムスタッフの店販売上',           fmt: 'num' },
      { id: 'pat_retail',         label: '　PAタイムスタッフの店販売上',             fmt: 'num' },
      { id: 'ow_retail',          label: '　オーナーの店販売上',                     fmt: 'num' },
      { id: 'new_sales',          label: '新規売上合計',                             fmt: 'num' },
      { id: 'new_sales_tech',     label: '　技術売上合計',                           fmt: 'num' },
      { id: 'new_ft_tech',        label: '　　フルタイムスタッフの技術売上',         fmt: 'num' },
      { id: 'new_pat_tech',       label: '　　PAタイムスタッフの技術売上',           fmt: 'num' },
      { id: 'new_ow_tech',        label: '　　オーナーの技術売上',                   fmt: 'num' },
      { id: 'new_sales_retail',   label: '　店販売上合計',                           fmt: 'num' },
      { id: 'new_ft_retail',      label: '　　フルタイムスタッフの店販売上',         fmt: 'num' },
      { id: 'new_pat_retail',     label: '　　PAタイムスタッフの店販売上',           fmt: 'num' },
      { id: 'new_ow_retail',      label: '　　オーナーの店販売上',                   fmt: 'num' },
      { id: 'exist_sales',        label: '既存売上合計',                             fmt: 'num' },
      { id: 'exist_sales_tech',   label: '　技術売上合計',                           fmt: 'num' },
      { id: 'exist_ft_tech',      label: '　　フルタイムスタッフの技術売上',         fmt: 'num' },
      { id: 'exist_pat_tech',     label: '　　PAタイムスタッフの技術売上',           fmt: 'num' },
      { id: 'exist_ow_tech',      label: '　　オーナーの技術売上',                   fmt: 'num' },
      { id: 'exist_sales_retail', label: '　店販売上合計',                           fmt: 'num' },
      { id: 'exist_ft_retail',    label: '　　フルタイムスタッフの店販売上',         fmt: 'num' },
      { id: 'exist_pat_retail',   label: '　　PAタイムスタッフの店販売上',           fmt: 'num' },
      { id: 'exist_ow_retail',    label: '　　オーナーの店販売上',                   fmt: 'num' },
    ]
  },
  {
    id: 'vcost', label: '変動費合計（税抜）',
    cols: [
      { id: 'vcost_total',      label: '変動費合計（税抜）',           summary: true, fmt: 'num' },
      { id: 'vcost_rate',       label: '　率',                                        fmt: 'pct1' },
      { id: 'v_lab',            label: '人件費',                                      fmt: 'num' },
      { id: 'v_lab_rate',       label: '　率',                                        fmt: 'pct1' },
      { id: 'v_wel',            label: '法定福利費',                                  fmt: 'num' },
      { id: 'v_wel_rate',       label: '　率',                                        fmt: 'pct1' },
      { id: 'v_tra',            label: 'スタッフ交通費',                              fmt: 'num' },
      { id: 'v_tra_rate',       label: '　率',                                        fmt: 'pct1' },
      { id: 'v_mat',            label: '薬剤費',                                      fmt: 'num' },
      { id: 'v_mat_rate',       label: '　率',                                        fmt: 'pct1' },
      { id: 'v_roy',            label: 'ロイヤリティ',                                fmt: 'num' },
      { id: 'v_roy_rate',       label: '　率',                                        fmt: 'pct1' },
      { id: 'a_attract_total',  label: '集客合計広告費',                              fmt: 'num' },
      { id: 'a_attract_rate',   label: '　率',                                        fmt: 'pct1' },
      { id: 'a_hq',             label: '　本部集客広告費',                            fmt: 'num' },
      { id: 'a_hq_rate',        label: '　　率',                                      fmt: 'pct1' },
      { id: 'a_hpb',            label: '　HPB集客広告費',                             fmt: 'num' },
      { id: 'a_hpb_rate',       label: '　　率',                                      fmt: 'pct1' },
      { id: 'a_fly',            label: '　チラシ費',                                  fmt: 'num' },
      { id: 'a_fly_rate',       label: '　　率',                                      fmt: 'pct1' },
      { id: 'a_recruit_total',  label: '求人合計広告費',                              fmt: 'num' },
      { id: 'a_recruit_rate',   label: '　率',                                        fmt: 'pct1' },
      { id: 'a_rhq',            label: '　本部求人広告費',                            fmt: 'num' },
      { id: 'a_rhq_rate',       label: '　　率',                                      fmt: 'pct1' },
      { id: 'a_rex',            label: '　外部求人広告費',                            fmt: 'num' },
      { id: 'a_rex_rate',       label: '　　率',                                      fmt: 'pct1' },
      { id: 'v_oth',            label: 'その他',                                      fmt: 'num' },
      { id: 'v_oth_rate',       label: '　率',                                        fmt: 'pct1' },
    ]
  },
];

const PL_STORE_DATA = [
  { name:'表参道店', storeId:'ST001', type:'direct', area:'東京',
    staff_total:8, empty_seats:2, ft_count:4, pat_count:3, po:true,
    occ:84.2, occ_ft:88.1, occ_pat:76.4, occ_ow:92.0,
    labor_prod:1540, labor_prod_ft:1480, labor_prod_pat:1120, labor_prod_ow:1780,
    prod_val:1280, prod_val_ft:1350, prod_val_pat:980, prod_val_ow:0,
    unit_price:12800, unit_price_ft:12200, unit_price_pat:10800, unit_price_ow:12600,
    tech_unit:10700, tech_unit_ft:11200, tech_unit_pat:10400, tech_unit_ow:10900,
    retail_unit:2100, retail_unit_ft:2300, retail_unit_pat:1900, retail_unit_ow:2050,
    retail_ratio:16.4, retail_ratio_ft:17.2, retail_ratio_pat:16.0, retail_ratio_ow:15.8,
    sales:3840, sales_tech:3210, sales_retail:630, ft_tech:1770, pat_tech:930, ow_tech:510, new_sales:770, exist_sales:2440,
    v_lab:690, v_wel:70, v_tra:24, v_mat:220, v_roy:0, v_oth:46,
    a_hq:180, a_hpb:130, a_fly:25, a_rhq:0, a_rex:62, f_ren:480, f_par:0 },
  { name:'渋谷店', storeId:'ST002', type:'direct', area:'東京',
    staff_total:7, empty_seats:1, ft_count:4, pat_count:2, po:true,
    occ:78.6, occ_ft:82.0, occ_pat:70.2, occ_ow:85.0,
    labor_prod:1490, labor_prod_ft:1430, labor_prod_pat:1080, labor_prod_ow:1720,
    prod_val:1220, prod_val_ft:1290, prod_val_pat:940, prod_val_ow:0,
    unit_price:11900, unit_price_ft:11400, unit_price_pat:10200, unit_price_ow:11700,
    tech_unit:10200, tech_unit_ft:10600, tech_unit_pat:9900, tech_unit_ow:10400,
    retail_unit:1700, retail_unit_ft:1850, retail_unit_pat:1550, retail_unit_ow:1700,
    retail_ratio:14.1, retail_ratio_ft:14.9, retail_ratio_pat:13.5, retail_ratio_ow:13.8,
    sales:3120, sales_tech:2680, sales_retail:440, ft_tech:1560, pat_tech:620, ow_tech:500, new_sales:680, exist_sales:2000,
    v_lab:580, v_wel:58, v_tra:20, v_mat:190, v_roy:0, v_oth:38,
    a_hq:160, a_hpb:110, a_fly:20, a_rhq:0, a_rex:48, f_ren:420, f_par:0 },
  { name:'新宿店', storeId:'ST003', type:'direct', area:'東京',
    staff_total:7, empty_seats:2, ft_count:3, pat_count:3, po:true,
    occ:77.4, occ_ft:80.0, occ_pat:74.0, occ_ow:84.0,
    labor_prod:1480, labor_prod_ft:1420, labor_prod_pat:1070, labor_prod_ow:1710,
    prod_val:1200, prod_val_ft:1270, prod_val_pat:920, prod_val_ow:0,
    unit_price:11400, unit_price_ft:10900, unit_price_pat:9800, unit_price_ow:11200,
    tech_unit:9800, tech_unit_ft:10200, tech_unit_pat:9500, tech_unit_ow:9900,
    retail_unit:1600, retail_unit_ft:1750, retail_unit_pat:1450, retail_unit_ow:1600,
    retail_ratio:14.8, retail_ratio_ft:15.6, retail_ratio_pat:14.1, retail_ratio_ow:14.4,
    sales:2980, sales_tech:2540, sales_retail:440, ft_tech:1140, pat_tech:920, ow_tech:480, new_sales:620, exist_sales:1920,
    v_lab:560, v_wel:56, v_tra:18, v_mat:180, v_roy:0, v_oth:36,
    a_hq:150, a_hpb:100, a_fly:18, a_rhq:0, a_rex:46, f_ren:450, f_par:0 },
  { name:'大阪梅田店', storeId:'FC001', type:'fc', area:'大阪',
    staff_total:6, empty_seats:1, ft_count:3, pat_count:2, po:true,
    occ:70.1, occ_ft:74.0, occ_pat:63.0, occ_ow:76.0,
    labor_prod:1370, labor_prod_ft:1310, labor_prod_pat:980, labor_prod_ow:1590,
    prod_val:1100, prod_val_ft:1160, prod_val_pat:840, prod_val_ow:0,
    unit_price:11000, unit_price_ft:10500, unit_price_pat:9400, unit_price_ow:10800,
    tech_unit:9200, tech_unit_ft:9600, tech_unit_pat:9000, tech_unit_ow:9300,
    retail_unit:1800, retail_unit_ft:1950, retail_unit_pat:1600, retail_unit_ow:1780,
    retail_ratio:16.4, retail_ratio_ft:17.0, retail_ratio_pat:15.8, retail_ratio_ow:15.9,
    sales:2680, sales_tech:2240, sales_retail:440, ft_tech:1100, pat_tech:660, ow_tech:480, new_sales:560, exist_sales:1680,
    v_lab:480, v_wel:48, v_tra:16, v_mat:160, v_roy:268, v_oth:32,
    a_hq:140, a_hpb:100, a_fly:15, a_rhq:60, a_rex:50, f_ren:320, f_par:0 },
  { name:'名古屋栄店', storeId:'FC002', type:'fc', area:'名古屋',
    staff_total:5, empty_seats:1, ft_count:2, pat_count:2, po:true,
    occ:65.8, occ_ft:70.0, occ_pat:59.0, occ_ow:72.0,
    labor_prod:1340, labor_prod_ft:1280, labor_prod_pat:960, labor_prod_ow:1560,
    prod_val:1060, prod_val_ft:1120, prod_val_pat:810, prod_val_ow:0,
    unit_price:10600, unit_price_ft:10100, unit_price_pat:9100, unit_price_ow:10400,
    tech_unit:9000, tech_unit_ft:9400, tech_unit_pat:8700, tech_unit_ow:9100,
    retail_unit:1600, retail_unit_ft:1750, retail_unit_pat:1420, retail_unit_ow:1600,
    retail_ratio:15.0, retail_ratio_ft:15.7, retail_ratio_pat:14.2, retail_ratio_ow:14.7,
    sales:2140, sales_tech:1820, sales_retail:320, ft_tech:820, pat_tech:600, ow_tech:400, new_sales:440, exist_sales:1380,
    v_lab:420, v_wel:42, v_tra:14, v_mat:140, v_roy:214, v_oth:28,
    a_hq:110, a_hpb:80, a_fly:12, a_rhq:50, a_rex:38, f_ren:280, f_par:0 },
  { name:'心斎橋店', storeId:'FC003', type:'fc', area:'大阪',
    staff_total:5, empty_seats:1, ft_count:2, pat_count:2, po:false,
    occ:62.3, occ_ft:65.0, occ_pat:56.0, occ_ow:70.0,
    labor_prod:1320, labor_prod_ft:1260, labor_prod_pat:940, labor_prod_ow:1530,
    prod_val:1020, prod_val_ft:1080, prod_val_pat:780, prod_val_ow:0,
    unit_price:10200, unit_price_ft:9700, unit_price_pat:8800, unit_price_ow:10000,
    tech_unit:8700, tech_unit_ft:9100, tech_unit_pat:8400, tech_unit_ow:8800,
    retail_unit:1500, retail_unit_ft:1640, retail_unit_pat:1340, retail_unit_ow:1500,
    retail_ratio:15.2, retail_ratio_ft:15.9, retail_ratio_pat:14.4, retail_ratio_ow:14.8,
    sales:1980, sales_tech:1680, sales_retail:300, ft_tech:730, pat_tech:560, ow_tech:390, new_sales:400, exist_sales:1280,
    v_lab:390, v_wel:39, v_tra:13, v_mat:130, v_roy:198, v_oth:25,
    a_hq:100, a_hpb:70, a_fly:10, a_rhq:45, a_rex:32, f_ren:260, f_par:0 },
  { name:'福岡天神店', storeId:'FC007', type:'fc', area:'福岡',
    staff_total:5, empty_seats:3, ft_count:2, pat_count:2, po:false,
    occ:48.2, occ_ft:52.0, occ_pat:42.0, occ_ow:56.0,
    labor_prod:1200, labor_prod_ft:1150, labor_prod_pat:860, labor_prod_ow:1400,
    prod_val:890, prod_val_ft:940, prod_val_pat:680, prod_val_ow:0,
    unit_price:8100, unit_price_ft:7700, unit_price_pat:7000, unit_price_ow:7900,
    tech_unit:6900, tech_unit_ft:7200, tech_unit_pat:6700, tech_unit_ow:7000,
    retail_unit:1200, retail_unit_ft:1310, retail_unit_pat:1080, retail_unit_ow:1200,
    retail_ratio:14.8, retail_ratio_ft:15.5, retail_ratio_pat:14.0, retail_ratio_ow:14.4,
    sales:1420, sales_tech:1210, sales_retail:210, ft_tech:520, pat_tech:420, ow_tech:270, new_sales:260, exist_sales:950,
    v_lab:400, v_wel:40, v_tra:12, v_mat:110, v_roy:142, v_oth:22,
    a_hq:80, a_hpb:65, a_fly:8, a_rhq:35, a_rex:30, f_ren:480, f_par:0 },
];

const BILLING_DATA = [
  { name:'表参道店',  type:'direct', mktg:380000, recruit:0,      status:'confirmed' },
  { name:'渋谷店',    type:'direct', mktg:320000, recruit:0,      status:'confirmed' },
  { name:'新宿店',    type:'direct', mktg:300000, recruit:0,      status:'confirmed' },
  { name:'大阪梅田店', type:'fc',   mktg:280000, recruit:120000, status:'confirmed' },
  { name:'名古屋栄店', type:'fc',   mktg:210000, recruit:80000,  status:'confirmed' },
  { name:'心斎橋店',  type:'fc',    mktg:200000, recruit:77000,  status:'confirmed' },
  { name:'福岡天神店', type:'fc',   mktg:145000, recruit:65000,  status:'confirmed' },
  { name:'札幌大通店', type:'fc',   mktg:0,      recruit:0,      status:'pending'   },
];

// ===================================================
// UTILITIES
// ===================================================
function fmtVal(val, fmt) {
  if (val === undefined || val === null) return '—';
  switch (fmt) {
    case 'pct1': return val.toFixed(1) + '%';
    case 'yen':  return '¥' + Math.round(val).toLocaleString();
    case 'bool': return val ? '<span style="color:var(--green);font-weight:700;">●</span>' : '<span style="color:var(--text-3);">—</span>';
    default:     return Math.round(val).toLocaleString();
  }
}

function computeStore(s) {
  const d = { ...s };
  const sales = d.sales;

  // Derived retail by type (approximate split)
  d.ft_retail  = Math.round(d.sales_retail * (d.ft_tech  / (d.ft_tech + d.pat_tech + d.ow_tech)));
  d.pat_retail = Math.round(d.sales_retail * (d.pat_tech / (d.ft_tech + d.pat_tech + d.ow_tech)));
  d.ow_retail  = d.sales_retail - d.ft_retail - d.pat_retail;

  // Total sales by type
  d.sales_ft  = d.ft_tech  + d.ft_retail;
  d.sales_pat = d.pat_tech + d.pat_retail;
  d.sales_ow  = d.ow_tech  + d.ow_retail;

  // New/exist tech+retail split (using ~93% tech ratio from new_sales)
  const newTechRatio    = 0.93;
  const existTechRatio  = 0.97;
  d.new_sales_tech   = Math.round(d.new_sales  * newTechRatio);
  d.new_sales_retail = d.new_sales - d.new_sales_tech;
  const ftShare = d.ft_tech / (d.ft_tech + d.pat_tech + d.ow_tech);
  const patShare= d.pat_tech/ (d.ft_tech + d.pat_tech + d.ow_tech);
  d.new_ft_tech    = Math.round(d.new_sales_tech * ftShare);
  d.new_pat_tech   = Math.round(d.new_sales_tech * patShare);
  d.new_ow_tech    = d.new_sales_tech - d.new_ft_tech - d.new_pat_tech;
  d.new_ft_retail  = Math.round(d.new_sales_retail * ftShare);
  d.new_pat_retail = Math.round(d.new_sales_retail * patShare);
  d.new_ow_retail  = d.new_sales_retail - d.new_ft_retail - d.new_pat_retail;

  d.exist_sales_tech   = Math.round(d.exist_sales * existTechRatio);
  d.exist_sales_retail = d.exist_sales - d.exist_sales_tech;
  d.exist_ft_tech    = Math.round(d.exist_sales_tech * ftShare);
  d.exist_pat_tech   = Math.round(d.exist_sales_tech * patShare);
  d.exist_ow_tech    = d.exist_sales_tech - d.exist_ft_tech - d.exist_pat_tech;
  d.exist_ft_retail  = Math.round(d.exist_sales_retail * ftShare);
  d.exist_pat_retail = Math.round(d.exist_sales_retail * patShare);
  d.exist_ow_retail  = d.exist_sales_retail - d.exist_ft_retail - d.exist_pat_retail;

  // Cost totals
  d.a_attract_total  = d.a_hq  + d.a_hpb + d.a_fly;
  d.a_recruit_total  = d.a_rhq + d.a_rex;
  d.adcost_total     = d.a_attract_total + d.a_recruit_total;
  d.vcost_total      = d.v_lab + d.v_wel + d.v_tra + d.v_mat + d.v_roy + d.v_oth + d.adcost_total;
  d.fixed_total      = d.f_ren + (d.f_par || 0);

  // Rates (all as % of sales)
  const pct = v => sales > 0 ? +((v / sales) * 100).toFixed(1) : 0;
  d.vcost_rate      = pct(d.vcost_total);
  d.v_lab_rate      = pct(d.v_lab);
  d.v_wel_rate      = pct(d.v_wel);
  d.v_tra_rate      = pct(d.v_tra);
  d.v_mat_rate      = pct(d.v_mat);
  d.v_roy_rate      = pct(d.v_roy);
  d.a_attract_rate  = pct(d.a_attract_total);
  d.a_hq_rate       = pct(d.a_hq);
  d.a_hpb_rate      = pct(d.a_hpb);
  d.a_fly_rate      = pct(d.a_fly);
  d.a_recruit_rate  = pct(d.a_recruit_total);
  d.a_rhq_rate      = pct(d.a_rhq);
  d.a_rex_rate      = pct(d.a_rex);
  d.v_oth_rate      = pct(d.v_oth);
  d.fixed_rate      = pct(d.fixed_total);
  d.f_ren_rate      = pct(d.f_ren);
  d.f_par_rate      = pct(d.f_par || 0);

  // Profit
  d.marginal      = d.sales - d.vcost_total;
  d.marginal_rate = pct(d.marginal);
  d.profit        = d.marginal - d.fixed_total;
  d.profit_rate   = pct(d.profit);

  return d;
}

function computeMedian(data) {
  const m = { name:'中央値', type:'__median__', _isMedian:true, po:null };
  const allKeys = [
    'staff_total','empty_seats','ft_count','pat_count',
    'sales','sales_ft','sales_pat','sales_ow',
    'sales_tech','ft_tech','pat_tech','ow_tech',
    'sales_retail','ft_retail','pat_retail','ow_retail',
    'new_sales','new_sales_tech','new_ft_tech','new_pat_tech','new_ow_tech',
    'new_sales_retail','new_ft_retail','new_pat_retail','new_ow_retail',
    'exist_sales','exist_sales_tech','exist_ft_tech','exist_pat_tech','exist_ow_tech',
    'exist_sales_retail','exist_ft_retail','exist_pat_retail','exist_ow_retail',
    'v_lab','v_wel','v_tra','v_mat','v_roy','v_oth',
    'a_hq','a_hpb','a_fly','a_rhq','a_rex',
    'a_attract_total','a_recruit_total','adcost_total','vcost_total','fixed_total',
    'f_ren','f_par','marginal','profit',
    'occ','occ_ft','occ_pat','occ_ow',
    'labor_prod','labor_prod_ft','labor_prod_pat','labor_prod_ow',
    'prod_val','prod_val_ft','prod_val_pat','prod_val_ow',
    'unit_price','unit_price_ft','unit_price_pat','unit_price_ow',
    'tech_unit','tech_unit_ft','tech_unit_pat','tech_unit_ow',
    'retail_unit','retail_unit_ft','retail_unit_pat','retail_unit_ow',
    'retail_ratio','retail_ratio_ft','retail_ratio_pat','retail_ratio_ow',
  ];
  allKeys.forEach(k => {
    const vals = data.map(d => d[k]).filter(v => v !== undefined && v !== null).sort((a, b) => a - b);
    const mid = Math.floor(vals.length / 2);
    m[k] = vals.length % 2 !== 0 ? vals[mid] : (vals[mid - 1] + vals[mid]) / 2;
  });
  const pct = v => m.sales > 0 ? +((v / m.sales) * 100).toFixed(1) : 0;
  m.vcost_rate=pct(m.vcost_total); m.v_lab_rate=pct(m.v_lab); m.v_wel_rate=pct(m.v_wel);
  m.v_tra_rate=pct(m.v_tra); m.v_mat_rate=pct(m.v_mat); m.v_roy_rate=pct(m.v_roy);
  m.a_attract_rate=pct(m.a_attract_total); m.a_hq_rate=pct(m.a_hq); m.a_hpb_rate=pct(m.a_hpb);
  m.a_fly_rate=pct(m.a_fly); m.a_recruit_rate=pct(m.a_recruit_total); m.a_rhq_rate=pct(m.a_rhq);
  m.a_rex_rate=pct(m.a_rex); m.v_oth_rate=pct(m.v_oth);
  m.fixed_rate=pct(m.fixed_total); m.f_ren_rate=pct(m.f_ren); m.f_par_rate=pct(m.f_par||0);
  m.marginal_rate=pct(m.marginal); m.profit_rate=pct(m.profit);
  return m;
}

function computeAverages(data) {
  const a = { name:'平均', type:'__avg__', _isAvg:true, po:null };
  const n = data.length;
  const avgKeys = [
    'staff_total','empty_seats','ft_count','pat_count',
    'sales','sales_ft','sales_pat','sales_ow',
    'sales_tech','ft_tech','pat_tech','ow_tech',
    'sales_retail','ft_retail','pat_retail','ow_retail',
    'new_sales','exist_sales',
    'v_lab','v_wel','v_tra','v_mat','v_roy','v_oth',
    'a_hq','a_hpb','a_fly','a_rhq','a_rex',
    'a_attract_total','a_recruit_total','adcost_total','vcost_total','fixed_total',
    'f_ren','f_par','marginal','profit',
    'occ','occ_ft','occ_pat','occ_ow',
    'labor_prod','labor_prod_ft','labor_prod_pat','labor_prod_ow',
    'prod_val','prod_val_ft','prod_val_pat','prod_val_ow',
    'unit_price','unit_price_ft','unit_price_pat','unit_price_ow',
    'tech_unit','tech_unit_ft','tech_unit_pat','tech_unit_ow',
    'retail_unit','retail_unit_ft','retail_unit_pat','retail_unit_ow',
    'retail_ratio','retail_ratio_ft','retail_ratio_pat','retail_ratio_ow',
  ];
  avgKeys.forEach(k => { a[k] = data.reduce((s, d) => s + (d[k] || 0), 0) / n; });
  const pct = v => a.sales > 0 ? +((v / a.sales) * 100).toFixed(1) : 0;
  a.vcost_rate=pct(a.vcost_total); a.v_lab_rate=pct(a.v_lab); a.v_wel_rate=pct(a.v_wel);
  a.v_tra_rate=pct(a.v_tra); a.v_mat_rate=pct(a.v_mat); a.v_roy_rate=pct(a.v_roy);
  a.a_attract_rate=pct(a.a_attract_total); a.a_hq_rate=pct(a.a_hq); a.a_hpb_rate=pct(a.a_hpb);
  a.a_fly_rate=pct(a.a_fly); a.a_recruit_rate=pct(a.a_recruit_total); a.a_rhq_rate=pct(a.a_rhq);
  a.a_rex_rate=pct(a.a_rex); a.v_oth_rate=pct(a.v_oth);
  a.fixed_rate=pct(a.fixed_total); a.f_ren_rate=pct(a.f_ren); a.f_par_rate=pct(a.f_par||0);
  a.marginal_rate=pct(a.marginal); a.profit_rate=pct(a.profit);
  return a;
}

function computeTotals(data) {
  const t = { name:'合計', type:'__total__', _isTotal:true, po:null };
  const sumKeys = [
    'staff_total','empty_seats','ft_count','pat_count',
    'sales','sales_ft','sales_pat','sales_ow',
    'sales_tech','ft_tech','pat_tech','ow_tech',
    'sales_retail','ft_retail','pat_retail','ow_retail',
    'new_sales','new_sales_tech','new_ft_tech','new_pat_tech','new_ow_tech',
    'new_sales_retail','new_ft_retail','new_pat_retail','new_ow_retail',
    'exist_sales','exist_sales_tech','exist_ft_tech','exist_pat_tech','exist_ow_tech',
    'exist_sales_retail','exist_ft_retail','exist_pat_retail','exist_ow_retail',
    'v_lab','v_wel','v_tra','v_mat','v_roy','v_oth',
    'a_hq','a_hpb','a_fly','a_rhq','a_rex',
    'a_attract_total','a_recruit_total','adcost_total','vcost_total','fixed_total',
    'f_ren','f_par','marginal','profit',
  ];
  const avgKeys = [
    'occ','occ_ft','occ_pat','occ_ow',
    'labor_prod','labor_prod_ft','labor_prod_pat','labor_prod_ow',
    'prod_val','prod_val_ft','prod_val_pat','prod_val_ow',
    'unit_price','unit_price_ft','unit_price_pat','unit_price_ow',
    'tech_unit','tech_unit_ft','tech_unit_pat','tech_unit_ow',
    'retail_unit','retail_unit_ft','retail_unit_pat','retail_unit_ow',
    'retail_ratio','retail_ratio_ft','retail_ratio_pat','retail_ratio_ow',
  ];
  sumKeys.forEach(k => { t[k] = data.reduce((s,d) => s + (d[k]||0), 0); });
  avgKeys.forEach(k => { t[k] = data.reduce((s,d) => s + (d[k]||0), 0) / data.length; });
  // Recompute rates from totals
  const pct = v => t.sales > 0 ? +((v / t.sales) * 100).toFixed(1) : 0;
  t.vcost_rate=pct(t.vcost_total); t.v_lab_rate=pct(t.v_lab); t.v_wel_rate=pct(t.v_wel);
  t.v_tra_rate=pct(t.v_tra); t.v_mat_rate=pct(t.v_mat); t.v_roy_rate=pct(t.v_roy);
  t.a_attract_rate=pct(t.a_attract_total); t.a_hq_rate=pct(t.a_hq); t.a_hpb_rate=pct(t.a_hpb);
  t.a_fly_rate=pct(t.a_fly); t.a_recruit_rate=pct(t.a_recruit_total); t.a_rhq_rate=pct(t.a_rhq);
  t.a_rex_rate=pct(t.a_rex); t.v_oth_rate=pct(t.v_oth);
  t.fixed_rate=pct(t.fixed_total); t.f_ren_rate=pct(t.f_ren); t.f_par_rate=pct(t.f_par||0);
  t.marginal_rate=pct(t.marginal); t.profit_rate=pct(t.profit);
  return t;
}

// ===================================================
// PL TABLE  (転置版：行=項目、列=店舗)
// ===================================================
const GRP_STATE = {};
PL_GROUPS.forEach(g => GRP_STATE[g.id] = false);
GRP_STATE['fixed'] = false;

function buildPLTable() {
  const data = PL_STORE_DATA.map(computeStore);
  const totals  = computeTotals(data);
  const avgs    = computeAverages(data);
  const medians = computeMedian(data);
  const allStores = [totals, avgs, medians, ...data];

  let h = `<div class="table-wrap"><table class="data-table pl-tbl" id="plTable">`;

  // ヘッダー行：店舗名を列に
  h += `<thead><tr>`;
  h += `<th class="col-sticky pl-th-item">項目</th>`;
  allStores.forEach(s => {
    if (s._isTotal) {
      h += `<th class="col-num pl-th-store" style="background:var(--surface-3)"><strong>合計</strong></th>`;
    } else if (s._isAvg) {
      h += `<th class="col-num pl-th-store" style="background:var(--surface-3)"><strong>平均</strong></th>`;
    } else if (s._isMedian) {
      h += `<th class="col-num pl-th-store" style="background:var(--surface-3)"><strong>中央値</strong></th>`;
    } else {
      const typeTag = s.type === 'direct'
        ? '<span class="tag tag-direct" style="font-size:9px;padding:1px 5px;">直営</span>'
        : '<span class="tag tag-fc" style="font-size:9px;padding:1px 5px;">FC</span>';
      h += `<th class="col-num pl-th-store">${s.name}<br>${typeTag}</th>`;
    }
  });
  h += `</tr></thead><tbody>`;

  // 各グループ：サマリ行 + 詳細行
  PL_GROUPS.forEach(g => {
    const summaryCol = g.cols.find(c => c.summary);
    const detailCols = g.cols.filter(c => !c.summary);

    // グループサマリ行
    h += `<tr class="pl-grp-row">`;
    h += `<td class="col-sticky pl-td-grp">`;
    if (detailCols.length > 0) {
      h += `<button class="grp-toggle-btn" data-grbtn="${g.id}" onclick="toggleGrp('${g.id}')">▸</button> `;
    }
    h += `<strong>${g.label}</strong>`;
    if (summaryCol) h += ` <span style="font-size:10px;color:var(--text-3)">(${summaryCol.label})</span>`;
    h += `</td>`;
    allStores.forEach(s => {
      const val = summaryCol ? s[summaryCol.id] : null;
      const isAgg = s._isTotal || s._isAvg || s._isMedian;
      h += `<td class="col-num${isAgg ? ' row-summary-cell' : ''}">${fmtVal(val, summaryCol ? summaryCol.fmt : undefined)}</td>`;
    });
    h += `</tr>`;

    // 詳細行（デフォルト非表示）
    detailCols.forEach(c => {
      h += `<tr data-d="${g.id}" style="display:none">`;
      h += `<td class="col-sticky pl-td-detail">　${c.label}</td>`;
      allStores.forEach(s => {
        h += `<td class="col-num">${fmtVal(s[c.id], c.fmt)}</td>`;
      });
      h += `</tr>`;
    });
  });

  // 限界利益行
  [
    { id: 'marginal',      label: '限界利益',   fmt: 'num',  hl: true },
    { id: 'marginal_rate', label: '限界利益率', fmt: 'pct1', hl: true },
  ].forEach(t => {
    h += `<tr class="pl-grp-row"><td class="col-sticky pl-td-grp pl-hl-th"><strong>${t.label}</strong></td>`;
    allStores.forEach(s => {
      const val = s[t.id];
      let cls = 'col-num pl-hl';
      if (typeof val === 'number') cls += val < 0 ? ' profit-neg' : ' profit-pos';
      h += `<td class="${cls}">${fmtVal(val, t.fmt)}</td>`;
    });
    h += `</tr>`;
  });

  // 固定費グループ（展開可能）
  const fixedGrpId = 'fixed';
  h += `<tr class="pl-grp-row">`;
  h += `<td class="col-sticky pl-td-grp"><button class="grp-toggle-btn" data-grbtn="${fixedGrpId}" onclick="toggleGrp('${fixedGrpId}')">▸</button> <strong>固定費合計（税抜）</strong></td>`;
  allStores.forEach(s => h += `<td class="col-num${(s._isTotal||s._isAvg||s._isMedian) ? ' row-summary-cell' : ''}">${fmtVal(s.fixed_total, 'num')}</td>`);
  h += `</tr>`;
  [
    { id: 'fixed_rate', label: '率',               fmt: 'pct1' },
    { id: 'f_ren',      label: '家賃',              fmt: 'num'  },
    { id: 'f_ren_rate', label: '　率',              fmt: 'pct1' },
    { id: 'f_par',      label: 'お客様駐車場代',    fmt: 'num'  },
    { id: 'f_par_rate', label: '　率',              fmt: 'pct1' },
  ].forEach(c => {
    h += `<tr data-d="${fixedGrpId}" style="display:none">`;
    h += `<td class="col-sticky pl-td-detail">　${c.label}</td>`;
    allStores.forEach(s => h += `<td class="col-num">${fmtVal(s[c.id], c.fmt)}</td>`);
    h += `</tr>`;
  });

  // 暫定利益行
  [
    { id: 'profit',      label: '暫定利益',   fmt: 'num'  },
    { id: 'profit_rate', label: '暫定利益率', fmt: 'pct1' },
  ].forEach(t => {
    h += `<tr class="pl-grp-row"><td class="col-sticky pl-td-grp pl-hl-th"><strong>${t.label}</strong></td>`;
    allStores.forEach(s => {
      const val = s[t.id];
      let cls = 'col-num pl-hl';
      if (typeof val === 'number') cls += val < 0 ? ' profit-neg' : ' profit-pos';
      h += `<td class="${cls}">${fmtVal(val, t.fmt)}</td>`;
    });
    h += `</tr>`;
  });

  h += `</tbody></table></div>`;
  h += `<div class="table-note">※ 金額単位：千円　|　各グループ行の [▸] で詳細行を展開　|　FT=フルタイム / PAT=パートタイム / OW=オーナー</div>`;
  document.getElementById('plTableContainer').innerHTML = h;
}

function toggleGrp(grpId) {
  GRP_STATE[grpId] = !GRP_STATE[grpId];
  const expanded = GRP_STATE[grpId];
  const table = document.getElementById('plTable');
  if (!table) return;
  table.querySelectorAll(`[data-d="${grpId}"]`).forEach(el => {
    el.style.display = expanded ? '' : 'none';
  });
  const btn = document.querySelector(`#plTable [data-grbtn="${grpId}"]`);
  if (btn) btn.textContent = expanded ? '▾' : '▸';
}

// ===================================================
// TREND DATA (generated from PL_STORE_DATA with monthly scale factors)
// ===================================================
// Scale factors per store for [12月, 1月, 2月, 3月, 4月, 5月] — May = 1.0 (latest)
const TREND_SCALES = {
  '表参道店':  [0.836, 0.891, 0.932, 0.977, 0.940, 1.000],
  '渋谷店':    [0.852, 0.896, 0.931, 0.971, 0.946, 1.000],
  '新宿店':    [0.859, 0.901, 0.939, 0.973, 0.949, 1.000],
  '大阪梅田店':[0.873, 0.910, 0.940, 0.975, 0.951, 1.000],
  '名古屋栄店':[0.883, 0.921, 0.946, 0.978, 0.956, 1.000],
  '心斎橋店':  [0.878, 0.916, 0.943, 0.977, 0.953, 1.000],
  '福岡天神店':[1.296, 1.239, 1.183, 1.120, 1.063, 1.000],
};
const TREND_MONTHS = ['12月','1月','2月','3月','4月','5月'];

const TREND_DATA = {};
PL_STORE_DATA.forEach(s => {
  const scales = TREND_SCALES[s.name] || [0.87,0.91,0.94,0.97,0.95,1.0];
  TREND_DATA[s.name] = TREND_MONTHS.map((month, i) => {
    const sc  = scales[i];
    const r   = v => Math.round(v);
    const s1  = v => r(v * sc);
    const sl  = v => r(v * (0.92 + sc * 0.08)); // labor is less elastic than sales
    return {
      month,
      staff_total: s.staff_total, empty_seats: r(s.empty_seats / sc),
      ft_count: s.ft_count, pat_count: s.pat_count, po: s.po,
      occ:    +( s.occ     * sc).toFixed(1),
      occ_ft: +( s.occ_ft  * sc).toFixed(1),
      occ_pat:+( s.occ_pat * sc).toFixed(1),
      occ_ow: +( s.occ_ow  * sc).toFixed(1),
      unit_price:   r(s.unit_price  * (0.97 + sc * 0.03)),
      unit_price_ft:  r(s.unit_price_ft  * (0.97 + sc * 0.03)),
      unit_price_pat: r(s.unit_price_pat * (0.97 + sc * 0.03)),
      unit_price_ow:  r(s.unit_price_ow  * (0.97 + sc * 0.03)),
      labor_prod:   s1(s.labor_prod),
      labor_prod_ft:  r(s.labor_prod_ft  * (0.97 + sc * 0.03)),
      labor_prod_pat: r(s.labor_prod_pat * (0.97 + sc * 0.03)),
      labor_prod_ow:  r(s.labor_prod_ow  * (0.97 + sc * 0.03)),
      prod_val:     s1(s.prod_val),
      prod_val_ft:  s1(s.prod_val_ft),
      prod_val_pat: s1(s.prod_val_pat),
      prod_val_ow:  s.prod_val_ow,
      tech_unit:    r(s.tech_unit   * (0.97 + sc * 0.03)),
      tech_unit_ft:  r(s.tech_unit_ft  * (0.97 + sc * 0.03)),
      tech_unit_pat: r(s.tech_unit_pat * (0.97 + sc * 0.03)),
      tech_unit_ow:  r(s.tech_unit_ow  * (0.97 + sc * 0.03)),
      retail_unit:  s.retail_unit,
      retail_unit_ft:  s.retail_unit_ft,
      retail_unit_pat: s.retail_unit_pat,
      retail_unit_ow:  s.retail_unit_ow,
      retail_ratio: +(s.retail_ratio).toFixed(1),
      retail_ratio_ft:  +s.retail_ratio_ft.toFixed(1),
      retail_ratio_pat: +s.retail_ratio_pat.toFixed(1),
      retail_ratio_ow:  +s.retail_ratio_ow.toFixed(1),
      sales:        s1(s.sales),
      sales_tech:   s1(s.sales_tech),
      sales_retail: s1(s.sales_retail),
      ft_tech:      s1(s.ft_tech),
      pat_tech:     s1(s.pat_tech),
      ow_tech:      s1(s.ow_tech),
      new_sales:    s1(s.new_sales),
      exist_sales:  s1(s.exist_sales),
      v_lab: sl(s.v_lab), v_wel: sl(s.v_wel), v_tra: s1(s.v_tra),
      v_mat: s1(s.v_mat), v_roy: s1(s.v_roy), v_oth: s1(s.v_oth),
      a_hq:  s1(s.a_hq),  a_hpb: s1(s.a_hpb), a_fly: s1(s.a_fly),
      a_rhq: s1(s.a_rhq), a_rex: s1(s.a_rex),
      f_ren: s.f_ren, f_par: s.f_par || 0,
    };
  });
});

// ===================================================
// STORES LIST
// ===================================================
function buildStoresMaster() {
  const tbody = document.getElementById('storesMasterBody');
  if (!tbody) return;
  tbody.innerHTML = '';
  const count = document.getElementById('storesMasterCount');
  if (count) count.textContent = STORE_DATA.length + '店舗';

  STORE_DATA.forEach(s => {
    const typeTag = s.type === 'direct' ? '<span class="tag tag-direct">直営</span>' : '<span class="tag tag-fc">FC</span>';
    const stsBadge = s.status === 'active'
      ? '<span class="status-badge status-active">稼働中</span>'
      : '<span class="status-badge status-inactive">休止中</span>';
    const hpbLink = s.hpb_url ? `<a href="${s.hpb_url}" target="_blank" class="link-text" onclick="event.stopPropagation()">HPBリンク ↗</a>` : '—';
    const disableBtn = s.status === 'active'
      ? `<button class="btn-xs btn-xs-danger" onclick="event.stopPropagation()">無効化</button>`
      : `<button class="btn-xs btn-xs-success" onclick="event.stopPropagation()">有効化</button>`;
    const inactiveCls = s.status === 'inactive' ? ' class="row-inactive"' : '';
    const detailUrl = `${B}stores/show.html?id=${s.id}`;

    tbody.innerHTML += `
      <tr${inactiveCls} style="cursor:pointer" onclick="location.href='${detailUrl}'">
        <td><code>${s.id}</code></td>
        <td><strong>${s.name}</strong></td>
        <td>${s.owner || '—'}</td>
        <td>${s.corp}</td>
        <td>${typeTag}</td>
        <td>${s.area}</td>
        <td>${stsBadge}</td>
        <td>${hpbLink}</td>
        <td><div class="action-btns" onclick="event.stopPropagation()">
          <a class="btn-xs" href="${detailUrl}">詳細</a>
          ${disableBtn}
        </div></td>
      </tr>`;
  });
}

// ===================================================
// STORE DETAIL
// ===================================================
function buildStoreDetail() {
  const params = new URLSearchParams(window.location.search);
  const storeId = params.get('id');
  const s = STORE_DATA.find(x => x.id === storeId);
  if (!s) {
    document.getElementById('storeDetailContent').innerHTML = `
      <div style="padding:40px;text-align:center;color:var(--text-3);">
        店舗が見つかりません。<a href="${B}stores.html" class="link-text">一覧に戻る</a>
      </div>`;
    return;
  }
  document.title = `${s.name} — DEARS`;
  const typeTag = s.type === 'direct' ? '<span class="tag tag-direct">直営</span>' : '<span class="tag tag-fc">FC</span>';
  const stsBadge = s.status === 'active'
    ? '<span class="status-badge status-active">稼働中</span>'
    : '<span class="status-badge status-inactive">休止中</span>';
  const fixedTotal = s.rent + s.parking;

  document.getElementById('storeDetailContent').innerHTML = `
    <div class="detail-back">
      <a href="${B}stores.html" class="btn-ghost">← 店舗マスタ一覧に戻る</a>
      <div style="margin-left:auto;display:flex;gap:8px;align-items:center;">
        ${stsBadge} ${typeTag}
        <a class="btn-ghost" href="${B}../store/">🏪 店舗アプリを開く</a>
        <button class="btn-primary" onclick="alert('編集モード（本実装時）')">✎ 編集</button>
      </div>
    </div>
    <div class="detail-grid">
      <div class="detail-section">
        <div class="detail-section-title">📋 基本情報</div>
        <div class="detail-rows">
          <div class="detail-row"><span class="detail-label">店舗ID</span><span class="detail-val"><code>${s.id}</code></span></div>
          <div class="detail-row"><span class="detail-label">店舗名</span><span class="detail-val"><strong>${s.name}</strong></span></div>
          <div class="detail-row"><span class="detail-label">直営 / FC</span><span class="detail-val">${typeTag}</span></div>
          <div class="detail-row"><span class="detail-label">法人名</span><span class="detail-val">${s.corp}</span></div>
          <div class="detail-row"><span class="detail-label">代表者 / FCオーナー</span><span class="detail-val">${s.owner || '—'}</span></div>
          <div class="detail-row"><span class="detail-label">エリア</span><span class="detail-val">${s.area}</span></div>
          <div class="detail-row"><span class="detail-label">加盟年月</span><span class="detail-val">${s.joined}</span></div>
          <div class="detail-row"><span class="detail-label">店舗TEL</span><span class="detail-val">${s.tel || '—'}</span></div>
        </div>
      </div>
      <div class="detail-section">
        <div class="detail-section-title">📍 住所</div>
        <div class="detail-rows">
          <div class="detail-row"><span class="detail-label">都道府県</span><span class="detail-val">${s.pref}</span></div>
          <div class="detail-row"><span class="detail-label">市区町村</span><span class="detail-val">${s.city}</span></div>
          <div class="detail-row"><span class="detail-label">番地</span><span class="detail-val">${s.addr}</span></div>
          <div class="detail-row"><span class="detail-label">マンション名 / ビル名</span><span class="detail-val">${s.building || '—'}</span></div>
        </div>
        <div class="detail-full-addr">
          <span style="font-size:11px;color:var(--text-3);">全住所：</span>
          <span style="font-size:13px;">${s.pref}${s.city}${s.addr}${s.building ? ' ' + s.building : ''}</span>
        </div>
      </div>
      <div class="detail-section">
        <div class="detail-section-title">💴 固定費（税抜・月額）</div>
        <div class="detail-rows">
          <div class="detail-row"><span class="detail-label">家賃（税抜）</span><span class="detail-val"><strong>¥${s.rent.toLocaleString()}</strong></span></div>
          <div class="detail-row"><span class="detail-label">お客様駐車場代（税抜）</span><span class="detail-val">${s.parking ? '¥' + s.parking.toLocaleString() : '—'}</span></div>
          <div class="detail-row detail-row-total"><span class="detail-label">固定費合計（税抜）</span><span class="detail-val accent-val">¥${fixedTotal.toLocaleString()}</span></div>
        </div>
      </div>
      <div class="detail-section">
        <div class="detail-section-title">🔗 外部リンク</div>
        <div class="detail-rows">
          <div class="detail-row"><span class="detail-label">HPB店舗URL</span><span class="detail-val">${s.hpb_url ? `<a href="${s.hpb_url}" target="_blank" class="link-text">${s.hpb_url}</a>` : '—'}</span></div>
          <div class="detail-row"><span class="detail-label">HP URL</span><span class="detail-val">${s.hp_url ? `<a href="${s.hp_url}" target="_blank" class="link-text">${s.hp_url}</a>` : '—'}</span></div>
        </div>
      </div>
      <div class="detail-section">
        <div class="detail-section-title">💬 LINE連携</div>
        <div class="detail-rows">
          <div class="detail-row"><span class="detail-label">LINEチャネルID</span><span class="detail-val"><code class="detail-code">${s.line_channel_id || '未設定'}</code></span></div>
          <div class="detail-row"><span class="detail-label">LINEチャネルアクセストークン</span><span class="detail-val"><code class="detail-code detail-secret">${s.line_token ? s.line_token.slice(0,20) + '…' : '未設定'}</code></span></div>
        </div>
      </div>
      <div class="detail-section">
        <div class="detail-section-title">📣 広告設定</div>
        <div class="detail-rows">
          <div class="detail-row"><span class="detail-label">Meta広告 広告セットID</span><span class="detail-val"><code class="detail-code">${s.meta_adset_id || '未設定'}</code></span></div>
          <div class="detail-row"><span class="detail-label">Google広告 キャンペーンID</span><span class="detail-val"><code class="detail-code">${s.google_campaign_id || '未設定'}</code></span></div>
        </div>
      </div>
    </div>`;
}

// ===================================================
// ACCOUNTS
// ===================================================
function buildAccountsPage() {
  const tbody = document.getElementById('accountsTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';
  const counts = { admin:0, honbu:0, owner:0, staff:0 };
  ACCOUNT_DATA.forEach(a => counts[a.role]++);
  ['admin','honbu','owner','staff'].forEach(r => {
    const el = document.getElementById('accCount_' + r);
    if (el) el.textContent = counts[r];
  });
  ACCOUNT_DATA.forEach(a => {
    const rc = ROLE_CONFIG[a.role];
    const stsBadge = a.status === 'active'
      ? '<span class="status-badge status-active">有効</span>'
      : '<span class="status-badge status-inactive">無効</span>';
    const inactiveCls = a.status === 'inactive' ? ' class="row-inactive"' : '';
    tbody.innerHTML += `
      <tr${inactiveCls}>
        <td><code style="font-size:10px">${a.id}</code></td>
        <td><strong>${a.name}</strong></td>
        <td><span class="role-badge ${rc.cls}">${rc.label}</span></td>
        <td style="font-size:12px;color:var(--text-3)">${a.email}</td>
        <td>${a.store}</td>
        <td>${stsBadge}</td>
        <td style="font-size:11px;color:var(--text-3)">${a.lastLogin}</td>
        <td><div class="action-btns">
          <button class="btn-xs">編集</button>
          <button class="btn-xs btn-xs-danger">無効化</button>
        </div></td>
      </tr>`;
  });
}

// ===================================================
// BILLING
// ===================================================
function buildBillingTable() {
  const tbody = document.getElementById('billingTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';
  let totalMktg = 0, totalRec = 0, totalAll = 0;
  BILLING_DATA.forEach(b => {
    const total = b.mktg + b.recruit;
    totalMktg += b.mktg; totalRec += b.recruit; totalAll += total;
    const stsBadge = b.status === 'confirmed'
      ? '<span class="status-badge status-active">確定</span>'
      : '<span class="status-badge status-pending">未確定</span>';
    const tag = b.type === 'direct' ? '<span class="tag tag-direct">直営</span>' : '<span class="tag tag-fc">FC</span>';
    tbody.innerHTML += `
      <tr>
        <td>${b.name}</td><td>${tag}</td>
        <td class="col-num">${b.mktg ? b.mktg.toLocaleString() : '—'}</td>
        <td class="col-num">${b.recruit ? b.recruit.toLocaleString() : '—'}</td>
        <td class="col-num"><strong>${total ? total.toLocaleString() : '—'}</strong></td>
        <td>${stsBadge}</td>
        <td><button class="btn-xs">詳細</button></td>
      </tr>`;
  });
  document.getElementById('billingTotal').innerHTML = `
    <tr class="row-summary">
      <td><strong>合計</strong></td><td>—</td>
      <td class="col-num"><strong>${totalMktg.toLocaleString()}</strong></td>
      <td class="col-num"><strong>${totalRec.toLocaleString()}</strong></td>
      <td class="col-num"><strong>${totalAll.toLocaleString()}</strong></td>
      <td>—</td><td></td>
    </tr>`;
}
