import { test, expect } from '@playwright/test';

const userEmail = process.env.PLAYWRIGHT_USER_EMAIL || 'demo@afriglam.test';
const adminEmail = process.env.PLAYWRIGHT_ADMIN_EMAIL || 'ops-admin@example.com';
const userPassword = process.env.PLAYWRIGHT_USER_PASSWORD || 'password123';

test.describe('Storefront smoke (demo mode)', () => {
  test('login, add to cart, reach checkout', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email Address').fill(userEmail);
    await page.getByLabel('Password').fill(userPassword);
    await page.getByRole('button', { name: 'Sign In' }).click();

    await page.waitForURL('**/feed');
    await page.goto('/products/all');
    await page.getByRole('link', { name: 'View Product' }).first().click();
    await page.getByRole('button', { name: /ADD TO CART/i }).click();

    await page.goto('/cart');
    await expect(page.getByRole('heading', { name: 'Shopping Cart' })).toBeVisible();
    await page.getByRole('button', { name: 'Proceed to Checkout' }).click();

    await expect(page).toHaveURL(/\/checkout$/);
    await page.getByPlaceholder('Full name').fill('Playwright Customer');
    await page.getByPlaceholder('Email address').fill('customer@example.com');
    await page.getByPlaceholder('Delivery address').fill('123 Demo Street');
    await page.getByPlaceholder('City').fill('Lagos');
    await page.getByPlaceholder('State / Region').fill('Lagos');
    await page.getByPlaceholder('Postal code').fill('100001');
    await page.getByPlaceholder('Country').fill('Nigeria');
    await page.getByPlaceholder('Phone number').fill('+2348012345678');

    await expect(page.getByText('Demo mode is active')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Complete Checkout' })).toBeDisabled();
  });
});

test.describe('Admin smoke (demo mode)', () => {
  test('admin login and orders page renders', async ({ page }) => {
    await page.goto('/admin/login');
    await page.getByPlaceholder('admin@yourdomain.com').fill(adminEmail);
    await page.getByPlaceholder('Enter your password').fill(userPassword);
    await page.getByRole('button', { name: 'Sign in to Dashboard' }).click();

    await page.waitForURL('**/admin/dashboard');
    await page.getByRole('link', { name: 'Orders' }).click();
    await page.waitForURL('**/admin/orders');

    await expect(page.getByRole('heading', { name: 'Orders' })).toBeVisible();
    await expect(page.getByText('Manage and fulfill customer orders.')).toBeVisible();
    await expect(page.getByText('Export')).toBeVisible();
  });
});
