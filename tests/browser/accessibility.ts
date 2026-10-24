import { expect, type Page } from "@playwright/test";
import { resolve } from "node:path";

export async function expectAccessible(page: Page, context: string) {
  await page.addScriptTag({
    path: resolve("node_modules/axe-core/axe.min.js"),
  });
  const violations = await page.evaluate(async () => {
    const axe = (
      window as unknown as {
        axe: {
          run: (options: object) => Promise<{
            violations: Array<{
              id: string;
              nodes: Array<{ target: unknown }>;
            }>;
          }>;
        };
      }
    ).axe;
    return (
      await axe.run({
        runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
      })
    ).violations.map((v) => ({
      id: v.id,
      targets: v.nodes.map((node) => node.target),
    }));
  });
  expect(violations, context).toEqual([]);
}
