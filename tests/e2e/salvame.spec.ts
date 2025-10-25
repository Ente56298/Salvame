// Arquitecto: DIOS | Implementador: Jorge Hernández
import { test, expect } from '@playwright/test';

test.describe('Salvame E2E Tests', () => {
  test('debe cargar la página principal', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Salvame/);
  });

  test('debe mostrar 6 agentes IA', async ({ page }) => {
    await page.goto('/');
    const agents = await page.locator('[data-testid="agent"]').count();
    expect(agents).toBe(6);
  });

  test('debe activar asistente inteligente', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="intelligent-assistant"]');
    await expect(page.locator('[data-testid="chat-mode"]')).toBeVisible();
  });

  test('debe mostrar telemetría vehicular', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="vehicle-telemetry"]');
    await expect(page.locator('[data-testid="fuel-level"]')).toBeVisible();
  });

  test('debe cargar multiservicios', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="multiservices"]');
    const categories = await page.locator('[data-testid="service-category"]').count();
    expect(categories).toBe(6);
  });

  test('debe mostrar compliance México', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-testid="mexican-compliance"]')).toBeVisible();
  });
});
