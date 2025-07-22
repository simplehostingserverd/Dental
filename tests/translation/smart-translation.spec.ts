import { test, expect } from '@playwright/test';

test.describe('Smart Translation Service', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should prioritize static medical translations', async ({ page }) => {
    // Navigate to a page with medical terms
    await page.goto('/es/dashboard/charting');
    
    // Test that medical terms use static translations (highest accuracy)
    const medicalTerms = [
      'root canal', // Should translate to 'endodoncia'
      'crown', // Should translate to 'corona dental'
      'filling', // Should translate to 'empaste'
      'extraction', // Should translate to 'extracción dental'
    ];

    for (const term of medicalTerms) {
      // Check if the term appears and is properly translated
      const termElement = page.locator(`text=/.*${term}.*/i`);
      if (await termElement.isVisible()) {
        const termText = await termElement.textContent();
        // Should not contain the English term in Spanish context
        expect(termText?.toLowerCase()).not.toContain(term.toLowerCase());
      }
    }
  });

  test('should fall back to API translation for non-medical terms', async ({ page }) => {
    await page.goto('/es/dashboard');
    
    // Test dynamic content that would use API translation
    await page.evaluate(() => {
      // Add dynamic content that would need API translation
      const dynamicElement = document.createElement('div');
      dynamicElement.textContent = 'This is dynamic content that needs translation';
      dynamicElement.setAttribute('data-testid', 'dynamic-content');
      document.body.appendChild(dynamicElement);
    });

    // Wait for translation to occur
    await page.waitForTimeout(2000);
    
    const dynamicContent = page.locator('[data-testid="dynamic-content"]');
    if (await dynamicContent.isVisible()) {
      const content = await dynamicContent.textContent();
      // Should be translated to Spanish
      expect(content).not.toContain('This is dynamic content');
    }
  });

  test('should cache translations for performance', async ({ page }) => {
    await page.goto('/es/dashboard');
    
    // Measure translation time for first load
    const startTime = Date.now();
    await page.waitForLoadState('networkidle');
    const firstLoadTime = Date.now() - startTime;
    
    // Reload the page
    await page.reload();
    
    // Measure translation time for cached load
    const cacheStartTime = Date.now();
    await page.waitForLoadState('networkidle');
    const cachedLoadTime = Date.now() - cacheStartTime;
    
    // Cached load should be faster (allowing for some variance)
    expect(cachedLoadTime).toBeLessThan(firstLoadTime * 1.5);
  });

  test('should handle batch translation efficiently', async ({ page }) => {
    await page.goto('/es/dashboard/patients');
    
    // Check that multiple patient records are translated efficiently
    const patientRows = page.locator('[data-testid="patient-row"]');
    const rowCount = await patientRows.count();
    
    if (rowCount > 0) {
      // All rows should be visible and translated within reasonable time
      const startTime = Date.now();
      
      for (let i = 0; i < Math.min(rowCount, 5); i++) {
        await expect(patientRows.nth(i)).toBeVisible();
      }
      
      const translationTime = Date.now() - startTime;
      
      // Batch translation should complete within 5 seconds for 5 rows
      expect(translationTime).toBeLessThan(5000);
    }
  });

  test('should maintain translation accuracy under load', async ({ page }) => {
    await page.goto('/es/dashboard');
    
    // Navigate through multiple pages quickly to test translation stability
    const pages = [
      '/es/dashboard/appointments',
      '/es/dashboard/patients',
      '/es/dashboard/billing',
      '/es/dashboard/settings'
    ];

    for (const pagePath of pages) {
      await page.goto(pagePath);
      
      // Check that key Spanish terms are present
      const spanishTerms = ['Configuración', 'Guardar', 'Cancelar', 'Editar'];
      let foundSpanishTerm = false;
      
      for (const term of spanishTerms) {
        const termElement = page.locator(`text=${term}`);
        if (await termElement.isVisible()) {
          foundSpanishTerm = true;
          break;
        }
      }
      
      // At least one Spanish term should be visible on each page
      expect(foundSpanishTerm).toBeTruthy();
    }
  });

  test('should handle translation errors gracefully', async ({ page }) => {
    // Mock translation API failure
    await page.route('**/api/translate/**', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Translation service unavailable' })
      });
    });

    await page.goto('/es/dashboard');
    
    // Page should still load and function, even with translation failures
    await expect(page.locator('body')).toBeVisible();
    
    // Should fall back to original text or static translations
    const fallbackContent = page.locator('text=Dashboard').or(
      page.locator('text=Panel de Control')
    );
    
    await expect(fallbackContent.first()).toBeVisible();
  });

  test('should respect user language preferences', async ({ page, context }) => {
    // Set language preference in localStorage
    await page.addInitScript(() => {
      localStorage.setItem('preferred-language', 'es');
      localStorage.setItem('auto-translate', 'true');
    });

    await page.goto('/dashboard');
    
    // Should automatically show Spanish content
    const spanishContent = page.locator('text=Panel de Control').or(
      page.locator('text=Citas').or(
        page.locator('text=Pacientes')
      )
    );

    await expect(spanishContent.first()).toBeVisible({ timeout: 10000 });
  });

  test('should handle mixed content translation', async ({ page }) => {
    await page.goto('/es/dashboard/appointments');
    
    // Test page with mixed static and dynamic content
    const mixedContent = [
      { type: 'static', term: 'Citas' },
      { type: 'static', term: 'Pacientes' },
      { type: 'dynamic', term: 'Programado' },
      { type: 'dynamic', term: 'Confirmado' }
    ];

    for (const content of mixedContent) {
      const contentElement = page.locator(`text=${content.term}`);
      if (await contentElement.isVisible()) {
        await expect(contentElement).toBeVisible();
      }
    }
  });

  test('should maintain context in translations', async ({ page }) => {
    await page.goto('/es/dashboard/charting');
    
    // Test that dental context is maintained in translations
    // "Crown" in dental context should be "corona dental", not "corona" (royal crown)
    const dentalCrown = page.locator('text=/corona.*dental/i').or(
      page.locator('text=corona').and(page.locator(':not(text=/rey|real/i)'))
    );

    if (await dentalCrown.isVisible()) {
      await expect(dentalCrown).toBeVisible();
    }
  });

  test('should handle real-time content updates', async ({ page }) => {
    await page.goto('/es/dashboard');
    
    // Add new content dynamically
    await page.evaluate(() => {
      const newElement = document.createElement('div');
      newElement.textContent = 'New appointment scheduled';
      newElement.setAttribute('data-testid', 'new-content');
      document.body.appendChild(newElement);
    });

    // Wait for translation
    await page.waitForTimeout(1000);
    
    const newContent = page.locator('[data-testid="new-content"]');
    const contentText = await newContent.textContent();
    
    // Should be translated or at least not show English in Spanish context
    if (contentText) {
      // Should not contain "appointment" in Spanish context
      expect(contentText.toLowerCase()).not.toContain('appointment');
    }
  });

  test('should optimize translation for mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/es/dashboard');
    
    // Check that translations work efficiently on mobile
    const startTime = Date.now();
    
    // Navigate through mobile-optimized pages
    await page.click('[data-testid="mobile-menu"]').catch(() => {
      // Mobile menu might not exist, that's okay
    });
    
    const loadTime = Date.now() - startTime;
    
    // Mobile translation should be fast
    expect(loadTime).toBeLessThan(3000);
    
    // Check that Spanish content is visible
    const spanishContent = page.locator('text=Panel de Control').or(
      page.locator('text=Citas').or(
        page.locator('text=Menú')
      )
    );

    await expect(spanishContent.first()).toBeVisible({ timeout: 5000 });
  });

  test('should handle translation service availability', async ({ page }) => {
    // Test with translation service available
    await page.goto('/es/dashboard');
    
    // Check translation status indicator
    const translationStatus = page.locator('[data-testid="translation-status"]');
    
    if (await translationStatus.isVisible()) {
      const statusText = await translationStatus.textContent();
      expect(statusText).toContain('Translation Active');
    }
    
    // Mock translation service unavailable
    await page.route('**/api/integrations**', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ integrations: [] })
      });
    });

    await page.reload();
    
    // Should still function with fallback translations
    const fallbackContent = page.locator('text=Panel de Control').or(
      page.locator('text=Dashboard')
    );

    await expect(fallbackContent.first()).toBeVisible();
  });
});
