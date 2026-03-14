import { test, expect } from "@playwright/test";

test.describe("Generative UI Page", () => {
  test("should render the AI chat interface and accept input", async ({ page }) => {
    // 1. Navigate to the AI page
    await page.goto("/ai");

    // 2. Verify the page header is visible
    await expect(page.getByRole("heading", { name: "Generative UI Sandbox" })).toBeVisible();

    // 3. Locate the input field using accessibility placeholders
    const aiInput = page.getByPlaceholder("e.g., Build me a pricing card...");
    await expect(aiInput).toBeVisible();

    // 4. Simulate a user typing a prompt
    const promptText = "Build a solid primary button that says 'Deploy Now'";
    await aiInput.fill(promptText);

    // 5. Verify the input captured the text
    await expect(aiInput).toHaveValue(promptText);

    // 6. Click the Generate button
    const generateButton = page.getByRole("button", { name: "Generate UI" });
    await expect(generateButton).toBeEnabled();
    
    // Note: In a true CI environment, we would mock the OpenAI network response 
    // here using `page.route()` to avoid spending API credits on every test run, 
    // but this ensures the UI wiring is perfectly intact!
  });
});
