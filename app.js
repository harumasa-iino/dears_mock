// ===== NAVIGATION =====
const PAGE_TITLES = {
  pl:           'PL画面',
  stores:       '店舗マスタ管理',
  'store-detail': '店舗詳細',
  accounts:     'アカウント管理',
  budget:       '予算管理',
  billing:      '請求リスト',
  monthly:      '月次データ確認・修正',
  ads:          '広告データ連携',

};

function navigate(page) {
  document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const target = document.getElementById('page-' + page);
  if (target) target.classList.add('active');
  const navItem = document.querySelector(`.nav-item[data-page="${page}"]`);
  if (navItem) navItem.classList.add('active');
  document.getElementById('pageTitle').textContent = PAGE_TITLES[page] || page;
}

// ===================================================
// PL TABLE
// ===================================================

const PL_GROUPS = [
  {
    id: 'staff', label: '人員構成',
    cols: [
      { id: 'staff_total', label: 'スタッフ計', summary: true },
      { id: 'empty_seats', label: '空き席' },
      { id: 'ft_count',    label: 'FT数' },
      { id: 'pat_count',   label: 'PAT数' },
      { id: 'po',          label: 'PO在籍', fmt: 'bool' },
    ]
  },
  {
    id: 'occ', label: '稼働率',
    cols: [
      { id: 'occ',     label: '合計', summary: true, fmt: 'pct1' },
      { id: 'occ_ft',  label: 'FT',             fmt: 'pct1' },
      { id: 'occ_pat', label: 'PAT',            fmt: 'pct1' },
      { id: 'occ_ow',  label: 'OW',             fmt: 'pct1' },
    ]
  },
  {
    id: 'prod', label: '生産性・単価',
    cols: [
      { id: 'unit_price',   label: '客単価',     summary: true, fmt: 'yen' },
      { id: 'labor_prod',   label: '人事生産性',           fmt: 'yen' },
      { id: 'prod_val',     label: '生産性',               fmt: 'yen' },
      { id: 'tech_unit',    label: '技術単価',             fmt: 'yen' },
      { id: 'retail_unit',  label: '店販単価',             fmt: 'yen' },
      { id: 'retail_ratio', label: '店販比率',             fmt: 'pct1' },
    ]
  },
  {
    id: 'sales', label: '売上',
    cols: [
      { id: 'sales',        label: '総売上',     summary: true, fmt: 'num' },
      { id: 'sales_tech',   label: '技術売上',             fmt: 'num' },
      { id: 'sales_retail', label: '店販売上',             fmt: 'num' },
      { id: 'ft_tech',      label: 'FT技術',               fmt: 'num' },
      { id: 'pat_tech',     label: 'PAT技術',              fmt: 'num' },
      { id: 'ow_tech',      label: 'OW技術',               fmt: 'num' },
      { id: 'new_sales',    label: '新規売上',             fmt: 'num' },
      { id: 'exist_sales',  label: '既存売上',             fmt: 'num' },
    ]
  },
  {
    id: 'vcost', label: '変動費',
    cols: [
      { id: 'vcost_total', label: '小計',  summary: true, fmt: 'num' },
      { id: 'v_lab', label: '人件費',                fmt: 'num' },
      { id: 'v_wel', label: '法定福利',              fmt: 'num' },
      { id: 'v_tra', label: '交通費',               fmt: 'num' },
      { id: 'v_mat', label: '薬剤費',               fmt: 'num' },
      { id: 'v_roy', label: 'ロイヤリティ',         fmt: 'num' },
      { id: 'v_oth', label: 'その他',               fmt: 'num' },
    ]
  },
  {
    id: 'adcost', label: '広告費',
    cols: [
      { id: 'adcost_total', label: '小計',  summary: true, fmt: 'num' },
      { id: 'a_hq',  label: '集客(本部)',            fmt: 'num' },
      { id: 'a_hpb', label: 'HPB',                  fmt: 'num' },
      { id: 'a_fly', label: 'チラシ',               fmt: 'num' },
      { id: 'a_rhq', label: '求人(本部)',            fmt: 'num' },
      { id: 'a_rex', label: '求人(外部)',            fmt: 'num' },
    ]
  },
];

const PL_STORE_DATA = [
  { name:'表参道店', type:'direct', area:'東京',
    staff_total:8, empty_seats:2, ft_count:4, pat_count:3, po:true,
    occ:84.2, occ_ft:88.1, occ_pat:76.4, occ_ow:92.0,
    unit_price:12800, labor_prod:1540, prod_val:1280, tech_unit:10700, retail_unit:2100, retail_ratio:16.4,
    sales:3840, sales_tech:3210, sales_retail:630, ft_tech:1770, pat_tech:930, ow_tech:510, new_sales:770, exist_sales:2440,
    v_lab:690, v_wel:70, v_tra:24, v_mat:220, v_roy:0,   v_oth:46,
    a_hq:180, a_hpb:130, a_fly:25, a_rhq:0,  a_rex:62,  f_ren:480, f_par:0 },
  { name:'渋谷店', type:'direct', area:'東京',
    staff_total:7, empty_seats:1, ft_count:4, pat_count:2, po:true,
    occ:78.6, occ_ft:82.0, occ_pat:70.2, occ_ow:85.0,
    unit_price:11900, labor_prod:1490, prod_val:1220, tech_unit:10200, retail_unit:1700, retail_ratio:14.1,
    sales:3120, sales_tech:2680, sales_retail:440, ft_tech:1560, pat_tech:620, ow_tech:500, new_sales:680, exist_sales:2000,
    v_lab:580, v_wel:58, v_tra:20, v_mat:190, v_roy:0,   v_oth:38,
    a_hq:160, a_hpb:110, a_fly:20, a_rhq:0,  a_rex:48,  f_ren:420, f_par:0 },
  { name:'新宿店', type:'direct', area:'東京',
    staff_total:7, empty_seats:2, ft_count:3, pat_count:3, po:true,
    occ:77.4, occ_ft:80.0, occ_pat:74.0, occ_ow:84.0,
    unit_price:11400, labor_prod:1480, prod_val:1200, tech_unit:9800, retail_unit:1600, retail_ratio:14.8,
    sales:2980, sales_tech:2540, sales_retail:440, ft_tech:1140, pat_tech:920, ow_tech:480, new_sales:620, exist_sales:1920,
    v_lab:560, v_wel:56, v_tra:18, v_mat:180, v_roy:0,   v_oth:36,
    a_hq:150, a_hpb:100, a_fly:18, a_rhq:0,  a_rex:46,  f_ren:450, f_par:0 },
  { name:'大阪梅田店', type:'fc', area:'大阪',
    staff_total:6, empty_seats:1, ft_count:3, pat_count:2, po:true,
    occ:70.1, occ_ft:74.0, occ_pat:63.0, occ_ow:76.0,
    unit_price:11000, labor_prod:1370, prod_val:1100, tech_unit:9200, retail_unit:1800, retail_ratio:16.4,
    sales:2680, sales_tech:2240, sales_retail:440, ft_tech:1100, pat_tech:660, ow_tech:480, new_sales:560, exist_sales:1680,
    v_lab:480, v_wel:48, v_tra:16, v_mat:160, v_roy:268, v_oth:32,
    a_hq:140, a_hpb:100, a_fly:15, a_rhq:60, a_rex:50,  f_ren:320, f_par:0 },
  { name:'名古屋栄店', type:'fc', area:'名古屋',
    staff_total:5, empty_seats:1, ft_count:2, pat_count:2, po:true,
    occ:65.8, occ_ft:70.0, occ_pat:59.0, occ_ow:72.0,
    unit_price:10600, labor_prod:1340, prod_val:1060, tech_unit:9000, retail_unit:1600, retail_ratio:15.0,
    sales:2140, sales_tech:1820, sales_retail:320, ft_tech:820, pat_tech:600, ow_tech:400, new_sales:440, exist_sales:1380,
    v_lab:420, v_wel:42, v_tra:14, v_mat:140, v_roy:214, v_oth:28,
    a_hq:110, a_hpb:80,  a_fly:12, a_rhq:50, a_rex:38,  f_ren:280, f_par:0 },
  { name:'心斎橋店', type:'fc', area:'大阪',
    staff_total:5, empty_seats:1, ft_count:2, pat_count:2, po:false,
    occ:62.3, occ_ft:65.0, occ_pat:56.0, occ_ow:70.0,
    unit_price:10200, labor_prod:1320, prod_val:1020, tech_unit:8700, retail_unit:1500, retail_ratio:15.2,
    sales:1980, sales_tech:1680, sales_retail:300, ft_tech:730, pat_tech:560, ow_tech:390, new_sales:400, exist_sales:1280,
    v_lab:390, v_wel:39, v_tra:13, v_mat:130, v_roy:198, v_oth:25,
    a_hq:100, a_hpb:70,  a_fly:10, a_rhq:45, a_rex:32,  f_ren:260, f_par:0 },
  { name:'福岡天神店', type:'fc', area:'福岡',
    staff_total:5, empty_seats:3, ft_count:2, pat_count:2, po:false,
    occ:48.2, occ_ft:52.0, occ_pat:42.0, occ_ow:56.0,
    unit_price:8100, labor_prod:1200, prod_val:890, tech_unit:6900, retail_unit:1200, retail_ratio:14.8,
    sales:1420, sales_tech:1210, sales_retail:210, ft_tech:520, pat_tech:420, ow_tech:270, new_sales:260, exist_sales:950,
    v_lab:400, v_wel:40, v_tra:12, v_mat:110, v_roy:142, v_oth:22,
    a_hq:80,  a_hpb:65,  a_fly:8,  a_rhq:35, a_rex:30,  f_ren:480, f_par:0 },
];

// Group expanded state (default: all collapsed)
const GRP_STATE = {};
PL_GROUPS.forEach(g => GRP_STATE[g.id] = false);

function computeStore(s) {
  const d = { ...s };
  d.vcost_total  = d.v_lab + d.v_wel + d.v_tra + d.v_mat + d.v_roy + d.v_oth;
  d.adcost_total = d.a_hq  + d.a_hpb + d.a_fly + d.a_rhq + d.a_rex;
  d.fixed_total  = d.f_ren + (d.f_par || 0);
  d.marginal      = d.sales - d.vcost_total - d.adcost_total;
  d.marginal_rate = d.marginal / d.sales * 100;
  d.profit        = d.marginal - d.fixed_total;
  d.profit_rate   = d.profit   / d.sales * 100;
  return d;
}

function computeTotals(data) {
  const t = { name:'合計', type:'__total__', _isTotal:true, po:null };
  const sumKeys = ['staff_total','empty_seats','ft_count','pat_count',
    'sales','sales_tech','sales_retail','ft_tech','pat_tech','ow_tech','new_sales','exist_sales',
    'v_lab','v_wel','v_tra','v_mat','v_roy','v_oth',
    'a_hq','a_hpb','a_fly','a_rhq','a_rex',
    'vcost_total','adcost_total','fixed_total','marginal','profit'];
  const avgKeys = ['occ','occ_ft','occ_pat','occ_ow',
    'unit_price','labor_prod','prod_val','tech_unit','retail_unit','retail_ratio',
    'marginal_rate','profit_rate'];
  sumKeys.forEach(k => { t[k] = data.reduce((s,d) => s + (d[k]||0), 0); });
  avgKeys.forEach(k => { t[k] = data.reduce((s,d) => s + (d[k]||0), 0) / data.length; });
  return t;
}

function fmtVal(val, fmt) {
  if (val === undefined || val === null) return '—';
  switch (fmt) {
    case 'pct1': return val.toFixed(1) + '%';
    case 'yen':  return '¥' + Math.round(val).toLocaleString();
    case 'bool': return val ? '<span style="color:var(--green);font-weight:700;">●</span>' : '<span style="color:var(--text-3);">—</span>';
    case 'num':  default: return Math.round(val).toLocaleString();
  }
}

function buildPLTable() {
  const data = PL_STORE_DATA.map(computeStore);
  const totals = computeTotals(data);

  let h = `<div class="table-wrap"><table class="data-table pl-tbl" id="plTable">`;

  // ---- THEAD row 1: group headers ----
  h += `<thead><tr class="pl-grp-row">`;
  h += `<th rowspan="2" class="col-sticky pl-th-store">店舗名</th>`;
  h += `<th rowspan="2" class="pl-th-type">区分</th>`;

  PL_GROUPS.forEach(g => {
    h += `<th class="pl-grp-th" data-grpth="${g.id}" colspan="1">`;
    h += `${g.label} <button class="grp-toggle-btn" data-grbtn="${g.id}" onclick="toggleGrp('${g.id}')">▸</button>`;
    h += `</th>`;
  });
  h += `<th rowspan="2" class="col-num pl-fixed-th">固定費</th>`;
  h += `<th colspan="4" class="pl-grp-th pl-grp-profit">📊 利益</th>`;
  h += `</tr>`;

  // ---- THEAD row 2: column names ----
  h += `<tr class="pl-col-row">`;
  PL_GROUPS.forEach(g => {
    g.cols.forEach(c => {
      const det = !c.summary;
      const vis = (det && !GRP_STATE[g.id]) ? ' style="display:none"' : '';
      const dd  = det ? ` data-d="${g.id}"` : '';
      h += `<th class="col-num"${vis}${dd}>${c.label}</th>`;
    });
  });
  // Profit sub-headers
  ['限界利益','利益率','暫定利益','利益率'].forEach((lbl, i) => {
    h += `<th class="col-num pl-hl-th">${lbl}${i===0||i===2 ? '' : ''}</th>`;
  });
  h += `</tr></thead>`;

  // ---- TBODY ----
  h += `<tbody>`;
  h += buildPLRow(totals, true);
  data.forEach(s => h += buildPLRow(s, false));
  h += `</tbody></table></div>`;
  h += `<div class="table-note">※ 金額単位：千円　|　各グループの [▸] で詳細列を展開　|　FT=フルタイム / PAT=パートタイム / OW=オーナー</div>`;

  document.getElementById('plTableContainer').innerHTML = h;
}

function buildPLRow(s, isTotal) {
  const isNeg  = !isTotal && s.profit  < 0;
  const isWarn = !isTotal && !isNeg && s.occ < 65;
  const rowCls = isTotal ? 'row-summary' : isNeg ? 'row-alert' : isWarn ? 'row-warn' : '';

  let h = `<tr class="${rowCls}">`;

  // Store name + trend button
  const dot    = isNeg ? '<span class="alert-dot">●</span>' : '';
  const trend  = !isTotal ? `<button class="btn-trend" onclick="openTrend('${s.name}')">推移</button>` : '';
  h += `<td class="col-sticky pl-td-store">${dot}<strong>${isTotal ? '合計' : s.name}</strong>${trend}</td>`;

  // Type tag
  h += `<td>`;
  if (!isTotal) {
    h += s.type === 'direct'
      ? '<span class="tag tag-direct">直営</span>'
      : '<span class="tag tag-fc">FC</span>';
  } else { h += '<span style="color:var(--text-3)">—</span>'; }
  h += `</td>`;

  // Group columns
  PL_GROUPS.forEach(g => {
    g.cols.forEach(c => {
      const det = !c.summary;
      const vis = (det && !GRP_STATE[g.id]) ? ' style="display:none"' : '';
      const dd  = det ? ` data-d="${g.id}"` : '';
      h += `<td class="col-num"${vis}${dd}>${fmtVal(s[c.id], c.fmt)}</td>`;
    });
  });

  // Fixed cost
  h += `<td class="col-num">${fmtVal(s.fixed_total,'num')}</td>`;

  // Profit columns
  const profitCols = [
    { id:'marginal',      fmt:'num'  },
    { id:'marginal_rate', fmt:'pct1' },
    { id:'profit',        fmt:'num'  },
    { id:'profit_rate',   fmt:'pct1' },
  ];
  profitCols.forEach(t => {
    const val = s[t.id];
    let cls = 'col-num pl-hl';
    if (typeof val === 'number') {
      if (val < 0) cls += ' profit-neg';
      else cls += ' profit-pos';
    }
    h += `<td class="${cls}">${fmtVal(val, t.fmt)}</td>`;
  });

  h += `</tr>`;
  return h;
}

function toggleGrp(grpId) {
  GRP_STATE[grpId] = !GRP_STATE[grpId];
  const expanded = GRP_STATE[grpId];
  const table = document.getElementById('plTable');
  if (!table) return;

  table.querySelectorAll(`[data-d="${grpId}"]`).forEach(el => {
    el.style.display = expanded ? '' : 'none';
  });

  const btn = document.querySelector(`[data-grbtn="${grpId}"]`);
  if (btn) btn.textContent = expanded ? '▾' : '▸';

  const th = document.querySelector(`[data-grpth="${grpId}"]`);
  if (th) {
    const grp = PL_GROUPS.find(g => g.id === grpId);
    th.colSpan = expanded ? grp.cols.length : 1;
  }
}

// ===================================================
// TREND MODAL
// ===================================================
const TREND_DATA = {
  default: [
    { month:'12月', sales:2100, marginal:1100, profit: 380, occ:64 },
    { month:'1月',  sales:2280, marginal:1200, profit: 460, occ:68 },
    { month:'2月',  sales:2420, marginal:1300, profit: 530, occ:71 },
    { month:'3月',  sales:2650, marginal:1420, profit: 660, occ:74 },
    { month:'4月',  sales:2490, marginal:1340, profit: 580, occ:72 },
    { month:'5月',  sales:2680, marginal:1430, profit: 640, occ:76 },
  ],
  '表参道店': [
    { month:'12月', sales:3210, marginal:2020, profit: 980, occ:76 },
    { month:'1月',  sales:3420, marginal:2180, profit:1120, occ:79 },
    { month:'2月',  sales:3580, marginal:2290, profit:1210, occ:81 },
    { month:'3月',  sales:3750, marginal:2410, profit:1350, occ:83 },
    { month:'4月',  sales:3610, marginal:2310, profit:1250, occ:82 },
    { month:'5月',  sales:3840, marginal:2393, profit:1913, occ:84 },
  ],
  '福岡天神店': [
    { month:'12月', sales:1840, marginal: 860, profit: 240, occ:58 },
    { month:'1月',  sales:1760, marginal: 800, profit: 140, occ:55 },
    { month:'2月',  sales:1680, marginal: 740, profit:  40, occ:52 },
    { month:'3月',  sales:1590, marginal: 680, profit: -60, occ:50 },
    { month:'4月',  sales:1510, marginal: 620, profit:-120, occ:49 },
    { month:'5月',  sales:1420, marginal: 534, profit: -47, occ:48 },
  ],
  '渋谷店': [
    { month:'12月', sales:2760, marginal:1680, profit: 780, occ:72 },
    { month:'1月',  sales:2890, marginal:1760, profit: 860, occ:74 },
    { month:'2月',  sales:2980, marginal:1830, profit: 930, occ:76 },
    { month:'3月',  sales:3100, marginal:1910, profit:1010, occ:78 },
    { month:'4月',  sales:3050, marginal:1870, profit: 960, occ:77 },
    { month:'5月',  sales:3120, marginal:1896, profit:1056, occ:79 },
  ],
};

function openTrend(storeName) {
  const data = TREND_DATA[storeName] || TREND_DATA['default'];
  document.getElementById('trendModalTitle').textContent = storeName + ' — 月別推移';
  const maxSales = Math.max(...data.map(d => d.sales));

  // Line chart (SVG)
  const chartEl = document.getElementById('trendChart');
  chartEl.innerHTML = '';
  const W = 560, H = 120, padL = 40, padR = 10, padT = 10, padB = 24;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const n = data.length;
  const minVal = Math.min(...data.map(d => d.profit));
  const maxVal = maxSales;
  const valRange = maxVal - Math.min(minVal, 0);
  const xPos = i => padL + (i / (n - 1)) * innerW;
  const yPos = v => padT + innerH - ((v - Math.min(minVal, 0)) / valRange) * innerH;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.style.cssText = 'width:100%;height:auto;';

  // Zero line
  const zeroY = yPos(0);
  const zeroLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  zeroLine.setAttribute('x1', padL); zeroLine.setAttribute('x2', W - padR);
  zeroLine.setAttribute('y1', zeroY); zeroLine.setAttribute('y2', zeroY);
  zeroLine.setAttribute('stroke', '#ddd'); zeroLine.setAttribute('stroke-dasharray', '3 3');
  svg.appendChild(zeroLine);

  const mkLine = (key, color) => {
    const pts = data.map((d, i) => `${xPos(i)},${yPos(d[key])}`).join(' ');
    const pl = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    pl.setAttribute('points', pts);
    pl.setAttribute('fill', 'none');
    pl.setAttribute('stroke', color);
    pl.setAttribute('stroke-width', '2');
    pl.setAttribute('stroke-linejoin', 'round');
    pl.setAttribute('stroke-linecap', 'round');
    svg.appendChild(pl);
    data.forEach((d, i) => {
      const cx = xPos(i), cy = yPos(d[key]);
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', cx); circle.setAttribute('cy', cy); circle.setAttribute('r', '3');
      circle.setAttribute('fill', color);
      svg.appendChild(circle);
    });
  };

  mkLine('sales',    '#4361ee');
  mkLine('marginal', '#2ec4b6');
  mkLine('profit',   '#e63946');

  // X labels
  data.forEach((d, i) => {
    const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    txt.setAttribute('x', xPos(i)); txt.setAttribute('y', H - 4);
    txt.setAttribute('text-anchor', 'middle');
    txt.setAttribute('font-size', '9'); txt.setAttribute('fill', '#666');
    txt.textContent = d.month;
    svg.appendChild(txt);
  });

  // Legend
  const legend = [['売上','#4361ee'], ['限界利益','#2ec4b6'], ['利益','#e63946']];
  legend.forEach(([label, color], i) => {
    const lx = padL + i * 90;
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', lx); rect.setAttribute('y', padT);
    rect.setAttribute('width', '16'); rect.setAttribute('height', '3');
    rect.setAttribute('fill', color); rect.setAttribute('rx', '1');
    svg.appendChild(rect);
    const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    txt.setAttribute('x', lx + 20); txt.setAttribute('y', padT + 5);
    txt.setAttribute('font-size', '9'); txt.setAttribute('fill', '#555');
    txt.textContent = label;
    svg.appendChild(txt);
  });

  chartEl.appendChild(svg);

  // Table
  const tbody = document.getElementById('trendTableBody');
  tbody.innerHTML = '';
  data.forEach((d, i) => {
    const prev = i > 0 ? data[i-1] : null;
    const mom  = prev ? Math.round((d.sales - prev.sales) / prev.sales * 100) : null;
    const momStr = mom === null ? '—' : (mom >= 0 ? `▲ +${mom}%` : `▼ ${mom}%`);
    const momCls = mom === null ? '' : (mom >= 0 ? 'profit-pos' : 'profit-neg');
    const pCls = d.profit >= 0 ? 'profit-pos' : 'profit-neg';
    const isCur = i === data.length - 1;
    const tr = document.createElement('tr');
    if (isCur) tr.style.background = '#f0f4ff';
    tr.innerHTML = `
      <td>${d.month}${isCur ? ' <span style="font-size:10px;color:var(--accent);font-weight:600;">今月</span>' : ''}</td>
      <td class="col-num">${d.sales.toLocaleString()}</td>
      <td class="col-num">${d.occ}%</td>
      <td class="col-num">${(d.sales - d.marginal).toLocaleString()}</td>
      <td class="col-num">${(d.marginal - d.profit).toLocaleString()}</td>
      <td class="col-num">${d.marginal.toLocaleString()}</td>
      <td class="col-num ${pCls}">${d.profit < 0 ? '−'+Math.abs(d.profit).toLocaleString() : d.profit.toLocaleString()}</td>
      <td class="col-num ${momCls}">${momStr}</td>`;
    tbody.appendChild(tr);
  });

  document.getElementById('trendModal').classList.add('open');
}

function closeTrend() {
  document.getElementById('trendModal').classList.remove('open');
}
function closeTrendOnOverlay(e) {
  if (e.target === document.getElementById('trendModal')) closeTrend();
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeTrend(); });

// ===================================================
// ALERT PAGE
// ===================================================
const ALERT_DATA = [
  { store:'福岡天神店', type:'赤字',     detail:'暫定利益が −47千円',         val:'−47千円',  threshold:'0以上',   sev:'danger'  },
  { store:'福岡天神店', type:'低稼働率', detail:'稼働率 48.2%（目標 60%以上）', val:'48.2%',   threshold:'60%以上', sev:'danger'  },
  { store:'福岡天神店', type:'月次確認待ち', detail:'データ入力済み・本部未確認', val:'確認待ち', threshold:'—',      sev:'warning' },
  { store:'心斎橋店',  type:'低稼働率', detail:'稼働率 62.3%（目標 65%以上）', val:'62.3%',   threshold:'65%以上', sev:'warning' },
  { store:'心斎橋店',  type:'PO不在',   detail:'プレイヤーオーナー在籍なし',    val:'不在',    threshold:'在籍',    sev:'warning' },
  { store:'名古屋栄店', type:'低稼働率', detail:'稼働率 65.8%（ボーダーライン）',val:'65.8%',  threshold:'65%以上', sev:'notice'  },
  { store:'札幌大通店', type:'月次未入力', detail:'5月度データが期限超過',       val:'未入力',  threshold:'月末+3日', sev:'warning' },
  { store:'仙台一番町店', type:'月次未入力', detail:'5月度データが期限超過',     val:'未入力',  threshold:'月末+3日', sev:'warning' },
];

function buildAlertPage() {
  const counts = { danger:0, warning:0, notice:0, ok:0 };
  ALERT_DATA.forEach(a => counts[a.sev]++);
  // Remaining stores
  counts.ok = 7 - [...new Set(ALERT_DATA.map(a=>a.store))].length;

  document.getElementById('alertDanger').textContent  = counts.danger;
  document.getElementById('alertWarning').textContent = counts.warning;
  document.getElementById('alertNotice').textContent  = counts.notice;
  document.getElementById('alertOk').textContent      = Math.max(counts.ok, 0);

  const tbody = document.getElementById('alertTableBody');
  tbody.innerHTML = '';
  ALERT_DATA.forEach(a => {
    const sevConfig = {
      danger:  { label:'危険',  cls:'sev-danger'  },
      warning: { label:'警告',  cls:'sev-warning' },
      notice:  { label:'注意',  cls:'sev-notice'  },
    };
    const sc = sevConfig[a.sev];
    tbody.innerHTML += `
      <tr>
        <td><strong>${a.store}</strong></td>
        <td><span class="alert-type-tag">${a.type}</span></td>
        <td>${a.detail}</td>
        <td class="col-num"><strong>${a.val}</strong></td>
        <td class="col-num" style="color:var(--text-3)">${a.threshold}</td>
        <td><span class="sev-badge ${sc.cls}">${sc.label}</span></td>
        <td><button class="btn-xs">対応記録</button></td>
      </tr>`;
  });
}

// ===================================================
// BILLING PAGE
// ===================================================
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
    const tag = b.type === 'direct'
      ? '<span class="tag tag-direct">直営</span>'
      : '<span class="tag tag-fc">FC</span>';
    tbody.innerHTML += `
      <tr>
        <td>${b.name}</td>
        <td>${tag}</td>
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

// ===================================================
// STORE MASTER DATA
// ===================================================
const STORE_DATA = [
  {
    id: 'ST001', name: '表参道店', type: 'direct', status: 'active',
    corp: '株式会社DEARS', owner: '—', area: '東京',
    joined: '2018年4月',
    tel: '03-1234-5678',
    pref: '東京都', city: '渋谷区', addr: '神宮前4-1-1', building: 'DEARSビル 2F',
    rent: 320000, parking: 0,
    hpb_url: 'https://beauty.hotpepper.jp/slnH000000001/',
    hp_url: 'https://dears.co.jp/omotesando/',
    line_channel_id: '1234567890',
    line_token: 'eyJhbGciOiJIUzI1NiJ9.xxxx',
    meta_adset_id: 'act_123456789_adset_001',
    google_campaign_id: '9876543210',
  },
  {
    id: 'ST002', name: '渋谷店', type: 'direct', status: 'active',
    corp: '株式会社DEARS', owner: '—', area: '東京',
    joined: '2019年2月',
    tel: '03-2345-6789',
    pref: '東京都', city: '渋谷区', addr: '道玄坂2-25-12', building: '渋谷Mビル 3F',
    rent: 290000, parking: 0,
    hpb_url: 'https://beauty.hotpepper.jp/slnH000000002/',
    hp_url: 'https://dears.co.jp/shibuya/',
    line_channel_id: '2345678901',
    line_token: 'eyJhbGciOiJIUzI1NiJ9.yyyy',
    meta_adset_id: 'act_123456789_adset_002',
    google_campaign_id: '8765432109',
  },
  {
    id: 'ST003', name: '新宿店', type: 'direct', status: 'active',
    corp: '株式会社DEARS', owner: '—', area: '東京',
    joined: '2019年9月',
    tel: '03-3456-7890',
    pref: '東京都', city: '新宿区', addr: '新宿3-14-1', building: 'ルミネ新宿 4F',
    rent: 310000, parking: 0,
    hpb_url: 'https://beauty.hotpepper.jp/slnH000000003/',
    hp_url: 'https://dears.co.jp/shinjuku/',
    line_channel_id: '3456789012',
    line_token: 'eyJhbGciOiJIUzI1NiJ9.zzzz',
    meta_adset_id: 'act_123456789_adset_003',
    google_campaign_id: '7654321098',
  },
  {
    id: 'FC001', name: '大阪梅田店', type: 'fc', status: 'active',
    corp: '株式会社ヤマダビューティ', owner: '山田 太郎', area: '大阪',
    joined: '2020年6月',
    tel: '06-1234-5678',
    pref: '大阪府', city: '大阪市北区', addr: '梅田1-13-1', building: '大阪梅田ビル 5F',
    rent: 280000, parking: 30000,
    hpb_url: 'https://beauty.hotpepper.jp/slnH000000004/',
    hp_url: '',
    line_channel_id: '4567890123',
    line_token: 'eyJhbGciOiJIUzI1NiJ9.aaaa',
    meta_adset_id: 'act_987654321_adset_001',
    google_campaign_id: '6543210987',
  },
  {
    id: 'FC002', name: '名古屋栄店', type: 'fc', status: 'active',
    corp: '田中ビューティ合同会社', owner: '田中 花子', area: '名古屋',
    joined: '2020年11月',
    tel: '052-234-5678',
    pref: '愛知県', city: '名古屋市中区', addr: '栄3-4-5', building: 'SAKAE BLDG 2F',
    rent: 240000, parking: 20000,
    hpb_url: 'https://beauty.hotpepper.jp/slnH000000005/',
    hp_url: '',
    line_channel_id: '5678901234',
    line_token: 'eyJhbGciOiJIUzI1NiJ9.bbbb',
    meta_adset_id: 'act_987654321_adset_002',
    google_campaign_id: '5432109876',
  },
  {
    id: 'FC003', name: '心斎橋店', type: 'fc', status: 'active',
    corp: '合同会社シンサイバシスタイル', owner: '鈴木 二郎', area: '大阪',
    joined: '2021年3月',
    tel: '06-2345-6789',
    pref: '大阪府', city: '大阪市中央区', addr: '心斎橋筋1-2-3', building: 'SHINSAIBASHI 3F',
    rent: 220000, parking: 0,
    hpb_url: 'https://beauty.hotpepper.jp/slnH000000006/',
    hp_url: '',
    line_channel_id: '6789012345',
    line_token: 'eyJhbGciOiJIUzI1NiJ9.cccc',
    meta_adset_id: 'act_987654321_adset_003',
    google_campaign_id: '4321098765',
  },
  {
    id: 'FC007', name: '福岡天神店', type: 'fc', status: 'active',
    corp: 'スズキスタイル株式会社', owner: '鈴木 一郎', area: '福岡',
    joined: '2021年8月',
    tel: '092-345-6789',
    pref: '福岡県', city: '福岡市中央区', addr: '天神2-5-55', building: 'ソラリアビル 6F',
    rent: 380000, parking: 50000,
    hpb_url: 'https://beauty.hotpepper.jp/slnH000000007/',
    hp_url: '',
    line_channel_id: '7890123456',
    line_token: 'eyJhbGciOiJIUzI1NiJ9.dddd',
    meta_adset_id: 'act_987654321_adset_007',
    google_campaign_id: '3210987654',
  },
  {
    id: 'FC009', name: '京都四条店', type: 'fc', status: 'inactive',
    corp: '佐藤ヘア株式会社', owner: '佐藤 美咲', area: '京都',
    joined: '2022年1月',
    tel: '075-456-7890',
    pref: '京都府', city: '京都市下京区', addr: '四条河原町3-1', building: '四条ビル 2F',
    rent: 200000, parking: 0,
    hpb_url: '',
    hp_url: '',
    line_channel_id: '',
    line_token: '',
    meta_adset_id: '',
    google_campaign_id: '',
  },
];

// ===================================================
// STORE MASTER TABLE (JS-generated)
// ===================================================
function buildStoresMaster() {
  const tbody = document.getElementById('storesMasterBody');
  if (!tbody) return;
  tbody.innerHTML = '';
  const count = document.getElementById('storesMasterCount');
  if (count) count.textContent = STORE_DATA.length + '店舗';

  STORE_DATA.forEach(s => {
    const typeTag = s.type === 'direct'
      ? '<span class="tag tag-direct">直営</span>'
      : '<span class="tag tag-fc">FC</span>';
    const stsBadge = s.status === 'active'
      ? '<span class="status-badge status-active">稼働中</span>'
      : '<span class="status-badge status-inactive">休止中</span>';
    const hpbLink = s.hpb_url
      ? `<a href="${s.hpb_url}" target="_blank" class="link-text">HPBリンク ↗</a>`
      : '—';
    const disableBtn = s.status === 'active'
      ? `<button class="btn-xs btn-xs-danger" onclick="event.stopPropagation()">無効化</button>`
      : `<button class="btn-xs btn-xs-success" onclick="event.stopPropagation()">有効化</button>`;
    const inactiveCls = s.status === 'inactive' ? ' class="row-inactive"' : '';

    tbody.innerHTML += `
      <tr${inactiveCls} style="cursor:pointer" onclick="openStoreDetail('${s.id}')">
        <td><code>${s.id}</code></td>
        <td><strong>${s.name}</strong></td>
        <td>${s.owner || '—'}</td>
        <td>${s.corp}</td>
        <td>${typeTag}</td>
        <td>${s.area}</td>
        <td>${stsBadge}</td>
        <td>${hpbLink}</td>
        <td><div class="action-btns" onclick="event.stopPropagation()">
          <button class="btn-xs" onclick="openStoreDetail('${s.id}')">詳細</button>
          ${disableBtn}
        </div></td>
      </tr>`;
  });
}

// ===================================================
// STORE DETAIL PAGE
// ===================================================
function openStoreDetail(storeId) {
  const s = STORE_DATA.find(x => x.id === storeId);
  if (!s) return;

  PAGE_TITLES['store-detail'] = s.name + ' — 店舗詳細';
  navigate('store-detail');

  const el = document.getElementById('storeDetailContent');
  const typeTag = s.type === 'direct'
    ? '<span class="tag tag-direct">直営</span>'
    : '<span class="tag tag-fc">FC</span>';
  const stsBadge = s.status === 'active'
    ? '<span class="status-badge status-active">稼働中</span>'
    : '<span class="status-badge status-inactive">休止中</span>';
  const fixedTotal = s.rent + s.parking;

  el.innerHTML = `
    <div class="detail-back">
      <button class="btn-ghost" onclick="navigate('stores')">← 店舗マスタ一覧に戻る</button>
      <div style="margin-left:auto;display:flex;gap:8px;">
        ${stsBadge}
        ${typeTag}
        <button class="btn-primary" onclick="alert('編集モード（本実装時）')">✎ 編集</button>
      </div>
    </div>

    <div class="detail-grid">

      <!-- 基本情報 -->
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

      <!-- 住所 -->
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

      <!-- 固定費 -->
      <div class="detail-section">
        <div class="detail-section-title">💴 固定費（税抜・月額）</div>
        <div class="detail-rows">
          <div class="detail-row"><span class="detail-label">家賃（税抜）</span><span class="detail-val"><strong>¥${s.rent.toLocaleString()}</strong></span></div>
          <div class="detail-row"><span class="detail-label">お客様駐車場代（税抜）</span><span class="detail-val">${s.parking ? '¥' + s.parking.toLocaleString() : '—'}</span></div>
          <div class="detail-row detail-row-total"><span class="detail-label">固定費合計（税抜）</span><span class="detail-val accent-val">¥${fixedTotal.toLocaleString()}</span></div>
        </div>
      </div>

      <!-- 外部リンク -->
      <div class="detail-section">
        <div class="detail-section-title">🔗 外部リンク</div>
        <div class="detail-rows">
          <div class="detail-row"><span class="detail-label">HPB店舗URL</span><span class="detail-val">${s.hpb_url ? `<a href="${s.hpb_url}" target="_blank" class="link-text">${s.hpb_url}</a>` : '—'}</span></div>
          <div class="detail-row"><span class="detail-label">HP URL</span><span class="detail-val">${s.hp_url ? `<a href="${s.hp_url}" target="_blank" class="link-text">${s.hp_url}</a>` : '—'}</span></div>
        </div>
      </div>

      <!-- LINE設定 -->
      <div class="detail-section">
        <div class="detail-section-title">💬 LINE連携</div>
        <div class="detail-rows">
          <div class="detail-row"><span class="detail-label">LINEチャネルID</span><span class="detail-val"><code class="detail-code">${s.line_channel_id || '未設定'}</code></span></div>
          <div class="detail-row"><span class="detail-label">LINEチャネルアクセストークン</span><span class="detail-val"><code class="detail-code detail-secret">${s.line_token ? s.line_token.slice(0,20) + '…' : '未設定'}</code></span></div>
        </div>
      </div>

      <!-- 広告ID -->
      <div class="detail-section">
        <div class="detail-section-title">📣 広告設定</div>
        <div class="detail-rows">
          <div class="detail-row"><span class="detail-label">Meta広告 広告セットID</span><span class="detail-val"><code class="detail-code">${s.meta_adset_id || '未設定'}</code></span></div>
          <div class="detail-row"><span class="detail-label">Google広告 キャンペーンID</span><span class="detail-val"><code class="detail-code">${s.google_campaign_id || '未設定'}</code></span></div>
        </div>
      </div>

    </div>
  `;
}

// ===================================================
// ACCOUNTS PAGE
// ===================================================
const ACCOUNT_DATA = [
  { id:'ADM001', name:'システム管理者',    role:'admin',  email:'admin@dears.co.jp',           store:'—（全店）',   status:'active',  lastLogin:'2025-05-31' },
  { id:'HQ001',  name:'田中 本部（CMO）', role:'honbu',  email:'tanaka@dears.co.jp',           store:'—（全店）',   status:'active',  lastLogin:'2025-05-31' },
  { id:'HQ002',  name:'山本 花子',        role:'honbu',  email:'yamamoto@dears.co.jp',         store:'—（全店）',   status:'active',  lastLogin:'2025-05-30' },
  { id:'HQ003',  name:'佐々木 健',        role:'honbu',  email:'sasaki@dears.co.jp',           store:'—（全店）',   status:'active',  lastLogin:'2025-05-28' },
  { id:'OW001',  name:'山田 太郎',        role:'owner',  email:'yamada@fc001.dears.co.jp',     store:'大阪梅田店',  status:'active',  lastLogin:'2025-05-29' },
  { id:'OW002',  name:'田中 花子',        role:'owner',  email:'tanaka.h@fc002.dears.co.jp',   store:'名古屋栄店',  status:'active',  lastLogin:'2025-05-27' },
  { id:'OW003',  name:'鈴木 二郎',        role:'owner',  email:'suzuki.j@fc003.dears.co.jp',   store:'心斎橋店',    status:'active',  lastLogin:'2025-05-25' },
  { id:'OW004',  name:'鈴木 一郎',        role:'owner',  email:'suzuki.i@fc007.dears.co.jp',   store:'福岡天神店',  status:'active',  lastLogin:'2025-05-20' },
  { id:'OW005',  name:'佐藤 美咲',        role:'owner',  email:'sato@fc009.dears.co.jp',       store:'京都四条店',  status:'inactive',lastLogin:'2025-02-10' },
  { id:'ST001A', name:'田中 花子',        role:'staff',  email:'tanaka.hanako@st001.dears.co.jp',store:'表参道店', status:'active',  lastLogin:'2025-05-31' },
  { id:'ST001B', name:'佐藤 健太',        role:'staff',  email:'sato.k@st002.dears.co.jp',     store:'表参道店',    status:'active',  lastLogin:'2025-05-31' },
  { id:'FC001A', name:'田中 花子（スタッフ）',role:'staff',email:'tanaka.h.s@fc001.dears.co.jp',store:'大阪梅田店', status:'active',  lastLogin:'2025-05-30' },
  { id:'FC007A', name:'中村 さくら',      role:'staff',  email:'nakamura@fc007.dears.co.jp',   store:'福岡天神店',  status:'active',  lastLogin:'2025-05-19' },
];

const ROLE_CONFIG = {
  admin:  { label:'Admin',    cls:'role-admin',  desc:'全機能・システム設定' },
  honbu:  { label:'本部',     cls:'role-honbu',  desc:'予算設定・全店閲覧・レポート' },
  owner:  { label:'オーナー', cls:'role-owner',  desc:'担当店舗閲覧・月次入力' },
  staff:  { label:'スタッフ', cls:'role-staff',  desc:'担当店舗日次入力のみ' },
};

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
// INIT
// ===================================================
document.addEventListener('DOMContentLoaded', () => {
  buildPLTable();
  buildBillingTable();
  buildStoresMaster();
  buildAccountsPage();
});
