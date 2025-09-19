const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Ask a question to the user and return the answer
 * @param {string} question - The question to ask
 * @returns {Promise<string>} - The user's answer (lowercase, trimmed)
 */
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.toLowerCase().trim());
    });
  });
}

/**
 * Close the readline interface
 */
function closeInterface() {
  rl.close();
}

/**
 * Display the application header
 */
function displayHeader() {
  console.log('🏆 Holland Football Club Scraper');
  console.log('=====================================\n');
}

/**
 * Display configuration summary
 * @param {Object} options - Configuration options
 */
function displayConfiguration(options) {
  console.log('\n🔧 Configuration:');
  console.log(`   Dry run: ${options.dryRun ? '✅' : '❌'}`);
  console.log(`   Download images: ${options.downloadImages ? '✅' : '❌'}`);
  console.log(`   Save JSON: ${options.saveJson ? '✅' : '❌'}`);
}

/**
 * Display scraping statistics
 * @param {number} totalClubs - Total number of clubs scraped
 * @param {number} totalDuration - Total duration in seconds
 */
function displayStats(totalClubs, totalDuration) {
  console.log(`\n🎉 Scraping completed!`);
  console.log(`📈 Total clubs scraped: ${totalClubs}`);
  console.log(`⏱️  Total duration: ${totalDuration}s`);
  console.log(`⚡ Average time per club: ${(totalDuration / totalClubs).toFixed(2)}s`);
}

/**
 * Log progress for a specific letter
 * @param {string} letter - Current letter being scraped
 * @param {string} url - URL being scraped
 * @param {number} clubCount - Number of clubs found
 */
function logLetterProgress(letter, url, clubCount) {
  console.log(`\n🔍 Scraping letter "${letter.toUpperCase()}": ${url}`);
  if (clubCount !== undefined) {
    console.log(`   Found ${clubCount} clubs for letter "${letter.toUpperCase()}"`);
  }
}

/**
 * Log club processing progress
 * @param {number} current - Current club index
 * @param {number} total - Total clubs for this letter
 * @param {string} clubName - Name of the club being processed
 */
function logClubProgress(current, total, clubName) {
  console.log(`   Processing club ${current}/${total}: ${clubName}`);
}

/**
 * Log download result
 * @param {boolean} success - Whether download was successful
 * @param {string} filename - Name of the file
 * @param {boolean} skipped - Whether download was skipped
 */
function logDownload(success, filename, skipped = false) {
  if (skipped) {
    console.log(`     ⏭️  Skipped download (disabled): ${filename}`);
  } else if (success) {
    console.log(`     ✅ Downloaded: ${filename}`);
  } else {
    console.log(`     ❌ Failed to download: ${filename}`);
  }
}

/**
 * Log letter completion
 * @param {string} letter - Letter that was completed
 * @param {number} duration - Duration in seconds
 */
function logLetterComplete(letter, duration) {
  console.log(`   ✅ Completed letter "${letter.toUpperCase()}" in ${duration}s`);
}

/**
 * Log error messages
 * @param {string} message - Error message
 * @param {Error} error - Error object (optional)
 */
function logError(message, error = null) {
  console.error(`❌ ${message}`);
  if (error) {
    console.error(`   Error details: ${error.message}`);
  }
}

/**
 * Log warning messages
 * @param {string} message - Warning message
 */
function logWarning(message) {
  console.log(`⚠️  ${message}`);
}

module.exports = {
  askQuestion,
  closeInterface,
  displayHeader,
  displayConfiguration,
  displayStats,
  logLetterProgress,
  logClubProgress,
  logDownload,
  logLetterComplete,
  logError,
  logWarning
};