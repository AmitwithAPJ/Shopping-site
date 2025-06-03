/**
 * Cross-platform build script
 * 
 * This script sets environment variables for the build process
 * and runs the necessary commands to build the application.
 */

const { execSync } = require('child_process');

// Set environment variables for the build
process.env.REACT_APP_NODE_ENV = 'production';

console.log('🚀 Starting build process...');

try {
  // Install dependencies for the main project
  console.log('📦 Installing main project dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  // Install dependencies and build frontend
  console.log('📦 Installing frontend dependencies...');
  execSync('cd frontend && npm install', { stdio: 'inherit' });
  
  console.log('🔨 Building frontend...');
  execSync('cd frontend && npm run build', { 
    stdio: 'inherit',
    env: { 
      ...process.env, 
      REACT_APP_NODE_ENV: 'production' 
    }
  });
  
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} 