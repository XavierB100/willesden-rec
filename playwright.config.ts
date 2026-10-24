import { defineConfig } from "@playwright/test";

export default defineConfig({
  outputDir: "test-results/browser",
  testDir: "./tests/browser",
  webServer: process.env.VERIFY_URL
    ? undefined
    : {
        command: "npm start -- --port 3100",
        url: "http://localhost:3100",
        reuseExistingServer: true,
        timeout: 30_000,
      },
  fullyParallel: false,
  workers: 1,
  timeout: 45_000,
  use: {
    baseURL: process.env.VERIFY_URL || "http://localhost:3100",
    viewport: { width: 1440, height: 1000 },
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  reporter: [["list"], ["html", { open: "never" }]],
});
