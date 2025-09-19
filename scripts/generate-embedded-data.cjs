#!/usr/bin/env node

/**
 * Script to generate embedded character data for Netlify Functions
 * This creates a JavaScript file with the character data embedded
 */

const fs = require('fs');
const path = require('path');

// Read the db.json file
const dbPath = path.join(__dirname, '..', 'db.json');
const outputPath = path.join(__dirname, '..', 'netlify', 'functions', 'characters-data.js');

try {
  if (!fs.existsSync(dbPath)) {
    console.error('❌ db.json not found. Run "npm run generate-data" first.');
    process.exit(1);
  }

  const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  
  // Create the embedded data file
  const embeddedData = `/**
 * Embedded character data for Netlify Functions
 * Generated automatically - do not edit manually
 */

const charactersData = ${JSON.stringify(dbData, null, 2)};

module.exports = { charactersData };
`;

  // Write the embedded data file
  fs.writeFileSync(outputPath, embeddedData);
  
  console.log('✅ Generated embedded character data');
  console.log(`📊 Total characters: ${dbData.characters.length}`);
  console.log(`📁 Output file: ${outputPath}`);
  
} catch (error) {
  console.error('❌ Error generating embedded data:', error);
  process.exit(1);
}
