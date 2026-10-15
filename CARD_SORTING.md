# Card Sorting Study: Information Architecture for "Dear Diary"
**Lead Researcher & Creative Director:** Laya (Fashion Communication, NIFT Hyderabad)  
**Method:** Hybrid Card Sorting (30 Cards, 5 Architectural Buckets)  
**Objective:** Validate mental models and screen navigation for a multimodal voice-first journal.  

---

## 1. Study Overview & Methodology
Card sorting was conducted to determine how users naturally categorize 30 core features spanning security, multilingual voice dictation, analog scrapbooking, friend keepsakes, and future manifestations.

---

## 2. The 30-Card Master Inventory

| Card ID | Feature Card Name | Core Functionality |
| :--- | :--- | :--- |
| **C-01** | `4-Digit Passcode Pad` | Numeric keypad to lock/unlock private vault |
| **C-02** | `Biometric Unlock` | Fingerprint / Face ID quick access |
| **C-03** | `Passcode Hint` | Self-written memory clue if passcode is forgotten |
| **C-04** | `Emergency Vault Reset` | "Erase and Start Fresh" if permanently locked |
| **C-05** | `Language Switcher Pill` | 1-tap toggle between Malayalam, Hindi, and English |
| **C-06** | `One-Tap Voice Record` | Tap mic to dictate day's story |
| **C-07** | `Live Mirror Transcript` | Voice transcribes in native script onto paper lines |
| **C-08** | `Inline Keyboard Tap-to-Edit` | Tap any word to refine or type manually |
| **C-09** | `Paper Texture Styles` | Toggle between Lined, Grid, Dotted, and Plain |
| **C-10** | `Classic Paper Theme` | Warm alabaster cream stationery with sepia ink |
| **C-11** | `Diary / Ink Pen Theme` | Ruled notebook with deep fountain pen indigo ink |
| **C-12** | `Something From the Page` | Upload photo of real handwritten paper scrap with washi tape |
| **C-13** | `Polaroid Photo with Caption` | White-bordered photo with handwritten chin caption |
| **C-14** | `Multi-Page Pagination` | Expand today's entry from Page 1 up to Page 5 |
| **C-15** | `Keyword Tagging` | Add search chips like `#firstcar`, `#nift`, `#jury` |
| **C-16** | `Milestone Star (🌟)` | Mark historic life events to preserve voice forever |
| **C-17** | `Calendar Month View` | Month grid showing entry dots (📖) and events (🎉) |
| **C-18** | `Yearly Reminders` | "Note this day as..." (e.g. Amma's Birthday) |
| **C-19** | `Episodic Search Bar` | Full-text query (*"first car"*, *"monsoon"*) |
| **C-20** | `Temporal Time Filter` | Filter search by [This Month], [2026], [All Time] |
| **C-21** | `Tear a Page` | Write a dedicated keepsake letter to a friend |
| **C-22** | `Memory Clipping Selector` | Highlight & quote a past diary sentence into a letter |
| **C-23** | `WhatsApp / Insta Share` | Export sealed letter card directly to friend's chat |
| **C-24** | `1-Year Vision Board` | Profile collage of annual intentions and moodboard images |
| **C-25** | `3-Month Manifestation Note` | Written future intention with target unlock date |
| **C-26** | `Discreet Zomato Whispers` | Conversational mindfulness notifications on lock screen |
| **C-27** | `Granular Biometric Gate` | Require fingerprint before opening specific manifestation |
| **C-28** | `30-Day Voice Capsule` | Audio stays available to re-listen for 1 month |
| **C-29** | `Pin / Star Voice` | Save emotional voice note permanently into vault |
| **C-30** | `Encrypted Backup File` | Download/Import `.diaryvault` file for safe backup |

---

## 3. Clustered Information Architecture (5 Core Spaces)

```mermaid
graph TD
    subgraph 1. The Sanctuary Gate
        C-01["C-01: Passcode Pad"]
        C-02["C-02: Biometric Unlock"]
        C-03["C-03: Passcode Hint"]
        C-04["C-04: Emergency Reset"]
    end

    subgraph 2. The Studio Canvas (Create & Edit)
        C-05["C-05: Language Pill"]
        C-06["C-06: Voice Record"]
        C-07["C-07: Mirror Transcript"]
        C-08["C-08: Inline Edit"]
        C-09["C-09: Paper Styles"]
        C-12["C-12: Something from Page"]
        C-13["C-13: Polaroid & Caption"]
        C-14["C-14: Pages 1 to 5"]
        C-15["C-15: Keyword Tags"]
        C-16["C-16: Milestone Star"]
        C-29["C-29: Pin Voice Forever"]
    end

    subgraph 3. The Memory Archive (Home & Search)
        C-17["C-17: Calendar Month (📖 / 🎉)"]
        C-18["C-18: Yearly Reminders (Amma)"]
        C-19["C-19: Episodic Search"]
        C-20["C-20: Time Filter Pills"]
        C-28["C-28: 30-Day Voice Capsule"]
    end

    subgraph 4. The Postbox (Friend Keepsakes)
        C-21["C-21: Tear a Page"]
        C-22["C-22: Memory Clipping"]
        C-23["C-23: WhatsApp/Insta Share"]
    end

    subgraph 5. The Vision Atelier & Settings
        C-24["C-24: 1-Year Vision Board"]
        C-25["C-25: 3-Month Manifestation"]
        C-26["C-26: Zomato Whispers"]
        C-27["C-27: Biometric Gate"]
        C-10["C-10: Paper Theme"]
        C-11["C-11: Ink Pen Theme"]
        C-30["C-30: Encrypted Backup"]
    end
```

---

## 4. Architectural Synthesis & Insights
1. **Separation of Intimacy:** Users cleanly separate retrospective memories (The Memory Archive) from prospective dreams (The Vision Atelier).
2. **Quarantined Sharing:** "The Postbox" (Tear a Page) lives in its own dedicated drawer, ensuring users never feel anxious about accidental diary leaks.
3. **Frictionless Daily Canvas:** The Studio Canvas consolidates voice dictation, Polaroid pasting, and paper scrap insertions into a single distraction-free creative session.
