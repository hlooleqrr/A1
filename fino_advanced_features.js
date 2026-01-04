// FINO Advanced Features JavaScript
// PWA, Themes, Seasonal Effects, and More

// ===== PWA Installation =====
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  showInstallBanner();
});

function showInstallBanner() {
  // Check if already installed or dismissed
  if (localStorage.getItem('pwaInstallDismissed')) {
    const dismissedTime = parseInt(localStorage.getItem('pwaInstallDismissed'));
    if (Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
      return; // Don't show for 7 days after dismissal
    }
  }
  
  const banner = document.createElement('div');
  banner.className = 'pwa-install-banner';
  banner.innerHTML = `
    <h4>📱 أضف المنصة لشاشتك الرئيسية</h4>
    <p>استخدم المنصة كتطبيق بدون الحاجة للمتصفح</p>
    <div class="banner-buttons">
      <button class="install-btn" onclick="installPWA()">تثبيت التطبيق</button>
      <button class="later-btn" onclick="dismissInstallBanner()">لاحقاً</button>
    </div>
  `;
  document.body.appendChild(banner);
}

function installPWA() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        showToast('تم تثبيت التطبيق بنجاح! 🎉', 'success');
      }
      deferredPrompt = null;
      removeInstallBanner();
    });
  }
}

function dismissInstallBanner() {
  localStorage.setItem('pwaInstallDismissed', Date.now().toString());
  removeInstallBanner();
}

function removeInstallBanner() {
  const banner = document.querySelector('.pwa-install-banner');
  if (banner) {
    banner.style.animation = 'slideUp 0.3s ease-out forwards';
    setTimeout(() => banner.remove(), 300);
  }
}

// ===== Theme Management =====
function setTheme(themeName) {
  document.documentElement.setAttribute('data-theme', themeName);
  localStorage.setItem('finoTheme', themeName);
  showToast(`تم تغيير الثيم إلى: ${getThemeDisplayName(themeName)}`, 'success');
}

function getThemeDisplayName(theme) {
  const names = {
    'blue': 'أزرق',
    'green': 'أخضر',
    'purple': 'بنفسجي',
    'gold': 'ذهبي',
    'dark': 'داكن'
  };
  return names[theme] || theme;
}

function loadSavedTheme() {
  const savedTheme = localStorage.getItem('finoTheme') || 'blue';
  document.documentElement.setAttribute('data-theme', savedTheme);
}

// ===== Seasonal Effects =====
function setSeason(seasonName) {
  document.documentElement.setAttribute('data-season', seasonName);
  localStorage.setItem('finoSeason', seasonName);
  
  // Add or update seasonal particles container
  let particlesContainer = document.querySelector('.seasonal-particles');
  if (!particlesContainer) {
    particlesContainer = document.createElement('div');
    particlesContainer.className = 'seasonal-particles';
    document.body.insertBefore(particlesContainer, document.body.firstChild);
  }
  
  // Clear existing particles
  particlesContainer.innerHTML = '';
  
  // Add season-specific particles
  if (seasonName === 'winter') {
    createSnowParticles(particlesContainer);
  }
  
  showToast(`تم تغيير الخلفية إلى: ${getSeasonDisplayName(seasonName)}`, 'success');
}

function getSeasonDisplayName(season) {
  const names = {
    'none': 'بدون',
    'winter': 'شتوي ❄️',
    'spring': 'ربيعي 🌸',
    'summer': 'صيفي ☀️',
    'autumn': 'خريفي 🍂'
  };
  return names[season] || season;
}

function createSnowParticles(container) {
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.className = 'snow-particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.width = Math.random() * 5 + 2 + 'px';
    particle.style.height = particle.style.width;
    particle.style.animationDuration = Math.random() * 5 + 5 + 's';
    particle.style.animationDelay = Math.random() * 5 + 's';
    container.appendChild(particle);
  }
}

function loadSavedSeason() {
  const savedSeason = localStorage.getItem('finoSeason') || 'none';
  if (savedSeason !== 'none') {
    setSeason(savedSeason);
  }
}

// ===== Toast Notifications =====
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'toastOut 0.3s ease-out forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ===== Visitor Tracking =====
function trackVisitor() {
  const today = new Date().toDateString();
  const visitData = JSON.parse(localStorage.getItem('finoVisitorData') || '{}');
  
  if (!visitData.total) visitData.total = 0;
  if (!visitData.dates) visitData.dates = {};
  
  // Increment total
  visitData.total++;
  
  // Track by date
  if (!visitData.dates[today]) {
    visitData.dates[today] = 0;
  }
  visitData.dates[today]++;
  
  localStorage.setItem('finoVisitorData', JSON.stringify(visitData));
}

function getVisitorStats() {
  const visitData = JSON.parse(localStorage.getItem('finoVisitorData') || '{}');
  const today = new Date().toDateString();
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  
  let todayCount = visitData.dates?.[today] || 0;
  let weekCount = 0;
  let monthCount = 0;
  
  if (visitData.dates) {
    Object.keys(visitData.dates).forEach(dateStr => {
      const date = new Date(dateStr);
      if (date >= weekAgo) weekCount += visitData.dates[dateStr];
      if (date >= monthAgo) monthCount += visitData.dates[dateStr];
    });
  }
  
  return {
    total: visitData.total || 0,
    today: todayCount,
    week: weekCount,
    month: monthCount
  };
}

// ===== Service Worker Registration =====
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('ServiceWorker registered:', registration.scope);
      })
      .catch(error => {
        console.log('ServiceWorker registration failed:', error);
      });
  }
}

// ===== Initialize on Load =====
document.addEventListener('DOMContentLoaded', () => {
  loadSavedTheme();
  loadSavedSeason();
  trackVisitor();
  registerServiceWorker();
});

// ===== Export functions for global use =====
window.finoAdvanced = {
  setTheme,
  setSeason,
  showToast,
  getVisitorStats,
  installPWA,
  dismissInstallBanner
};
