# Project Specification: "Dear Diary"
**Role:** Digital Journal & Multimodal Scrapbook  
**Author & Creative Lead:** Laya (Fashion Communication, NIFT Hyderabad)  
**Technical Architecture:** 100% Free, Local-First, Zero-AI, AES-256 Encrypted  
**Deployment Target:** Web Prototype (PWA / GitHub Pages) with Android Flutter Roadmap  

---

## 1. Core Vision & Feature Pillars

### A. Multilingual Voice-to-Text Capture
- **Speech Engine:** Browser Web Speech API (free, client-side recognition).
- **Supported Dialects:** Multilingual selection at launch (English, Hindi, Telugu, Tamil, Kannada, Malayalam, Marathi, Bengali, Spanish, French).
- **Fallback:** Always-available tactile typing interface.

### B. Paper & Scrapbook Aesthetics
- **Page Layouts:** Lined (ruled notebook), Grid (bullet journal), Dotted (sketching/layout), and Plain.
- **Media Attachments:** Polaroid-style framed photos with bottom-chin editable captions + document file chips (auto-compressed).
- **Themes & Palettes:** 5 editorial colorways:
  1. *Paper* (warm cream stationery)
  2. *Sky* (soft airy blue)
  3. *Blossom* (gentle blush rose)
  4. *Forest* (earthy sage green)
  5. *Midnight* (deep indigo noir)

### C. Sentimental Calendar & Recurring Milestones
- **Month Grid View:**
  - 📖 = Day with an active journal entry.
  - 🎉 = Celebratory milestone or reminder.
- **Yearly Milestones:** "Note this day as..." recurring reminders (e.g., *"Amma's Birthday"*, *"Housewarming"*, *"First day at NIFT"*).

### D. Zero-Knowledge Cryptographic Vault
- **Encryption:** AES-256 encryption via Web Crypto API.
- **Key Derivation:** PBKDF2 derived from user-selected passcode.
- **Auto-Lock:** Immediate lock upon page defocus or app switcher toggle.
- **Recovery Hierarchy:**
  1. Daily Biometric unlock (Fingerprint / Face ID via WebAuthn).
  2. Passcode hint (optional self-written memory clue).
  3. Encrypted export/import file backup.
  4. Emergency fallback: "Erase and Start Fresh" reset.

---

## 2. Technical Feasibility & Storage Budget
- **Storage Tier:** Client-side `LocalStorage` & `IndexedDB` (5 MB to 50 MB local envelope).
- **Photo Compression:** Automated client-side canvas resizing to ensure low storage footprint.
- **Zero Cost / Zero Cloud:** 100% free hosting via GitHub Pages; no external backend or recurring subscriptions.
