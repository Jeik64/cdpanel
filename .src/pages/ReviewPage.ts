import { Page, Locator } from 'playwright/test';
import { extractPrice } from '../helper/priceHelper';
import { CheckoutPage } from './CheckoutPage';
import { BasePage } from './BasePage';
import { ProductInReview } from '../models/ProductInReviewModel';
import { AddonInfo } from '../models/AddonModel';

export class ReviewPage extends BasePage {
  readonly product: Locator;
  readonly checkoutButton: Locator;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.product = page.locator(`//div[@class='secondary-cart-body']//div[@class='item']`);
    this.checkoutButton = page.locator(`//div[@class='text-right']/a[@id='checkout']`);
    this.pageTitle = page.locator(`h1:has-text("Review & Checkout")`);
  }

  public async waitForLoadPage(): Promise<void> {
    await this.pageTitle.waitFor({ state: 'visible', timeout: 5000 });
  }

  public async getProductsInfo(): Promise<ProductInReview[]> {
    const products: ProductInReview[] = [];
    const count = await this.product.count();

    for (let i = 1; i <= count; i++) {
      const title = await this.page
        .locator(`${this.getXPathProduct(i)}//span[@class='item-title']`)
        .textContent();
      const group = await this.page
        .locator(`${this.getXPathProduct(i)}//span[@class='item-group']`)
        .textContent();
      const price = await this.page
        .locator(`${this.getXPathProduct(i)}//span[@class='cycle']`)
        .textContent();

      const product: ProductInReview = {
        title: title ? title.trim() : null,
        group: group ? group.trim() : null,
        price: price ? extractPrice(price.trim()) : null,
      };
      products.push(product);
    }
    return products;
  }

  public verifyAddonsInProducts(addons: AddonInfo[], productsReview: ProductInReview[]): boolean {
    return addons.every(addon =>
      productsReview.some(
        productReview => addon.title === productReview.title && addon.price === productReview.price,
      ),
    );
  }

  public async clickOnCheckout(): Promise<CheckoutPage> {
    await this.checkoutButton.click();
    const checkoutPage = new CheckoutPage(this.page);
    await this.waitForSpinner();
    await checkoutPage.waitForLoadPage();
    return checkoutPage;
  }

  private getXPathProduct(index: number): string {
    return `(//div[@class='secondary-cart-body']//div[@class='item'])[${index}]`;
  }
}
