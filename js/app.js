/**
 * CyberSatark Portal - Core JavaScript Application
 * Features:
 * - Multi-language translation engine (English, Hindi, Marathi)
 * - Startup Language Toast Modal with LocalStorage memory
 * - Dark & Light mode toggle with LocalStorage memory
 * - Mobile responsive navigation menu
 * - Live Scam & SMS Checker Tool (AI-like rule-based fraud pattern analyzer)
 * - Emergency SOS Triage Modal with 1930 & Instant Bank Block List
 * - Interactive Quiz & Scam Spotter logic
 * - Cyber Safety Pledge & Certificate Generator
 */

(function () {
  'use strict';

  const STORAGE_LANG_KEY = 'cybersatark_lang';
  const STORAGE_THEME_KEY = 'cybersatark_theme';
  const DEFAULT_LANG = 'en';

  let currentLang = localStorage.getItem(STORAGE_LANG_KEY) || null;

  /* ==========================================================================
     Theme Management (Dark / Light)
     ========================================================================== */
  function initTheme() {
    const savedTheme = localStorage.getItem(STORAGE_THEME_KEY);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const activeTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    applyTheme(activeTheme);

    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const nextTheme = current === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
        localStorage.setItem(STORAGE_THEME_KEY, nextTheme);
      });
    }
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const sunIcon = document.getElementById('sunIcon');
    const moonIcon = document.getElementById('moonIcon');

    if (sunIcon && moonIcon) {
      if (theme === 'dark') {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
      } else {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
      }
    }
  }

  /* ==========================================================================
     Multi-Language Translation Engine
     ========================================================================== */
  function applyLanguage(lang) {
    if (!translations[lang]) {
      lang = DEFAULT_LANG;
    }
    currentLang = lang;
    localStorage.setItem(STORAGE_LANG_KEY, lang);
    document.documentElement.setAttribute('lang', lang);

    // Sync header dropdown
    const langSelect = document.getElementById('headerLangSelect');
    if (langSelect) {
      langSelect.value = lang;
    }

    const dict = translations[lang];

    // Replace all elements with data-i18n
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) {
        if (dict[key].includes('<')) {
          el.innerHTML = dict[key];
        } else {
          el.textContent = dict[key];
        }
      }
    });

    // Replace attributes like placeholders
    const attrElements = document.querySelectorAll('[data-i18n-placeholder]');
    attrElements.forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key] !== undefined) {
        el.setAttribute('placeholder', dict[key]);
      }
    });

    // Re-render certificate date if active
    const badgeDateEl = document.getElementById('badgeDate');
    if (badgeDateEl && badgeDateEl.getAttribute('data-raw-date')) {
      formatBadgeDate(badgeDateEl);
    }
  }

  /* ==========================================================================
     Startup Toast Modal for Preferred Language
     ========================================================================== */
  function initLanguageModal() {
    const toastOverlay = document.getElementById('langToastModal');
    const hasChosen = localStorage.getItem(STORAGE_LANG_KEY);

    if (!hasChosen && toastOverlay) {
      setTimeout(() => {
        toastOverlay.classList.add('active');
      }, 350);
    }

    const langButtons = document.querySelectorAll('.lang-pick-btn');
    langButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const chosen = btn.getAttribute('data-lang');
        if (chosen) {
          applyLanguage(chosen);
          if (toastOverlay) {
            toastOverlay.classList.remove('active');
          }
        }
      });
    });

    const closeBtn = document.getElementById('langToastClose');
    if (closeBtn && toastOverlay) {
      closeBtn.addEventListener('click', () => {
        if (!localStorage.getItem(STORAGE_LANG_KEY)) {
          applyLanguage(DEFAULT_LANG);
        }
        toastOverlay.classList.remove('active');
      });
    }

    const headerSelect = document.getElementById('headerLangSelect');
    if (headerSelect) {
      headerSelect.addEventListener('change', (e) => {
        applyLanguage(e.target.value);
      });
    }
  }

  /* ==========================================================================
     Mobile Menu Toggle
     ========================================================================== */
  function initMobileMenu() {
    const toggleBtn = document.getElementById('mobileMenuToggle');
    const mainNav = document.getElementById('mainNav');

    if (toggleBtn && mainNav) {
      toggleBtn.addEventListener('click', () => {
        mainNav.classList.toggle('open');
      });
    }
  }

  /* ==========================================================================
     Emergency SOS Modal Logic
     ========================================================================== */
  function initSOSModal() {
    const sosBtn = document.getElementById('floatingSosBtn');
    const sosModal = document.getElementById('sosModal');
    const sosClose = document.getElementById('sosModalClose');

    if (sosBtn && sosModal) {
      sosBtn.addEventListener('click', () => {
        sosModal.classList.add('active');
      });
    }

    if (sosClose && sosModal) {
      sosClose.addEventListener('click', () => {
        sosModal.classList.remove('active');
      });
    }

    if (sosModal) {
      sosModal.addEventListener('click', (e) => {
        if (e.target === sosModal) {
          sosModal.classList.remove('active');
        }
      });
    }
  }

  /* ==========================================================================
     Unique Feature: Live Scam & Threat Checker
     ========================================================================== */
  function initScamChecker() {
    const checkerInput = document.getElementById('checkerInput');
    const checkBtn = document.getElementById('checkerBtn');
    const resultCard = document.getElementById('checkerResultCard');
    const resultTitle = document.getElementById('checkerResultTitle');
    const resultRule = document.getElementById('checkerResultRule');

    if (!checkerInput || !checkBtn || !resultCard) return;

    // Preset Buttons
    const presetPills = document.querySelectorAll('[data-preset]');
    presetPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        const type = pill.getAttribute('data-preset');
        let sample = '';
        if (type === 'apk') {
          sample = "Dear Consumer, your electricity bill is unpaid. Power supply will be disconnected tonight at 9:30 PM. Call electricity officer immediately and update BijliBill.apk to avoid cutoff.";
        } else if (type === 'cbi') {
          sample = "This is CBI New Delhi Police Cyber Cell. An illegal courier containing narcotic drugs has been caught with your Aadhaar ID. Join WhatsApp video call immediately or warrant will be executed.";
        } else if (type === 'qr') {
          sample = "Congratulations! Your refund of Rs 25,000 has been approved. Scan this QR code and enter your UPI PIN to receive money instantly in your bank account.";
        } else if (type === 'telegram') {
          sample = "Work from home part time job! Earn Rs 3000 to 5000 daily just by liking YouTube videos and Google reviews. Join VIP Telegram task group now for immediate payout.";
        }
        checkerInput.value = sample;
        analyzeScamText(sample);
      });
    });

    checkBtn.addEventListener('click', () => {
      analyzeScamText(checkerInput.value.trim());
    });

    function analyzeScamText(text) {
      if (!text) {
        resultCard.style.display = 'none';
        return;
      }

      const lower = text.toLowerCase();
      const dict = translations[currentLang || DEFAULT_LANG];

      // High Risk Signatures
      const dangerWords = [
        'apk', '.apk', 'bijli', 'electricity', 'disconnected', 'cutoff', '9:30', 
        'cbi', 'narcotics', 'digital arrest', 'arrest warrant', 'customs parcel', 'illegal courier',
        'skype', 'police video', 'qr code', 'scan to receive', 'enter upi pin', 'enter pin to receive',
        'telegram job', 'like youtube', 'prepaid task', 'crypto investment'
      ];

      // Moderate Risk Signatures
      const cautionWords = [
        'kyc', 'expire', 'blocked', 'suspended', 'immediately', 'urgent', 'lottery', 
        'refund', 'winner', 'gift card', 'pan card', 'debit card blocked', 'update now', 'bit.ly'
      ];

      const hasDanger = dangerWords.some(w => lower.includes(w));
      const hasCaution = cautionWords.some(w => lower.includes(w));

      if (hasDanger) {
        resultCard.className = 'checker-result-card danger';
        resultTitle.textContent = dict.checkerResultDangerTitle;
        resultRule.textContent = dict.checkerResultDangerRule;
        resultCard.style.display = 'block';
      } else if (hasCaution) {
        resultCard.className = 'checker-result-card caution';
        resultTitle.textContent = dict.checkerResultCautionTitle;
        resultRule.textContent = dict.checkerResultCautionRule;
        resultCard.style.display = 'block';
      } else {
        resultCard.className = 'checker-result-card safe';
        resultTitle.textContent = dict.checkerResultSafeTitle;
        resultRule.textContent = dict.checkerResultSafeRule;
        resultCard.style.display = 'block';
      }
    }
  }

  /* ==========================================================================
     Interactive Scam Quiz (on problems.html)
     ========================================================================== */
  function initQuiz() {
    const quizOpt1 = document.getElementById('quizOpt1');
    const quizOpt2 = document.getElementById('quizOpt2');
    const feedbackBox = document.getElementById('quizFeedback');

    if (!quizOpt1 || !quizOpt2 || !feedbackBox) return;

    quizOpt1.addEventListener('click', () => {
      feedbackBox.className = 'quiz-feedback error';
      const dict = translations[currentLang || DEFAULT_LANG];
      feedbackBox.textContent = dict.quizFeedbackWrong || 'Danger! Never click unknown links.';
      feedbackBox.style.display = 'block';
    });

    quizOpt2.addEventListener('click', () => {
      feedbackBox.className = 'quiz-feedback success';
      const dict = translations[currentLang || DEFAULT_LANG];
      feedbackBox.textContent = dict.quizFeedbackCorrect || 'Correct! Official banking happens only through verified channels.';
      feedbackBox.style.display = 'block';
    });
  }

  /* ==========================================================================
     Cyber Safety Pledge & Badge Generator (on solutions.html)
     ========================================================================== */
  function formatBadgeDate(badgeDateEl) {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const locale = currentLang === 'hi' ? 'hi-IN' : currentLang === 'mr' ? 'mr-IN' : 'en-IN';
    try {
      badgeDateEl.textContent = now.toLocaleDateString(locale, options);
    } catch (e) {
      badgeDateEl.textContent = now.toISOString().split('T')[0];
    }
  }

  function initPledge() {
    const pledgeForm = document.getElementById('pledgeForm');
    const badgeResult = document.getElementById('badgeResult');
    const badgeRecipient = document.getElementById('badgeRecipient');
    const badgeDate = document.getElementById('badgeDate');

    if (!pledgeForm || !badgeResult) return;

    pledgeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('pledgeName');
      const name = (nameInput && nameInput.value.trim()) || 'Citizen of India';

      if (badgeRecipient) {
        badgeRecipient.textContent = name;
      }

      if (badgeDate) {
        badgeDate.setAttribute('data-raw-date', 'true');
        formatBadgeDate(badgeDate);
      }

      badgeResult.classList.add('active');
      badgeResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  /* ==========================================================================
     Document Ready Initialization
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();

    const langToUse = currentLang || DEFAULT_LANG;
    applyLanguage(langToUse);

    initLanguageModal();
    initMobileMenu();
    initSOSModal();
    initScamChecker();
    initQuiz();
    initPledge();
  });
})();
