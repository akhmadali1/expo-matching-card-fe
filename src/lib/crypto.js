const crypto = require('crypto');
const encryptionKey = process.env.NEXT_PUBLIC_CIPHER_KEY;

// Function to adjust the key length to 32 bytes by padding or truncating
function adjustKey(key) {
  const keyBuffer = Buffer.from(key, 'utf8');
  const adjustedKey = Buffer.alloc(32);
  keyBuffer.copy(adjustedKey, 0, 0, Math.min(keyBuffer.length, 32));
  return adjustedKey;
}

export function Encrypt(plaintext) {
  let encryptedData = plaintext;
  try {
    // Generate a random initialization vector (IV)
    const iv = crypto.randomBytes(16); // 16 bytes (128 bits) IV

    // Adjust the encryption key to be 32 bytes long
    const adjustedKey = adjustKey(encryptionKey);

    // Create a cipher using AES-256-CBC with the adjusted encryption key and IV
    const cipher = crypto.createCipheriv('aes-256-cbc', adjustedKey, iv);

    // Encrypt the plaintext
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Combine the IV and the encrypted data into a single string
    encryptedData = iv.toString('hex') + encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    encryptedData = "";
  }
  return encryptedData;
}

export function Decrypt(encryptedText) {
  let decrypted = encryptedText;
  try {
    // Split the encrypted data into the IV and the ciphertext
    const iv = Buffer.from(encryptedText.slice(0, 32), 'hex'); // 16 bytes (128 bits) IV
    const ciphertext = encryptedText.slice(32);

    // Adjust the encryption key to be 32 bytes long
    const adjustedEncryptionKey = adjustKey(encryptionKey);

    // Create a decipher using AES-256-CBC with the adjusted encryption key and IV
    const decipher = crypto.createDecipheriv('aes-256-cbc', adjustedEncryptionKey, iv);

    // Decrypt the ciphertext
    decrypted = decipher.update(ciphertext, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
  } catch (error) {
    console.error('Decryption error:', error);
    decrypted = "";
  }
  return decrypted;
}


