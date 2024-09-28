import { Page, Locator } from 'playwright/test';
import { AddonInfo } from '../models/AddonModel';
import { extractPrice } from '../helper/priceHelper';
import { OrderSummary } from './componets/OrderSummaryComponet';
import { ReviewPage } from './ReviewPage';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  readonly ipInput: Locator;
  readonly continueButton: Locator;
  readonly pageTitle: Locator;
  readonly orderSummary: OrderSummary;

  constructor(page: Page) {
    super(page);
    this.ipInput = page.locator(`//*[@id="customfield11"]`);
    this.continueButton = page.locator(
      `//div[@class='text-center']/button[@id='btnCompleteProductConfig']`,
    );
    this.pageTitle = page.locator(`h1:has-text("Configure")`);
    this.orderSummary = new OrderSummary(page);
  }

  public async waitForLoadPage(): Promise<void> {
    await this.pageTitle.waitFor({ state: 'visible', timeout: 5000 });
  }

  public async fillInIpInput(ip: string): Promise<string> {
    await this.ipInput.fill(ip);
    await this.page.keyboard.press('Enter');
    return ip;
  }

  public async getAddonsInfo(indeces: number[]): Promise<AddonInfo[]> {
    const addons: AddonInfo[] = [];

    for (const index of indeces) {
      const title = await this.page.locator(`${this.getXPathAddon(index)}/div/label`).textContent();
      const price = await this.page
        .locator(`${this.getXPathAddon(index)}//div[@class='panel-price']`)
        .textContent();

      const addon: AddonInfo = {
        title: title!.trim(),
        price: extractPrice(price!),
      };
      addons.push(addon);
    }
    return addons;
  }

  public async clickOnAddonCheckbox(indices: number[]): Promise<void> {
    for (const index of indices) {
      const addonLocator = this.page.locator(
        `${this.getXPathAddon(index)}//input[contains(@name,'addons')]`,
      );
      await addonLocator.scrollIntoViewIfNeeded();
      await addonLocator.check({ force: true });

      if (index === indices[indices.length - 1]) {
        const titleText = (await this.page
          .locator(`${this.getXPathAddon(index)}/div/label`)
          .textContent())!.trim();
        await this.orderSummary.waitLastProductInOrder(titleText);
      }
    }
  }

  public async verifyAddons(addons: AddonInfo[]) {
    const allTitleProductsOrder = await this.orderSummary.getAllTitleProductsOrder();
    const allPriceProductsOrder = await this.orderSummary.getAllPriceProductsOrder();

    for (const addon of addons) {
      const index = allTitleProductsOrder.indexOf(addon.title!);
      if (index === -1) {
        return false;
      }
      if (!(addon.price === allPriceProductsOrder[index])) {
        return false;
      }
    }
    return true;
  }

  public async clickOnContinueButton(): Promise<ReviewPage> {
    await this.continueButton.click();
    const reviewPage = new ReviewPage(this.page);
    await this.waitForSpinner();
    await reviewPage.waitForLoadPage();
    return reviewPage;
  }

  private getXPathAddon(index: number): string {
    return `(//div[@id='productAddonsContainer']//div[contains(@class,'panel-addon')])[${index}]`;
  }
}
