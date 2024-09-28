import { test as base, expect } from '@playwright/test';
import { LicensesPage } from '../pages/LicensesPage';
import { ProductPage } from '../pages/ProductPage';
import { ReviewPage } from '../pages/ReviewPage';
import { CheckoutPage } from '../pages/CheckoutPage';

type MyFixtures = {
  licensesPage: LicensesPage;
  productPage: ProductPage;
  reviewPage: ReviewPage;
  checkoutPage: CheckoutPage;
};

export const test = base.extend<MyFixtures>({
  licensesPage: async ({ page }, use) => {
    const licensesPage = new LicensesPage(page);
    await use(licensesPage);
  },

  productPage: async ({ page }, use) => {
    const productPage = new ProductPage(page);
    await use(productPage);
  },

  reviewPage: async ({ page }, use) => {
    const reviewPage = new ReviewPage(page);
    await use(reviewPage);
  },

  checkoutPage: async ({ page }, use) => {
    const checkoutPage = new CheckoutPage(page);
    await use(checkoutPage);
  },
});

export { expect };
