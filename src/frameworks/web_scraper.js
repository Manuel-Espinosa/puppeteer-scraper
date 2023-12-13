import axios from "axios";
import { JSDOM } from "jsdom";
import { applyPriceFilterInMeli } from "./puppeteer.js";
import { fetchProductDetails } from "../utils/meli_utils.js";

const DOMAINS = {
  meli: process.env.MELI_DOMAIN,
  wm: process.env.WALMART_DOMAIN,
  // other domains...
};

export const scrapeWebsite = async (domain, prompt, priceRange) => {
  console.log(
    `scrapeWebsite: Domain: "${domain}", prompt="${prompt}", pricerange=${priceRange}`
  );

  const searchUrl = await getSearchUrl(domain, prompt, priceRange);
  console.log(`search_url: ${searchUrl}`);
  if (!searchUrl) return [];

  console.log(`search url after getting it: "${searchUrl}"`);

  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  };

  try {
    const response = await axios.get(searchUrl, { headers });
    console.log(`Response Status Code: ${response.status}`);
    console.log(`Response Content Length: ${response.data.length}`);

    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    const functionMap = {
      [DOMAINS.meli]: findAllInMeli,
      //[DOMAINS.az]: findAllInAmazon,
      // [DOMAINS.wm]: findAllInWalmart, // Add a function for Walmart
    };

    // Extract the appropriate function from the map and call it
    const scrapingFunction = functionMap[domain];
    if (!scrapingFunction) {
      console.error(`No scraping function found for domain: ${domain}`);
      return [];
    }

    const result = scrapingFunction(document, prompt, domain);
    const formattedProducts = await fetchProductDetails(result)
    return formattedProducts;
  } catch (error) {
    console.error(`Error scraping website: ${error.message}`);
    return [];
  }
};

export const getSearchUrl = async (domain, prompt, priceRange) => {
  if (domain.includes(DOMAINS.meli)) {
    return await constructMeliSearchUrl(domain, prompt, priceRange);
  } else if (domain.includes(DOMAINS.wm)) {
    //return await constructWalmartSearchUrl(domain, prompt, priceRange);
  }
  return null;
};

export const constructMeliSearchUrl = async (domain, prompt, priceRange) => {
  try {
    console.log(
      `constructMeliSearchUrl: Domain: "${domain}", prompt="${prompt}", pricerange=${priceRange}`
    );
    const searchPhrase = prompt.replace(/ /g, "-");
    const encodedPhrase = encodeURIComponent(prompt);
    const searchUrl = `${domain}/${searchPhrase}#D[A:${encodedPhrase}]`;
    console.log(`search_url in constructor: ${searchUrl}`);

    const searchUrlWithFilters = await applyPriceFilterInMeli(
      priceRange[0],
      priceRange[1],
      searchUrl
    );
    return searchUrlWithFilters;
  } catch (error) {
    console.error(`Error in constructMeliSearchUrl: ${error.message}`);
    // Depending on your error handling strategy, you might want to:
    // - Return a default value
    // - Rethrow the error
    // - Return null or undefined
    // Here, I'm returning null for simplicity
    return null;
  }
};

export const findAllInMeli = (document, prompt, domain) => {
  // Find the specific section
  const searchSection = document.querySelector(
    "section.ui-search-results.ui-search-results--without-disclaimer"
  );

  if (!searchSection) {
    return [];
  }

  // Find the ordered list within the section
  const olTag = searchSection.querySelector(
    "ol.ui-search-layout.ui-search-layout--stack"
  );

  if (!olTag) {
    return [];
  }

  // Find all list items within the ordered list
  const liTags = olTag.querySelectorAll("li.ui-search-layout__item");

  const itemIds = Array.from(liTags)
    .map((li) => {
      // Find the hidden input element for item ID
      const itemIdInput = li.querySelector(
        'input[type="hidden"][name="itemId"]'
      );
      return itemIdInput ? itemIdInput.value.trim() : null;
    })
    .filter((id) => id !== null);

  return itemIds;
};
