import { test, expect } from '@playwright/test';

test('should display login form', async ({ page }) => {

    await page.goto('/auth/login');

    await expect(
        page.locator('input[name="email"]')
    ).toBeVisible();

    await expect(
        page.locator('input[name="passwordHash"]')
    ).toBeVisible();

    await expect(
        page.getByRole('button', { name: 'Log in' })
    ).toBeVisible();
});

/** Formular fill */
test('should allow user to type credentials', async ({ page }) => {

    await page.goto('/auth/login');

    await page.fill(
        'input[name="email"]',
        'test@example.com'
    );

    await page.fill(
        'input[name="passwordHash"]',
        'password123'
    );

    await expect(
        page.locator('input[name="email"]')
    ).toHaveValue('test@example.com');

    await expect(
        page.locator('input[name="passwordHash"]')
    ).toHaveValue('password123');
});

test('should login successfully', async ({ page }) => {
  await page.goto('/auth/login');

  await page.getByTestId('login-email').fill('demo@mbokogo.com');
  await page.getByTestId('login-password').fill('12demo34');

  await page.getByTestId('login-button').click({ force: true });

  await expect(page.getByRole('link', { name: /Create a Listing/i })).toBeVisible();
});