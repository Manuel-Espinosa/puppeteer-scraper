import puppeteer from "puppeteer";

import {
  getMeliPricesFromTracker,
  getMeliPrices,
} from "../utils/meli_utils.js";

export const browser = async (ecommerce, url) => {
  if (ecommerce === "meli") {
    return await navigateMeli(url);
  } else if (ecommerce === "wm") {
    return await navigateWalmart(url);
  }
  return null;
};

export const initChrome = async (searchUrl) => {
  try {
    console.log(`Connecting to remote browser...`);

    // Connect to the remote Chrome instance
    const browser = await puppeteer.connect({
      browserWSEndpoint: `ws://chromium-node:3000`,
    });

    console.log("Remote browser connected");
    const page = await browser.newPage();
    await page.goto(searchUrl);

    return page;
  } catch (e) {
    console.error(`An error occurred initializing Chrome: ${e}`);
    return null;
  }
};

export const navigateMeli = async (url) => {
  try {
    const page = await initChrome(url);
    await page.goto(url);

    // You can use Puppeteer's selectors to find elements by class name
    const tables = await page.$$(".andes-table");
    if (!tables.length) {
      const uiVppTables = await page.$$(".ui-vpp-striped-specs__table");
      tables.push(...uiVppTables);
    }

    // Extracting information from the page using Puppeteer
    const titleElement = await page.$(".ui-pdp-title");
    const title = await titleElement.textContent();
    const itemIdInput = await page.$('input[name="item_id"]');
    const itemIdValue = itemIdInput
      ? await itemIdInput.evaluate((input) => input.value)
      : "";

    // Handling prices and other data using Puppeteer
    const prices = await getMeliPrices(page);
    try {
      getMeliPricesFromTracker(itemIdValue);
    } catch (e) {
      // Handle the exception if needed
    }

    // Extracting and transforming tables
    const fetchedTables = [];
    for (const table of tables) {
      const tableHtml = await table.evaluate((table) => table.outerHTML);
      fetchedTables.push(tableHtml);
    }

    //const transformedTables = meliTablesToJsonTransformed(fetchedTables);

    const data = {
      title: title,
      //specs: transformedTables,
      prices: prices,
      url: url,
      store: "Mercado Libre",
    };

    await page.close();
    return data;
  } catch (e) {
    console.error(`Error encountered: ${e}`);
    return null;
  }
};

export const applyPriceFilterInMeli = async (minPrice, maxPrice, searchUrl) => {
  let currentUrl = null; // Declare currentUrl here

  try {
    console.log(`searchUrl in applyPriceFilterInMeli: ${searchUrl}`);
    const page = await initChrome(searchUrl);

    console.log(`Navigation successful. Current URL: ${page.url()}`);

    // Check and fill in the minimum price input
    const minPriceInput = await page.waitForSelector(
      'input[data-testid="Minimum-price"]'
    );
    if (minPriceInput) {
      console.log("Found Min Price input. Filling it now.");
      await minPriceInput.type(String(minPrice));
    } else {
      console.error("Min Price input not found.");
    }

    // Check and fill in the maximum price input
    const maxPriceInput = await page.waitForSelector(
      'input[data-testid="Maximum-price"]'
    );
    if (maxPriceInput) {
      console.log("Found Max Price input. Filling it now.");
      await maxPriceInput.type(String(maxPrice));
    } else {
      console.error("Max Price input not found.");
    }

    // Click the apply button if both inputs were found
    if (minPriceInput && maxPriceInput) {
      const applyButton = 'button[data-testid="submit-price"]';
      await page.click(applyButton);
      console.log("Clicked Apply button.");

      // You may need to wait for navigation or AJAX calls here
      // ...

      currentUrl = page.url(); // Update currentUrl
      console.log(`Current full url: ${currentUrl}`);
    } else {
      console.error(
        "Could not apply price filter as one or more inputs were not found."
      );
    }

    await page.close();
  } catch (e) {
    console.error(`An error occurred: ${e}`);
  }

  return currentUrl; // Return currentUrl outside the try-catch block
};

/*
export const navigateWalmart = async (url) => {
  try {
    const urlMaincontent = url + "#maincontent";
    const page = await initChrome(urlMaincontent);

    // Check if verification challenge is required
    const challengeRequired = await handleVerificationChallenge(page);

    if (!challengeRequired) {
      // Continue with scraping logic using Puppeteer
      const titleElement = await page.$("#main-title");
      const title = await titleElement.textContent();
      const prices = await getWmPrices(page);
      const specs = await extractProductSpecs(page);

      const product = {
        title: title,
        prices: prices,
        specs: specs,
        store: "Walmart",
        url: url,
      };

      await page.close();
      return product;
    }
  } catch (e) {
    console.error(`An error occurred scraping product: ${e}`);
    return null;
  }
}
*/
// The rest of your code remains the same

// You'll need to define getMeliPrices, getMeliPricesFromTracker,
// and other functions used in the code using Puppeteer as well.
