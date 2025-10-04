const { createHash } = require('crypto');

function hashPassword(password) {
  return createHash('sha256').update(password).digest('hex');
}

const storedHash = 'a4c7c7e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8';

// Common passwords to test
const commonPasswords = [
  'admin',
  'admin123',
  'password',
  'master',
  'master123',
  'MasterAdmin@2024!',
  'formafit',
  'FormaFit123',
  '123456',
  'admin@123',
  'master@123'
];

console.log('Testing passwords against hash:', storedHash);
console.log('');

for (const password of commonPasswords) {
  const hash = hashPassword(password);
  console.log(`Password: "${password}" -> Hash: ${hash}`);
  if (hash === storedHash) {
    console.log(`✅ MATCH FOUND! Password is: "${password}"`);
    break;
  }
}

console.log('');
console.log('If no match found, the password might be custom or the hash method is different.');