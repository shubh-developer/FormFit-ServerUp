#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔒 Security Check Starting...\n');

// Check for hardcoded secrets
console.log('🔍 Checking for hardcoded secrets...');
const patterns = [
  /password\s*[:=]\s*['"`][^'"`]+['"`]/gi,
  /secret\s*[:=]\s*['"`][^'"`]+['"`]/gi,
  /key\s*[:=]\s*['"`][^'"`]+['"`]/gi,
  /token\s*[:=]\s*['"`][^'"`]+['"`]/gi,
  /api_key\s*[:=]\s*['"`][^'"`]+['"`]/gi,
  /private_key\s*[:=]\s*['"`][^'"`]+['"`]/gi
];

// Exclude patterns (false positives)
const excludePatterns = [
  /prices?\s*[:=]/gi,
  /price\s*[:=]/gi,
  /amount\s*[:=]/gi,
  /cost\s*[:=]/gi,
  /fee\s*[:=]/gi
];

function checkFiles(dir) {
  const files = fs.readdirSync(dir);
  let found = false;
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules') {
        found = checkFiles(fullPath) || found;
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      patterns.forEach(pattern => {
        const matches = content.match(pattern);
        if (matches) {
          // Check if it's a false positive
          const isFalsePositive = excludePatterns.some(excludePattern => 
            content.match(excludePattern)
          );
          
          if (!isFalsePositive) {
            console.log(`❌ Found potential secret in ${fullPath}`);
            found = true;
          }
        }
      });
    }
  });
  
  return found;
}

const hasSecrets = checkFiles('./src');
if (!hasSecrets) {
  console.log('✅ No hardcoded secrets found\n');
}

// Check environment variables
console.log('🔍 Checking environment variables...');
const requiredVars = ['JWT_SECRET', 'SESSION_SECRET', 'DB_PASSWORD'];
const missing = requiredVars.filter(varName => !process.env[varName]);

if (missing.length > 0) {
  console.log(`❌ Missing: ${missing.join(', ')}\n`);
} else {
  console.log('✅ All required environment variables are set\n');
}

console.log('🔒 Security check completed!'); 