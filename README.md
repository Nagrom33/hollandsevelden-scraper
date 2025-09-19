Holland Football Club Scraper

A Node.js web scraper for extracting football club information from hollandsevelden.nl using Puppeteer.
📁 Project Structure

```
holland-club-scraper/
├── index.js              # Main application entry point
├── package.json          # Project dependencies and scripts
├── README.md             # Project documentation
├── lib/                  # Core application logic
│   ├── scraper.js        # Main scraping functionality
│   └── config.js         # Configuration management
├── utils/                # Utility functions
│   ├── console.js        # Console logging utilities
│   └── download.js       # Download and file utilities
└── logos/                # Downloaded images (created automatically)
    └── big/              # High-resolution club logos
```

🚀 Features

    Interactive Configuration: Choose scraping options through console prompts
    Dry Run Mode: Test scraping with only letter "A" clubs
    Image Downloads: Optionally download high-resolution club logos
    Progress Tracking: Real-time progress updates and duration logging
    Modular Design: Clean separation of concerns with utility modules
    Error Handling: Robust error handling and graceful shutdowns
    JSON Export: Save results to structured JSON files

📦 Installation

    Clone or download the project files
    Install dependencies:

bash

npm install

🏃‍♂️ Usage
Interactive Mode (Recommended)

Run the scraper with interactive prompts:
bash

npm start

The application will ask you:

    🧪 Run in dry mode (only scrape letter A)? (y/n)
    📥 Download club logo images? (y/n)
    💾 Save results as JSON file? (y/n)

Programmatic Usage

You can also use the scraper programmatically:


```javascript
const { scrapeClubs } = require('./lib/scraper');
const { getDefaultConfiguration } = require('./lib/config');

async function customScrape() {
  const options = getDefaultConfiguration({
    dryRun: true,
    downloadImages: false,
    saveJson: true
  });
  
  const clubs = await scrapeClubs(options);
  console.log(`Found ${clubs.length} clubs`);
}

customScrape().catch(console.error);
```

⚙️ Configuration Options

Option	Type	Default	Description
dryRun	boolean	false	Only scrape clubs starting with "A"
downloadImages	boolean	true	Download high-resolution club logos
saveJson	boolean	true	Save results to JSON file

📊 Output
Club Data Structure

Each club object contains:
```javascript

{
  "logoUrl": "https://www.hollandsevelden.nl/path/to/small-logo.jpg",
  "logoAlt": "Club Name Logo",
  "clubName": "Club Name",
  "clubLink": "https://www.hollandsevelden.nl/club/club-name/",
  "bigLogoUrl": "https://www.hollandsevelden.nl/path/to/big-logo.jpg",
  "shirtImgUrl": "path/to/shirt-image.jpg",
  "bigLogoFile": "logos/big/club-logo.jpg"
}
```

Files Created

    clubs.json - Full scraping results
    clubs_dry_run.json - Dry run results (letter A only)
    logos/big/ - Downloaded high-resolution logos (if enabled)

🔧 Development
Adding New Features

    Scraping Logic: Modify lib/scraper.js
    Console Utilities: Add functions to utils/console.js
    File Operations: Extend utils/download.js
    Configuration: Update lib/config.js

Error Handling

The application includes comprehensive error handling:

    Network request failures
    Missing page elements
    File system errors
    Graceful shutdowns (Ctrl+C)

📈 Performance
Logging Features

    Real-time Progress: Shows current club being processed
    Duration Tracking: Per-letter and total scraping time
    Statistics: Total clubs scraped and average time per club
    Success/Failure Indicators: Visual feedback for downloads

Example Output

🏆 Holland Football Club Scraper
=====================================

🧪 Run in dry mode (only scrape letter A)? (y/n): n
📥 Download club logo images? (y/n): y
💾 Save results as JSON file? (y/n): y

🔧 Configuration:
   Dry run: ❌
   Download images: ✅
   Save JSON: ✅

🚀 FULL SCRAPE MODE: Scraping all clubs A-Z

📊 Starting scrape of 26 letter(s)...

🔍 Scraping letter "A": https://www.hollandsevelden.nl/clubs/a/
   Found 12 clubs for letter "A"
   Processing club 1/12: AFC Amsterdam
     ✅ Downloaded

