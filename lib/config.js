const { askQuestion, displayConfiguration } = require('../utils/console');

/**
 * Get user configuration through interactive prompts
 * @returns {Promise<Object>} - Configuration options
 */
async function getUserConfiguration() {
  // Ask for user preferences
  const dryRunAnswer = await askQuestion('🧪 Run in dry mode (only scrape letter A)? (y/n): ');
  const downloadAnswer = await askQuestion('📥 Download club logo images? (y/n): ');
  const saveJsonAnswer = await askQuestion('💾 Save results as JSON file? (y/n): ');
  
  const options = {
    dryRun: dryRunAnswer === 'y' || dryRunAnswer === 'yes',
    downloadImages: downloadAnswer === 'y' || downloadAnswer === 'yes',
    saveJson: saveJsonAnswer === 'y' || saveJsonAnswer === 'yes'
  };
  
  displayConfiguration(options);
  
  return options;
}

/**
 * Get default configuration (for programmatic use)
 * @param {Object} overrides - Configuration overrides
 * @returns {Object} - Configuration options
 */
function getDefaultConfiguration(overrides = {}) {
  const defaultOptions = {
    dryRun: false,
    downloadImages: true,
    saveJson: true
  };
  
  return { ...defaultOptions, ...overrides };
}

/**
 * Validate configuration options
 * @param {Object} options - Configuration options
 * @returns {boolean} - Whether configuration is valid
 */
function validateConfiguration(options) {
  const requiredKeys = ['dryRun', 'downloadImages', 'saveJson'];
  
  for (const key of requiredKeys) {
    if (typeof options[key] !== 'boolean') {
      console.error(`❌ Invalid configuration: ${key} must be a boolean`);
      return false;
    }
  }
  
  return true;
}

module.exports = {
  getUserConfiguration,
  getDefaultConfiguration,
  validateConfiguration
};