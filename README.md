# 🏡 Edge Property Scraper

A Microsoft Edge extension that captures property listing details from real estate pages, formats them into a structured TSV row, and copies the result to your clipboard.

---

## 🚀 Features

- Extracts property details (price, address, description, etc.) from the active webpage.
- Sends listing data to the OpenAI API to format into a **single TSV line**.
- Copies the formatted TSV data directly to your clipboard.
- Stores your **OpenAI API key** securely using `chrome.storage.sync`.

---

## 📦 Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/roosta255/edge-property-scraper.git
   ```

2. Open **Microsoft Edge** and navigate to:

   ```
   edge://extensions/
   ```

3. Enable **Developer mode** (toggle at the bottom left).

4. Click **Load unpacked** and select the `edge-property-scraper` project folder.

---

## 🔑 API Key Setup

1. Open the extension popup.
2. Enter your **OpenAI API Key**.
3. Click **Save**.  
   The key will be stored securely in `chrome.storage.sync`.

---

## 🖥️ Usage

1. Navigate to a property listing page.
2. Trigger the extension (via popup or hotkey).
3. The extension will:
   - Extract relevant data.
   - Call the OpenAI API.
   - Copy the generated **TSV row** to your clipboard.

---

## 📂 Project Structure

```
edge-property-scraper/
│
├── manifest.json         # Extension manifest file
├── background.js         # Background script for handling messages
├── content.js            # Content script for scraping listings
├── popup.html            # Extension popup UI
├── popup.js              # Popup logic (API key input, save, etc.)
└── README.md             # Project documentation
```

---

## ⚡ Tech Stack

- **Microsoft Edge Extension API** (`chrome.*` APIs supported in Edge)
- **JavaScript (ES6)**
- **OpenAI API**

---

## 📝 License

MIT License © 2025 [roosta255](https://github.com/roosta255)
