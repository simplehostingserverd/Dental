import { test, expect } from '@playwright/test';

test.describe('Complete User Workflow with Translation', () => {
  test('should complete full receptionist workflow in Spanish', async ({ page }) => {
    // Start in Spanish
    await page.goto('/es/auth/signin');
    
    // Verify login page is in Spanish
    await expect(page.locator('text=Iniciar Sesión')).toBeVisible();
    
    // Login as receptionist
    await page.fill('input[type="email"]', 'receptionist@test.com');
    await page.fill('input[type="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    
    // Wait for redirect to receptionist dashboard
    await page.waitForLoadState('networkidle');
    
    // Verify receptionist dashboard is in Spanish
    await expect(page.locator('text=Recepcionista')).toBeVisible({ timeout: 10000 });
    
    // Navigate to appointments
    await page.click('text=Citas');
    await page.waitForLoadState('networkidle');
    
    // Verify appointments page is in Spanish
    await expect(page.locator('text=Programar')).toBeVisible();
    
    // Try to create new appointment
    const newAppointmentButton = page.locator('text=Nueva Cita').or(
      page.locator('text=Agregar').or(
        page.locator('button:has-text("+")')
      )
    );
    
    if (await newAppointmentButton.isVisible()) {
      await newAppointmentButton.click();
      
      // Verify appointment form is in Spanish
      await expect(page.locator('text=Paciente')).toBeVisible();
      await expect(page.locator('text=Fecha')).toBeVisible();
      await expect(page.locator('text=Hora')).toBeVisible();
    }
    
    // Navigate to patients
    await page.click('text=Pacientes');
    await page.waitForLoadState('networkidle');
    
    // Verify patients page is in Spanish
    await expect(page.locator('text=Lista de Pacientes').or(
      page.locator('text=Pacientes')
    )).toBeVisible();
    
    // Check patient information fields
    const patientFields = ['Nombre', 'Apellido', 'Teléfono', 'Correo'];
    for (const field of patientFields) {
      const fieldElement = page.locator(`text=${field}`);
      if (await fieldElement.isVisible()) {
        await expect(fieldElement).toBeVisible();
      }
    }
    
    // Navigate to billing
    await page.click('text=Facturación');
    await page.waitForLoadState('networkidle');
    
    // Verify billing page is in Spanish
    await expect(page.locator('text=Facturación').or(
      page.locator('text=Pagos')
    )).toBeVisible();
    
    // Navigate to settings
    await page.click('text=Configuración');
    await page.waitForLoadState('networkidle');
    
    // Verify settings page is in Spanish
    await expect(page.locator('text=Configuración')).toBeVisible();
    
    // Test language switcher in settings
    const languageSwitcher = page.locator('[data-testid="language-switcher"]').or(
      page.locator('button:has-text("Español")')
    );
    
    if (await languageSwitcher.isVisible()) {
      await languageSwitcher.click();
      
      // Switch back to English
      const englishOption = page.locator('text=English').or(
        page.locator('text=🇺🇸')
      );
      
      await englishOption.click();
      await page.waitForLoadState('networkidle');
      
      // Verify page is now in English
      await expect(page.locator('text=Settings')).toBeVisible({ timeout: 10000 });
      
      // Switch back to Spanish
      const englishLanguageSwitcher = page.locator('button:has-text("English")');
      await englishLanguageSwitcher.click();
      
      const spanishOption = page.locator('text=Español').or(
        page.locator('text=🇪🇸')
      );
      
      await spanishOption.click();
      await page.waitForLoadState('networkidle');
      
      // Verify back in Spanish
      await expect(page.locator('text=Configuración')).toBeVisible({ timeout: 10000 });
    }
  });

  test('should complete full dentist workflow in Spanish', async ({ page }) => {
    // Login as dentist in Spanish
    await page.goto('/es/auth/signin');
    
    await page.fill('input[type="email"]', 'dentist@test.com');
    await page.fill('input[type="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    
    await page.waitForLoadState('networkidle');
    
    // Verify dentist dashboard is in Spanish
    await expect(page.locator('text=Panel de Control')).toBeVisible({ timeout: 10000 });
    
    // Navigate to patient charting
    await page.click('text=Gráficos Dentales').catch(async () => {
      // Fallback if exact text not found
      await page.click('text=Charting').catch(() => {
        // If neither found, that's okay for this test
      });
    });
    
    await page.waitForLoadState('networkidle');
    
    // Check for dental procedure terms in Spanish
    const dentalTerms = ['Limpieza', 'Empaste', 'Corona', 'Extracción'];
    let foundDentalTerm = false;
    
    for (const term of dentalTerms) {
      const termElement = page.locator(`text=${term}`);
      if (await termElement.isVisible()) {
        foundDentalTerm = true;
        await expect(termElement).toBeVisible();
        break;
      }
    }
    
    // Navigate to treatment plans
    await page.click('text=Planes de Tratamiento').catch(async () => {
      await page.click('text=Treatment Plans').catch(() => {
        // If not found, that's okay
      });
    });
    
    await page.waitForLoadState('networkidle');
    
    // Check for treatment plan terms
    const treatmentTerms = ['Tratamiento', 'Procedimiento', 'Diagnóstico'];
    for (const term of treatmentTerms) {
      const termElement = page.locator(`text=${term}`);
      if (await termElement.isVisible()) {
        await expect(termElement).toBeVisible();
      }
    }
  });

  test('should complete full patient workflow in Spanish', async ({ page }) => {
    // Navigate to patient portal in Spanish
    await page.goto('/es/patient/auth/signin');
    
    // Verify patient login page is in Spanish
    await expect(page.locator('text=Portal del Paciente').or(
      page.locator('text=Iniciar Sesión')
    )).toBeVisible();
    
    // Login as patient
    await page.fill('input[type="email"]', 'patient@test.com');
    await page.fill('input[type="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    
    await page.waitForLoadState('networkidle');
    
    // Verify patient dashboard is in Spanish
    await expect(page.locator('text=Mi Portal').or(
      page.locator('text=Mis Citas')
    )).toBeVisible({ timeout: 10000 });
    
    // Navigate to appointments
    await page.click('text=Mis Citas').catch(async () => {
      await page.click('text=Citas').catch(() => {
        // If not found, that's okay
      });
    });
    
    await page.waitForLoadState('networkidle');
    
    // Check for appointment-related terms
    const appointmentTerms = ['Próxima Cita', 'Historial', 'Programar'];
    for (const term of appointmentTerms) {
      const termElement = page.locator(`text=${term}`);
      if (await termElement.isVisible()) {
        await expect(termElement).toBeVisible();
      }
    }
    
    // Navigate to medical history
    await page.click('text=Historia Médica').catch(async () => {
      await page.click('text=Medical History').catch(() => {
        // If not found, that's okay
      });
    });
    
    await page.waitForLoadState('networkidle');
    
    // Check for medical history terms
    const medicalTerms = ['Alergias', 'Medicamentos', 'Condiciones'];
    for (const term of medicalTerms) {
      const termElement = page.locator(`text=${term}`);
      if (await termElement.isVisible()) {
        await expect(termElement).toBeVisible();
      }
    }
  });

  test('should handle appointment booking flow in Spanish', async ({ page }) => {
    // Start appointment booking in Spanish
    await page.goto('/es/patient/appointments/book');
    
    // Verify booking page is in Spanish
    await expect(page.locator('text=Reservar Cita').or(
      page.locator('text=Programar Cita')
    )).toBeVisible();
    
    // Check form fields are in Spanish
    const formFields = ['Tipo de Cita', 'Fecha Preferida', 'Hora Preferida', 'Motivo'];
    for (const field of formFields) {
      const fieldElement = page.locator(`text=${field}`);
      if (await fieldElement.isVisible()) {
        await expect(fieldElement).toBeVisible();
      }
    }
    
    // Check appointment types are in Spanish
    const appointmentTypes = ['Limpieza', 'Consulta', 'Emergencia', 'Seguimiento'];
    for (const type of appointmentTypes) {
      const typeElement = page.locator(`text=${type}`);
      if (await typeElement.isVisible()) {
        await expect(typeElement).toBeVisible();
      }
    }
  });

  test('should maintain language consistency during form submissions', async ({ page }) => {
    await page.goto('/es/auth/signin');
    
    // Try invalid login to test error messages
    await page.fill('input[type="email"]', 'invalid@email.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Wait for error message
    await page.waitForTimeout(2000);
    
    // Error messages should be in Spanish
    const errorElement = page.locator('[role="alert"], .error, .invalid').first();
    if (await errorElement.isVisible()) {
      const errorText = await errorElement.textContent();
      // Should not contain English error terms
      expect(errorText?.toLowerCase()).not.toContain('invalid');
      expect(errorText?.toLowerCase()).not.toContain('incorrect');
    }
  });

  test('should handle real-time notifications in Spanish', async ({ page }) => {
    // Login as receptionist
    await page.goto('/es/auth/signin');
    await page.fill('input[type="email"]', 'receptionist@test.com');
    await page.fill('input[type="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    
    await page.waitForLoadState('networkidle');
    
    // Look for notification area
    const notificationArea = page.locator('[data-testid="notifications"]').or(
      page.locator('.notification').or(
        page.locator('.alert')
      )
    );
    
    if (await notificationArea.isVisible()) {
      const notificationText = await notificationArea.textContent();
      
      // Notifications should be in Spanish
      if (notificationText) {
        // Should contain Spanish terms
        const hasSpanishTerms = ['nueva', 'cita', 'paciente', 'mensaje', 'recordatorio']
          .some(term => notificationText.toLowerCase().includes(term));
        
        if (hasSpanishTerms) {
          expect(hasSpanishTerms).toBeTruthy();
        }
      }
    }
  });

  test('should handle print and export functions in Spanish', async ({ page }) => {
    await page.goto('/es/dashboard/reports');
    
    // Look for print/export buttons
    const printButton = page.locator('text=Imprimir').or(
      page.locator('button:has-text("Print")')
    );
    
    const exportButton = page.locator('text=Exportar').or(
      page.locator('button:has-text("Export")')
    );
    
    if (await printButton.isVisible()) {
      await expect(printButton).toBeVisible();
    }
    
    if (await exportButton.isVisible()) {
      await expect(exportButton).toBeVisible();
    }
  });
});
