const { scrapeClubs } = require('./lib/scraper');
const { getUserConfiguration, validateConfiguration } = require('./lib/config');
const { saveJsonFile } = require('./utils/download');
const { displayHeader, closeInterface, logError } = require('./utils/console');

/**
 * Main application function
 */
async function main() {
  try {
    // Display application header
    displayHeader();
    
    // Get user configuration
    const options = await getUserConfiguration();
    
    // Validate configuration
    if (!validateConfiguration(options)) {
      process.exit(1);
    }
    
    // Run the scraper
    const clubs = await scrapeClubs(options);
    
    // Save results if requested
    if (options.saveJson) {
      const filename = options.dryRun ? 'clubs_dry_run.json' : 'clubs.json';
      saveJsonFile(clubs, filename);
    } else {
      console.log('⏭️  Skipped saving JSON file');
      console.log(`📊 Found ${clubs.length} clubs total`);
    }
    
  } catch (error) {
    logError('Error during scraping:', error);
    process.exit(1);
  } finally {
    closeInterface();
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Received interrupt signal, shutting down gracefully...');
  closeInterface();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received termination signal, shutting down gracefully...');
  closeInterface();
  process.exit(0);
});

// Run the application
if (require.main === module) {
  main().catch((error) => {
    logError('Unhandled error:', error);
    closeInterface();
    process.exit(1);
  });
}

module.exports = { main };