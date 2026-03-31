import { defineConfig } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:4173';
const webServerCommand =
  process.env.PLAYWRIGHT_WEB_SERVER || 'npm run dev -- --host --port 4173';

export default defineConfig({
  testDir: './smoke',
  timeout: 120_000,
  fullyParallel: false,
  use: {
    baseURL,
    headless: true,
    channel: process.env.PLAYWRIGHT_BROWSER || 'msedge',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: webServerCommand,
    url: baseURL,
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },
});
