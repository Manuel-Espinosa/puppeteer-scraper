import { scrapeWebsite } from "../frameworks/web_scraper.js";

const DOMAINS = {
  wm: process.env.WALMART_DOMAIN,
  meli: process.env.MELI_DOMAIN,
  az: process.env.AMAZON_DOMAIN,
};

const getDomains = async (keywords) => {
  const domains = keywords
    .filter((keyword) => keyword in DOMAINS)
    .map((keyword) => DOMAINS[keyword]);

  console.log(`getDomains sent: "${domains}"`)
  return domains;
};

export const searchInMultipleDomains = async (
  prompt,
  domainsKeywords,
  priceRange
) => {
  console.log(
    `searchInMultipleDomains got: "${domainsKeywords}", prompt="${prompt}", pricerange=${priceRange}`
  );

  const domains = await getDomains(domainsKeywords);
  console.log(`getDomains got: "${domains}"`);

  let allProducts = [];

  // Create a list of coroutine objects for the tasks
  const tasks = domains.map((domain) =>
    scrapeWebsite(domain, prompt, priceRange)
  );

  // Use Promise.all to await all tasks concurrently
  const results = await Promise.all(tasks);

  // Extend the allProducts list with the results
  results.forEach((products) => {
    allProducts = [...allProducts, ...products];
  });

  // Filter products within the given price range (if needed)
  // allProducts = filterProductsByPrice(allProducts, priceRange);

  return allProducts;
};

// Example filter function (if needed)
const filterProductsByPrice = (products, priceRange) => {
  // Logic to filter products by price range
};
