import { test, expect } from "@playwright/test";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
for (const width of [320, 390, 768, 1024, 1440])
  for (const language of ["id", "en"]) {
    test(`responsive ${width} ${language}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/roxy-landing/");
      if (language === "en") await page.locator("#language").click();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      const art = await page.locator(".roxy").boundingBox();
      expect(art.x).toBeGreaterThanOrEqual(0);
      expect(art.x + art.width).toBeLessThanOrEqual(width);
      expect(art.width).toBeLessThanOrEqual(338);
      for (const tab of await page.getByRole("tab").all()) {
        await tab.click();
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
      }
      const targets = await page
        .locator("a:visible,button:visible")
        .evaluateAll((els) =>
          els
            .filter((e) => !e.classList.contains("skip"))
            .map((e) => ({
              text: e.textContent,
              height: e.getBoundingClientRect().height,
            })),
        );
      for (const target of targets)
        expect(target.height, target.text).toBeGreaterThanOrEqual(44);
      const bounds = await page
        .locator(".discipline-nav a")
        .evaluateAll((els) =>
          els.map((e) => ({
            left: e.getBoundingClientRect().left,
            right: e.getBoundingClientRect().right,
            top: e.getBoundingClientRect().top,
          })),
        );
      for (let i = 1; i < bounds.length; i++)
        if (bounds[i].top === bounds[i - 1].top)
          expect(bounds[i].left).toBeGreaterThanOrEqual(bounds[i - 1].right);
    });
  }
for (const width of [390, 1440])
  for (const language of ["id", "en"]) {
    test(`axe WCAG ${width} ${language}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      if (language === "en") await page.locator("#language").click();
      await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") });
      for (const tab of await page.getByRole("tab").all()) {
        await tab.click();
        const violations = await page.evaluate(
          async () =>
            (
              await window.axe.run(document, {
                runOnly: {
                  type: "tag",
                  values: ["wcag2a", "wcag2aa", "wcag21aa", "best-practice"],
                },
              })
            ).violations,
        );
        expect(violations).toEqual([]);
      }
    });
  }
test("static no-JS page and anchors", async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 320, height: 800 },
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4173/roxy-landing/");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator("#language")).toBeDisabled();
  await expect(page.locator("#motion")).toBeDisabled();
  for (const id of ["build", "research", "learn"]) {
    await page.locator(`a[href="#${id}"]`).click();
    await expect(page.locator("#" + id)).toBeVisible();
    await expect(page).toHaveURL(new RegExp("#" + id + "$"));
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await context.close();
});
test("clean requests, complete translation, anchors and keyboard focus", async ({
  page,
}) => {
  const errors = [];
  page.on("request", (request) => {
    if (new URL(request.url()).origin !== "http://127.0.0.1:4173")
      errors.push("External request: " + request.url());
  });
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("requestfailed", (r) => errors.push(r.url()));
  page.on("response", (r) => {
    if (r.status() >= 400) errors.push(r.url());
  });
  await page.goto("/roxy-landing/");
  await page.keyboard.press("Tab");
  await expect(page.locator(".skip")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);
  const original = await page.locator("[data-i]").allTextContents();
  await page.locator("#language").click();
  const translated = await page.locator("[data-i]").allTextContents();
  original.forEach((text, i) => {
    if (text === "02 / GRIMOIRE") expect(translated[i]).toBe(text);
    else expect(translated[i]).not.toBe(text);
  });
  await expect(page.locator("nav")).toHaveAttribute(
    "aria-label",
    "Main navigation",
  );
  await expect(page.locator(".roxy")).toHaveAttribute("alt", /wearing/);
  await expect(page.locator("meta[name=description]")).toHaveAttribute(
    "content",
    /learning space/,
  );
  for (const href of ["#ethos", "#grimoire", "#journal"]) {
    await page.locator(`nav a[href="${href}"]`).click();
    await expect(page).toHaveURL(new RegExp(href + "$"));
  }
  await page.locator("#motion").click();
  await page.locator("#language").click();
  await expect(page.locator("#motion")).toHaveText("Gerak: mati");
  expect(errors).toEqual([]);
});
test("motion pauses when document becomes hidden", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  expect(
    await page.evaluate(() => document.getAnimations().map((a) => a.playState)),
  ).toEqual(["paused"]);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: false,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  expect(
    await page.evaluate(() => document.getAnimations().map((a) => a.playState)),
  ).toEqual(["running"]);
});
test("full-page screenshots", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const [name, width] of [
    ["desktop", 1440],
    ["mobile", 390],
  ]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.screenshot({ path: `test-results/${name}.png`, fullPage: true });
  }
});
test("motion respects reduction, explicit off and persistence", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const button = page.locator("#motion");
  await expect(button).toBeEnabled({ timeout: 2000 });
  await expect(button).toHaveAttribute("aria-pressed", "false");
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
  await button.click();
  await expect(button).toHaveAttribute("aria-pressed", "true");
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect
    .poll(() => page.evaluate(() => document.getAnimations().length))
    .toBe(1);
  await button.click();
  await expect(button).toHaveAttribute("aria-pressed", "false");
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
  await page.reload();
  await expect(button).toHaveAttribute("aria-pressed", "false");
  await page.getByRole("button", { name: "Switch to English" }).click();
  await expect(button).toHaveText("Motion: off");
});
test("language translates and persists", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Switch to English" })
    .click({ timeout: 2000 });
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("h1")).toHaveText(
    "Calm on the surface. Depth in every thought.",
  );
  await expect(page).toHaveTitle("Roxy — The Quiet Current · AI mentor");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.getByRole("button", { name: "Ganti ke Bahasa Indonesia" }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "id");
});
test("denied storage and keyboard grimoire remain usable", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new DOMException("Denied", "SecurityError");
      },
    });
  });
  await page.goto("/");
  await page
    .getByRole("button", { name: "Switch to English" })
    .click({ timeout: 2000 });
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  const tabs = page.getByRole("tab");
  await expect(tabs).toHaveCount(3);
  await tabs.nth(0).focus();
  await page.keyboard.press("ArrowRight");
  await expect(tabs.nth(1)).toBeFocused();
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel")).toHaveCount(1);
  await page.keyboard.press("End");
  await expect(tabs.nth(2)).toBeFocused();
  await page.keyboard.press("Home");
  await expect(tabs.nth(0)).toBeFocused();
  await tabs.nth(2).click();
  await expect(page.locator("#learn")).toBeVisible();
});
test("hero is a complete Indonesian page with canonical art", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Tenang di permukaan. Dalam di pemikiran.",
  );
  await expect(page.locator("html")).toHaveAttribute("lang", "id");
  const img = page.locator(".roxy");
  await expect(img).toBeVisible();
  expect(
    await img.evaluate((i) => [i.naturalWidth, i.naturalHeight, i.complete]),
  ).toEqual([338, 655, true]);
  await page.getByRole("link", { name: "Buka grimoire" }).click();
  await expect(page).toHaveURL(/#grimoire$/);
});
