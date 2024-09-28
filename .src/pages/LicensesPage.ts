import { Page } from 'playwright/test';
import { LicenseInfo } from '../models/LicenseModel';
import { extractPrice } from '../helper/priceHelper';
import { BasePage } from './BasePage';
import { ProductPage } from './ProductPage';

export class LicensesPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  public async visit() {
    await this.page.goto(`/store/cpanel-licenses`);
  }

  public async getLicenseInfo(index: number): Promise<LicenseInfo> {
    const title = await this.page
      .locator(`${this.getXPathLicense(index)}/header/span[contains(@id, 'name')]`)
      .textContent();
    const description = await this.page
      .locator(`${this.getXPathLicense(index)}/div/p[contains(@id, 'description')]`)
      .textContent();
    const price = await this.page
      .locator(`${this.getXPathLicense(index)}//div/span[contains(@class, 'price')]`)
      .textContent();

    const product: LicenseInfo = {
      title: title!.trim(),
      description: description ? description.trim() : null,
      price: extractPrice(price!),
    };
    return product;
  }

  public async clickOnOrderNow(index: number): Promise<ProductPage> {
    await this.page.click(`${this.getXPathLicense(index)}/footer/a`);
    const productPage = new ProductPage(this.page);
    await this.waitForSpinner();
    await productPage.waitForLoadPage();
    return productPage;
  }

  private getXPathLicense(index: number): string {
    return `(//div[@id='products']//div[contains(@class, 'clearfix')])[${index}]`;
  }
}
