import { Page, Locator } from 'playwright/test';
import { extractPrice } from '../../helper/priceHelper';

export class OrderSummary {
  readonly page: Page;
  readonly summaryPrice: Locator;

  constructor(page: Page) {
    this.page = page;
    this.summaryPrice = page.locator(`//div[@class='summary-totals']/div[last()]/span[2]`);
  }

  public async getSummaryPrice(): Promise<number | null> {
    return extractPrice((await this.summaryPrice.textContent()) || '');
  }

  public async getAllTitleProductsOrder(): Promise<string[]> {
    const count = await this.page.locator(this.getXPathProduct()).count();
    const allTitle: string[] = [];

    for (let i = 1; i <= count; i++) {
      const text = await this.page.locator(`${this.getXPathProduct()}[${i}]/span[1]`).textContent();
      if (text) allTitle.push(text.replace(/\+/g, '').trim());
    }
    return allTitle;
  }

  public async getAllPriceProductsOrder(): Promise<number[]> {
    const count = await this.page.locator(this.getXPathProduct()).count();
    const allPrice: number[] = [];

    for (let i = 1; i <= count; i++) {
      const price = await this.page
        .locator(`${this.getXPathProduct()}[${i}]/span[2]`)
        .textContent();
      if (price) allPrice.push(extractPrice(price)!);
    }
    return allPrice;
  }

  public async waitLastProductInOrder(nameProduct: string) {
    const elementXPath = `${this.getXPathProduct()}/span[contains(text(), '${nameProduct}')]`;
    await this.page.waitForSelector(elementXPath, {
      state: 'visible',
      timeout: 5000,
    });
  }

  private getXPathProduct(): string {
    return `//div[@class='order-summary']/div[@id='producttotal']/div[@class='clearfix']`;
  }
}
