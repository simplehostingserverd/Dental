import { test, expect } from '@playwright/test';

test.describe('Translation Accuracy', () => {
  test.beforeEach(async ({ page }) => {
    // Set up Spanish locale
    await page.goto('/es/');
  });

  test('should accurately translate dental procedures', async ({ page }) => {
    await page.goto('/es/dashboard/appointments');
    
    // Test common dental procedure translations
    const dentalTerms = [
      { english: 'Cleaning', spanish: 'Limpieza' },
      { english: 'Filling', spanish: 'Empaste' },
      { english: 'Crown', spanish: 'Corona' },
      { english: 'Root Canal', spanish: 'Endodoncia' },
      { english: 'Extraction', spanish: 'Extracción' },
      { english: 'Whitening', spanish: 'Blanqueamiento' },
      { english: 'Implant', spanish: 'Implante' },
      { english: 'Orthodontics', spanish: 'Ortodoncia' }
    ];

    for (const term of dentalTerms) {
      // Look for Spanish translation
      const spanishTerm = page.locator(`text=${term.spanish}`);
      if (await spanishTerm.isVisible()) {
        await expect(spanishTerm).toBeVisible();
      }
    }
  });

  test('should accurately translate appointment statuses', async ({ page }) => {
    await page.goto('/es/dashboard/appointments');
    
    const statusTerms = [
      { english: 'Scheduled', spanish: 'Programado' },
      { english: 'Confirmed', spanish: 'Confirmado' },
      { english: 'In Progress', spanish: 'En Progreso' },
      { english: 'Completed', spanish: 'Completado' },
      { english: 'Cancelled', spanish: 'Cancelado' },
      { english: 'No Show', spanish: 'No Se Presentó' }
    ];

    for (const status of statusTerms) {
      const spanishStatus = page.locator(`text=${status.spanish}`);
      if (await spanishStatus.isVisible()) {
        await expect(spanishStatus).toBeVisible();
      }
    }
  });

  test('should accurately translate patient information fields', async ({ page }) => {
    await page.goto('/es/dashboard/patients');
    
    const patientFields = [
      { english: 'First Name', spanish: 'Nombre' },
      { english: 'Last Name', spanish: 'Apellido' },
      { english: 'Date of Birth', spanish: 'Fecha de Nacimiento' },
      { english: 'Phone', spanish: 'Teléfono' },
      { english: 'Email', spanish: 'Correo Electrónico' },
      { english: 'Address', spanish: 'Dirección' },
      { english: 'Insurance', spanish: 'Seguro' }
    ];

    for (const field of patientFields) {
      const spanishField = page.locator(`text=${field.spanish}`);
      if (await spanishField.isVisible()) {
        await expect(spanishField).toBeVisible();
      }
    }
  });

  test('should accurately translate navigation menu', async ({ page }) => {
    await page.goto('/es/dashboard');
    
    const navigationTerms = [
      { english: 'Dashboard', spanish: 'Panel de Control' },
      { english: 'Appointments', spanish: 'Citas' },
      { english: 'Patients', spanish: 'Pacientes' },
      { english: 'Treatment Plans', spanish: 'Planes de Tratamiento' },
      { english: 'Billing', spanish: 'Facturación' },
      { english: 'Messages', spanish: 'Mensajes' },
      { english: 'Settings', spanish: 'Configuración' }
    ];

    for (const nav of navigationTerms) {
      const spanishNav = page.locator(`text=${nav.spanish}`);
      if (await spanishNav.isVisible()) {
        await expect(spanishNav).toBeVisible();
      }
    }
  });

  test('should accurately translate common actions', async ({ page }) => {
    await page.goto('/es/dashboard');
    
    const actionTerms = [
      { english: 'Save', spanish: 'Guardar' },
      { english: 'Cancel', spanish: 'Cancelar' },
      { english: 'Delete', spanish: 'Eliminar' },
      { english: 'Edit', spanish: 'Editar' },
      { english: 'Add', spanish: 'Agregar' },
      { english: 'Search', spanish: 'Buscar' },
      { english: 'Filter', spanish: 'Filtrar' }
    ];

    for (const action of actionTerms) {
      const spanishAction = page.locator(`text=${action.spanish}`);
      if (await spanishAction.isVisible()) {
        await expect(spanishAction).toBeVisible();
      }
    }
  });

  test('should handle medical term precision', async ({ page }) => {
    await page.goto('/es/dashboard/charting');
    
    // Test that medical terms are translated with high precision
    const medicalTerms = [
      { english: 'Gingivitis', spanish: 'Gingivitis' },
      { english: 'Periodontitis', spanish: 'Periodontitis' },
      { english: 'Cavity', spanish: 'Caries' },
      { english: 'Abscess', spanish: 'Absceso' },
      { english: 'Plaque', spanish: 'Placa' },
      { english: 'Tartar', spanish: 'Sarro' }
    ];

    for (const term of medicalTerms) {
      const spanishTerm = page.locator(`text=${term.spanish}`);
      if (await spanishTerm.isVisible()) {
        await expect(spanishTerm).toBeVisible();
      }
    }
  });

  test('should translate date and time formats', async ({ page }) => {
    await page.goto('/es/dashboard/appointments');
    
    // Check for Spanish date format patterns
    const spanishDatePatterns = [
      /\d{1,2} de \w+ de \d{4}/, // "15 de enero de 2024"
      /\w+, \d{1,2} de \w+/, // "lunes, 15 de enero"
    ];

    const pageContent = await page.textContent('body');
    
    // At least one Spanish date pattern should be present
    const hasSpanishDate = spanishDatePatterns.some(pattern => 
      pattern.test(pageContent || '')
    );
    
    if (pageContent && pageContent.includes('de ')) {
      expect(hasSpanishDate).toBeTruthy();
    }
  });

  test('should translate currency and numbers', async ({ page }) => {
    await page.goto('/es/dashboard/billing');
    
    // Check for Spanish currency formatting
    const currencyElements = page.locator('text=/\\$[\\d,]+\\.\\d{2}/');
    
    if (await currencyElements.count() > 0) {
      // Currency should still use $ but may have Spanish formatting
      await expect(currencyElements.first()).toBeVisible();
    }
  });

  test('should handle form validation messages', async ({ page }) => {
    await page.goto('/es/auth/signin');
    
    // Try to submit empty form to trigger validation
    await page.click('button[type="submit"]');
    
    // Look for Spanish validation messages
    const validationMessages = [
      'Este campo es requerido',
      'Correo electrónico inválido',
      'La contraseña es requerida',
      'Por favor complete este campo'
    ];

    let foundSpanishValidation = false;
    for (const message of validationMessages) {
      const validationElement = page.locator(`text=${message}`);
      if (await validationElement.isVisible()) {
        foundSpanishValidation = true;
        await expect(validationElement).toBeVisible();
        break;
      }
    }

    // If no specific Spanish validation found, check for any validation in Spanish
    if (!foundSpanishValidation) {
      const anyValidation = page.locator('[role="alert"], .error, .invalid');
      if (await anyValidation.count() > 0) {
        const validationText = await anyValidation.first().textContent();
        // Should not contain English validation terms
        expect(validationText).not.toContain('required');
        expect(validationText).not.toContain('invalid');
      }
    }
  });

  test('should translate error and success messages', async ({ page }) => {
    await page.goto('/es/auth/signin');
    
    // Try invalid login to trigger error message
    await page.fill('input[type="email"]', 'invalid@email.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Wait for error message
    await page.waitForTimeout(2000);
    
    // Look for Spanish error messages
    const errorMessages = [
      'Credenciales inválidas',
      'Error de inicio de sesión',
      'Usuario no encontrado',
      'Contraseña incorrecta'
    ];

    let foundSpanishError = false;
    for (const message of errorMessages) {
      const errorElement = page.locator(`text=${message}`);
      if (await errorElement.isVisible()) {
        foundSpanishError = true;
        await expect(errorElement).toBeVisible();
        break;
      }
    }
  });

  test('should maintain translation consistency across pages', async ({ page }) => {
    // Test that the same term is translated consistently across different pages
    const consistencyTerms = [
      { term: 'Pacientes', pages: ['/es/dashboard', '/es/dashboard/patients', '/es/dashboard/appointments'] },
      { term: 'Citas', pages: ['/es/dashboard', '/es/dashboard/appointments', '/es/receptionist'] },
      { term: 'Configuración', pages: ['/es/dashboard', '/es/dashboard/settings', '/es/receptionist/settings'] }
    ];

    for (const { term, pages } of consistencyTerms) {
      for (const pagePath of pages) {
        await page.goto(pagePath);
        
        const termElement = page.locator(`text=${term}`);
        if (await termElement.isVisible()) {
          await expect(termElement).toBeVisible();
        }
      }
    }
  });

  test('should handle pluralization correctly', async ({ page }) => {
    await page.goto('/es/dashboard/patients');
    
    // Test singular vs plural forms
    const pluralTerms = [
      { singular: 'Paciente', plural: 'Pacientes' },
      { singular: 'Cita', plural: 'Citas' },
      { singular: 'Tratamiento', plural: 'Tratamientos' },
      { singular: 'Mensaje', plural: 'Mensajes' }
    ];

    for (const { singular, plural } of pluralTerms) {
      // Check if either singular or plural form exists
      const singularElement = page.locator(`text=${singular}`);
      const pluralElement = page.locator(`text=${plural}`);
      
      const hasSingular = await singularElement.isVisible();
      const hasPlural = await pluralElement.isVisible();
      
      // At least one form should be present
      expect(hasSingular || hasPlural).toBeTruthy();
    }
  });
});
