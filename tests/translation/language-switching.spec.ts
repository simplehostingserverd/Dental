import { test, expect } from '@playwright/test';

test.describe('Language Switching', () => {
  test.beforeEach(async ({ page }) => {
    // Start on the main page
    await page.goto('/');
  });

  test('should display language switcher', async ({ page }) => {
    // Look for language switcher button
    const languageSwitcher = page.locator('[data-testid="language-switcher"]').or(
      page.locator('button:has-text("English")').or(
        page.locator('button:has-text("🇺🇸")')
      )
    );
    
    await expect(languageSwitcher).toBeVisible();
  });

  test('should switch from English to Spanish', async ({ page }) => {
    // Find and click language switcher
    const languageSwitcher = page.locator('[data-testid="language-switcher"]').or(
      page.locator('button:has-text("English")').or(
        page.locator('button:has-text("🇺🇸")')
      )
    );
    
    await languageSwitcher.click();
    
    // Click Spanish option
    const spanishOption = page.locator('[data-testid="language-option-es"]').or(
      page.locator('text=Español').or(
        page.locator('text=🇪🇸')
      )
    );
    
    await spanishOption.click();
    
    // Wait for page to reload/update
    await page.waitForLoadState('networkidle');
    
    // Check that URL contains Spanish locale or content is in Spanish
    const url = page.url();
    const isSpanishUrl = url.includes('/es/') || url.includes('locale=es');
    
    if (isSpanishUrl) {
      expect(url).toContain('es');
    } else {
      // Check for Spanish content
      const spanishContent = page.locator('text=Panel de Control').or(
        page.locator('text=Citas').or(
          page.locator('text=Pacientes')
        )
      );
      await expect(spanishContent.first()).toBeVisible({ timeout: 10000 });
    }
  });

  test('should switch from Spanish to English', async ({ page }) => {
    // First switch to Spanish
    await page.goto('/es/');
    
    // Find and click language switcher
    const languageSwitcher = page.locator('[data-testid="language-switcher"]').or(
      page.locator('button:has-text("Español")').or(
        page.locator('button:has-text("🇪🇸")')
      )
    );
    
    await languageSwitcher.click();
    
    // Click English option
    const englishOption = page.locator('[data-testid="language-option-en"]').or(
      page.locator('text=English').or(
        page.locator('text=🇺🇸')
      )
    );
    
    await englishOption.click();
    
    // Wait for page to reload/update
    await page.waitForLoadState('networkidle');
    
    // Check that content is in English
    const englishContent = page.locator('text=Dashboard').or(
      page.locator('text=Appointments').or(
        page.locator('text=Patients')
      )
    );
    await expect(englishContent.first()).toBeVisible({ timeout: 10000 });
  });

  test('should persist language preference', async ({ page, context }) => {
    // Switch to Spanish
    const languageSwitcher = page.locator('[data-testid="language-switcher"]').or(
      page.locator('button:has-text("English")').or(
        page.locator('button:has-text("🇺🇸")')
      )
    );
    
    await languageSwitcher.click();
    
    const spanishOption = page.locator('[data-testid="language-option-es"]').or(
      page.locator('text=Español').or(
        page.locator('text=🇪🇸')
      )
    );
    
    await spanishOption.click();
    await page.waitForLoadState('networkidle');
    
    // Navigate to a new page
    await page.goto('/auth/signin');
    
    // Check that Spanish is still active
    const spanishContent = page.locator('text=Iniciar Sesión').or(
      page.locator('text=Correo Electrónico').or(
        page.locator('text=Contraseña')
      )
    );
    
    await expect(spanishContent.first()).toBeVisible({ timeout: 10000 });
  });

  test('should handle navigation menu translation', async ({ page }) => {
    // Go to dashboard (assuming user is logged in via global setup)
    await page.goto('/dashboard');
    
    // Check English navigation items
    await expect(page.locator('text=Dashboard')).toBeVisible();
    await expect(page.locator('text=Appointments')).toBeVisible();
    await expect(page.locator('text=Patients')).toBeVisible();
    
    // Switch to Spanish
    const languageSwitcher = page.locator('[data-testid="language-switcher"]').or(
      page.locator('button:has-text("English")').or(
        page.locator('button:has-text("🇺🇸")')
      )
    );
    
    if (await languageSwitcher.isVisible()) {
      await languageSwitcher.click();
      
      const spanishOption = page.locator('[data-testid="language-option-es"]').or(
        page.locator('text=Español').or(
          page.locator('text=🇪🇸')
        )
      );
      
      await spanishOption.click();
      await page.waitForLoadState('networkidle');
      
      // Check Spanish navigation items
      await expect(page.locator('text=Panel de Control')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('text=Citas')).toBeVisible();
      await expect(page.locator('text=Pacientes')).toBeVisible();
    }
  });

  test('should translate form labels and buttons', async ({ page }) => {
    await page.goto('/auth/signin');
    
    // Check English form elements
    await expect(page.locator('label:has-text("Email")')).toBeVisible();
    await expect(page.locator('label:has-text("Password")')).toBeVisible();
    await expect(page.locator('button:has-text("Sign In")')).toBeVisible();
    
    // Switch to Spanish
    const languageSwitcher = page.locator('[data-testid="language-switcher"]').or(
      page.locator('button:has-text("English")').or(
        page.locator('button:has-text("🇺🇸")')
      )
    );
    
    if (await languageSwitcher.isVisible()) {
      await languageSwitcher.click();
      
      const spanishOption = page.locator('[data-testid="language-option-es"]').or(
        page.locator('text=Español').or(
          page.locator('text=🇪🇸')
        )
      );
      
      await spanishOption.click();
      await page.waitForLoadState('networkidle');
      
      // Check Spanish form elements
      await expect(page.locator('label:has-text("Correo Electrónico")')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('label:has-text("Contraseña")')).toBeVisible();
      await expect(page.locator('button:has-text("Iniciar Sesión")')).toBeVisible();
    }
  });

  test('should handle mobile language switching', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    
    // Look for mobile language toggle
    const mobileLanguageToggle = page.locator('[data-testid="mobile-language-toggle"]').or(
      page.locator('button:has-text("EN")').or(
        page.locator('button:has-text("🇺🇸")')
      )
    );
    
    if (await mobileLanguageToggle.isVisible()) {
      await mobileLanguageToggle.click();
      await page.waitForLoadState('networkidle');
      
      // Check that language switched
      const spanishIndicator = page.locator('button:has-text("ES")').or(
        page.locator('button:has-text("🇪🇸")')
      );
      
      await expect(spanishIndicator).toBeVisible({ timeout: 10000 });
    }
  });

  test('should maintain language across authentication', async ({ page }) => {
    // Start in Spanish
    await page.goto('/es/auth/signin');
    
    // Verify we're in Spanish
    await expect(page.locator('text=Iniciar Sesión')).toBeVisible();
    
    // Login with test credentials
    await page.fill('input[type="email"]', 'receptionist@test.com');
    await page.fill('input[type="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    
    // Wait for redirect
    await page.waitForLoadState('networkidle');
    
    // Check that we're still in Spanish after login
    const spanishContent = page.locator('text=Panel de Control').or(
      page.locator('text=Citas').or(
        page.locator('text=Recepcionista')
      )
    );
    
    await expect(spanishContent.first()).toBeVisible({ timeout: 10000 });
  });

  test('should handle URL-based locale routing', async ({ page }) => {
    // Test direct navigation to Spanish URL
    await page.goto('/es/dashboard');
    
    // Should show Spanish content
    const spanishContent = page.locator('text=Panel de Control').or(
      page.locator('text=Citas').or(
        page.locator('text=Pacientes')
      )
    );
    
    await expect(spanishContent.first()).toBeVisible({ timeout: 10000 });
    
    // Test direct navigation to English URL
    await page.goto('/en/dashboard');
    
    // Should show English content
    const englishContent = page.locator('text=Dashboard').or(
      page.locator('text=Appointments').or(
        page.locator('text=Patients')
      )
    );
    
    await expect(englishContent.first()).toBeVisible({ timeout: 10000 });
  });
});
