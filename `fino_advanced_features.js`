// ====== FINO Advanced Features JavaScript ======

// ====== حالة التطبيق PWA ======
let deferredPrompt = null;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const banner = document.getElementById("pwaInstallBanner");
  if (banner) banner.style.display = "block";
});

function installPWA() {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === "accepted") {
      console.log("User accepted the A2HS prompt");
    } else {
      console.log("User dismissed the A2HS prompt");
    }
    deferredPrompt = null;
    const banner = document.getElementById("pwaInstallBanner");
    if (banner) banner.style.display = "none";
  });
}
function dismissInstallPrompt() {
  const banner = document.getElementById("pwaInstallBanner");
  if (banner) banner.style.display = "none";
}

// ====== بيانات عامة ======
let currentPage = "landing"; // landing, calculator, result, admin, adminHub, etc.
let userAnswers = {};
let currentQuestionIndex = -1;
let questions = [];
let previousQuestionsStack = [];
let isExtendedRetirement = false; // حسبة ممتدة بعد التقاعد
let lastCalculatedResult = null;

// زوار
let visitorData = {
  total: 0,
  today: 0,
  week: 0,
  month: 0,
  logs: []
};

// نتائج عشوائية (بدون بيانات شخصية)
let clientResults = [];

// إعدادات التسويق
let marketingSettings = {
  showMarketingSection: true,
  marketingTitle: "ننجز تمويلك بأسرع وقت!",
  marketingText: "تواصل معنا الحين وخلنا نساعدك في إتمام تمويلك بدون تعقيدات ⚡️",
  marketingWhatsapp: "966506214458",
  showContractButton: false,
  contractButtonText: "📝 إبرام عقد تحويل إلكتروني",
  contractLink: "",
  showRatingSection: true
};

// إعدادات التقاعد الممتد (معامل الراتب الأساسي التقديري)
let retirementSettings = {
  basicMultiplier: 1.0
};

// منتجات التمويل
let financeProducts = [];

// إعدادات البنوك
let bankConfigs = [];

// التقييمات
let ratingsData = {
  showOnHome: false,
  ratings: []
};

// عروض خاصة
let specialOffers = [];

// إعلانات مستهدفة
let targetedAds = [];

// ====== تخزين محلي ======
function loadFromLocalStorage() {
  try {
    const vData = localStorage.getItem("fino_visitors");
    if (vData) {
      visitorData = JSON.parse(vData);
    }
  } catch (err) {
    console.error("خطأ في قراءة بيانات الزوار", err);
  }
  try {
    const cResults = localStorage.getItem("fino_clientResults");
    if (cResults) clientResults = JSON.parse(cResults);
  } catch (err) {
    console.error("خطأ في قراءة نتائج العملاء", err);
  }
  try {
    const mSettings = localStorage.getItem("fino_marketingSettings");
    if (mSettings) marketingSettings = JSON.parse(mSettings);
  } catch (err) {
    console.error("خطأ في قراءة إعدادات التسويق", err);
  }
  try {
    const rSettings = localStorage.getItem("fino_retirementSettings");
    if (rSettings) retirementSettings = JSON.parse(rSettings);
  } catch (err) {
    console.error("خطأ في قراءة إعدادات التقاعد", err);
  }
  try {
    const fp = localStorage.getItem("fino_financeProducts");
    if (fp) financeProducts = JSON.parse(fp);
  } catch (err) {
    console.error("خطأ في قراءة منتجات التمويل", err);
  }
  try {
    const bc = localStorage.getItem("fino_bankConfigs");
    if (bc) bankConfigs = JSON.parse(bc);
  } catch (err) {
    console.error("خطأ في قراءة إعدادات البنوك", err);
  }
  try {
    const rd = localStorage.getItem("fino_ratingsData");
    if (rd) ratingsData = JSON.parse(rd);
  } catch (err) {
    console.error("خطأ في قراءة بيانات التقييمات", err);
  }
  try {
    const of = localStorage.getItem("fino_specialOffers");
    if (of) specialOffers = JSON.parse(of);
  } catch (err) {
    console.error("خطأ في قراءة العروض الخاصة", err);
  }
  try {
    const ad = localStorage.getItem("fino_targetedAds");
    if (ad) targetedAds = JSON.parse(ad);
  } catch (err) {
    console.error("خطأ في قراءة الإعلانات المستهدفة", err);
  }
}

function saveToLocalStorage() {
  try {
    localStorage.setItem("fino_visitors", JSON.stringify(visitorData));
  } catch (e) {
    console.error("لا يمكن حفظ بيانات الزوار", e);
  }
  try {
    localStorage.setItem("fino_clientResults", JSON.stringify(clientResults));
  } catch (e) {
    console.error("لا يمكن حفظ نتائج العملاء", e);
  }
  try {
    localStorage.setItem("fino_marketingSettings", JSON.stringify(marketingSettings));
  } catch (e) {
    console.error("لا يمكن حفظ إعدادات التسويق", e);
  }
  try {
    localStorage.setItem("fino_retirementSettings", JSON.stringify(retirementSettings));
  } catch (e) {
    console.error("لا يمكن حفظ إعدادات التقاعد", e);
  }
  try {
    localStorage.setItem("fino_financeProducts", JSON.stringify(financeProducts));
  } catch (e) {
    console.error("لا يمكن حفظ منتجات التمويل", e);
  }
  try {
    localStorage.setItem("fino_bankConfigs", JSON.stringify(bankConfigs));
  } catch (e) {
    console.error("لا يمكن حفظ إعدادات البنوك", e);
  }
  try {
    localStorage.setItem("fino_ratingsData", JSON.stringify(ratingsData));
  } catch (e) {
    console.error("لا يمكن حفظ بيانات التقييمات", e);
  }
  try {
    localStorage.setItem("fino_specialOffers", JSON.stringify(specialOffers));
  } catch (e) {
    console.error("لا يمكن حفظ العروض الخاصة", e);
  }
  try {
    localStorage.setItem("fino_targetedAds", JSON.stringify(targetedAds));
  } catch (e) {
    console.error("لا يمكن حفظ الإعلانات المستهدفة", e);
  }
}

// ====== تتبع الزوار ======
function trackVisitor() {
  const now = new Date();
  const todayStr = now.toISOString().substring(0, 10); // YYYY-MM-DD
  if (!visitorData.logs) visitorData.logs = [];

  visitorData.total = (visitorData.total || 0) + 1;

  visitorData.logs.push({
    date: todayStr,
    time: now.toTimeString().substring(0, 8),
    source: document.referrer || "مباشر",
    screen: window.innerWidth + "x" + window.innerHeight
  });

  const today = new Date(todayStr);
  let todayCount = 0,
    weekCount = 0,
    monthCount = 0;

  visitorData.logs.forEach((log) => {
    const d = new Date(log.date);
    if (log.date === todayStr) todayCount++;
    const diffDays = (today - d) / (1000 * 60 * 60 * 24);
    if (diffDays >= 0 && diffDays < 7) weekCount++;
    if (diffDays >= 0 && diffDays < 30) monthCount++;
  });

  visitorData.today = todayCount;
  visitorData.week = weekCount;
  visitorData.month = monthCount;

  saveToLocalStorage();
  renderVisitorStats();
}

function renderVisitorStats() {
  const totalEl = document.getElementById("visitorTotal");
  const todayEl = document.getElementById("visitorToday");
  const weekEl = document.getElementById("visitorWeek");
  const monthEl = document.getElementById("visitorMonth");

  if (totalEl) totalEl.textContent = visitorData.total || 0;
  if (todayEl) todayEl.textContent = visitorData.today || 0;
  if (weekEl) weekEl.textContent = visitorData.week || 0;
  if (monthEl) monthEl.textContent = visitorData.month || 0;

  const totalPage = document.getElementById("visitorTotalPage");
  const todayPage = document.getElementById("visitorTodayPage");
  const weekPage = document.getElementById("visitorWeekPage");
  const monthPage = document.getElementById("visitorMonthPage");

  if (totalPage) totalPage.textContent = visitorData.total || 0;
  if (todayPage) todayPage.textContent = visitorData.today || 0;
  if (weekPage) weekPage.textContent = visitorData.week || 0;
  if (monthPage) monthPage.textContent = visitorData.month || 0;

  const visitorsTable = document.getElementById("visitorsTable");
  if (visitorsTable) {
    const tbody = visitorsTable.querySelector("tbody");
    tbody.innerHTML = "";
    visitorData.logs.slice().reverse().forEach((log) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${log.date}</td>
        <td>${log.time}</td>
        <td>${log.source}</td>
        <td>${log.screen}</td>
      `;
      tbody.appendChild(tr);
    });
  }
}

function clearVisitors() {
  if (!confirm("هل أنت متأكد من مسح سجل الزوار بالكامل؟")) return;
  visitorData = {
    total: 0,
    today: 0,
    week: 0,
    month: 0,
    logs: []
  };
  saveToLocalStorage();
  renderVisitorStats();
}

// ====== إدارة نتائج العملاء (عشوائية) ======
function addClientResult(result) {
  const now = new Date();
  clientResults.push({
    date: now.toISOString().substring(0, 10),
    name: result.clientName || "",
    financeType: result.financeType || "",
    amount: result.netFinance || 0,
    bank: result.bankName || "",
    salary: result.salary || 0
  });
  saveToLocalStorage();
  renderClientResults();
}

function renderClientResults() {
  const table = document.getElementById("clientResultsTable");
  if (!table) return;
  const tbody = table.querySelector("tbody");
  tbody.innerHTML = "";
  clientResults.slice().reverse().forEach((r) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r.date}</td>
      <td>${r.name}</td>
      <td>${r.financeType}</td>
      <td>${formatMoney(r.amount)}</td>
      <td>${r.bank}</td>
      <td>${formatMoney(r.salary)}</td>
    `;
    tbody.appendChild(tr);
  });
}

function clearClientResults() {
  if (!confirm("هل أنت متأكد من مسح سجل النتائج؟")) return;
  clientResults = [];
  saveToLocalStorage();
  renderClientResults();
}

// ====== تنسيق المبالغ ======
function formatMoney(num) {
  if (!num || isNaN(num)) num = 0;
  return Number(num).toLocaleString("ar-SA", {
    maximumFractionDigits: 0
  }) + " ريال";
}

// ====== إدارة صفحات الواجهة ======
function showPage(pageKey) {
  currentPage = pageKey;
  const pages = document.querySelectorAll(".page");
  pages.forEach((p) => p.classList.remove("active"));

  const pageMap = {
    landing: "landingPage",
    calculator: "calculatorPage",
    result: "resultPage",
    admin: "adminPage",
    adminHub: "adminHubPage",
    adminProducts: "adminProductsPage",
    adminArchive: "adminArchivePage",
    adminRatings: "adminRatingsPage",
    adminOffers: "adminOffersPage",
    adminMarketing: "adminMarketingPage",
    adminQuestions: "adminQuestionsPage",
    adminVisitors: "adminVisitorsPage",
    adminClientResults: "adminClientResultsPage",
    adminAds: "adminAdsPage",
    earlySettlement: "earlySettlementPage",
    comingSoon: "comingSoonPage"
  };

  const targetId = pageMap[pageKey] || pageKey;
  const target = document.getElementById(targetId);
  if (target) target.classList.add("active");

  if (pageKey === "adminHub") {
    renderVisitorStats();
  } else if (pageKey === "admin") {
    renderAdminTable();
  } else if (pageKey === "adminProducts") {
    renderFinanceProductsTable();
  } else if (pageKey === "adminArchive") {
    renderArchiveTable();
  } else if (pageKey === "adminRatings") {
    renderRatingsTable();
  } else if (pageKey === "adminOffers") {
    renderOffersTable();
  } else if (pageKey === "adminMarketing") {
    loadMarketingSettingsToUI();
  } else if (pageKey === "adminQuestions") {
    renderQuestionsList();
  } else if (pageKey === "adminVisitors") {
    renderVisitorStats();
  } else if (pageKey === "adminClientResults") {
    renderClientResults();
  } else if (pageKey === "adminAds") {
    renderAdsTable();
  }
}

function backToLanding() {
  showPage("landing");
}

function backToFinanceType() {
  // ترجع للسؤال الخاص بنوع التمويل في الحاسبة (يحتاج معرفة index)
  if (!questions || !questions.length) return;
  const financeTypeIndex = questions.findIndex((q) => q.id === "financeType");
  if (financeTypeIndex >= 0) {
    currentQuestionIndex = financeTypeIndex - 1;
    nextQuestion();
    showPage("calculator");
  } else {
    showPage("calculator");
  }
}

// ====== بدء مسار العميل ======
function startClientFlow() {
  showPage("calculator");
  resetCalc();
}

// ====== منطق الأسئلة المتتابعة الأساسية ======
// هنا توضع قائمة الأسئلة الافتراضية
function initQuestions() {
  questions = [
    {
      id: "clientName",
      text: "اسمك الكريم؟",
      type: "text",
      placeholder: "مثال: محمد بن عبدالله",
      required: true
    },
    {
      id: "financeType",
      text: "اختر نوع التمويل تريد حسبته:",
      type: "select",
      options: getFinanceTypesOptions(),
      required: true
    },
    {
      id: "salary",
      text: "كم صافي راتبك الشهري؟",
      type: "number",
      placeholder: "مثال: 12000",
      required: true
    },
    {
      id: "jobType",
      text: "ما نوع وظيفتك؟",
      type: "select",
      options: [
        "عسكري",
        "مدني (قطاع حكومي)",
        "خاص (شبه حكومي)",
        "خاص (شركة معتمدة)",
        "خاص (شركة غير معتمدة)"
      ],
      required: true
    },
    {
      id: "birthDate",
      text: "تاريخ الميلاد بالهجري",
      type: "date-hijri-simple",
      required: true
    },
    {
      id: "months",
      text: "كم عدد الأشهر التي ترغب بها للتمويل؟",
      type: "range",
      min: 12,
      max: 360,
      step: 1,
      default: 240,
      dependsOnFinanceType: true
    },
    {
      id: "commitments",
      text: "هل لديك التزامات حالياً (قروض/سيارة/استهلاكي)؟",
      type: "yesno-commitments",
      required: true
    }
  ];
}

// استرجاع خيارات نوع التمويل من إعدادات المنتجات
function getFinanceTypesOptions() {
  if (!financeProducts || financeProducts.length === 0) {
    return [
      "تمويل شخصي أو تمويل استهلاكي",
      "تمويل عقاري (مدعوم أو غير مدعوم)",
      "شراء مديونية (شخصي أو عقاري)"
    ];
  }
  return financeProducts
    .filter((p) => p.enabled !== false)
    .map((p) => p.name || "")
    .filter((n) => !!n);
}

// إظهار السؤال الحالي
function showQuestion() {
  const questionContainer = document.getElementById("question");
  const mainButton = document.getElementById("mainButton");
  const nextButton = document.getElementById("nextButton");
  const backButton = document.getElementById("backButton");
  const resetButtonContainer = document.getElementById("resetButtonContainer");

  if (!questions || questions.length === 0) {
    initQuestions();
  }

  if (currentQuestionIndex < 0) {
    questionContainer.innerHTML = `
      <div class="welcome-title">بدء الحسبة</div>
      <div class="welcome-sub">سنطرح عليك مجموعة أسئلة بسيطة، وبعدها نعرض لك أقوى نتيجة تمويل ممكنة.</div>
    `;
    mainButton.textContent = "ابدأ الحسبة";
    nextButton.style.display = "none";
    resetButtonContainer.style.display = "none";
    if (backButton) backButton.style.display = "none";
    return;
  }

  const q = questions[currentQuestionIndex];
  if (!q) return;

  let html = `<div class="steps-badge">السؤال ${currentQuestionIndex + 1} من ${questions.length}</div>`;
  html += `<label>${q.text}</label>`;
  if (q.type === "text") {
    html += `<input id="answerInput" type="text" placeholder="${q.placeholder || ""}" />`;
  } else if (q.type === "number") {
    html += `<input id="answerInput" type="number" inputmode="decimal" placeholder="${q.placeholder || ""}" />`;
  } else if (q.type === "select") {
    html += `<select id="answerInput"><option value="">اختر...</option>`;
    (q.options || []).forEach((opt) => {
      html += `<option value="${opt}">${opt}</option>`;
    });
    html += `</select>`;
  } else if (q.type === "date-hijri-simple") {
    html += `
      <div style="display:flex; gap:6px; margin-top:6px;">
        <select id="birthDay" style="flex:1;">
          ${generateNumberOptions(1, 30, "اليوم")}
        </select>
        <select id="birthMonth" style="flex:1;">
          ${generateNumberOptions(1, 12, "الشهر")}
        </select>
        <select id="birthYear" style="flex:1;">
          ${generateNumberOptions(1370, 1430, "السنة", 1412)}
        </select>
      </div>
      <div style="margin-top:6px; font-size:12px; color:#6b7280;">
        سيتم احتساب المدة حتى سن التقاعد بناء على تاريخ ميلادك.
      </div>
    `;
  } else if (q.type === "range") {
    let min = q.min || 12;
    let max = q.max || 360;
    let defaultVal = q.default || 240;
    const financeType = userAnswers["financeType"];
    if (financeType && ("" + financeType).includes("شخصي")) {
      max = 60;
      if (defaultVal > max) defaultVal = max;
    }
    html += `
      <input id="answerRange" type="range" min="${min}" max="${max}" step="${q.step || 1}" value="${defaultVal}" oninput="document.getElementById('rangeValue').textContent=this.value" />
      <div style="margin-top:6px;font-size:14px;">
        <span id="rangeValue">${defaultVal}</span> شهر
        <div style="font-size:12px;color:#6b7280;margin-top:2px;" id="rangeText"></div>
      </div>
    `;
  } else if (q.type === "yesno-commitments") {
    html += `
      <div style="display:flex; gap:10px; margin-top:8px;">
        <button class="secondary small" onclick="handleCommitmentsYes()">نعم، لدي التزامات</button>
        <button class="secondary small" onclick="handleCommitmentsNo()">لا، لا يوجد</button>
      </div>
    `;
  }

  questionContainer.innerHTML = html;
  mainButton.style.display = "none";
  nextButton.style.display = "inline-flex";
  resetButtonContainer.style.display = "flex";
  if (backButton) backButton.style.display = currentQuestionIndex > 0 ? "inline-flex" : "none";

  if (q.type === "range") {
    updateRangeText();
  }
}

function generateNumberOptions(min, max, placeholder, defaultVal) {
  let html = `<option value="">${placeholder}</option>`;
  for (let i = min; i <= max; i++) {
    html += `<option value="${i}" ${defaultVal && i === defaultVal ? "selected" : ""}>${i}</option>`;
  }
  return html;
}

function updateRangeText() {
  const range = document.getElementById("answerRange");
  const text = document.getElementById("rangeText");
  if (!range || !text) return;
  const v = parseInt(range.value, 10) || 0;
  const years = Math.floor(v / 12);
  const months = v % 12;
  let phrase = "";
  if (years > 0) {
    phrase += `${convertNumberToArabicWords(years)} سنة`;
  }
  if (months > 0) {
    if (phrase) phrase += " و";
    phrase += `${convertNumberToArabicWords(months)} شهر`;
  }
  if (!phrase) phrase = "أقل من سنة";
  text.textContent = `${v} شهر (${phrase})`;
}

// التعامل مع الالتزامات (أسئلة إضافية)
let commitmentsList = [];

function handleCommitmentsYes() {
  showCommitmentDetailsQuestion();
}

function handleCommitmentsNo() {
  commitmentsList = [];
  userAnswers["hasCommitments"] = "no";
  goToNextMainQuestion();
}

function showCommitmentDetailsQuestion() {
  const questionContainer = document.getElementById("question");
  const nextButton = document.getElementById("nextButton");
  const mainButton = document.getElementById("mainButton");
  const backButton = document.getElementById("backButton");
  const resetButtonContainer = document.getElementById("resetButtonContainer");

  let html = `
    <div class="steps-badge">تفاصيل الالتزامات</div>
    <label>نوع الالتزام</label>
    <select id="commitmentType">
      <option value="">اختر...</option>
      <option value="car">قرض سيارة</option>
      <option value="personal">قرض شخصي</option>
      <option value="consumer">قرض استهلاكي</option>
      <option value="other">التزام آخر</option>
    </select>
    <label>قيمة القسط الشهري (ريال)</label>
    <input id="commitmentAmount" type="number" inputmode="decimal" placeholder="مثال: 1500" />
    <label>عدد الأشهر المتبقية</label>
    <select id="commitmentMonths">
      ${generateNumberOptions(1, 120, "اختر عدد الأشهر")}
    </select>
    <div id="balloonQuestion" style="display:none; margin-top:8px;">
      <label>هل لديك دفعة أخيرة لهذا القرض؟</label>
      <div style="display:flex; gap:8px; margin-top:4px;">
        <button class="secondary small" onclick="showBalloonAmountInput(true)">نعم</button>
        <button class="secondary small" onclick="showBalloonAmountInput(false)">لا</button>
      </div>
      <div id="balloonAmountContainer" style="margin-top:8px; display:none;">
        <label>مبلغ الدفعة الأخيرة (ريال)</label>
        <input id="balloonAmount" type="number" inputmode="decimal" placeholder="مثال: 45000" />
      </div>
    </div>
    <div style="margin-top:10px;">
      <button class="primary small" onclick="saveCommitment()">حفظ الالتزام</button>
    </div>
    <div id="commitmentsSummary" style="margin-top:10px; font-size:13px; color:#111827; text-align:right;"></div>
    <div style="margin-top:10px; display:flex; gap:8px;">
      <button class="secondary small" onclick="askMoreCommitments()">هل لديك التزام آخر؟</button>
      <button class="secondary small" onclick="finishCommitments()">لا، هذه كل الالتزامات</button>
    </div>
  `;

  questionContainer.innerHTML = html;
  nextButton.style.display = "none";
  mainButton.style.display = "none";
  resetButtonContainer.style.display = "flex";
  if (backButton) backButton.style.display = "inline-flex";

  renderCommitmentsSummary();
}

function showBalloonAmountInput(hasBalloon) {
  const container = document.getElementById("balloonAmountContainer");
  if (!container) return;
  container.style.display = hasBalloon ? "block" : "none";
  if (!hasBalloon) {
    const balloonAmount = document.getElementById("balloonAmount");
    if (balloonAmount) balloonAmount.value = "";
  }
}

function saveCommitment() {
  const typeEl = document.getElementById("commitmentType");
  const amountEl = document.getElementById("commitmentAmount");
  const monthsEl = document.getElementById("commitmentMonths");
  const balloonAmountEl = document.getElementById("balloonAmount");

  const type = typeEl ? typeEl.value : "";
  const amount = amountEl ? parseFloat(amountEl.value || "0") : 0;
  const months = monthsEl ? parseInt(monthsEl.value || "0", 10) : 0;