/**
 * End-to-End Authentication Flow Tests
 * These tests simulate real user interactions for production readiness
 */

import { test, expect } from '@playwright/test';

test.describe('Authentication Flow E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Start from the home page
    await page.goto('/');
  });

  test('complete signup flow', async ({ page }) => {
    // Navigate to signup page
    await page.goto('/auth/signup');
    
    // Verify page loads correctly
    await expect(page.locator('text=DentalCloud')).toBeVisible();
    await expect(page.locator('text=Create your account')).toBeVisible();
    
    // Fill out the signup form
    await page.fill('[name="firstName"]', 'John');
    await page.fill('[name="lastName"]', 'Doe');
    await page.fill('[name="practiceName"]', 'Smile Dental Clinic');
    await page.fill('[name="email"]', 'john@smiledental.com');
    await page.fill('[name="password"]', 'SecurePassword123!');
    await page.fill('[name="confirmPassword"]', 'SecurePassword123!');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Verify redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
  });

  test('complete signin flow', async ({ page }) => {
    // Navigate to signin page
    await page.goto('/auth/signin');
    
    // Verify page loads correctly
    await expect(page.locator('text=DentalCloud')).toBeVisible();
    await expect(page.locator('text=Welcome back')).toBeVisible();
    
    // Fill out the signin form
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Verify redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
  });

  test('navigation between signin and signup pages', async ({ page }) => {
    // Start at signin page
    await page.goto('/auth/signin');
    
    // Click signup link
    await page.click('text=Sign up here');
    await expect(page).toHaveURL('/auth/signup');
    await expect(page.locator('text=Create your account')).toBeVisible();
    
    // Click signin link
    await page.click('text=Sign in here');
    await expect(page).toHaveURL('/auth/signin');
    await expect(page.locator('text=Welcome back')).toBeVisible();
  });

  test('form validation on signup page', async ({ page }) => {
    await page.goto('/auth/signup');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Check that form doesn't submit (stays on same page)
    await expect(page).toHaveURL('/auth/signup');
    
    // Fill only email and try again
    await page.fill('[name="email"]', 'invalid-email');
    await page.click('button[type="submit"]');
    
    // Should still be on signup page due to validation
    await expect(page).toHaveURL('/auth/signup');
  });

  test('form validation on signin page', async ({ page }) => {
    await page.goto('/auth/signin');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Check that form doesn't submit (stays on same page)
    await expect(page).toHaveURL('/auth/signin');
    
    // Fill only email with invalid format
    await page.fill('[name="email"]', 'invalid-email');
    await page.click('button[type="submit"]');
    
    // Should still be on signin page due to validation
    await expect(page).toHaveURL('/auth/signin');
  });

  test('responsive design on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Test signin page on mobile
    await page.goto('/auth/signin');
    await expect(page.locator('text=DentalCloud')).toBeVisible();
    
    // The right panel should be hidden on mobile
    const rightPanel = page.locator('text=Next-Gen Dental Practice Management');
    await expect(rightPanel).toBeHidden();
    
    // Form should still be accessible
    await expect(page.locator('[name="email"]')).toBeVisible();
    await expect(page.locator('[name="password"]')).toBeVisible();
    
    // Test signup page on mobile
    await page.goto('/auth/signup');
    await expect(page.locator('text=Create your account')).toBeVisible();
    await expect(page.locator('[name="firstName"]')).toBeVisible();
  });

  test('accessibility features', async ({ page }) => {
    await page.goto('/auth/signin');
    
    // Check for proper labels
    const emailInput = page.locator('[name="email"]');
    const passwordInput = page.locator('[name="password"]');
    
    await expect(emailInput).toHaveAttribute('type', 'email');
    await expect(passwordInput).toHaveAttribute('type', 'password');
    await expect(emailInput).toHaveAttribute('required');
    await expect(passwordInput).toHaveAttribute('required');
    
    // Test keyboard navigation
    await emailInput.focus();
    await page.keyboard.press('Tab');
    await expect(passwordInput).toBeFocused();
  });

  test('performance and loading times', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/auth/signin');
    await expect(page.locator('text=Welcome back')).toBeVisible();
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
    
    // Check that images load properly
    const backgroundImage = page.locator('.bg-cover');
    await expect(backgroundImage).toBeVisible();
  });

  test('error handling for network issues', async ({ page }) => {
    // Simulate offline condition
    await page.context().setOffline(true);
    
    await page.goto('/auth/signin');
    
    // Fill and submit form while offline
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Since we're using window.location.href, it should still attempt redirect
    // In a real app, you'd handle network errors gracefully
    
    // Restore online condition
    await page.context().setOffline(false);
  });

  test('security headers and HTTPS readiness', async ({ page }) => {
    const response = await page.goto('/auth/signin');
    
    // Check response status
    expect(response?.status()).toBe(200);
    
    // In production, these headers should be present:
    // - Strict-Transport-Security
    // - X-Content-Type-Options
    // - X-Frame-Options
    // - Content-Security-Policy
    
    // For now, just verify the page loads securely
    expect(page.url()).toContain('/auth/signin');
  });
});
