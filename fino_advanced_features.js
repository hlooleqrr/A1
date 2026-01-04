// ====== FINO Advanced Features JavaScript ======

// ====== نظام PWA ======
let deferredPrompt;
let pwaInstalled = false;

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => console.log('FINO SW: تم التسجيل بنجاح', registration.scope))
      .catch(err => console.log('FINO SW: فشل التسجيل', err));
  });
}

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  showInstallPrompt();
});

window.addEventListener('appinstalled', () => {
  pwaInstalled = true;
  hideInstallPrompt();
  console.log('FINO: تم تثبيت التطبيق');
});

function showInstallPrompt() {
  const banner = document.getElementById('pwaInstallBanner');
  if (banner && !pwaInstalled && !localStorage.getItem('pwaPromptDismissed')) {
    banner.style.display = 'block';
  }
}

function hideInstallPrompt() {
  const banner = document.getElementById('pwaInstallBanner');
  if (banner) banner.style.display = 'none';
}

function installPWA() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') console.log('FINO: قبل المستخدم التثبيت');
      deferredPrompt = null;
    });
  }
}

function dismissInstallPrompt() {
  hideInstallPrompt();
  localStorage.setItem('pwaPromptDismissed', 'true');
}

// ====== نظام الخلفيات المتحركة الموسمية ======
const SEASON_KEY = 'finoSeasonTheme';
const THEME_KEY = 'finoTheme';

const seasons = {
  winter: { name: 'شتوي', class: 'season-winter', particles: ['❄️', '❅', '❆', '✻', '✼'], particleClass: 'snowflake' },
  spring: { name: 'ربيعي', class: 'season-spring', particles: ['🌸', '🌺', '🌷', '🌼', '🍀', '🌿'], particleClass: 'spring-leaf' },
  summer: { name: 'صيفي', class: 'season-summer', particles: ['☀️', '🌞', '✨'], particleClass: 'summer-ray' },
  autumn: { name: 'خريفي', class: 'season-autumn', particles: ['🍂', '🍁', '🍃', '🌾'], particleClass: 'autumn-leaf' },
  default: { name: 'افتراضي', class: '', particles: [], particleClass: 'particle' }
};

function loadSeasonTheme() { return localStorage.getItem(SEASON_KEY) || 'default'; }
function saveSeasonTheme(season) { localStorage.setItem(SEASON_KEY, season); }

function applySeasonTheme(season) {
  const body = document.body;
  Object.values(seasons).forEach(s => { if (s.class) body.classList.remove(s.class); });
  document.querySelectorAll('.season-particle').forEach(el => el.remove());
  const seasonData = seasons[season];
  if (seasonData && seasonData.class) {
    body.classList.add(seasonData.class);
    createSeasonParticles(seasonData);
  }
  saveSeasonTheme(season);
}

function createSeasonParticles(seasonData) {
  if (!seasonData.particles.length) return;
  const container = document.getElementById('particles') || document.body;
  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.className = `season-particle ${seasonData.particleClass}`;
    particle.textContent = seasonData.particles[Math.floor(Math.random() * seasonData.particles.length)];
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
    particle.style.animationDelay = Math.random() * 10 + 's';
    particle.style.fontSize = (Math.random() * 1 + 0.8) + 'em';
    container.appendChild(particle);
  }
}

// ====== نظام الثيمات والألوان ======
function applyTheme(theme) {
  const body = document.body;
  const themes = ['default', 'green', 'purple', 'gold', 'dark'];
  themes.forEach(t => body.classList.remove(`theme-${t}`));
  body.classList.add(`theme-${theme}`);
  localStorage.setItem(THEME_KEY, theme);
}

function applyCustomColors(primary, secondary, accent) {
  const root = document.documentElement;
  if (primary) root.style.setProperty('--primary-color', primary);
  if (secondary) root.style.setProperty('--secondary-color', secondary);
  if (accent) root.style.setProperty('--accent-color', accent);
}

// ====== نظام تتبع الزوار ======
const VISITORS_KEY = 'finoVisitors';
const RESULTS_KEY = 'finoClientResults';

function trackVisitor() {
  const visitors = loadVisitors();
  const now = new Date();
  const visitor = {
    id: 'v_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
    timestamp: now.toISOString(),
    date: now.toISOString().split('T')[0],
    time: now.toLocaleTimeString('ar-SA'),
    userAgent: navigator.userAgent,
    screenSize: `${screen.width}x${screen.height}`,
    referrer: document.referrer || 'مباشر'
  };
  visitors.unshift(visitor);
  if (visitors.length > 1000) visitors.length = 1000;
  localStorage.setItem(VISITORS_KEY, JSON.stringify(visitors));
  updateVisitorStats();
}

function loadVisitors() {
  try { return JSON.parse(localStorage.getItem(VISITORS_KEY)) || []; } catch (e) { return []; }
}

function updateVisitorStats() {
  const visitors = loadVisitors();
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const stats = {
    total: visitors.length,
    today: visitors.filter(v => v.date === today).length,
    week: visitors.filter(v => new Date(v.timestamp) > new Date(now - 7*24*60*60*1000)).length,
    month: visitors.filter(v => v.date.startsWith(now.toISOString().substr(0, 7))).length
  };
  if (document.getElementById('visitorTotal')) document.getElementById('visitorTotal').textContent = stats.total;
  if (document.getElementById('visitorToday')) document.getElementById('visitorToday').textContent = stats.today;
  if (document.getElementById('visitorWeek')) document.getElementById('visitorWeek').textContent = stats.week;
  if (document.getElementById('visitorMonth')) document.getElementById('visitorMonth').textContent = stats.month;
  
  renderVisitorsTable(visitors);
}

function renderVisitorsTable(visitors) {
  const tbody = document.querySelector('#visitorsTable tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  visitors.slice(0, 50).forEach(v => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${v.date}</td><td><LaTex>${v.time}</td><td>$</LaTex>{v.referrer}</td><td>${v.screenSize}</td>`;
    tbody.appendChild(tr);
  });
}

// ====== إدارة الجهات والمنتجات الديناميكية ======
const BANKS_KEY = 'finoBanks';
const PRODUCTS_KEY = 'finoProducts';

function loadDynamicBanks() {
  try {
    const banks = JSON.parse(localStorage.getItem(BANKS_KEY));
    return banks || [
      { id: 'rajhi', name: 'مصرف الراجحي', logo: '' },
      { id: 'ahli', name: 'البنك الأهلي السعودي', logo: '' },
      { id: 'riyad', name: 'بنك الرياض', logo: '' },
      { id: 'alinma', name: 'مصرف الإنماء', logo: '' },
      { id: 'bilad', name: 'بنك البلاد', logo: '' }
    ];
  } catch (e) { return []; }
}

function loadDynamicProducts() {
  try {
    const products = JSON.parse(localStorage.getItem(PRODUCTS_KEY));
    return products || [
      { id: 'personal', name: 'تمويل شخصي', enabled: true },
      { id: 'mortgage', name: 'تمويل عقاري', enabled: true },
      { id: 'consumer', name: 'تمويل استهلاكي', enabled: true },
      { id: 'buyoutPersonal', name: 'شراء مديونية تمويل شخصي', enabled: true },
      { id: 'buyoutMortgage', name: 'شراء مديونية تمويل عقاري', enabled: true }
    ];
  } catch (e) { return []; }
}

function addNewBank() {
  const name = prompt('أدخل اسم الجهة التمويلية الجديدة:');
  if (!name) return;
  const banks = loadDynamicBanks();
  const id = 'bank_' + Date.now();
  banks.push({ id, name, logo: '' });
  localStorage.setItem(BANKS_KEY, JSON.stringify(banks));
  updateAllBankDropdowns();
  alert('تمت إضافة الجهة بنجاح!');
}

function updateAllBankDropdowns() {
  const banks = loadDynamicBanks();
  const dropdowns = ['adminBankName', 'adBank'];
  dropdowns.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const currentVal = el.value;
    el.innerHTML = '<option value="">اختر الجهة...</option>';
    banks.forEach(bank => {
      el.innerHTML += `<option value="${bank.name}">${bank.name}</option>`;
    });
    el.value = currentVal;
  });
}

// ====== إعدادات المنصة والتحكم الكامل ======
const SETTINGS_KEY = 'finoPlatformSettings';

function loadPlatformSettings() {
  try {
    const defaults = {
      platformName: 'منصة FINO',
      platformSubtitle: 'منصة ذكية تحسب لك التمويل وتُرشّح البنك الأنسب بناءً على راتبك ونوع التمويل والتزاماتك خلال ثوانٍ، بدون حيرة ولا تعب',
      platformUrl: window.location.origin,
      primaryColor: '#1e3a8a',
      secondaryColor: '#3b82f6',
      accentColor: '#f59e0b',
      activeTheme: 'default',
      activeSeason: 'default'
    };
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY));
    return { ...defaults, ...saved };
  } catch (e) { return {}; }
}

function savePlatformSettings(e) {
  if (e) e.preventDefault();
  const settings = {
    platformName: document.getElementById('setPlatformName').value,
    platformSubtitle: document.getElementById('setPlatformSubtitle').value,
    platformUrl: document.getElementById('setPlatformUrl').value,
    primaryColor: document.getElementById('setPrimaryColor').value,
    secondaryColor: document.getElementById('setSecondaryColor').value,
    accentColor: document.getElementById('setAccentColor').value,
    activeTheme: document.getElementById('activeThemeSelect').value,
    activeSeason: document.getElementById('activeSeasonSelect').value
  };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  applyAllSettings();
  alert('تم حفظ الإعدادات وتطبيقها بنجاح!');
}

function applyAllSettings() {
  const s = loadPlatformSettings();
  document.querySelectorAll('.platform-name').forEach(el => el.textContent = s.platformName);
  document.querySelectorAll('.platform-subtitle').forEach(el => el.textContent = s.platformSubtitle);
  document.title = s.platformName;
  applyCustomColors(s.primaryColor, s.secondaryColor, s.accentColor);
  applyTheme(s.activeTheme);
  applySeasonTheme(s.activeSeason);
  if (document.getElementById('setPlatformName')) {
    document.getElementById('setPlatformName').value = s.platformName;
    document.getElementById('setPlatformSubtitle').value = s.platformSubtitle;
    document.getElementById('setPlatformUrl').value = s.platformUrl;
    document.getElementById('setPrimaryColor').value = s.primaryColor;
    document.getElementById('setSecondaryColor').value = s.secondaryColor;
    document.getElementById('setAccentColor').value = s.accentColor;
    document.getElementById('activeThemeSelect').value = s.activeTheme;
    document.getElementById('activeSeasonSelect').value = s.activeSeason;
  }
}

// ====== تهيئة لوحة المسؤول ======
function initAdminHub() {
  updateVisitorStats();
  updateAllBankDropdowns();
  const results = JSON.parse(localStorage.getItem(RESULTS_KEY)) || [];
  const tbody = document.querySelector('#clientResultsTable tbody');
  if (tbody) {
    tbody.innerHTML = '';
    results.forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${new Date(r.timestamp).toLocaleDateString('ar-SA')}</td>
        <td><LaTex>${r.clientName}</td>
        <td>$</LaTex>{r.financeType}</td>
        <td><LaTex>${r.amount ? r.amount.toLocaleString() : 0}</td>
        <td>$</LaTex>{r.bank}</td>
        <td>${r.salary ? r.salary.toLocaleString() : 0}</td>
      `;
      tbody.appendChild(tr);
    });
  }
}

// ====== تهيئة عند التحميل ======
document.addEventListener('DOMContentLoaded', () => {
  trackVisitor();
  applyAllSettings();
  const installBtn = document.getElementById('pwaInstallBtn');
  if (installBtn) installBtn.onclick = installPWA;
  const dismissBtn = document.getElementById('pwaDismissBtn');
  if (dismissBtn) dismissBtn.onclick = dismissInstallPrompt;
});