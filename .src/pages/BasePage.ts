import { Page, Locator } from 'playwright/test';

export abstract class BasePage {
  readonly page: Page;
  readonly spinner: Locator;

  constructor(page: Page) {
    this.page = page;
    this.spinner = page.locator(`//img[contains(@src,'overlay')]`);
  }

  protected async waitForSpinner() {
    const isVisible = await this.spinner.isVisible({ timeout: 3000 });
    if (isVisible) {
      await this.spinner.waitFor({ state: 'hidden', timeout: 5000 });
    }
  }
}
