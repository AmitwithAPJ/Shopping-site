/**
 * Deployment Helper Script
 * 
 * This script helps verify that your project is ready for deployment.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Check if MongoDB URI is set
function checkMongoDBURI() {
  try {
    const envPath = path.join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      if (!envContent.includes('MONGODB_URI=')) {
        console.error('⚠️ Warning: MONGODB_URI is not set in .env file');
        return false;
      }
      return true;
    } else {
      console.error('⚠️ Warning: .env file not found');
      return false;
    }
  } catch (error) {
    console.error('Error checking MongoDB URI:', error);
    return false;
  }
}

// Check if package.json has the required scripts
function checkPackageJson() {
  try {
    const packageJsonPath = path.join(__dirname, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    const requiredScripts = ['build', 'start', 'render-build'];
    const missingScripts = requiredScripts.filter(script => !packageJson.scripts[script]);
    
    if (missingScripts.length > 0) {
      console.error(`⚠️ Warning: Missing required scripts in package.json: ${missingScripts.join(', ')}`);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking package.json:', error);
    return false;
  }
}

// Check if frontend build script works
function checkFrontendBuild() {
  try {
    console.log('📦 Checking if frontend build works...');
    execSync('cd frontend && npm run build', { stdio: 'inherit' });
    console.log('✅ Frontend build successful!');
    return true;
  } catch (error) {
    console.error('❌ Frontend build failed:', error.message);
    return false;
  }
}

// Main function
function main() {
  console.log('🚀 Checking deployment readiness...');
  
  let readiness = true;
  
  // Check MongoDB URI
  if (!checkMongoDBURI()) {
    readiness = false;
    console.log(`
To fix MongoDB URI issue:
1. Create a .env file in the root directory
2. Add MONGODB_URI=your_mongodb_connection_string
3. Make sure you have a MongoDB Atlas account and cluster set up
`);
  }
  
  // Check package.json
  if (!checkPackageJson()) {
    readiness = false;
    console.log(`
To fix package.json scripts:
1. Make sure your package.json has the following scripts:
   - "build": "npm install && cd frontend && npm install && npm run build"
   - "start": "node backend/index.js"
   - "render-build": "npm run build"
`);
  }
  
  // Final verdict
  if (readiness) {
    console.log(`
✅ Your project is ready for deployment!

Next steps:
1. Push your code to GitHub
2. Follow the instructions in DEPLOYMENT.md to deploy to Render
3. Set up your environment variables in the Render dashboard
`);
  } else {
    console.log(`
❌ Your project needs some adjustments before deployment.
Please fix the issues mentioned above and run this script again.
`);
  }
}

// Run the main function
main(); 