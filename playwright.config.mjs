import { defineConfig } from "@playwright/test";
import { existsSync } from "node:fs";
const local = "/root/.hermes/tools/chromium-1208/chrome-linux/chrome";
export default defineConfig({
  testDir: "./tests",
  // The alternate-cwd regression rebuilds dist; serialize it with browser reads.
  workers: 1,
  use: {
    baseURL: "http://127.0.0.1:4173",
    launchOptions: {
      executablePath:
        process.env.CHROMIUM_PATH || (existsSync(local) ? local : undefined),
    },
    headless: true,
  },
  webServer: {
    command: "node scripts/server.mjs",
    url: "http://127.0.0.1:4173/health",
    reuseExistingServer: false,
  },
  reporter: "list",
});
