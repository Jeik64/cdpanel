import { test, expect } from '../fixtures/fixtures';
import { AddonInfo } from '../models/AddonModel';
import { LicenseInfo } from '../models/LicenseModel';
import { sumPriceAddons, sumAndFixedNumber } from '../helper/priceHelper';
import { getAllSectionsInFile } from '../helper/dataHelpers';

test('Verify product and addon addition to cart with correct information', async ({
  licensesPage,
}) => {
  const licenseIndex: number = 1;
  const addonsIndex: number[] = [1, 2];
  const addons: AddonInfo[] = [];

  // LICENSES PAGE
  await licensesPage.visit();
  const license: LicenseInfo = await licensesPage.getLicenseInfo(licenseIndex);
  const productPage = await licensesPage.clickOnOrderNow(licenseIndex);

  //PRODUCT PAGE
  const ipAddress = await productPage.fillInIpInput(`2.2.2.2`);
  addons.push(...(await productPage.getAddonsInfo(addonsIndex)));
  await productPage.clickOnAddonCheckbox(addonsIndex);

  const expectedSummaryPrice = sumAndFixedNumber(license.price!, sumPriceAddons(addons));
  let actualSummaryPrice = await productPage.orderSummary.getSummaryPrice();
  expect(actualSummaryPrice).toEqual(expectedSummaryPrice);

  const allTitleProductsOrder = await productPage.orderSummary.getAllTitleProductsOrder()
  const allPriceProductsOrder = await productPage.orderSummary.getAllPriceProductsOrder();

  for (const addon of addons) {
    const index = allTitleProductsOrder.indexOf(addon.title!);
    expect
      .soft(index, `The product title '${addon.title}' is not found in the order.`)
      .not.toBe(-1);
    expect
      .soft(
        allPriceProductsOrder[index],
        `The price for '${addon.title}' should be ${addon.price}, but found ${allPriceProductsOrder[index]}.`,
      )
      .toEqual(addon.price);
  }
  //Addon validation errors have been detected
  expect(test.info().errors).toHaveLength(0);

  const reviewPage = await productPage.clickOnContinueButton();

  // REVIEW PAGE
  const productsInReview = await reviewPage.getProductsInfo();

  let actualLicenseTitle = productsInReview[0].title;
  expect(actualLicenseTitle).toContain(license.title);

  const isVerifyAddonsInProducts = reviewPage.verifyAddonsInProducts(addons, productsInReview);
  expect(isVerifyAddonsInProducts).toBeTruthy();

  actualSummaryPrice = productsInReview[0].price;
  expect(expectedSummaryPrice).toEqual(actualSummaryPrice);

  const checkoutPage = await reviewPage.clickOnCheckout();

  // CHECKOUT PAGE
  const productsInCheckout = await checkoutPage.getProductsInfo();

  actualLicenseTitle = productsInCheckout[0].title;
  expect(license.title).toBe(actualLicenseTitle);

  const isVerifyIpAddress = await checkoutPage.verifyCorrectIp(ipAddress, productsInCheckout);
  expect(isVerifyIpAddress).toBeTruthy();

  actualSummaryPrice = productsInCheckout[0].price;
  expect(expectedSummaryPrice).toEqual(actualSummaryPrice);

  const isVerifySections = await checkoutPage.verifySections(getAllSectionsInFile());
  expect(isVerifySections).toBeTruthy();

  const isVerifyDisabledButton = await checkoutPage.verifyDisabledButton(true);
  expect(isVerifyDisabledButton).toBeTruthy();
});
