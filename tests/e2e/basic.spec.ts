import { test, expect } from '@playwright/test';

test('landing and locale switch', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/en/);
  await expect(page.getByText('Build your Resume')).toBeVisible();
});

test('signup -> verify (simulated) -> signin', async ({ page }) => {
  const email = `user${Date.now()}@example.com`;
  await page.goto('/en/auth/signup');
  await page.getByPlaceholder('Full name').fill('E2E User');
  await page.getByPlaceholder('Email').fill(email);
  await page.getByPlaceholder('Password (min 8 chars)').fill('password123');
  await page.getByRole('button', { name: 'Sign up' }).click();
  await expect(page.getByText('Check your email to verify')).toBeVisible();

  // Simulate verification by calling server endpoint directly (seed token)
  // For e2e, we skip actual email and mark verified via API
  await page.request.post('/api/test/verify', { data: { email } });

  await page.goto('/en/auth/signin');
  await page.getByPlaceholder('Email').fill(email);
  await page.getByPlaceholder('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL(/\/en\/resumes/);
});
