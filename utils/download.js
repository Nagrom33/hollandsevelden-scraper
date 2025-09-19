const fs = require('fs');
const https = require('https');
const path = require('path');

/**
 * Download an image from URL to destination
 * @param {string} url - Image URL
 * @param {string} dest - Destination file path
 * @returns {Promise<void>}
 */
async function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        file.close();
        fs.unlink(dest, () => {});
        return reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
      }
      response.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', (err) => {
      file.close();
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

/**
 * Create directory if it doesn't exist
 * @param {string} dirPath - Directory path
 */
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created directory: ${dirPath}`);
  }
}

/**
 * Get filename from URL
 * @param {string} url - Image URL
 * @returns {string} - Filename
 */
function getFilenameFromUrl(url) {
  return path.basename(url.split('?')[0]);
}

/**
 * Save JSON data to file
 * @param {Object} data - Data to save
 * @param {string} filename - Output filename
 */
function saveJsonFile(data, filename) {
  fs.writeFileSync(filename, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`💾 Results saved to ${filename}`);
}

module.exports = {
  downloadImage,
  ensureDirectoryExists,
  getFilenameFromUrl,
  saveJsonFile
};