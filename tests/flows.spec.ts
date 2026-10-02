import { test, expect, type Page } from "@playwright/test";
const KEY = "northstar-relevance-v1";
async function begin(page: Page) {
  await page.getByRole("button", { name: "Choose my starting point" }).click();
  await page.getByRole("button", { name: "Preview preferences" }).click();
  await page
    .getByRole("button", { name: "Confirm change", exact: true })
    .click();
}
async function changeTime(page: Page, value: string) {
  await page.getByRole("button", { name: "Edit my preferences" }).click();
  await page.getByLabel("Maximum course duration").selectOption(value);
  await page.getByRole("button", { name: "Preview preferences" }).click();
  await page
    .getByRole("button", { name: "Confirm change", exact: true })
    .click();
}
test.beforeEach(async ({ page }) => {
  await page.goto("./");
});
test("cold start requires choices; primary route and exact why", async ({
  page,
}) => {
  await expect(page.getByText("We do not know your goal yet.")).toBeVisible();
  await begin(page);
  const titles = await page.locator(".course h3").allTextContents();
  expect(titles).toEqual([
    "Read a small dataset",
    "Tell the story behind a number",
    "Ask a better learning question",
    "Notice what the data leaves out",
  ]);
  await page
    .getByRole("button", {
      name: "Why this: Read a small dataset",
      exact: true,
    })
    .click();
  await expect(page.getByRole("dialog")).toContainText("3 × 10 = 30");
  await expect(page.getByRole("dialog")).toContainText(
    "Passes duration, level, prerequisites, completion and hide checks.",
  );
  await page.getByRole("button", { name: "Back to courses" }).click();
  await expect(
    page.getByRole("button", {
      name: "Why this: Read a small dataset",
      exact: true,
    }),
  ).toBeFocused();
});
test("cancel preview and cancel form do not save", async ({ page }) => {
  await page.getByRole("button", { name: "Choose my starting point" }).click();
  await page.getByLabel("Learning goal").selectOption("story");
  await page.getByRole("button", { name: "Preview preferences" }).click();
  await page.getByRole("button", { name: "Cancel preview" }).click();
  expect(await page.evaluate((k) => localStorage.getItem(k), KEY)).toBeNull();
  await page.getByRole("button", { name: "Cancel editing" }).click();
  await expect(page.getByText("We do not know your goal yet.")).toBeVisible();
});
test("policies produce traceable different ordering and saved refresh", async ({
  page,
}) => {
  await begin(page);
  await page.getByRole("button", { name: "Exploration", exact: true }).click();
  await page
    .getByRole("button", { name: "Confirm change", exact: true })
    .click();
  expect(await page.locator(".course h3").allTextContents()).toEqual([
    "Notice what the data leaves out",
    "Tell the story behind a number",
    "Ask a better learning question",
    "Read a small dataset",
  ]);
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Exploration", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
});
test("hide and restore affect only that course; undo reviewed", async ({
  page,
}) => {
  await begin(page);
  await page
    .getByRole("button", {
      name: "Not for me: Read a small dataset",
      exact: true,
    })
    .click();
  await expect(page.locator(".course h3")).toHaveCount(3);
  await page
    .getByRole("button", { name: "Restore Read a small dataset", exact: true })
    .click();
  await expect(page.locator(".course h3")).toHaveCount(4);
  await page.getByRole("button", { name: "Undo last change" }).click();
  await expect(page.getByRole("dialog")).toContainText(
    "Hide Read a small dataset again",
  );
  await page
    .getByRole("button", { name: "Confirm change", exact: true })
    .click();
  await expect(page.locator(".course h3")).toHaveCount(3);
});
test("no match never violates duration or positive goal", async ({ page }) => {
  await begin(page);
  await changeTime(page, "20");
  await expect(
    page.getByRole("heading", { name: "No eligible courses" }),
  ).toBeVisible();
  await expect(page.locator(".course")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Inspect catalog eligibility" })
    .click();
  await expect(page.locator(".course")).toHaveCount(8);
  await expect(
    page
      .locator(".course")
      .filter({ hasText: "Sketch an idea before building" }),
  ).toContainText("Outside your stated goal (match 0/3).");
  await page.getByRole("button", { name: "Edit my preferences" }).click();
  await page.getByLabel("Maximum course duration").selectOption("60");
  await page.getByRole("button", { name: "Preview preferences" }).click();
  await page
    .getByRole("button", { name: "Confirm change", exact: true })
    .click();
  await page.getByRole("button", { name: "For your goal" }).click();
  await expect(page.locator(".course")).toHaveCount(4);
});
test("completed courses require consistent prerequisites and unlock applied", async ({
  page,
}) => {
  await begin(page);
  await page.getByRole("button", { name: "Edit my preferences" }).click();
  await page.getByLabel("Choose a chart with care", { exact: true }).check();
  await page.getByRole("button", { name: "Preview preferences" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Completed courses conflict",
  );
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByLabel("Choose a chart with care", { exact: true }).uncheck();
  await page.getByLabel("Read a small dataset", { exact: true }).check();
  await page.getByLabel("Highest course level").selectOption("2");
  await page.getByRole("button", { name: "Preview preferences" }).click();
  await page
    .getByRole("button", { name: "Confirm change", exact: true })
    .click();
  await expect(page.locator(".course h3").first()).toHaveText(
    "Choose a chart with care",
  );
  await expect(page.locator(".course h3")).not.toContainText([
    "Read a small dataset",
  ]);
});
test("fixture discloses numerator denominator and judgments", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Policy comparison" }).click();
  await expect(page.locator(".comparison article").first()).toContainText(
    "3/3 eligible useful (100%)",
  );
  await expect(page.locator(".comparison article").nth(1)).toContainText(
    "2/3 eligible useful (67%)",
  );
  await expect(page.locator(".comparison article").nth(1)).toContainText(
    "0/3 shown",
  );
  await expect(
    page.getByText("Sketch an idea before building").last(),
  ).toBeVisible();
});
test("reset cancel confirm undo exact prior full state", async ({ page }) => {
  await begin(page);
  await page
    .getByRole("button", {
      name: "Not for me: Read a small dataset",
      exact: true,
    })
    .click();
  await page.getByRole("button", { name: "Reset sample" }).click();
  await page.getByRole("button", { name: "Cancel preview" }).click();
  await expect(page.locator(".course")).toHaveCount(3);
  await page.getByRole("button", { name: "Reset sample" }).click();
  await page.getByRole("button", { name: "Confirm reset" }).click();
  await expect(page.getByText("We do not know your goal yet.")).toBeVisible();
  await page.getByRole("button", { name: "Undo last change" }).click();
  await page
    .getByRole("button", { name: "Confirm change", exact: true })
    .click();
  await expect(page.locator(".course")).toHaveCount(3);
  await expect(
    page.getByRole("button", {
      name: "Restore Read a small dataset",
      exact: true,
    }),
  ).toBeVisible();
});
test("invalid storage stays intact until explicit reset", async ({ page }) => {
  await page.evaluate(
    (k) =>
      localStorage.setItem(
        k,
        '{"version":9,"note":"<img src=x onerror=alert(1)>"}',
      ),
    KEY,
  );
  await page.reload();
  await expect(page.getByRole("status")).toContainText("Saved data is invalid");
  await begin(page);
  expect(await page.evaluate((k) => localStorage.getItem(k), KEY)).toContain(
    'version":9',
  );
  await page.getByRole("button", { name: "Reset sample" }).click();
  await page.getByRole("button", { name: "Cancel preview" }).click();
  expect(await page.evaluate((k) => localStorage.getItem(k), KEY)).toContain(
    'version":9',
  );
  await page.getByRole("button", { name: "Reset sample" }).click();
  await page.getByRole("button", { name: "Confirm reset" }).click();
  expect(
    await page.evaluate(
      (k) => JSON.parse(localStorage.getItem(k)!).version,
      KEY,
    ),
  ).toBe(1);
  expect(await page.locator("img").count()).toBe(0);
});
test("same revision changed content makes preference preview stale", async ({
  page,
}) => {
  await begin(page);
  await page.getByRole("button", { name: "Edit my preferences" }).click();
  await page.getByRole("button", { name: "Preview preferences" }).click();
  await page.evaluate((k) => {
    const s = JSON.parse(localStorage.getItem(k)!);
    s.preferences.maxMinutes = 30;
    localStorage.setItem(k, JSON.stringify(s));
  }, KEY);
  await page
    .getByRole("button", { name: "Confirm change", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("preview is stale");
  expect(
    await page.evaluate(
      (k) => JSON.parse(localStorage.getItem(k)!).preferences.maxMinutes,
      KEY,
    ),
  ).toBe(30);
  await page.getByRole("button", { name: "Refresh saved choices" }).click();
  await expect(page.getByRole("dialog")).toContainText("30 min maximum");
  await page.getByRole("button", { name: "Confirm load" }).click();
  await expect(page.locator(".summary")).toContainText("30 min maximum");
});
test("real other tab changes reject reset preview", async ({
  page,
  context,
}) => {
  await begin(page);
  await page.getByRole("button", { name: "Reset sample" }).click();
  const second = await context.newPage();
  await second.goto("./");
  await changeTime(second, "30");
  await page.getByRole("button", { name: "Confirm reset" }).click();
  await expect(page.getByRole("status")).toContainText("preview is stale");
  await expect(page.locator(".course")).toHaveCount(4);
  expect(
    await page.evaluate(
      (k) => JSON.parse(localStorage.getItem(k)!).preferences.maxMinutes,
      KEY,
    ),
  ).toBe(30);
  await second.close();
});
for (const failure of ["getter", "getItem", "setItem"])
  test(`unavailable ${failure} retains current state and explains saving`, async ({
    page,
  }) => {
    await page.addInitScript((f) => {
      if (f === "getter")
        Object.defineProperty(window, "localStorage", {
          get() {
            throw new Error("blocked");
          },
        });
      else
        Object.defineProperty(Storage.prototype, f, {
          value() {
            throw new Error("blocked");
          },
        });
    }, failure);
    await page.reload();
    await begin(page);
    await expect(page.locator(".course")).toHaveCount(4);
    await expect(page.getByRole("status")).toContainText(
      failure === "setItem"
        ? "Local saving failed"
        : "Local saving is unavailable",
    );
    await page.getByRole("button", { name: "Reset sample" }).click();
    await page.getByRole("button", { name: "Cancel preview" }).click();
    await expect(page.locator(".course")).toHaveCount(4);
  });
test("keyboard dialog wraps focus and escape returns opener", async ({
  page,
}) => {
  await begin(page);
  const why = page.getByRole("button", {
    name: "Why this: Read a small dataset",
    exact: true,
  });
  await why.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("button", { name: "Close dialog" }),
  ).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(
    page.getByRole("button", { name: "Back to courses" }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Close dialog" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(why).toBeFocused();
  await page.getByRole("button", { name: "Reset sample" }).click();
  await page.getByRole("button", { name: "Confirm reset" }).focus();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Close dialog" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Reset sample" }),
  ).toBeFocused();
});
for (const width of [320, 390])
  test(`responsive ${width}px course and drawer have no page overflow`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    await begin(page);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page
      .getByRole("button", {
        name: "Why this: Read a small dataset",
        exact: true,
      })
      .click();
    await expect(page.getByRole("dialog")).toBeVisible();
    expect(
      await page.evaluate(
        () =>
          document.querySelector("dialog")!.getBoundingClientRect().right <=
          innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `test-results/relevance-${width}.png`,
      fullPage: true,
    });
  });
test("production run makes no external requests or runtime errors", async ({
  page,
}) => {
  const errors: string[] = [];
  const external: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("request", (r) => {
    if (
      !r.url().startsWith("http://127.0.0.1:4188/") &&
      !r.url().startsWith("data:")
    )
      external.push(r.url());
  });
  await page.reload();
  await begin(page);
  await page.getByRole("button", { name: "Whole catalog" }).click();
  await page.getByRole("button", { name: "Policy comparison" }).click();
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});

test("external corruption can be explicitly reset without reload", async ({
  page,
}) => {
  await begin(page);
  await page.evaluate((k) => localStorage.setItem(k, "broken"), KEY);
  await page.getByRole("button", { name: "Refresh saved choices" }).click();
  await expect(page.getByRole("status")).toContainText("Saved data is invalid");
  await page.getByRole("button", { name: "Reset sample" }).click();
  await expect(page.getByRole("dialog")).toContainText("Clear preferences");
  await page.getByRole("button", { name: "Confirm reset" }).click();
  expect(
    await page.evaluate((k) => JSON.parse(localStorage.getItem(k)!).ready, KEY),
  ).toBe(false);
  await expect(page.getByText("We do not know your goal yet.")).toBeVisible();
});
