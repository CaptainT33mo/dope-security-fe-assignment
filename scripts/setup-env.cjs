#!/usr/bin/env node

/**
 * Script to set up environment variables
 * Copies the appropriate environment file based on the environment
 */

const fs = require('fs');
const path = require('path');

const envFiles = {
  development: 'env.development',
  production: 'env.production',
  example: 'env.example'
};

function setupEnvironment(env = 'development') {
  const sourceFile = envFiles[env];
  
  if (!sourceFile) {
    console.error(`❌ Unknown environment: ${env}`);
    console.log('Available environments:', Object.keys(envFiles).join(', '));
    process.exit(1);
  }

  const sourcePath = path.join(__dirname, '..', sourceFile);
  const targetPath = path.join(__dirname, '..', '.env.local');

  try {
    if (!fs.existsSync(sourcePath)) {
      console.error(`❌ Source file not found: ${sourcePath}`);
      process.exit(1);
    }

    // Copy the environment file
    fs.copyFileSync(sourcePath, targetPath);
    
    console.log(`✅ Environment setup complete!`);
    console.log(`📁 Copied ${sourceFile} to .env.local`);
    console.log(`🌍 Environment: ${env}`);
    
    // Show the contents
    const contents = fs.readFileSync(targetPath, 'utf8');
    console.log('\n📋 Environment variables:');
    console.log(contents);
    
  } catch (error) {
    console.error('❌ Error setting up environment:', error.message);
    process.exit(1);
  }
}

// Get environment from command line argument
const env = process.argv[2] || 'development';

console.log('🔧 Setting up environment variables...\n');
setupEnvironment(env);
