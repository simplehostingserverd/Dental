import disposableDomains from "disposable-email-domains";
import * as emailValidator from "email-validator";
import validator from "validator";

export interface EmailValidationResult {
	isValid: boolean;
	errors: string[];
	warnings: string[];
}

/**
 * Comprehensive email validation for patient and practice signups
 * Prevents fraudulent, disposable, and malformed emails
 */
export class EmailValidationService {
	// Common suspicious patterns
	private static readonly SUSPICIOUS_PATTERNS = [
		/^[0-9]+@/, // Starts with only numbers
		/^.{1,2}@/, // Very short local part
		/\+.*\+/, // Multiple plus signs
		/\.{2,}/, // Multiple consecutive dots
		/^.*\.(tk|ml|ga|cf)$/i, // Suspicious TLDs
		/temp|fake|test|spam|trash/i, // Suspicious keywords
		/^(admin|root|test|demo)@/i, // Common test accounts
	];

	// Trusted email domains (major providers)
	private static readonly TRUSTED_DOMAINS = [
		"gmail.com",
		"yahoo.com",
		"hotmail.com",
		"outlook.com",
		"aol.com",
		"icloud.com",
		"me.com",
		"mac.com",
		"live.com",
		"msn.com",
		"comcast.net",
		"verizon.net",
		"att.net",
		"cox.net",
		"charter.net",
		"earthlink.net",
		"sbcglobal.net",
		"bellsouth.net",
		"rr.com",
		"protonmail.com",
		"tutanota.com",
		"fastmail.com",
	];

	/**
	 * Validate email address comprehensively
	 */
	static validateEmail(email: string): EmailValidationResult {
		const errors: string[] = [];
		const warnings: string[] = [];

		// Basic validation
		if (!email || typeof email !== "string") {
			errors.push("Email is required");
			return { isValid: false, errors, warnings };
		}

		const trimmedEmail = email.trim().toLowerCase();

		// Check basic format
		if (!validator.isEmail(trimmedEmail)) {
			errors.push("Invalid email format");
		}

		// Double check with another validator
		if (!emailValidator.validate(trimmedEmail)) {
			errors.push("Email format is not valid");
		}

		// Check length
		if (trimmedEmail.length > 254) {
			errors.push("Email address is too long");
		}

		// Extract domain
		const domain = trimmedEmail.split("@")[1];
		if (!domain) {
			errors.push("Invalid email domain");
			return { isValid: false, errors, warnings };
		}

		// Check for disposable email domains
		if (disposableDomains.includes(domain)) {
			errors.push(
				"Disposable email addresses are not allowed. Please use a permanent email address.",
			);
		}

		// Check for suspicious patterns
		for (const pattern of EmailValidationService.SUSPICIOUS_PATTERNS) {
			if (pattern.test(trimmedEmail)) {
				warnings.push(
					"Email address appears suspicious. Please verify it is correct.",
				);
				break;
			}
		}

		// Check if domain has MX record (basic DNS validation)
		// Note: This would require server-side validation in a real implementation
		// For now, we'll just check against known good domains

		// Check for trusted domains
		const isTrustedDomain =
			EmailValidationService.TRUSTED_DOMAINS.includes(domain);
		if (!isTrustedDomain) {
			// Check if it's a business domain (has company-like structure)
			const isBusinessDomain =
				EmailValidationService.isLikelyBusinessDomain(domain);
			if (!isBusinessDomain) {
				warnings.push(
					"Please verify your email domain is correct. We recommend using a well-known email provider.",
				);
			}
		}

		// Check for common typos in popular domains
		const typoSuggestion = EmailValidationService.checkForTypos(domain);
		if (typoSuggestion) {
			warnings.push(`Did you mean ${typoSuggestion}?`);
		}

		return {
			isValid: errors.length === 0,
			errors,
			warnings,
		};
	}

	/**
	 * Check if domain looks like a business domain
	 */
	private static isLikelyBusinessDomain(domain: string): boolean {
		// Business domains typically have:
		// - More than one dot (subdomain structure)
		// - Common business TLDs
		// - Not in disposable list
		const businessTlds = [
			".com",
			".org",
			".net",
			".edu",
			".gov",
			".mil",
			".co.",
			".inc",
			".llc",
		];
		const hasBusinessTld = businessTlds.some((tld) => domain.includes(tld));
		const hasSubdomain = domain.split(".").length > 2;

		return hasBusinessTld || hasSubdomain;
	}

	/**
	 * Check for common typos in email domains
	 */
	private static checkForTypos(domain: string): string | null {
		const commonTypos: Record<string, string> = {
			"gmai.com": "gmail.com",
			"gmial.com": "gmail.com",
			"gmail.co": "gmail.com",
			"yahooo.com": "yahoo.com",
			"yaho.com": "yahoo.com",
			"hotmial.com": "hotmail.com",
			"hotmai.com": "hotmail.com",
			"outlok.com": "outlook.com",
			"outloo.com": "outlook.com",
			"iclod.com": "icloud.com",
			"icoud.com": "icloud.com",
		};

		return commonTypos[domain] || null;
	}

	/**
	 * Validate email for patient signup (stricter)
	 */
	static validatePatientEmail(email: string): EmailValidationResult {
		const result = EmailValidationService.validateEmail(email);

		// Additional patient-specific validations
		if (result.isValid) {
			const trimmedEmail = email.trim().toLowerCase();

			// Patients should use personal email addresses
			if (EmailValidationService.looksLikeBusinessEmail(trimmedEmail)) {
				result.warnings.push(
					"Consider using a personal email address for your patient account.",
				);
			}
		}

		return result;
	}

	/**
	 * Validate email for practice signup (different rules)
	 */
	static validatePracticeEmail(email: string): EmailValidationResult {
		const result = EmailValidationService.validateEmail(email);

		// Additional practice-specific validations
		if (result.isValid) {
			const trimmedEmail = email.trim().toLowerCase();
			const domain = trimmedEmail.split("@")[1];

			// Practices should ideally use business domains
			if (domain && EmailValidationService.TRUSTED_DOMAINS.includes(domain)) {
				result.warnings.push(
					"Consider using your practice's business email domain for professional communication.",
				);
			}
		}

		return result;
	}

	/**
	 * Check if email looks like a business email
	 */
	private static looksLikeBusinessEmail(email: string): boolean {
		const businessKeywords = [
			"admin",
			"info",
			"contact",
			"support",
			"office",
			"reception",
			"dental",
			"clinic",
		];
		const localPart = email.split("@")[0];

		return localPart ? businessKeywords.some((keyword) => localPart.includes(keyword)) : false;
	}

	/**
	 * Sanitize email for storage
	 */
	static sanitizeEmail(email: string): string {
		return email.trim().toLowerCase();
	}
}

/**
 * Simple email validation for forms (client-side)
 */
export function isValidEmail(email: string): boolean {
	const result = EmailValidationService.validateEmail(email);
	return result.isValid;
}

/**
 * Get email validation errors for display
 */
export function getEmailValidationErrors(email: string): string[] {
	const result = EmailValidationService.validateEmail(email);
	return [...result.errors, ...result.warnings];
}
