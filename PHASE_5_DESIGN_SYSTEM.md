# Phase 5: Visual Design System & Tokens
**Project Title:** Dear Diary – The Multimodal Memory Archive  
**Creative Lead:** Laya (Fashion Communication, NIFT Hyderabad)  
**Deliverable:** Aesthetic Tokens, The 5 Palettes, Torn Letter Specs, & Sensory Microcopy  

---

## 1. Locked Visual Themes & Moodboard Placeholders

| Theme Name | Status | Mood & Aesthetic Intent | Canvas Background (`--bg`) | Ink Color (`--ink`) | Lines / Grid (`--rule`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Classic Paper** | **LOCKED** | Warm analog stationery, antique paper grain | `#FDFBF7` (Alabaster cream) | `#2C2523` (Sepia espresso) | `rgba(44, 37, 35, 0.12)` |
| **2. Diary / Ink Pen** | **LOCKED** | Traditional ruled journal, fountain pen ink intimacy | `#FFFDF9` (Ivory parchment) | `#1A2436` (Deep fountain pen indigo/noir) | `rgba(26, 36, 54, 0.14)` |
| **3. Upcoming Palettes** | **PENDING** | *Awaiting Creative Director's Moodboard* | TBD via Moodboard | TBD via Moodboard | TBD via Moodboard |

---

## 2. Typography Hierarchy & Authentic Handwriting Stacks

- **Title & Header Font:** `'Playfair Display', 'Cinzel', serif` (Editorial elegance, timeless bookbindery).
- **Body & Speech Transcript:** `'Lora', 'Crimson Pro', Georgia, serif` (Readable literary book serif).
- **Authentic Handwriting Font Stacks (By Language - 100% Free & Open Source):**
  - **English:** `'Caveat', 'Patrick Hand', cursive` (Natural student ballpoint cursive).
  - **Malayalam:** `'Chilanka', cursive` (Beloved open-source Malayalam handwriting font; real ballpoint script).
  - **Hindi:** `'Kalam', cursive` (Natural Devanagari handwriting script).
- **Polaroid Chin Captions & Notes:** Dedicated handwriting stack matching selected language.
- **UI Labels & Tags:** `'Inter', -apple-system, sans-serif` (Crisp, modern, uncluttered).

---

## 3. The Scrapbook Artifacts: Clippings & Scraps

### 3A. "Something Directly from the Page" (Physical Paper Scrap Insert)
- **Concept:** For users who want their literal hand-ink on the page without AI or digital distortion.
- **Interaction:**
  1. The user writes a note, sketch, quote, or poem with a real pen on a small scrap of physical paper (napkin, sticky note, notebook tear).
  2. Tap **"📷 Something from the Page"** to snap a quick photo.
  3. The app auto-compresses the image and pins it directly onto that day's journal canvas with simulated **washi tape and soft elevation shadows**.
  4. Stored permanently as part of that day's encrypted entry.

### 3B. The "Torn Letter" & Clipping Specification
- **Privacy Quarantine Rule:** Total cryptographic isolation. The export engine extracts *only* the user-typed letter and the explicitly checked snippet string. No database references, keys, or sibling entries are bundled.
- **Visual Texture Tokens:**
  - `border-top: 3px dashed var(--accent);` (Simulated perforated torn edge).
  - Box shadow: `0 8px 24px rgba(0, 0, 0, 0.08)` (Tactile elevated paper feel).
  - Clipping Box: Kraft paper background `#F4EDE2` with simulated washi tape corner.
- **Export Formats:**
  1. **Visual Card (PNG/PDF):** Formatted for direct sharing on WhatsApp / Instagram Story / DM.
  2. **Interactive Envelope (`.letter`):** JSON package with MIME-type `application/dear-diary` that can be imported directly into the friend's app.

---

## 4. Sensory Microcopy & Welcoming Ritual
- **Lock Screen Greeting:** *"A quiet sanctuary for your voice."*
- **Recording In Progress:** *"Listening in [Language]... Speak your day freely."*
- **Post-Transcription Prompt:** *"Your words are safe on this page. Tap any word to refine, or add photos."*
- **Letter Sharing Gate:** *"Only this torn letter will be sent. The rest of your diary remains locked and private."*

### 4B. Locked Conversational Manifestation Whispers (Zomato-Style)
*The "Zero-Leakage / Discreet Glance" Privacy Rule:*
- **Strictly Blind to Personal Data:** Notifications must NEVER display the user's name, diary excerpts, specific goals, or personal details. 
- **Outsider Perception:** To anyone glancing at your lock screen (roommates, metro commuters, family), the notification looks like an aesthetic, thoughtful, abstract quote.
- **Insider Meaning:** To the user, it immediately triggers the memory of their private manifestation and motivates action.

*The 3 Locked Whispers:*
1. **The Playful Reality Check:**  
   *"Quick question before you sleep... did today look like the life you've been manifesting, or are we hitting reset tomorrow morning?"*
2. **The Reassurance:**  
   *"Just checking in on you. That goal you wrote down a few weeks ago? It hasn't forgotten you either. One small step at a time."*
3. **The Late-Night Quiet Moment:**  
   *"The world is quiet right now. Close your eyes for 5 seconds and picture that version of you who already achieved what you wrote. She's waiting for you 🌙"*

### 4C. Notification Deep-Link & Granular Re-Authentication Flow
*Privacy Principle: Zero Unintended Exposure.*
1. **Notification Tap:** Tapping the notification opens directly to the **Manifestations Overview** list.
2. **Obfuscated List View:** Displays manifestation cards by target date (e.g., *Manifestation #1 • Target: Dec 2026*), but the intimate content remains masked/blurred.
3. **Secondary Biometric / Passcode Gate:** Tapping an individual card triggers an immediate **Fingerprint / Face ID / Passcode prompt**.
4. **Unveiled Manifestation:** Only upon verified biometric/PIN authorization does the card smoothly unfold to reveal the private written notes, dates, and minimized vision photos.

### 4D. "Fading Voice" Nudge & Pin/Star Preservation Flow
*Concept: Preventing storage bloat while guaranteeing zero accidental memory loss.*
- **The Lifecycle:** Normal audio recordings stay available for review (1 to 3 months). The permanent written text and photos NEVER disappear.
- **The Conversational "Fading Voice" Nudge (Zomato-Style):**  
  > *"Some whispers from last month are fading into the quiet tonight... Want to listen one last time, or pin the ones you love? 🎧"*  
  *(Zero personal data shown; 100% discreet on lock screen).*
- **The "Pin / Star to Keep" Action:**
  - **At Recording Time:** Right after speaking, an explicit `[ 📌 Pin Voice / ⭐ Star ]` button lets you mark the day as historic (e.g., buying a car).
  - **During Review Period:** Tapping `[ 📌 Pin Voice ]` anytime locks the audio permanently into the encrypted vault.
  - **Unpinned Audio:** Automatically dissolves cleanly into text at the end of the window to keep phone storage free!

---

## 5. Phase 5 Sign-Off & Stage Gate Checklist
- [x] Classic Paper and Diary/Ink Pen themes locked (additional palettes pending Moodboard).
- [x] Typography pairings defined for editorial, transcript, and handwritten captions.
- [x] "Torn Letter / WhatsApp Keepsake" component specified with Privacy Quarantine.
- [ ] **Awaiting Creative Director's Moodboard before Phase 6 Prototyping.**
