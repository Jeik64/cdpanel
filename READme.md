### Author

Radishevskiy Andrii

### Project Overview

This project automates the process of adding a product and an addon to the cart on the cPanel Store website using Playwright.
The automation ensures that the product and addon are added correctly and that their information is preserved throughout the checkout
process. Additionally, the tests verify that the payment options and registration form appear on the checkout page.

### Goal of the Task

The objective is to automate the following processes on the cPanel Store website

1. Add a product to the cart.
2. Add an addon to the cart.
3. Verify that the product and addon are correctly added and that their information (title, price) is correct.
4. Ensure the product and addon do not disappear by step 3 of the checkout process.
5. Verify that the payment options appear alongside the registration form during checkout.

Note Account creation and order submission are not required for the test.

---

### File Descriptions

- `test.spec.ts` The main test file that automates the steps mentioned above, including visiting the license page, adding a product
  and addon, and validating the presence and correctness of information in the cart, review, and checkout pages.

---

### Setup and Installation

1. Clone the repository

   ```bash
   git clone repository_url
   ```

2. Install dependencies

   Ensure you have Node.js and npm installed. In the project directory, run

   ```bash
   npm install
   ```

3. Install Playwright

   If Playwright is not installed yet, run

   ```bash
   npx playwright install
   ```

4. Configure the environment

   Make sure Playwright is correctly configured for the browser you will be testing on. You can adjust settings in
   the `playwright.config.ts` file.

---

### Running the Tests

To run the automated tests

```bash
npx playwright test
```

---

### Test Breakdown

1. License Selection

   - Visits the licenses page.
   - Retrieves license information and selects the product.

2. Addon Selection

   - Fills in the IP address.
   - Selects and adds the addons.

3. Price Validation

   - Calculates the expected summary price (product price + addon prices).
   - Validates that the price on the product page matches the expected price.

4. Review Page

   - Ensures that the product and addon are correctly listed.
   - Validates that the correct titles and prices are shown.

5. Checkout Page
   - Ensures that product, addon, and IP information are correctly displayed.
   - Verifies that the correct sections (e.g., payment options) appear.
   - Checks that the submit button is correctly enabled or disabled based on conditions.

---

### Technologies Used

- Playwright The testing framework used for browser automation.
- TypeScript The language used for type-safe coding in the tests.
- Node.js The runtime environment for executing the Playwright tests.

---

### Additional Information

- Helper Functions
  - `sumPriceAddons` and `sumAndFixedNumber` These helper functions calculate the total price for addons and ensure the correct precision.
  - `verifyAddonsInProducts` A utility function that verifies whether all selected addons are included in the product list during review and checkout.
  - `verifySections` Ensures that required sections (like payment options) are visible on the checkout page.
- Test Data
  - Data for sections, licenses, and addons is loaded from external JSON files through helper functions like `getAllSectionsInFile()`.

---

### Notes

- This project focuses on the core functionality of adding products and addons to the cart and verifying their presence and accuracy during the checkout process.
- Future improvements could include handling dynamic product configurations, more extensive error handling, and reporting enhancements.

---

This README provides the necessary information to understand, set up, and run the Playwright tests for automating the cPanel Store checkout process.
