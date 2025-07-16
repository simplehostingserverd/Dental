import { db } from "@/server/db"
import { PasswordService } from "./password"
import { TwoFactorService } from "./two-factor"
import { RateLimitService } from "./rate-limiter"
import { PracticeRole } from "@prisma/client"
import jwt from "jsonwebtoken"
import crypto from "crypto"

export interface LoginCredentials {
  email: string
  password: string
  twoFactorToken?: string
  rememberMe?: boolean
}

export interface LoginResult {
  success: boolean
  user?: any
  token?: string
  requiresTwoFactor?: boolean
  error?: string
  lockoutTime?: number
}

export interface CreateUserData {
  email: string
  firstName: string
  lastName: string
  role: PracticeRole
  practiceId: string
  phone?: string
  licenseNumber?: string
  specialization?: string
  temporaryPassword?: boolean
}

export class PracticeAuthService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
  private static readonly JWT_EXPIRES_IN = "24h"
  private static readonly REMEMBER_ME_EXPIRES_IN = "30d"
  private static readonly MAX_LOGIN_ATTEMPTS = 5
  private static readonly LOCKOUT_DURATION = 30 * 60 * 1000 // 30 minutes

  /**
   * Authenticate a practice user
   */
  static async login(credentials: LoginCredentials, ipAddress: string): Promise<LoginResult> {
    const { email, password, twoFactorToken, rememberMe } = credentials

    try {
      // Rate limiting checks
      const rateLimitResult = await RateLimitService.checkMultipleRateLimits([
        { type: "login", key: ipAddress },
        { type: "loginEmail", key: email.toLowerCase() },
      ])

      if (!rateLimitResult.allowed) {
        return {
          success: false,
          error: `Too many login attempts. Try again in ${RateLimitService.formatTimeRemaining(rateLimitResult.msBeforeNext || 0)}.`,
          lockoutTime: rateLimitResult.msBeforeNext,
        }
      }

      // Find user
      const user = await db.practiceUser.findUnique({
        where: { email: email.toLowerCase() },
        include: { practice: true },
      })

      if (!user) {
        return { success: false, error: "Invalid email or password" }
      }

      // Check if user is active
      if (!user.isActive) {
        return { success: false, error: "Account is deactivated. Contact your administrator." }
      }

      // Check if account is locked
      if (user.lockedUntil && user.lockedUntil > new Date()) {
        const lockoutTime = user.lockedUntil.getTime() - Date.now()
        return {
          success: false,
          error: `Account is locked. Try again in ${RateLimitService.formatTimeRemaining(lockoutTime)}.`,
          lockoutTime,
        }
      }

      // Verify password
      if (!user.password || !(await PasswordService.verifyPassword(password, user.password))) {
        await this.handleFailedLogin(user.id)
        return { success: false, error: "Invalid email or password" }
      }

      // Check 2FA if enabled
      if (user.twoFactorEnabled) {
        if (!twoFactorToken) {
          return { success: false, requiresTwoFactor: true }
        }

        if (!user.twoFactorSecret || !TwoFactorService.verifyToken(twoFactorToken, user.twoFactorSecret)) {
          await this.handleFailedLogin(user.id)
          return { success: false, error: "Invalid two-factor authentication code" }
        }
      }

      // Successful login - reset failed attempts and update last login
      await this.handleSuccessfulLogin(user.id)

      // Generate JWT token
      const tokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        practiceId: user.practiceId,
        type: "practice",
      }

      const token = jwt.sign(
        tokenPayload,
        this.JWT_SECRET,
        { expiresIn: rememberMe ? this.REMEMBER_ME_EXPIRES_IN : this.JWT_EXPIRES_IN }
      )

      // Remove sensitive data
      const { password: _, twoFactorSecret: __, ...safeUser } = user

      return {
        success: true,
        user: safeUser,
        token,
      }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, error: "An error occurred during login" }
    }
  }

  /**
   * Create a new practice user
   */
  static async createUser(userData: CreateUserData, createdBy: string): Promise<{ success: boolean; user?: any; temporaryPassword?: string; error?: string }> {
    try {
      // Check if email already exists
      const existingUser = await db.practiceUser.findUnique({
        where: { email: userData.email.toLowerCase() },
      })

      if (existingUser) {
        return { success: false, error: "Email already exists" }
      }

      // Generate temporary password if needed
      const temporaryPassword = userData.temporaryPassword !== false 
        ? PasswordService.generateSecurePassword(12)
        : undefined

      const hashedPassword = temporaryPassword 
        ? await PasswordService.hashPassword(temporaryPassword)
        : undefined

      // Create user
      const user = await db.practiceUser.create({
        data: {
          email: userData.email.toLowerCase(),
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role,
          practiceId: userData.practiceId,
          phone: userData.phone,
          licenseNumber: userData.licenseNumber,
          specialization: userData.specialization,
          password: hashedPassword,
        },
        include: { practice: true },
      })

      // Log user creation
      await this.logAuditEvent("USER_CREATED", "PracticeUser", user.id, createdBy)

      // Remove sensitive data
      const { password: _, twoFactorSecret: __, ...safeUser } = user

      return {
        success: true,
        user: safeUser,
        temporaryPassword,
      }
    } catch (error) {
      console.error("Create user error:", error)
      return { success: false, error: "Failed to create user" }
    }
  }

  /**
   * Handle failed login attempt
   */
  private static async handleFailedLogin(userId: string): Promise<void> {
    const user = await db.practiceUser.findUnique({ where: { id: userId } })
    if (!user) return

    const newAttempts = user.loginAttempts + 1
    const shouldLock = newAttempts >= this.MAX_LOGIN_ATTEMPTS

    await db.practiceUser.update({
      where: { id: userId },
      data: {
        loginAttempts: newAttempts,
        lockedUntil: shouldLock ? new Date(Date.now() + this.LOCKOUT_DURATION) : null,
      },
    })
  }

  /**
   * Handle successful login
   */
  private static async handleSuccessfulLogin(userId: string): Promise<void> {
    await db.practiceUser.update({
      where: { id: userId },
      data: {
        loginAttempts: 0,
        lockedUntil: null,
        lastLogin: new Date(),
      },
    })
  }

  /**
   * Log audit event
   */
  private static async logAuditEvent(
    action: string,
    resource: string,
    resourceId: string,
    userId: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    try {
      await db.auditLog.create({
        data: {
          action,
          resource,
          resourceId,
          userId,
          ipAddress,
          userAgent,
        },
      })
    } catch (error) {
      console.error("Audit log error:", error)
    }
  }

  /**
   * Verify JWT token
   */
  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.JWT_SECRET)
    } catch (error) {
      return null
    }
  }

  /**
   * Generate password reset token
   */
  static async generatePasswordResetToken(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const user = await db.practiceUser.findUnique({
        where: { email: email.toLowerCase() },
      })

      if (!user) {
        // Don't reveal if email exists
        return { success: true }
      }

      const resetToken = PasswordService.generateResetToken()
      const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

      await db.practiceUser.update({
        where: { id: user.id },
        data: {
          resetToken,
          resetTokenExpiry,
        },
      })

      // TODO: Send email with reset token
      console.log(`Password reset token for ${email}: ${resetToken}`)

      return { success: true }
    } catch (error) {
      console.error("Password reset token generation error:", error)
      return { success: false, error: "Failed to generate reset token" }
    }
  }

  /**
   * Reset password using token
   */
  static async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      PasswordService.validatePassword(newPassword)

      const user = await db.practiceUser.findFirst({
        where: {
          resetToken: token,
          resetTokenExpiry: { gt: new Date() },
        },
      })

      if (!user) {
        return { success: false, error: "Invalid or expired reset token" }
      }

      const hashedPassword = await PasswordService.hashPassword(newPassword)

      await db.practiceUser.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          resetToken: null,
          resetTokenExpiry: null,
          loginAttempts: 0,
          lockedUntil: null,
        },
      })

      await this.logAuditEvent("PASSWORD_RESET", "PracticeUser", user.id, user.id)

      return { success: true }
    } catch (error) {
      console.error("Password reset error:", error)
      return { success: false, error: error instanceof Error ? error.message : "Failed to reset password" }
    }
  }
}
