const puppeteer = require('puppeteer');
const path = require('path');
const { downloadImage, ensureDirectoryExists, getFilenameFromUrl } = require('../utils/download');
const { 
  logLetterProgress, 
  logClubProgress, 
  logDownload, 
  logLetterComplete, 
  displayStats, 
  logWarning 
} = require('../utils/console');

/**
 * Scrape club data from a single list item
 * @param {Array} lis - Array of list item elements
 * @returns {Array} - Array of club objects
 */
function extractClubsFromPage(lis) {
  return lis.map((li) => {
    const img = li.querySelector('img');
    const aTags = li.querySelectorAll('a');
    if (!img || aTags.length < 2) return null;
    
    const logoUrl = 'https://www.hollandsevelden.nl/' + img.getAttribute('src');
    const logoAlt = img.getAttribute('alt').replace('Clublogo voetbalvereniging ', '').trim();
    const clubName = aTags[1].textContent.trim();
    const clubLink = 'https://www.hollandsevelden.nl/' + aTags[1].getAttribute('href');
    
    return { logoUrl, logoAlt, clubName, clubLink };
  }).filter(Boolean);
}

/**
 * Get club details from the club's individual page
 * @param {Object} page - Puppeteer page object
 * @param {Object} club - Club object
 * @param {Object} options - Scraping options
 * @returns {Object} - Enhanced club object
 */
async function getClubDetails(page, club, options) {
  try {
    await page.goto(club.clubLink, { waitUntil: 'domcontentloaded' });
    
    // Get the big logo from picture > img.img-fluid
    try {
      const bigLogoUrl = await page.$eval('picture img.img-fluid', img => img.getAttribute('src'));
      club.bigLogoUrl = bigLogoUrl ? (bigLogoUrl.startsWith('http') ? bigLogoUrl : 'https://www.hollandsevelden.nl' + bigLogoUrl) : null;
    } catch (e) {
      club.bigLogoUrl = null;
    }
    
    // Get the shirt image from .card-body address img
    try {
      const shirtImgUrl = await page.$eval('.card-body address img', img => img.getAttribute('src'));
      club.shirtImgUrl = shirtImgUrl ? (shirtImgUrl.startsWith('http') ? shirtImgUrl : shirtImgUrl) : null;
    } catch (e) {
      club.shirtImgUrl = null;
    }
    
    // Download bigLogoUrl if available and option is enabled
    if (club.bigLogoUrl && options.downloadImages) {
      const bigLogoFile = getFilenameFromUrl(club.bigLogoUrl);
      const bigLogoPath = path.join(__dirname, '..', 'logos', 'big', bigLogoFile);
      try {
        await downloadImage(club.bigLogoUrl, bigLogoPath);
        club.bigLogoFile = path.relative(path.join(__dirname, '..'), bigLogoPath);
        logDownload(true, bigLogoFile);
      } catch (err) {
        club.bigLogoFile = null;
        logDownload(false, bigLogoFile);
      }
    } else {
      club.bigLogoFile = null;
      if (club.bigLogoUrl && !options.downloadImages) {
        logDownload(false, getFilenameFromUrl(club.bigLogoUrl), true);
      }
    }
    
  } catch (e) {
    logWarning(`Error processing club ${club.clubName}: ${e.message}`);
    club.bigLogoUrl = null;
    club.shirtImgUrl = null;
    club.bigLogoFile = null;
  }
  
  return club;
}

/**
 * Main scraping function
 * @param {Object} options - Scraping options
 * @returns {Array} - Array of club objects
 */
async function scrapeClubs(options = {}) {
  const startTime = Date.now();
  let totalClubs = 0;
  
  // Configure alphabet based on dry run option
  let alphabet;
  if (options.dryRun) {
    alphabet = ['a']; // Only scrape 'A' for dry run
    console.log('🧪 DRY RUN MODE: Only scraping clubs starting with "A"');
  } else {
    alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    console.log('🚀 FULL SCRAPE MODE: Scraping all clubs A-Z');
  }
  
  const baseUrl = 'https://www.hollandsevelden.nl/clubs/';
  const results = [];
  
  // Create logos/big directory if downloading images
  if (options.downloadImages) {
    const bigLogoDir = path.join(__dirname, '..', 'logos', 'big');
    ensureDirectoryExists(bigLogoDir);
  }
  
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  console.log(`\n📊 Starting scrape of ${alphabet.length} letter(s)...`);
  
  for (const letter of alphabet) {
    const letterStartTime = Date.now();
    const url = `${baseUrl}${letter}/`;
    
    logLetterProgress(letter, url);
    
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    
    const clubs = await page.$$eval('li', extractClubsFromPage);
    
    logLetterProgress(letter, url, clubs.length);
    totalClubs += clubs.length;
    
    // Process each club
    for (let i = 0; i < clubs.length; i++) {
      const club = clubs[i];
      logClubProgress(i + 1, clubs.length, club.clubName);
      
      const enhancedClub = await getClubDetails(page, club, options);
      results.push(enhancedClub);
    }
    
    const letterDuration = ((Date.now() - letterStartTime) / 1000).toFixed(2);
    logLetterComplete(letter, letterDuration);
  }
  
  await browser.close();
  
  const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);
  displayStats(totalClubs, totalDuration);
  
  return results;
}

module.exports = {
  scrapeClubs
};