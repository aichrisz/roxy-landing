import { publicPath } from "../scripts/public-files.mjs";
import { symlink } from "node:fs/promises";
import { test, expect } from "@playwright/test";
test("public path rejects symlink files and directories", async () => {
  const fixture = new URL("../test-results/path-fixture/", import.meta.url);
  const base = fileURLToPath(fixture);
  await mkdir(base, { recursive: true });
  try {
    await symlink(root + "index.html", base + "index.html");
    await expect(publicPath(base, "index.html")).rejects.toThrow(
      "Symlink denied",
    );
    await symlink(root + "assets", base + "assets");
    await expect(publicPath(base, "assets/current.svg")).rejects.toThrow(
      "Symlink denied",
    );
    await expect(publicPath(root, "../package.json")).rejects.toThrow(
      "Not public",
    );
  } finally {
    await rm(base, { recursive: true, force: true });
  }
});
import { execFileSync } from "node:child_process";
import { mkdir, writeFile, readFile, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../", import.meta.url));
test("server denies private paths", async ({ request }) => {
  for (const path of [
    "/package.json",
    "/package-lock.json",
    "/.git/HEAD",
    "/docs/tdd-evidence.md",
    "/scripts/server.mjs",
    "/roxy-landing/package.json",
    "/assets/../package.json",
  ])
    expect((await request.get(path)).status()).toBe(404);
});
test("build is safe from alternate cwd", async () => {
  const cwd = root + "test-results/alternate-cwd";
  await mkdir(cwd + "/dist", { recursive: true });
  await writeFile(cwd + "/dist/keep.txt", "keep");
  try {
    const output = execFileSync(
      process.execPath,
      [root + "scripts/build.mjs"],
      { cwd, encoding: "utf8" },
    );
    expect(output).toContain("Built 5 static files");
    expect(await readFile(cwd + "/dist/keep.txt", "utf8")).toBe("keep");
  } finally {
    await rm(cwd, { recursive: true, force: true });
  }
});
for (const width of [390, 1440])
  test(`tab orientation ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const tabs = page.getByRole("tab");
    await expect(page.getByRole("tablist")).toHaveAttribute(
      "aria-orientation",
      width > 650 ? "vertical" : "horizontal",
    );
    await tabs.nth(0).focus();
    await page.keyboard.press(width > 650 ? "ArrowDown" : "ArrowRight");
    await expect(tabs.nth(1)).toBeFocused();
    await expect(page.getByRole("tabpanel")).toHaveCount(1);
    await expect(page.locator("#build")).toBeHidden();
    await page.keyboard.press(width > 650 ? "ArrowUp" : "ArrowLeft");
    await expect(tabs.nth(0)).toBeFocused();
    await page.setViewportSize({
      width: width > 650 ? 390 : 1440,
      height: 900,
    });
    await expect(page.getByRole("tablist")).toHaveAttribute(
      "aria-orientation",
      width > 650 ? "horizontal" : "vertical",
    );
  });
test("language roundtrip and reduced motion explanation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const snapshot = () =>
    page.evaluate(() => ({
      text: [...document.querySelectorAll("[data-i]")].map(
        (e) => e.textContent,
      ),
      aria: [...document.querySelectorAll("[data-a]")].map(
        (e) => e.getAttribute("aria-label") || e.getAttribute("alt"),
      ),
      meta: document.querySelector("meta[name=description]").content,
      title: document.title,
    }));
  const before = await snapshot();
  await expect(page.locator("#language")).toHaveAttribute("lang", "en");
  await page.locator("#language").click();
  await expect(page.locator("#language")).toHaveAttribute("lang", "id");
  await page.locator("#motion").click();
  await expect(page.locator("#motion")).toHaveAttribute(
    "aria-description",
    /system.*reduced motion/i,
  );
  await page.locator("#language").click();
  await expect(page.locator("#motion")).toHaveAttribute(
    "aria-description",
    /sistem/,
  );
  await page.locator("#motion").click();
  expect(await snapshot()).toEqual(before);
});
