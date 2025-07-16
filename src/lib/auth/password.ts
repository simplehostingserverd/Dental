import bcrypt from "bcryptjs"
import crypto from "crypto"

export class PasswordService {
  private static readonly SALT_ROUNDS = 12
  private static readonly MIN_PASSWORD_LENGTH = 8
  private static readonly MAX_PASSWORD_LENGTH = 128

  /**
   * Hash a password using bcrypt
   */
  static async hashPassword(password: string): Promise<string> {
    this.validatePassword(password)
    return bcrypt.hash(password, this.SALT_ROUNDS)
  }

  /**
   * Verify a password against a hash
   */
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    try {
      return bcrypt.compare(password, hash)
    } catch (error) {
      console.error("Password verification error:", error)
      return false
    }
  }

  /**
   * Generate a secure random password
   */
  static generateSecurePassword(length: number = 16): string {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
    let password = ""
    
    // Ensure at least one character from each category
    const lowercase = "abcdefghijklmnopqrstuvwxyz"
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const numbers = "0123456789"
    const symbols = "!@#$%^&*"
    
    password += lowercase[Math.floor(Math.random() * lowercase.length)]
    password += uppercase[Math.floor(Math.random() * uppercase.length)]
    password += numbers[Math.floor(Math.random() * numbers.length)]
    password += symbols[Math.floor(Math.random() * symbols.length)]
    
    // Fill the rest randomly
    for (let i = 4; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)]
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('')
  }

  /**
   * Generate a secure reset token
   */
  static generateResetToken(): string {
    return crypto.randomBytes(32).toString("hex")
  }

  /**
   * Validate password strength
   */
  static validatePassword(password: string): void {
    if (!password) {
      throw new Error("Password is required")
    }

    if (password.length < this.MIN_PASSWORD_LENGTH) {
      throw new Error(`Password must be at least ${this.MIN_PASSWORD_LENGTH} characters long`)
    }

    if (password.length > this.MAX_PASSWORD_LENGTH) {
      throw new Error(`Password must be no more than ${this.MAX_PASSWORD_LENGTH} characters long`)
    }

    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      throw new Error("Password must contain at least one lowercase letter")
    }

    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      throw new Error("Password must contain at least one uppercase letter")
    }

    // Check for at least one number
    if (!/\d/.test(password)) {
      throw new Error("Password must contain at least one number")
    }

    // Check for at least one special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      throw new Error("Password must contain at least one special character")
    }
  }

  /**
   * Check if password is compromised (basic check against common passwords)
   */
  static isCommonPassword(password: string): boolean {
    const commonPasswords = [
      "password", "123456", "password123", "admin", "qwerty",
      "letmein", "welcome", "monkey", "1234567890", "abc123",
      "Password1", "password1", "123456789", "welcome123"
    ]
    
    return commonPasswords.includes(password.toLowerCase())
  }

  /**
   * Calculate password strength score (0-100)
   */
  static calculatePasswordStrength(password: string): number {
    let score = 0
    
    // Length bonus
    if (password.length >= 8) score += 25
    if (password.length >= 12) score += 25
    
    // Character variety bonus
    if (/[a-z]/.test(password)) score += 10
    if (/[A-Z]/.test(password)) score += 10
    if (/\d/.test(password)) score += 10
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 10
    
    // Penalty for common patterns
    if (/(.)\1{2,}/.test(password)) score -= 10 // Repeated characters
    if (/123|abc|qwe/i.test(password)) score -= 10 // Sequential patterns
    if (this.isCommonPassword(password)) score -= 20
    
    return Math.max(0, Math.min(100, score))
  }
}
