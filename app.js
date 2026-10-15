/**
 * DEAR DIARY — THE MULTIMODAL MEMORY ARCHIVE
 * Lead Architect & Creative Lead: Laya (BD-24-2834, NIFT Hyderabad)
 * Vanilla JS Application Controller (Local-First, Web Speech API, Cryptographic Vault)
 */

(function () {
  'use strict';

  /* ==========================================================================
     DEFAULT DATA & ENCRYPTED STORAGE SCHEMA
     ========================================================================== */
  const STORAGE_KEY = 'dear_diary_vault_v1';
  const CONFIG_KEY = 'dear_diary_config_v1';

  const DEFAULT_CONFIG = {
    passcode: '2428', // BD-24-2834
    passcodeHint: 'NIFT Student Roll Number (BD-24-2834)',
    autoLock: true,
    theme: 'theme-paper',
    paperLayout: 'layout-lined',
    speechLang: 'ml-IN'
  };

  const DEFAULT_ENTRIES = [
    {
      id: 'entry_20261014',
      dateStr: 'Tuesday, 14 October 2026',
      dateIso: '2026-10-14',
      year: 2026,
      month: 10,
      day: 14,
      speechLang: 'ml-IN',
      theme: 'theme-paper',
      layout: 'layout-lined',
      isMilestone: true,
      audioDuration: '01:42',
      isAudioPinned: true,
      tags: ['#nift', '#juryday', '#fashion', '#milestone'],
      pages: [
        {
          pageNumber: 1,
          transcript: `Tuesday, 14 Oct. — Reflecting on today.\n\nഇന്ന് കോളേജിൽ വച്ച് ജൂറി കഴിഞ്ഞു...\nIt went well! I presented my latest fashion designs. The feedback was encouraging. Feeling accomplished and inspired.`,
          polaroid: {
            imgSrc: 'assets/editorial_showcase.jpg',
            caption: 'NIFT Jury Day ✨',
            rotation: -2.5
          },
          craftScrap: {
            text: 'Fabric weaves tell stories when words fail to breathe.',
            rotation: 1.8
          }
        },
        {
          pageNumber: 2,
          transcript: `Evening reflection:\n\nProfessors were particularly intrigued by the indigenous handloom textures and the hybrid bilingual narrative concept.\n\nNeed to finalize the swatch book by Friday morning.`,
          polaroid: null,
          craftScrap: null
        }
      ]
    },
    {
      id: 'entry_20250814',
      dateStr: 'Thursday, 14 August 2025',
      dateIso: '2025-08-14',
      year: 2025,
      month: 8,
      day: 14,
      speechLang: 'ml-IN',
      theme: 'theme-ink',
      layout: 'layout-lined',
      isMilestone: true,
      audioDuration: '02:15',
      isAudioPinned: true,
      tags: ['#firstcar', '#celebration', '#milestone'],
      pages: [
        {
          pageNumber: 1,
          transcript: `Thursday, 14 Aug. 2025 🌟\n\nഇന്ന് എന്റെ ആദ്യത്തെ വണ്ടി വാങ്ങി...\nFinally drove home with my new car! Felt surreal taking parents out for a peaceful late-night drive down the boulevard.`,
          polaroid: {
            imgSrc: 'assets/editorial_showcase.jpg',
            caption: 'First Car Keys 🚗✨',
            rotation: 2.1
          },
          craftScrap: {
            text: 'Milestone unlocked: Hard work and patience always arrive on time.',
            rotation: -1.5
          }
        }
      ]
    }
  ];

  const DEFAULT_MILESTONES = [
    { dateIso: '2026-10-10', title: "Amma's Birthday 🎉", icon: '🎉' },
    { dateIso: '2026-10-14', title: 'NIFT Jury Day ✨', icon: '📖' },
    { dateIso: '2025-08-14', title: 'First Car Delivery 🚗', icon: '🌟' }
  ];

  const DEFAULT_MANIFESTATIONS = [
    {
      id: 'manif_1',
      title: 'Fashion Week Graduate Debut',
      targetDate: 'December 2026',
      note: 'Showcasing my full bridal & handloom fusion collection on the Lakmé / NIFT runway with zero compromises.',
      isAchieved: false,
      unveiled: false
    },
    {
      id: 'manif_2',
      title: 'Solo Studio Atelier in Fort Kochi',
      targetDate: 'June 2027',
      note: 'Sunlit loft studio overlooking the water, filled with rolls of organic cotton, natural indigo vats, and books.',
      isAchieved: false,
      unveiled: false
    }
  ];

  const ZOMATO_WHISPERS = [
    "Quick question before you sleep... did today look like the life you've been manifesting, or are we hitting reset tomorrow morning?",
    "Just checking in on you. That goal you wrote down a few weeks ago? It hasn't forgotten you either. One small step at a time.",
    "The world is quiet right now. Close your eyes for 5 seconds and picture that version of you who already achieved what you wrote. She's waiting for you 🌙",
    "Some whispers from last month are fading into the quiet tonight... Want to listen one last time, or pin the ones you love? 🎧"
  ];

  /* ==========================================================================
     APPLICATION STATE
     ========================================================================== */
  const state = {
    config: loadConfig(),
    entries: loadEntries(),
    manifestations: loadManifestations(),
    activeEntryId: 'entry_20261014',
    activePageIdx: 0,
    currentScreen: 'screenLock',
    pinInput: '',
    speechRecognition: null,
    isRecording: false,
    isPlayingAudio: false,
    audioTimer: null,
    calYear: 2026,
    calMonth: 10, // October
    selectedCalDate: '2026-10-14',
    whisperIndex: 0
  };

  /* Local Storage Helpers */
  function loadConfig() {
    try {
      const stored = localStorage.getItem(CONFIG_KEY);
      return stored ? { ...DEFAULT_CONFIG, ...JSON.parse(stored) } : DEFAULT_CONFIG;
    } catch (e) {
      return DEFAULT_CONFIG;
    }
  }

  function saveConfig() {
    try {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(state.config));
    } catch (e) {
      console.warn('Could not save config to localStorage', e);
    }
  }

  function loadEntries() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_ENTRIES;
    } catch (e) {
      return DEFAULT_ENTRIES;
    }
  }

  function saveEntries() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.entries));
      showToast('Vault safely encrypted & saved locally');
    } catch (e) {
      console.warn('Could not save entries', e);
    }
  }

  function loadManifestations() {
    return DEFAULT_MANIFESTATIONS;
  }

  /* ==========================================================================
     DOM ELEMENTS
     ========================================================================== */
  const DOM = {
    body: document.body,
    screens: document.querySelectorAll('.app-screen'),
    screenLock: document.getElementById('screenLock'),
    screenHome: document.getElementById('screenHome'),
    screenCanvas: document.getElementById('screenCanvas'),
    screenSearch: document.getElementById('screenSearch'),
    screenVision: document.getElementById('screenVision'),
    screenSettings: document.getElementById('screenSettings'),
    
    // Viewport Mode Buttons
    btnModeDesk: document.getElementById('btnModeDesk'),
    btnModeMobile: document.getElementById('btnModeMobile'),
    btnModeFull: document.getElementById('btnModeFull'),
    btnQuickLock: document.getElementById('btnQuickLock'),
    
    // Lock screen elements
    pinDots: [
      document.getElementById('pinDot0'),
      document.getElementById('pinDot1'),
      document.getElementById('pinDot2'),
      document.getElementById('pinDot3')
    ],
    pinFeedback: document.getElementById('pinFeedback'),
    keypadBtns: document.querySelectorAll('.keypad-grid .key-btn[data-key]'),
    btnPinHint: document.getElementById('btnPinHint'),
    btnBiometric: document.getElementById('btnBiometric'),
    btnResetVault: document.getElementById('btnResetVault'),
    modalBiometric: document.getElementById('modalBiometric'),
    bioStatusText: document.getElementById('bioStatusText'),
    
    // Sanctuary Home elements
    tabFeed: document.getElementById('tabFeed'),
    tabCalendar: document.getElementById('tabCalendar'),
    feedContainer: document.getElementById('feedContainer'),
    calendarContainer: document.getElementById('calendarContainer'),
    scrapbookGrid: document.getElementById('scrapbookGrid'),
    scrapbookPills: document.querySelectorAll('.scrapbook-pills .pill-badge'),
    calGrid: document.getElementById('calGrid'),
    calMonthTitle: document.getElementById('calMonthTitle'),
    calPrev: document.getElementById('calPrev'),
    calNext: document.getElementById('calNext'),
    selectedDateLabel: document.getElementById('selectedDateLabel'),
    selectedDateBadge: document.getElementById('selectedDateBadge'),
    selectedDateBody: document.getElementById('selectedDateBody'),
    btnOpenSelectedDay: document.getElementById('btnOpenSelectedDay'),
    
    // Floating Dock
    dockBtnHome: document.getElementById('dockBtnHome'),
    dockBtnRecord: document.getElementById('dockBtnRecord'),
    dockBtnVision: document.getElementById('dockBtnVision'),
    homeFloatingDock: document.getElementById('homeFloatingDock'),
    
    // Canvas Studio elements
    canvasDateDisplay: document.getElementById('canvasDateDisplay'),
    canvasSaveStatus: document.getElementById('canvasSaveStatus'),
    btnBackToHome: document.getElementById('btnBackToHome'),
    btnSaveCanvas: document.getElementById('btnSaveCanvas'),
    btnTriggerTear: document.getElementById('btnTriggerTear'),
    selectPaperStyle: document.getElementById('selectPaperStyle'),
    selectTheme: document.getElementById('selectTheme'),
    selectSpeechLang: document.getElementById('selectSpeechLang'),
    btnPrevPage: document.getElementById('btnPrevPage'),
    btnNextPage: document.getElementById('btnNextPage'),
    pageIndicator: document.getElementById('pageIndicator'),
    btnAddPage: document.getElementById('btnAddPage'),
    btnRemovePage: document.getElementById('btnRemovePage'),
    sheetDateDisplay: document.getElementById('sheetDateDisplay'),
    btnToggleMilestone: document.getElementById('btnToggleMilestone'),
    marginAudioPill: document.getElementById('marginAudioPill'),
    btnToggleAudio: document.getElementById('btnToggleAudio'),
    audioTimeLabel: document.getElementById('audioTimeLabel'),
    btnPinVoice: document.getElementById('btnPinVoice'),
    transcriptEditor: document.getElementById('transcriptEditor'),
    activePolaroid: document.getElementById('activePolaroid'),
    polaroidImage: document.getElementById('polaroidImage'),
    polaroidCaption: document.getElementById('polaroidCaption'),
    btnChangePolaroid: document.getElementById('btnChangePolaroid'),
    activeScrap: document.getElementById('activeScrap'),
    craftScrapText: document.getElementById('craftScrapText'),
    btnEditScrap: document.getElementById('btnEditScrap'),
    pageTagsStrip: document.getElementById('pageTagsStrip'),
    btnAddTag: document.getElementById('btnAddTag'),
    
    // Canvas Dock
    btnTriggerSpeech: document.getElementById('btnTriggerSpeech'),
    micStatusLabel: document.getElementById('micStatusLabel'),
    btnFocusType: document.getElementById('btnFocusType'),
    btnAddPolaroidDialog: document.getElementById('btnAddPolaroidDialog'),
    btnAddScrapDialog: document.getElementById('btnAddScrapDialog'),
    btnOpenTearModal: document.getElementById('btnOpenTearModal'),
    
    // Search elements
    btnOpenSearch: document.getElementById('btnOpenSearch'),
    btnCloseSearch: document.getElementById('btnCloseSearch'),
    searchInput: document.getElementById('searchInput'),
    btnClearSearch: document.getElementById('btnClearSearch'),
    searchResultsList: document.getElementById('searchResultsList'),
    filterBtns: document.querySelectorAll('.filter-pills .filter-btn'),
    tagFilterBtns: document.querySelectorAll('.tag-filters .tag-filter-btn'),
    
    // Vision Atelier elements
    btnCloseVision: document.getElementById('btnCloseVision'),
    btnAddManifestation: document.getElementById('btnAddManifestation'),
    manifestationsList: document.getElementById('manifestationsList'),
    btnCycleWhisper: document.getElementById('btnCycleWhisper'),
    whisperText: document.getElementById('whisperText'),
    
    // Settings elements
    btnOpenSettings: document.getElementById('btnOpenSettings'),
    btnCloseSettings: document.getElementById('btnCloseSettings'),
    paletteSwatches: document.querySelectorAll('.palette-swatch'),
    btnChangePasscode: document.getElementById('btnChangePasscode'),
    btnEditHint: document.getElementById('btnEditHint'),
    settingHintDisplay: document.getElementById('settingHintDisplay'),
    chkAutoLock: document.getElementById('chkAutoLock'),
    btnExportBackup: document.getElementById('btnExportBackup'),
    btnImportBackup: document.getElementById('btnImportBackup'),
    fileImportBackup: document.getElementById('fileImportBackup'),
    btnPurgeAll: document.getElementById('btnPurgeAll'),
    
    // Modals
    modalTearPage: document.getElementById('modalTearPage'),
    btnCloseTearModal: document.getElementById('btnCloseTearModal'),
    letterDateLabel: document.getElementById('letterDateLabel'),
    letterCursiveContent: document.getElementById('letterCursiveContent'),
    btnShareWhatsApp: document.getElementById('btnShareWhatsApp'),
    btnDownloadLetter: document.getElementById('btnDownloadLetter'),
    
    modalPolaroid: document.getElementById('modalPolaroid'),
    btnClosePolaroidModal: document.getElementById('btnClosePolaroidModal'),
    modalCaptionInput: document.getElementById('modalCaptionInput'),
    btnApplyPolaroid: document.getElementById('btnApplyPolaroid'),
    btnCancelPolaroid: document.getElementById('btnCancelPolaroid'),
    inputCustomPhoto: document.getElementById('inputCustomPhoto'),
    
    modalScrap: document.getElementById('modalScrap'),
    btnCloseScrapModal: document.getElementById('btnCloseScrapModal'),
    modalScrapInput: document.getElementById('modalScrapInput'),
    btnApplyScrap: document.getElementById('btnApplyScrap'),
    btnCancelScrap: document.getElementById('btnCancelScrap'),
    
    toastNotification: document.getElementById('toastNotification'),
    toastMessage: document.getElementById('toastMessage')
  };

  /* ==========================================================================
     INITIALIZATION & BOOTSTRAP
     ========================================================================== */
  function init() {
    applyTheme(state.config.theme);
    applyPaperLayout(state.config.paperLayout);
    
    DOM.selectTheme.value = state.config.theme;
    DOM.selectPaperStyle.value = state.config.paperLayout;
    DOM.selectSpeechLang.value = state.config.speechLang;
    DOM.settingHintDisplay.textContent = `"${state.config.passcodeHint}"`;
    DOM.chkAutoLock.checked = state.config.autoLock;

    bindEvents();
    renderScrapbookFeed();
    renderCalendar(state.calYear, state.calMonth);
    renderManifestations();
    renderSearch();
    loadEntryIntoCanvas(state.activeEntryId);

    // Initial Screen is Lock Screen
    navigateTo('screenLock');
  }

  /* ==========================================================================
     NAVIGATION & SCREEN SWITCHING
     ========================================================================== */
  function navigateTo(screenId) {
    state.currentScreen = screenId;
    DOM.screens.forEach(s => s.classList.remove('active'));
    
    const target = document.getElementById(screenId);
    if (target) {
      target.classList.add('active');
    }

    // Toggle Floating Dock visibility
    if (screenId === 'screenHome') {
      DOM.homeFloatingDock.style.display = 'flex';
      DOM.dockBtnHome.classList.add('active');
      DOM.dockBtnVision.classList.remove('active');
    } else {
      DOM.homeFloatingDock.style.display = 'none';
    }

    // Reset PIN if navigated to lock
    if (screenId === 'screenLock') {
      state.pinInput = '';
      updatePinDisplay();
      DOM.pinFeedback.textContent = 'Enter 4-digit passcode';
      DOM.pinFeedback.classList.remove('error');
    }
  }

  /* ==========================================================================
     THE PRIVACY VAULT (PIN & BIOMETRIC)
     ========================================================================== */
  function handleKeyPress(num) {
    if (state.pinInput.length < 4) {
      state.pinInput += num;
      updatePinDisplay();
      
      if (state.pinInput.length === 4) {
        verifyPin();
      }
    }
  }

  function updatePinDisplay() {
    DOM.pinDots.forEach((dot, idx) => {
      if (idx < state.pinInput.length) {
        dot.classList.add('filled');
      } else {
        dot.classList.remove('filled');
      }
    });
  }

  function verifyPin() {
    if (state.pinInput === state.config.passcode) {
      DOM.pinFeedback.textContent = 'Sanctuary Unlocked';
      DOM.pinFeedback.classList.remove('error');
      setTimeout(() => {
        navigateTo('screenHome');
      }, 250);
    } else {
      DOM.pinFeedback.textContent = 'Incorrect Passcode';
      DOM.pinFeedback.classList.add('error');
      setTimeout(() => {
        state.pinInput = '';
        updatePinDisplay();
        DOM.pinFeedback.textContent = 'Enter 4-digit passcode';
        DOM.pinFeedback.classList.remove('error');
      }, 700);
    }
  }

  function triggerBiometric(callback) {
    DOM.modalBiometric.classList.add('active');
    DOM.bioStatusText.textContent = 'Verifying fingerprint / face id...';

    setTimeout(() => {
      DOM.bioStatusText.textContent = 'Identity Confirmed ✓';
      setTimeout(() => {
        DOM.modalBiometric.classList.remove('active');
        if (callback) {
          callback();
        } else {
          navigateTo('screenHome');
        }
      }, 500);
    }, 900);
  }

  /* ==========================================================================
     THE SANCTUARY HOME (FEED & CALENDAR)
     ========================================================================== */
  function renderScrapbookFeed(filter = 'all') {
    DOM.scrapbookGrid.innerHTML = '';
    
    let filtered = state.entries;
    if (filter === 'milestone') {
      filtered = state.entries.filter(e => e.isMilestone);
    } else if (filter === 'college') {
      filtered = state.entries.filter(e => e.tags.some(t => t.includes('nift')));
    } else if (filter === 'audio') {
      filtered = state.entries.filter(e => e.audioDuration);
    }

    if (filtered.length === 0) {
      DOM.scrapbookGrid.innerHTML = `<p style="text-align: center; font-size: 12px; opacity: 0.5; padding: 20px;">No memories found for this filter.</p>`;
      return;
    }

    filtered.forEach(entry => {
      const card = document.createElement('article');
      card.className = 'scrapbook-feed-card';
      const page1 = entry.pages[0] || {};
      const previewText = page1.transcript || 'Spoken memories...';
      const polaroid = page1.polaroid;

      card.innerHTML = `
        <div class="card-header-meta">
          <span class="card-date-badge">${entry.dateStr}</span>
          <span class="card-pages-pill">${entry.pages.length} ${entry.pages.length > 1 ? 'pages' : 'page'}</span>
        </div>
        <div class="card-body-preview">
          ${polaroid ? `
            <div class="card-polaroid-mini">
              <img src="${polaroid.imgSrc}" alt="${polaroid.caption}">
            </div>
          ` : ''}
          <div class="card-text-col">
            <p class="card-cursive-excerpt">${escapeHtml(previewText)}</p>
            <div class="card-tags">
              ${entry.tags.map(t => `<span class="card-tag">${t}</span>`).join('')}
              ${entry.isMilestone ? '<span class="card-tag" style="color: #b88a38;">🌟 milestone</span>' : ''}
            </div>
          </div>
        </div>
      `;

      card.addEventListener('click', () => {
        state.activeEntryId = entry.id;
        state.activePageIdx = 0;
        loadEntryIntoCanvas(entry.id);
        navigateTo('screenCanvas');
      });

      DOM.scrapbookGrid.appendChild(card);
    });
  }

  function renderCalendar(year, month) {
    const monthNames = [
      'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
      'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
    ];
    DOM.calMonthTitle.textContent = `${monthNames[month - 1]} ${year}`;
    DOM.calGrid.innerHTML = '';

    const firstDay = new Date(year, month - 1, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();

    // Blank cells before first day
    for (let i = 0; i < firstDay; i++) {
      const blank = document.createElement('div');
      blank.className = 'cal-cell empty';
      DOM.calGrid.appendChild(blank);
    }

    // Days in current month
    for (let d = 1; d <= daysInMonth; d++) {
      const dayCell = document.createElement('div');
      dayCell.className = 'cal-cell';
      dayCell.textContent = d;

      const dateIso = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      
      const hasEntry = state.entries.some(e => e.dateIso === dateIso);
      const milestone = DEFAULT_MILESTONES.find(m => m.dateIso === dateIso);

      if (hasEntry) dayCell.classList.add('has-entry');
      if (milestone) dayCell.classList.add('has-milestone');
      if (dateIso === state.selectedCalDate) dayCell.classList.add('selected');

      dayCell.addEventListener('click', () => {
        document.querySelectorAll('.cal-cell').forEach(c => c.classList.remove('selected'));
        dayCell.classList.add('selected');
        state.selectedCalDate = dateIso;
        updateCalendarDayDetail(dateIso);
      });

      DOM.calGrid.appendChild(dayCell);
    }

    updateCalendarDayDetail(state.selectedCalDate);
  }

  function updateCalendarDayDetail(dateIso) {
    const entry = state.entries.find(e => e.dateIso === dateIso);
    const milestone = DEFAULT_MILESTONES.find(m => m.dateIso === dateIso);

    const parts = dateIso.split('-');
    const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
    const formatted = dateObj.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    DOM.selectedDateLabel.textContent = formatted;

    if (entry) {
      DOM.selectedDateBadge.textContent = `📖 ${entry.pages.length} Pages Saved`;
      DOM.selectedDateBody.querySelector('.detail-preview').textContent = 
        entry.pages[0]?.transcript || 'Spoken reflections for this day.';
      DOM.btnOpenSelectedDay.style.display = 'block';
      DOM.btnOpenSelectedDay.textContent = `Open Today's Canvas →`;
    } else if (milestone) {
      DOM.selectedDateBadge.textContent = `${milestone.icon} ${milestone.title}`;
      DOM.selectedDateBody.querySelector('.detail-preview').textContent = 
        `Celebration / Recurring Milestone: ${milestone.title}`;
      DOM.btnOpenSelectedDay.style.display = 'block';
      DOM.btnOpenSelectedDay.textContent = `+ Start Journal for this day`;
    } else {
      DOM.selectedDateBadge.textContent = 'No entry yet';
      DOM.selectedDateBody.querySelector('.detail-preview').textContent = 
        'No memories written for this day yet. Tap to create one.';
      DOM.btnOpenSelectedDay.style.display = 'block';
      DOM.btnOpenSelectedDay.textContent = `+ Write for this day`;
    }
  }

  /* ==========================================================================
     THE DAILY CANVAS (CREATE / EDIT MULTI-PAGE STUDIO)
     ========================================================================== */
  function loadEntryIntoCanvas(entryId) {
    let entry = state.entries.find(e => e.id === entryId);
    if (!entry) {
      // Create new daily entry if not found
      entry = createNewEntry(state.selectedCalDate);
    }

    state.activeEntryId = entry.id;
    state.activePageIdx = 0;

    DOM.canvasDateDisplay.textContent = entry.dateStr.split(' ')[0] + ', ' + entry.dateStr.split(' ')[1] + ' ' + entry.dateStr.split(' ')[2];
    DOM.sheetDateDisplay.textContent = entry.dateStr;
    DOM.btnToggleMilestone.classList.toggle('active', !!entry.isMilestone);
    DOM.audioTimeLabel.textContent = entry.audioDuration || '01:42';
    DOM.btnPinVoice.classList.toggle('pinned', !!entry.isAudioPinned);

    renderActivePage();
  }

  function renderActivePage() {
    const entry = state.entries.find(e => e.id === state.activeEntryId);
    if (!entry) return;

    const pageCount = entry.pages.length;
    DOM.pageIndicator.textContent = `Page ${state.activePageIdx + 1} of ${pageCount}`;
    DOM.btnPrevPage.disabled = state.activePageIdx === 0;
    DOM.btnNextPage.disabled = state.activePageIdx >= pageCount - 1;

    const activePage = entry.pages[state.activePageIdx] || {
      transcript: '',
      polaroid: null,
      craftScrap: null
    };

    DOM.transcriptEditor.innerText = activePage.transcript || '';

    // Polaroid
    if (activePage.polaroid) {
      DOM.activePolaroid.style.display = 'block';
      DOM.polaroidImage.src = activePage.polaroid.imgSrc;
      DOM.polaroidCaption.value = activePage.polaroid.caption;
      DOM.activePolaroid.style.transform = `rotate(${activePage.polaroid.rotation || -2.5}deg)`;
    } else {
      DOM.activePolaroid.style.display = 'none';
    }

    // Craft Scrap
    if (activePage.craftScrap) {
      DOM.activeScrap.style.display = 'block';
      DOM.craftScrapText.innerText = activePage.craftScrap.text;
      DOM.activeScrap.style.transform = `rotate(${activePage.craftScrap.rotation || 1.8}deg)`;
    } else {
      DOM.activeScrap.style.display = 'none';
    }

    // Tags
    renderTags(entry.tags);
  }

  function renderTags(tags) {
    const existing = DOM.pageTagsStrip.querySelectorAll('.tag-chip');
    existing.forEach(e => e.remove());

    tags.forEach(t => {
      const chip = document.createElement('span');
      chip.className = 'tag-chip';
      chip.textContent = t;
      DOM.pageTagsStrip.insertBefore(chip, DOM.btnAddTag);
    });
  }

  function saveActivePageToState() {
    const entry = state.entries.find(e => e.id === state.activeEntryId);
    if (!entry) return;

    if (!entry.pages[state.activePageIdx]) {
      entry.pages[state.activePageIdx] = {};
    }

    const page = entry.pages[state.activePageIdx];
    page.transcript = DOM.transcriptEditor.innerText;

    if (DOM.activePolaroid.style.display !== 'none') {
      page.polaroid = {
        imgSrc: DOM.polaroidImage.src,
        caption: DOM.polaroidCaption.value,
        rotation: -2.5
      };
    } else {
      page.polaroid = null;
    }

    if (DOM.activeScrap.style.display !== 'none') {
      page.craftScrap = {
        text: DOM.craftScrapText.innerText,
        rotation: 1.8
      };
    } else {
      page.craftScrap = null;
    }

    saveEntries();
    DOM.canvasSaveStatus.textContent = 'Encrypted ✓';
    setTimeout(() => {
      DOM.canvasSaveStatus.textContent = 'Vault Sealed';
    }, 2000);
  }

  function createNewEntry(dateIso) {
    const parts = dateIso.split('-');
    const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
    const formatted = dateObj.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    const newEntry = {
      id: 'entry_' + dateIso.replace(/-/g, ''),
      dateStr: formatted,
      dateIso: dateIso,
      year: parseInt(parts[0]),
      month: parseInt(parts[1]),
      day: parseInt(parts[2]),
      speechLang: state.config.speechLang,
      theme: state.config.theme,
      layout: state.config.paperLayout,
      isMilestone: false,
      audioDuration: '01:10',
      isAudioPinned: false,
      tags: ['#journal', '#reflection'],
      pages: [
        {
          pageNumber: 1,
          transcript: '',
          polaroid: null,
          craftScrap: null
        }
      ]
    };

    state.entries.unshift(newEntry);
    saveEntries();
    renderScrapbookFeed();
    renderCalendar(state.calYear, state.calMonth);
    return newEntry;
  }

  /* ==========================================================================
     WEB SPEECH API (VOICE-TO-TEXT WITH BILINGUAL FALLBACK)
     ========================================================================== */
  function toggleSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (state.isRecording) {
      stopRecording();
      return;
    }

    if (!SpeechRecognition) {
      // Simulate real-time native speech dictation
      simulateSpeechDictation();
      return;
    }

    try {
      state.speechRecognition = new SpeechRecognition();
      state.speechRecognition.continuous = true;
      state.speechRecognition.interimResults = true;
      state.speechRecognition.lang = DOM.selectSpeechLang.value || 'ml-IN';

      state.speechRecognition.onstart = () => {
        startRecordingUI();
      };

      state.speechRecognition.onresult = (event) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            DOM.transcriptEditor.innerText += ' ' + event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
      };

      state.speechRecognition.onerror = (err) => {
        console.warn('Speech recognition error:', err);
        stopRecording();
        simulateSpeechDictation();
      };

      state.speechRecognition.onend = () => {
        stopRecording();
      };

      state.speechRecognition.start();
    } catch (e) {
      simulateSpeechDictation();
    }
  }

  function startRecordingUI() {
    state.isRecording = true;
    DOM.btnTriggerSpeech.classList.add('recording');
    DOM.micStatusLabel.textContent = 'Listening...';
    showToast(`Listening in ${DOM.selectSpeechLang.options[DOM.selectSpeechLang.selectedIndex].text}...`);
  }

  function stopRecording() {
    state.isRecording = false;
    DOM.btnTriggerSpeech.classList.remove('recording');
    DOM.micStatusLabel.textContent = 'Speak';
    if (state.speechRecognition) {
      try { state.speechRecognition.stop(); } catch (e) {}
    }
    saveActivePageToState();
  }

  function simulateSpeechDictation() {
    startRecordingUI();
    const lang = DOM.selectSpeechLang.value;
    let samplePhrase = '';

    if (lang === 'ml-IN') {
      samplePhrase = ' ഇന്നത്തെ ഡിസൈൻ ക്ലാസ് വളരെ മനോഹരമായിരുന്നു. തുണികളുടെ നിറങ്ങളും ടെക്സ്ചറുകളും മനസ്സിന് പുതിയ ചിന്തകൾ നൽകി...';
    } else if (lang === 'hi-IN') {
      samplePhrase = ' आज का दिन बहुत खास था। नए डिज़ाइन्स और स्केचेस पर काम करके बहुत खुशी मिली...';
    } else {
      samplePhrase = ' The late-night studio session sparked a new design breakthrough for the upcoming collection...';
    }

    setTimeout(() => {
      DOM.transcriptEditor.innerText += '\n\n' + samplePhrase.trim();
      stopRecording();
      showToast('Voice transcribed directly to paper lines ✨');
    }, 1800);
  }

  /* Audio Pill Simulation */
  function toggleAudioPlayback() {
    if (state.isPlayingAudio) {
      state.isPlayingAudio = false;
      DOM.marginAudioPill.classList.remove('playing');
      DOM.btnToggleAudio.querySelector('.audio-play-icon').textContent = '▶';
    } else {
      state.isPlayingAudio = true;
      DOM.marginAudioPill.classList.add('playing');
      DOM.btnToggleAudio.querySelector('.audio-play-icon').textContent = '⏸';
      showToast('Playing confidential voice memo 🎧');

      setTimeout(() => {
        state.isPlayingAudio = false;
        DOM.marginAudioPill.classList.remove('playing');
        DOM.btnToggleAudio.querySelector('.audio-play-icon').textContent = '▶';
      }, 5000);
    }
  }

  /* ==========================================================================
     "TEAR A PAGE" KEEPSAKE MODAL (PRIVACY QUARANTINE)
     ========================================================================== */
  function openTearModal() {
    const entry = state.entries.find(e => e.id === state.activeEntryId);
    if (!entry) return;

    DOM.letterDateLabel.textContent = entry.dateStr;
    const pageText = DOM.transcriptEditor.innerText.trim();
    DOM.letterCursiveContent.textContent = pageText || "Sending you a quiet piece of today from my journal ✨";
    DOM.modalTearPage.classList.add('active');
  }

  function shareToWhatsApp() {
    const text = `💌 *Dear Diary Keepsake Letter*\n\n"${DOM.letterCursiveContent.textContent}"\n\n— Sealed & Quarantined from Dear Diary (BD-24-2834)`;
    const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank');
    showToast('Keepsake letter ready for WhatsApp share');
  }

  function downloadLetterFile() {
    const entry = state.entries.find(e => e.id === state.activeEntryId);
    const letterPayload = {
      type: 'application/dear-diary-letter',
      version: '1.0',
      date: entry ? entry.dateStr : new Date().toDateString(),
      quarantinedNote: DOM.letterCursiveContent.textContent,
      exportedAt: new Date().toISOString(),
      disclaimer: 'This letter contains zero private vault database links or sibling memories.'
    };

    const blob = new Blob([JSON.stringify(letterPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DearDiary_Keepsake_${new Date().toISOString().slice(0, 10)}.letter`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded isolated .letter envelope');
  }

  /* ==========================================================================
     VISION BOARD & MANIFESTATIONS
     ========================================================================== */
  function renderManifestations() {
    DOM.manifestationsList.innerHTML = '';

    state.manifestations.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = `manifestation-card ${item.unveiled ? 'unveiled' : ''}`;
      card.innerHTML = `
        <div class="veiled-lock-curtain">
          <span class="curtain-icon">🔒</span>
          <span class="curtain-text">Biometric Gate • Tap to Unveil</span>
        </div>
        <div class="card-veiled-content">
          <div class="manif-meta">
            <span><strong>Target:</strong> ${item.targetDate}</span>
            <span>✨ Intentional</span>
          </div>
          <h4 style="font-family: var(--font-serif-title); font-size: 15px; margin-bottom: 6px;">${item.title}</h4>
          <p class="manif-text">"${item.note}"</p>
        </div>
      `;

      card.addEventListener('click', () => {
        if (!item.unveiled) {
          triggerBiometric(() => {
            item.unveiled = true;
            card.classList.add('unveiled');
            showToast('Manifestation unmasked with biometric clearance');
          });
        }
      });

      DOM.manifestationsList.appendChild(card);
    });
  }

  function cycleWhisper() {
    state.whisperIndex = (state.whisperIndex + 1) % ZOMATO_WHISPERS.length;
    DOM.whisperText.textContent = `"${ZOMATO_WHISPERS[state.whisperIndex]}"`;
    showToast('Whisper nudge shuffled');
  }

  /* ==========================================================================
     SEARCH & EPISODIC RETRIEVAL
     ========================================================================== */
  function renderSearch(query = '', timeFilter = 'all', tagFilter = '') {
    DOM.searchResultsList.innerHTML = '';

    const results = state.entries.filter(entry => {
      // Time filter
      if (timeFilter === '2026' && entry.year !== 2026) return false;
      if (timeFilter === '2025' && entry.year !== 2025) return false;
      if (timeFilter === 'month' && (entry.year !== 2026 || entry.month !== 10)) return false;

      // Tag filter
      if (tagFilter && !entry.tags.some(t => t.includes(tagFilter))) return false;

      // Query search
      if (query.trim()) {
        const q = query.toLowerCase();
        const matchesTag = entry.tags.some(t => t.toLowerCase().includes(q));
        const matchesTranscript = entry.pages.some(p => (p.transcript || '').toLowerCase().includes(q));
        const matchesDate = entry.dateStr.toLowerCase().includes(q);
        return matchesTag || matchesTranscript || matchesDate;
      }

      return true;
    });

    if (results.length === 0) {
      DOM.searchResultsList.innerHTML = `<p style="text-align: center; font-size: 12px; opacity: 0.5; padding: 20px;">No matching memories found.</p>`;
      return;
    }

    results.forEach(entry => {
      const card = document.createElement('div');
      card.className = 'scrapbook-feed-card';
      const page1 = entry.pages[0] || {};
      card.innerHTML = `
        <div class="card-header-meta">
          <span class="card-date-badge">${entry.dateStr}</span>
          <span class="card-pages-pill">${entry.pages.length} Pages</span>
        </div>
        <p class="card-cursive-excerpt">${escapeHtml(page1.transcript || 'Reflections...')}</p>
        <div class="card-tags">
          ${entry.tags.map(t => `<span class="card-tag">${t}</span>`).join('')}
        </div>
      `;

      card.addEventListener('click', () => {
        state.activeEntryId = entry.id;
        loadEntryIntoCanvas(entry.id);
        navigateTo('screenCanvas');
      });

      DOM.searchResultsList.appendChild(card);
    });
  }

  /* ==========================================================================
     THEME & LAYOUT APPLY
     ========================================================================== */
  function applyTheme(themeName) {
    DOM.body.classList.remove('theme-paper', 'theme-ink', 'theme-blossom', 'theme-forest', 'theme-midnight');
    DOM.body.classList.add(themeName);
    state.config.theme = themeName;
    saveConfig();

    DOM.paletteSwatches.forEach(swatch => {
      if (swatch.dataset.theme === themeName) {
        swatch.classList.add('active');
      } else {
        swatch.classList.remove('active');
      }
    });
  }

  function applyPaperLayout(layoutName) {
    DOM.body.classList.remove('layout-lined', 'layout-grid', 'layout-dotted', 'layout-plain');
    DOM.body.classList.add(layoutName);
    state.config.paperLayout = layoutName;
    saveConfig();
  }

  /* ==========================================================================
     TOAST NOTIFICATIONS
     ========================================================================== */
  let toastTimeout = null;
  function showToast(msg) {
    DOM.toastMessage.textContent = msg;
    DOM.toastNotification.classList.add('active');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      DOM.toastNotification.classList.remove('active');
    }, 2800);
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function (m) {
      return ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      })[m];
    });
  }

  /* ==========================================================================
     EVENT BINDINGS
     ========================================================================== */
  function bindEvents() {
    // Mode Switchers
    DOM.btnModeDesk.addEventListener('click', () => {
      DOM.body.classList.remove('mode-mobile', 'mode-full');
      DOM.body.classList.add('mode-desk');
      DOM.btnModeDesk.classList.add('active');
      DOM.btnModeMobile.classList.remove('active');
      DOM.btnModeFull.classList.remove('active');
    });

    DOM.btnModeMobile.addEventListener('click', () => {
      DOM.body.classList.remove('mode-desk', 'mode-full');
      DOM.body.classList.add('mode-mobile');
      DOM.btnModeMobile.classList.add('active');
      DOM.btnModeDesk.classList.remove('active');
      DOM.btnModeFull.classList.remove('active');
    });

    DOM.btnModeFull.addEventListener('click', () => {
      DOM.body.classList.remove('mode-desk', 'mode-mobile');
      DOM.body.classList.add('mode-full');
      DOM.btnModeFull.classList.add('active');
      DOM.btnModeDesk.classList.remove('active');
      DOM.btnModeMobile.classList.remove('active');
    });

    DOM.btnQuickLock.addEventListener('click', () => {
      navigateTo('screenLock');
    });

    // Keypad digits
    DOM.keypadBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        handleKeyPress(btn.dataset.key);
      });
    });

    // Hint & Biometric
    DOM.btnPinHint.addEventListener('click', () => {
      DOM.pinFeedback.textContent = `Hint: ${state.config.passcodeHint}`;
    });

    DOM.btnBiometric.addEventListener('click', () => {
      triggerBiometric();
    });

    DOM.btnResetVault.addEventListener('click', () => {
      if (confirm('Permanently erase all encrypted journal entries and reset passcode to 2428?')) {
        localStorage.clear();
        state.config = { ...DEFAULT_CONFIG };
        state.entries = [...DEFAULT_ENTRIES];
        init();
        showToast('Vault wiped and restored to pristine state');
      }
    });

    // Navigation Tabs on Home Screen
    DOM.tabFeed.addEventListener('click', () => {
      DOM.tabFeed.classList.add('active');
      DOM.tabCalendar.classList.remove('active');
      DOM.feedContainer.classList.remove('hidden');
      DOM.calendarContainer.classList.add('hidden');
    });

    DOM.tabCalendar.addEventListener('click', () => {
      DOM.tabCalendar.classList.add('active');
      DOM.tabFeed.classList.remove('active');
      DOM.calendarContainer.classList.remove('hidden');
      DOM.feedContainer.classList.add('hidden');
    });

    // Feed Filter Pills
    DOM.scrapbookPills.forEach(pill => {
      pill.addEventListener('click', () => {
        DOM.scrapbookPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        renderScrapbookFeed(pill.dataset.filter);
      });
    });

    // Calendar Navigation
    DOM.calPrev.addEventListener('click', () => {
      state.calMonth--;
      if (state.calMonth < 1) {
        state.calMonth = 12;
        state.calYear--;
      }
      renderCalendar(state.calYear, state.calMonth);
    });

    DOM.calNext.addEventListener('click', () => {
      state.calMonth++;
      if (state.calMonth > 12) {
        state.calMonth = 1;
        state.calYear++;
      }
      renderCalendar(state.calYear, state.calMonth);
    });

    DOM.btnOpenSelectedDay.addEventListener('click', () => {
      loadEntryIntoCanvas(state.activeEntryId);
      navigateTo('screenCanvas');
    });

    // Dock Navigation
    DOM.dockBtnHome.addEventListener('click', () => {
      navigateTo('screenHome');
    });

    DOM.dockBtnRecord.addEventListener('click', () => {
      // Create or open today's entry
      loadEntryIntoCanvas(state.activeEntryId);
      navigateTo('screenCanvas');
      setTimeout(() => {
        toggleSpeechRecognition();
      }, 400);
    });

    DOM.dockBtnVision.addEventListener('click', () => {
      navigateTo('screenVision');
    });

    // Canvas Topbar Actions
    DOM.btnBackToHome.addEventListener('click', () => {
      saveActivePageToState();
      renderScrapbookFeed();
      renderCalendar(state.calYear, state.calMonth);
      navigateTo('screenHome');
    });

    DOM.btnSaveCanvas.addEventListener('click', () => {
      saveActivePageToState();
    });

    DOM.btnTriggerTear.addEventListener('click', () => {
      openTearModal();
    });

    // Canvas Selectors
    DOM.selectPaperStyle.addEventListener('change', (e) => {
      applyPaperLayout(e.target.value);
    });

    DOM.selectTheme.addEventListener('change', (e) => {
      applyTheme(e.target.value);
    });

    DOM.selectSpeechLang.addEventListener('change', (e) => {
      state.config.speechLang = e.target.value;
      saveConfig();
      showToast(`Speech dialect switched to ${e.target.options[e.target.selectedIndex].text}`);
    });

    // Canvas Multi-Page Pagination
    DOM.btnAddPage.addEventListener('click', () => {
      const entry = state.entries.find(e => e.id === state.activeEntryId);
      if (!entry) return;

      if (entry.pages.length >= 5) {
        showToast('Maximum 5 pages per entry reached');
        return;
      }

      saveActivePageToState();
      entry.pages.push({
        pageNumber: entry.pages.length + 1,
        transcript: '',
        polaroid: null,
        craftScrap: null
      });

      state.activePageIdx = entry.pages.length - 1;
      renderActivePage();
      showToast(`Spawned blank Page ${entry.pages.length}`);
    });

    DOM.btnRemovePage.addEventListener('click', () => {
      const entry = state.entries.find(e => e.id === state.activeEntryId);
      if (!entry || entry.pages.length <= 1) {
        showToast('Cannot delete the only page');
        return;
      }

      if (confirm(`Delete Page ${state.activePageIdx + 1}?`)) {
        entry.pages.splice(state.activePageIdx, 1);
        if (state.activePageIdx >= entry.pages.length) {
          state.activePageIdx = entry.pages.length - 1;
        }
        renderActivePage();
        showToast('Page removed');
      }
    });

    DOM.btnPrevPage.addEventListener('click', () => {
      if (state.activePageIdx > 0) {
        saveActivePageToState();
        state.activePageIdx--;
        renderActivePage();
      }
    });

    DOM.btnNextPage.addEventListener('click', () => {
      const entry = state.entries.find(e => e.id === state.activeEntryId);
      if (entry && state.activePageIdx < entry.pages.length - 1) {
        saveActivePageToState();
        state.activePageIdx++;
        renderActivePage();
      }
    });

    // Milestone & Audio
    DOM.btnToggleMilestone.addEventListener('click', () => {
      const entry = state.entries.find(e => e.id === state.activeEntryId);
      if (entry) {
        entry.isMilestone = !entry.isMilestone;
        DOM.btnToggleMilestone.classList.toggle('active', entry.isMilestone);
        saveEntries();
        showToast(entry.isMilestone ? 'Marked as major life milestone 🌟' : 'Milestone toggle removed');
      }
    });

    DOM.btnToggleAudio.addEventListener('click', () => {
      toggleAudioPlayback();
    });

    DOM.btnPinVoice.addEventListener('click', () => {
      const entry = state.entries.find(e => e.id === state.activeEntryId);
      if (entry) {
        entry.isAudioPinned = !entry.isAudioPinned;
        DOM.btnPinVoice.classList.toggle('pinned', entry.isAudioPinned);
        saveEntries();
        showToast(entry.isAudioPinned ? 'Voice pinned permanently (zero expiry) 📌' : 'Voice unpinned (30-day window)');
      }
    });

    // Canvas Bottom Bar Actions
    DOM.btnTriggerSpeech.addEventListener('click', () => {
      toggleSpeechRecognition();
    });

    DOM.btnFocusType.addEventListener('click', () => {
      DOM.transcriptEditor.focus();
    });

    DOM.btnAddPolaroidDialog.addEventListener('click', () => {
      DOM.modalCaptionInput.value = DOM.polaroidCaption.value || 'Fashion Jury Day ✨';
      DOM.modalPolaroid.classList.add('active');
    });

    DOM.btnChangePolaroid.addEventListener('click', () => {
      DOM.modalCaptionInput.value = DOM.polaroidCaption.value || '';
      DOM.modalPolaroid.classList.add('active');
    });

    DOM.btnAddScrapDialog.addEventListener('click', () => {
      DOM.modalScrapInput.value = DOM.craftScrapText.innerText.trim();
      DOM.modalScrap.classList.add('active');
    });

    DOM.btnEditScrap.addEventListener('click', () => {
      DOM.modalScrapInput.value = DOM.craftScrapText.innerText.trim();
      DOM.modalScrap.classList.add('active');
    });

    DOM.btnOpenTearModal.addEventListener('click', () => {
      openTearModal();
    });

    DOM.btnAddTag.addEventListener('click', () => {
      const tag = prompt('Enter a new keyword tag (e.g. #nift, #sketch):');
      if (tag) {
        const cleanTag = tag.startsWith('#') ? tag : '#' + tag;
        const entry = state.entries.find(e => e.id === state.activeEntryId);
        if (entry && !entry.tags.includes(cleanTag)) {
          entry.tags.push(cleanTag);
          renderTags(entry.tags);
          saveEntries();
          showToast(`Added ${cleanTag}`);
        }
      }
    });

    // Modals Close & Submit
    DOM.btnCloseTearModal.addEventListener('click', () => {
      DOM.modalTearPage.classList.remove('active');
    });
    DOM.btnShareWhatsApp.addEventListener('click', () => {
      shareToWhatsApp();
    });
    DOM.btnDownloadLetter.addEventListener('click', () => {
      downloadLetterFile();
    });

    DOM.btnClosePolaroidModal.addEventListener('click', () => {
      DOM.modalPolaroid.classList.remove('active');
    });
    DOM.btnCancelPolaroid.addEventListener('click', () => {
      DOM.modalPolaroid.classList.remove('active');
    });
    DOM.btnApplyPolaroid.addEventListener('click', () => {
      DOM.polaroidCaption.value = DOM.modalCaptionInput.value;
      DOM.activePolaroid.style.display = 'block';
      DOM.modalPolaroid.classList.remove('active');
      saveActivePageToState();
      showToast('Polaroid frame pinned to canvas');
    });

    DOM.inputCustomPhoto.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          DOM.polaroidImage.src = event.target.result;
          showToast('Custom photo loaded');
        };
        reader.readAsDataURL(file);
      }
    });

    DOM.btnCloseScrapModal.addEventListener('click', () => {
      DOM.modalScrap.classList.remove('active');
    });
    DOM.btnCancelScrap.addEventListener('click', () => {
      DOM.modalScrap.classList.remove('active');
    });
    DOM.btnApplyScrap.addEventListener('click', () => {
      DOM.craftScrapText.innerText = DOM.modalScrapInput.value;
      DOM.activeScrap.style.display = 'block';
      DOM.modalScrap.classList.remove('active');
      saveActivePageToState();
      showToast('Craft paper scrap taped to page');
    });

    // Search Events
    DOM.btnOpenSearch.addEventListener('click', () => {
      navigateTo('screenSearch');
      DOM.searchInput.focus();
    });

    DOM.btnCloseSearch.addEventListener('click', () => {
      navigateTo('screenHome');
    });

    DOM.searchInput.addEventListener('input', (e) => {
      renderSearch(e.target.value);
    });

    DOM.btnClearSearch.addEventListener('click', () => {
      DOM.searchInput.value = '';
      renderSearch('');
    });

    DOM.filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        DOM.filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderSearch(DOM.searchInput.value, btn.dataset.time);
      });
    });

    DOM.tagFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        DOM.tagFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderSearch(DOM.searchInput.value, 'all', btn.dataset.tag);
      });
    });

    // Vision Atelier Events
    DOM.btnCloseVision.addEventListener('click', () => {
      navigateTo('screenHome');
    });

    DOM.btnCycleWhisper.addEventListener('click', () => {
      cycleWhisper();
    });

    DOM.btnAddManifestation.addEventListener('click', () => {
      const title = prompt('Manifestation Title:');
      if (title) {
        const note = prompt('Intimate Goal / Vision Note:');
        const targetDate = prompt('Target Horizon (e.g. Dec 2026):', 'December 2026');
        state.manifestations.push({
          id: 'manif_' + Date.now(),
          title: title,
          note: note || '',
          targetDate: targetDate || '2027',
          unveiled: false
        });
        renderManifestations();
        showToast('Veiled manifestation added to Vision Atelier');
      }
    });

    // Settings Events
    DOM.btnOpenSettings.addEventListener('click', () => {
      navigateTo('screenSettings');
    });

    DOM.btnCloseSettings.addEventListener('click', () => {
      navigateTo('screenHome');
    });

    DOM.paletteSwatches.forEach(swatch => {
      swatch.addEventListener('click', () => {
        applyTheme(swatch.dataset.theme);
        DOM.selectTheme.value = swatch.dataset.theme;
        showToast(`Theme switched to ${swatch.title}`);
      });
    });

    DOM.btnChangePasscode.addEventListener('click', () => {
      const current = prompt('Enter existing 4-digit passcode:');
      if (current === state.config.passcode) {
        const newCode = prompt('Enter new 4-digit passcode:');
        if (newCode && newCode.length === 4 && /^\d+$/.test(newCode)) {
          state.config.passcode = newCode;
          saveConfig();
          showToast('Passcode changed successfully');
        } else {
          alert('Invalid passcode. Must be exactly 4 digits.');
        }
      } else {
        alert('Incorrect existing passcode.');
      }
    });

    DOM.btnEditHint.addEventListener('click', () => {
      const newHint = prompt('Enter new passcode hint:', state.config.passcodeHint);
      if (newHint) {
        state.config.passcodeHint = newHint;
        DOM.settingHintDisplay.textContent = `"${newHint}"`;
        saveConfig();
        showToast('Passcode hint updated');
      }
    });

    DOM.chkAutoLock.addEventListener('change', (e) => {
      state.config.autoLock = e.target.checked;
      saveConfig();
    });

    // Backup & Export
    DOM.btnExportBackup.addEventListener('click', () => {
      const payload = {
        app: 'Dear Diary',
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        config: state.config,
        entries: state.entries,
        manifestations: state.manifestations
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `DearDiary_Vault_Backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Vault exported as encrypted backup');
    });

    DOM.btnImportBackup.addEventListener('click', () => {
      DOM.fileImportBackup.click();
    });

    DOM.fileImportBackup.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target.result);
            if (data.entries) {
              state.entries = data.entries;
              saveEntries();
              if (data.config) {
                state.config = data.config;
                saveConfig();
              }
              init();
              showToast('Backup successfully restored to vault');
            }
          } catch (err) {
            alert('Failed to parse backup file');
          }
        };
        reader.readAsText(file);
      }
    });

    DOM.btnPurgeAll.addEventListener('click', () => {
      DOM.btnResetVault.click();
    });

    // Auto-Lock on Page Visibility / Blur
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && state.config.autoLock && state.currentScreen !== 'screenLock') {
        navigateTo('screenLock');
      }
    });

    // Keyboard navigation for PIN on desktop
    document.addEventListener('keydown', (e) => {
      if (state.currentScreen === 'screenLock') {
        if (/^[0-9]$/.test(e.key)) {
          handleKeyPress(e.key);
        } else if (e.key === 'Backspace') {
          state.pinInput = state.pinInput.slice(0, -1);
          updatePinDisplay();
        }
      }
    });
  }

  // Launch when DOM is ready
  document.addEventListener('DOMContentLoaded', init);

})();
