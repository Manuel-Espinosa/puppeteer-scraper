import puppeteer from "puppeteer";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const trackerUrl = process.env.TRACKER_URL;

export const getMeliPrices = async (page) => {
  const actualPriceElement = await page.$(
    '//div[@class="ui-pdp-price__second-line"]//span[@class="andes-money-amount__fraction"]'
  );

  try {
    const originalPriceElement = await page.$(
      '//s[@class="andes-money-amount ui-pdp-price__part ui-pdp-price__original-value andes-money-amount--previous andes-money-amount--cents-superscript andes-money-amount--compact"]//span[@class="andes-money-amount__fraction"]'
    );
    const originalPrice = await originalPriceElement.textContent();
  } catch (e) {
    const originalPrice = null;
  }

  const actualPrice = await actualPriceElement.textContent();

  const prices = {
    actual_price: actualPrice,
    original_price: originalPrice,
  };

  return prices;
};

export const getMeliPricesFromTracker = async (id) => {
  const url = `${trackerUrl}${id}/prices`;

  try {
    const response = await axios.get(url);
    log.info(`Prices from tracker: ${JSON.stringify(response.data)}`);
  } catch (error) {
    log.error("Error fetching prices from tracker:", error.message);
  }
};

export const fetchProductDetails = async (ids) => {
  const formattedProducts = [];
  const localTracker = "http://meli-price-tracker:3000/api/product";

  for (const id of ids) {
    try {
      const response = await axios.get(`${localTracker}/${id}/identifier`, {
        headers: { "User-Agent": "Insomnia/2023.5.7" },
      });

      const product = response.data;
      if (product && product.pictures && product.pictures.length > 0) {
        formattedProducts.push({
          id: product.id,
          image: product.pictures[0].url,
          link: product.permalink,
          price: product.price,
          product: product.title,
          source: "meli",
        });
      }
    } catch (error) {
      console.error(`Error fetching details for ID ${id}: ${error.message}`);
    }
  }

  return formattedProducts;
};

export const fetchMeliProductSpecs = async (id) => {
  const localTracker = `http://meli-price-tracker:3000/api/product/${id}/specs`;
  try {
    const response = await axios.get(localTracker);

    const detail = response.data;
    const product = {
      productId: id,
      specs: detail,
    };
    return product;
  } catch (error) {
    console.error(`Error fetching specs for ID ${id}: ${error.message}`);
  }
};
