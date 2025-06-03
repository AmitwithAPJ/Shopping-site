/**
 * Build Verification Script
 * 
 * This script checks if the frontend build files exist and logs their location.
 */

const fs = require('fs');
const path = require('path');

// Possible build paths
const buildPaths = [
  path.join(__dirname, 'frontend/build'),
  path.join(__dirname, 'frontend/dist'),
  path.join(__dirname, 'build'),
  path.join(__dirname, 'dist')
];

console.log('🔍 Checking for build files...');

// Check each path
buildPaths.forEach(buildPath => {
  try {
    if (fs.existsSync(buildPath)) {
      console.log(`✅ Found build directory at: ${buildPath}`);
      
      // Check for index.html
      const indexPath = path.join(buildPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        console.log(`✅ Found index.html at: ${indexPath}`);
      } else {
        console.log(`❌ index.html not found in ${buildPath}`);
      }
      
      // List files in the build directory
      console.log('\nFiles in build directory:');
      const files = fs.readdirSync(buildPath);
      files.forEach(file => {
        const filePath = path.join(buildPath, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
          console.log(`📁 ${file}/`);
        } else {
          console.log(`📄 ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
        }
      });
    } else {
      console.log(`❌ Build directory not found at: ${buildPath}`);
    }
  } catch (error) {
    console.error(`Error checking ${buildPath}:`, error.message);
  }
});

// Check environment variables
console.log('\n🔍 Checking environment variables...');
const envVars = [
  'NODE_ENV',
  'PORT',
  'MONGODB_URI',
  'FRONTEND_URL'
];

envVars.forEach(varName => {
  if (process.env[varName]) {
    console.log(`✅ ${varName} is set to: ${varName === 'MONGODB_URI' ? '[HIDDEN]' : process.env[varName]}`);
  } else {
    console.log(`❌ ${varName} is not set`);
  }
});

console.log('\n📋 Deployment checklist:');
console.log('1. Make sure your MongoDB connection string is correct');
console.log('2. Verify that the frontend build files exist');
console.log('3. Ensure NODE_ENV is set to "production" in Render');
console.log('4. Check that the build command is running correctly');
console.log('5. Review the Render logs for any errors');

console.log('\n💡 Tip: Add this script to your package.json:');
console.log('"verify-build": "node verify-build.js"'); 