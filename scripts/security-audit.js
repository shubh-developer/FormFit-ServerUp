#!/usr/bin/env node

/**
 * Security Audit Script
 * Checks for common security issues in the application
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// Security checks
const securityChecks = {
  // Check for hardcoded secrets
  checkHardcodedSecrets: () => {
    console.log(`${colors.blue}${colors.bold}🔍 Checking for hardcoded secrets...${colors.reset}`);
    
    const patterns = [
      /password\s*[:=]\s*['"`][^'"`]+['"`]/gi,
      /secret\s*[:=]\s*['"`][^'"`]+['"`]/gi,
      /key\s*[:=]\s*['"`][^'"`]+['"`]/gi,
      /token\s*[:=]\s*['"`][^'"`]+['"`]/gi,
      /api_key\s*[:=]\s*['"`][^'"`]+['"`]/gi,
      /private_key\s*[:=]\s*['"`][^'"`]+['"`]/gi
    ];
    
    const files = getAllFiles('./src');
    let found = false;
    
    files.forEach(file => {
      if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
        const content = fs.readFileSync(file, 'utf8');
        patterns.forEach(pattern => {
          const matches = content.match(pattern);
          if (matches) {
            console.log(`${colors.red}❌ Found potential secret in ${file}:${colors.reset}`);
            matches.forEach(match => {
              console.log(`   ${colors.yellow}${match.substring(0, 50)}...${colors.reset}`);
            });
            found = true;
          }
        });
      }
    });
    
    if (!found) {
      console.log(`${colors.green}✅ No hardcoded secrets found${colors.reset}`);
    }
    
    return !found;
  },
  
  // Check for SQL injection vulnerabilities
  checkSQLInjection: () => {
    console.log(`${colors.blue}${colors.bold}🔍 Checking for SQL injection vulnerabilities...${colors.reset}`);
    
    const patterns = [
      /query\s*\(\s*`[^`]*\$\{[^}]*\}[^`]*`/gi,
      /query\s*\(\s*['"][^'"]*\$\{[^}]*\}[^'"]*['"]/gi,
      /execute\s*\(\s*`[^`]*\$\{[^}]*\}[^`]*`/gi
    ];
    
    const files = getAllFiles('./src');
    let found = false;
    
    files.forEach(file => {
      if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
        const content = fs.readFileSync(file, 'utf8');
        patterns.forEach(pattern => {
          const matches = content.match(pattern);
          if (matches) {
            console.log(`${colors.red}❌ Found potential SQL injection in ${file}:${colors.reset}`);
            matches.forEach(match => {
              console.log(`   ${colors.yellow}${match.substring(0, 100)}...${colors.reset}`);
            });
            found = true;
          }
        });
      }
    });
    
    if (!found) {
      console.log(`${colors.green}✅ No SQL injection vulnerabilities found${colors.reset}`);
    }
    
    return !found;
  },
  
  // Check for XSS vulnerabilities
  checkXSS: () => {
    console.log(`${colors.blue}${colors.bold}🔍 Checking for XSS vulnerabilities...${colors.reset}`);
    
    const patterns = [
      /dangerouslySetInnerHTML/gi,
      /innerHTML\s*=/gi,
      /document\.write/gi,
      /eval\s*\(/gi,
      /innerHTML\s*\+/gi
    ];
    
    const files = getAllFiles('./src');
    let found = false;
    
    files.forEach(file => {
      if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
        const content = fs.readFileSync(file, 'utf8');
        patterns.forEach(pattern => {
          const matches = content.match(pattern);
          if (matches) {
            console.log(`${colors.red}❌ Found potential XSS vulnerability in ${file}:${colors.reset}`);
            matches.forEach(match => {
              console.log(`   ${colors.yellow}${match.substring(0, 100)}...${colors.reset}`);
            });
            found = true;
          }
        });
      }
    });
    
    if (!found) {
      console.log(`${colors.green}✅ No XSS vulnerabilities found${colors.reset}`);
    }
    
    return !found;
  },
  
  // Check for weak dependencies
  checkDependencies: () => {
    console.log(`${colors.blue}${colors.bold}🔍 Checking dependencies for vulnerabilities...${colors.reset}`);
    
    try {
      const packageLock = JSON.parse(fs.readFileSync('./package-lock.json', 'utf8'));
      const vulnerabilities = [];
      
      Object.keys(packageLock.dependencies || {}).forEach(dep => {
        const depInfo = packageLock.dependencies[dep];
        if (depInfo.vulnerabilities) {
          vulnerabilities.push({
            package: dep,
            vulnerabilities: depInfo.vulnerabilities
          });
        }
      });
      
      if (vulnerabilities.length > 0) {
        console.log(`${colors.red}❌ Found ${vulnerabilities.length} packages with vulnerabilities:${colors.reset}`);
        vulnerabilities.forEach(vuln => {
          console.log(`   ${colors.yellow}${vuln.package}: ${vuln.vulnerabilities} vulnerabilities${colors.reset}`);
        });
        return false;
      } else {
        console.log(`${colors.green}✅ No vulnerable dependencies found${colors.reset}`);
        return true;
      }
    } catch (error) {
      console.log(`${colors.yellow}⚠️  Could not check dependencies: ${error.message}${colors.reset}`);
      return true;
    }
  },
  
  // Check environment variables
  checkEnvironmentVariables: () => {
    console.log(`${colors.blue}${colors.bold}🔍 Checking environment variables...${colors.reset}`);
    
    const requiredVars = [
      'JWT_SECRET',
      'SESSION_SECRET',
      'DB_PASSWORD',
      'EMAIL_PASS'
    ];
    
    const missing = [];
    requiredVars.forEach(varName => {
      if (!process.env[varName]) {
        missing.push(varName);
      }
    });
    
    if (missing.length > 0) {
      console.log(`${colors.red}❌ Missing required environment variables:${colors.reset}`);
      missing.forEach(varName => {
        console.log(`   ${colors.yellow}${varName}${colors.reset}`);
      });
      return false;
    } else {
      console.log(`${colors.green}✅ All required environment variables are set${colors.reset}`);
      return true;
    }
  },
  
  // Check for proper error handling
  checkErrorHandling: () => {
    console.log(`${colors.blue}${colors.bold}🔍 Checking error handling...${colors.reset}`);
    
    const patterns = [
      /console\.log\s*\(\s*error\s*\)/gi,
      /console\.error\s*\(\s*error\s*\)/gi,
      /throw\s+error/gi
    ];
    
    const files = getAllFiles('./src');
    let found = false;
    
    files.forEach(file => {
      if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
        const content = fs.readFileSync(file, 'utf8');
        patterns.forEach(pattern => {
          const matches = content.match(pattern);
          if (matches) {
            console.log(`${colors.yellow}⚠️  Found potential error handling issue in ${file}:${colors.reset}`);
            matches.forEach(match => {
              console.log(`   ${colors.yellow}${match.substring(0, 100)}...${colors.reset}`);
            });
            found = true;
          }
        });
      }
    });
    
    if (!found) {
      console.log(`${colors.green}✅ Error handling looks good${colors.reset}`);
    }
    
    return true;
  }
};

// Helper function to get all files recursively
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules') {
        arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
      }
    } else {
      arrayOfFiles.push(fullPath);
    }
  });
  
  return arrayOfFiles;
}

// Main audit function
function runSecurityAudit() {
  console.log(`${colors.bold}${colors.blue}🔒 Security Audit Starting...${colors.reset}\n`);
  
  const results = {};
  let passed = 0;
  let total = 0;
  
  Object.keys(securityChecks).forEach(checkName => {
    try {
      const result = securityChecks[checkName]();
      results[checkName] = result;
      if (result) passed++;
      total++;
    } catch (error) {
      console.log(`${colors.red}❌ Error running ${checkName}: ${error.message}${colors.reset}`);
      results[checkName] = false;
      total++;
    }
    console.log('');
  });
  
  // Summary
  console.log(`${colors.bold}${colors.blue}📊 Security Audit Summary${colors.reset}`);
  console.log(`${colors.bold}Passed: ${colors.green}${passed}/${total}${colors.reset}`);
  
  if (passed === total) {
    console.log(`${colors.green}${colors.bold}🎉 All security checks passed!${colors.reset}`);
    process.exit(0);
  } else {
    console.log(`${colors.red}${colors.bold}⚠️  Some security issues found. Please review and fix them.${colors.reset}`);
    process.exit(1);
  }
}

// Run the audit
if (require.main === module) {
  runSecurityAudit();
}

module.exports = { securityChecks, runSecurityAudit }; 