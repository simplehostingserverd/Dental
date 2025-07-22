import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-32-character-secret-key-here!';
const ALGORITHM = 'aes-256-gcm';

/**
 * Encrypt sensitive data
 */
export function encrypt(text: string): string {
	try {
		const iv = crypto.randomBytes(16);
		const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);
		const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

		let encrypted = cipher.update(text, 'utf8', 'hex');
		encrypted += cipher.final('hex');

		const authTag = cipher.getAuthTag();

		// Combine iv, authTag, and encrypted data
		return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
	} catch (error) {
		console.error('Encryption error:', error);
		throw new Error('Failed to encrypt data');
	}
}

/**
 * Decrypt sensitive data
 */
export function decrypt(encryptedData: string): string {
	try {
		const parts = encryptedData.split(':');
		if (parts.length !== 3) {
			throw new Error('Invalid encrypted data format');
		}

		const iv = Buffer.from(parts[0], 'hex');
		const authTag = Buffer.from(parts[1], 'hex');
		const encrypted = parts[2];

		const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);
		const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
		decipher.setAuthTag(authTag);

		let decrypted = decipher.update(encrypted, 'hex', 'utf8');
		decrypted += decipher.final('utf8');

		return decrypted;
	} catch (error) {
		console.error('Decryption error:', error);
		throw new Error('Failed to decrypt data');
	}
}

/**
 * Generate a secure random key for encryption
 */
export function generateEncryptionKey(): string {
	return crypto.randomBytes(32).toString('hex');
}

/**
 * Hash sensitive data (one-way)
 */
export function hashData(data: string): string {
	return crypto.createHash('sha256').update(data).digest('hex');
}
