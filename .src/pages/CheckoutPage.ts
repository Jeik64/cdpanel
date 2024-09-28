import { Page, Locator } from 'playwright/test';
import { extractPrice } from '../helper/priceHelper';
import { BasePage } from './BasePage';
import { ProductInCheckout } from '../models/ProductInCheckoutModel';

export class CheckoutPage extends BasePage {
  readonly completeOrderButton: Locator;
  readonly product: Locator;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.completeOrderButton = page.locator(`//button[@id='btnCompleteOrder']`);
    this.product = page.locator(`//table/tbody/tr`);
    this.pageTitle = page.locator(`h1:has-text("Checkout")`);
  }

  public async waitForLoadPage(): Promise<void> {
    await this.pageTitle.waitFor({ state: 'visible', timeout: 5000 });
  }

  public async getProductsInfo(): Promise<ProductInCheckout[]> {
    const count = await this.product.count();
    const products: ProductInCheckout[] = [];

    for (let i = 1; i <= count; i++) {
      const title = await this.page.locator(`${this.getXPathProduct(i)}/td[1]`).textContent();
      const ipAddress = await this.page.locator(`${this.getXPathProduct(i)}/td[3]`).textContent();
      const price = await this.page.locator(`${this.getXPathProduct(i)}/td[4]`).textContent();

      const product: ProductInCheckout = {
        title: title!.trim(),
        ipAddress: ipAddress!.trim(),
        price: extractPrice(price!),
      };
      products.push(product);
    }
    return products;
  }

  public async verifyCorrectIp(ipAddress: string, products: ProductInCheckout[]): Promise<boolean> {
    for (let i = 0; i < products.length; i++) {
      if (ipAddress !== products[i].ipAddress) {
        return false;
      }
    }
    return true;
  }

  public async verifySections(sections: string[]): Promise<boolean> {
    for (const section of sections) {
      const sectionLocator = this.page.locator(
        `//div[@class='sub-heading']/span[text()='${section}']`,
      );
      await sectionLocator.scrollIntoViewIfNeeded();
      if (!(await sectionLocator.isVisible())) {
        return false;
      }
    }
    return true;
  }

  public async verifyDisabledButton(isDisabled: boolean): Promise<boolean> {
    if (isDisabled) {
      return (
        (await this.completeOrderButton.isVisible()) &&
        (await this.completeOrderButton.isDisabled())
      );
    } else {
      return (
        (await this.completeOrderButton.isVisible()) &&
        !(await this.completeOrderButton.isDisabled())
      );
    }
  }

  private getXPathProduct(index: number): string {
    return `//table/tbody/tr[${index}]`;
  }
}
