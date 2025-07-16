import QRCode from "qrcode";
import speakeasy from "speakeasy";

export class TwoFactorService {
	/**
	 * Generate a new 2FA secret for a user
	 */
	static generateSecret(
		userEmail: string,
		serviceName = "DentalCloud",
	): {
		secret: string;
		qrCodeUrl: string;
		manualEntryKey: string;
	} {
		const secret = speakeasy.generateSecret({
			name: userEmail,
			issuer: serviceName,
			length: 32,
		});

		return {
			secret: secret.base32,
			qrCodeUrl: secret.otpauth_url!,
			manualEntryKey: secret.base32,
		};
	}

	/**
	 * Generate QR code data URL for 2FA setup
	 */
	static async generateQRCode(otpauthUrl: string): Promise<string> {
		try {
			return await QRCode.toDataURL(otpauthUrl);
		} catch (error) {
			console.error("QR Code generation error:", error);
			throw new Error("Failed to generate QR code");
		}
	}

	/**
	 * Verify a 2FA token
	 */
	static verifyToken(token: string, secret: string, window = 2): boolean {
		try {
			return speakeasy.totp.verify({
				secret,
				encoding: "base32",
				token,
				window, // Allow some time drift
			});
		} catch (error) {
			console.error("2FA token verification error:", error);
			return false;
		}
	}

	/**
	 * Generate backup codes for 2FA
	 */
	static generateBackupCodes(count = 10): string[] {
		const codes: string[] = [];

		for (let i = 0; i < count; i++) {
			// Generate 8-character alphanumeric code
			const code = Math.random().toString(36).substring(2, 10).toUpperCase();
			codes.push(code);
		}

		return codes;
	}

	/**
	 * Validate backup code format
	 */
	static isValidBackupCodeFormat(code: string): boolean {
		// 8 characters, alphanumeric
		return /^[A-Z0-9]{8}$/.test(code.toUpperCase());
	}

	/**
	 * Generate recovery codes (longer, more secure)
	 */
	static generateRecoveryCodes(count = 5): string[] {
		const codes: string[] = [];

		for (let i = 0; i < count; i++) {
			// Generate 16-character recovery code
			const code = Array.from({ length: 16 }, () =>
				Math.random().toString(36).charAt(2),
			)
				.join("")
				.toUpperCase();

			// Format as XXXX-XXXX-XXXX-XXXX
			const formatted = code.match(/.{1,4}/g)?.join("-") || code;
			codes.push(formatted);
		}

		return codes;
	}

	/**
	 * Validate recovery code format
	 */
	static isValidRecoveryCodeFormat(code: string): boolean {
		// Format: XXXX-XXXX-XXXX-XXXX
		return /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(
			code.toUpperCase(),
		);
	}
}
