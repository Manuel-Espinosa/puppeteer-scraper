import { searchInMultipleDomains } from "../usecases/search_products.js";
import { getMeliProducSpecs } from "../usecases/fetch_specs.js";
import { getProductComparison } from "../usecases/compare_products.js";

export const searchRoute = async (req, res) => {
  try {
    const { prompt, domains, price_range } = req.body;
    console.log(
      `Domain: "${domains}", prompt="${prompt}", priceRange=${price_range}`
    );

    const products = await searchInMultipleDomains(
      prompt,
      domains,
      price_range
    );
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSpecs = async (req, res) => {
  try {
    const products = req.body;
    const specs = await getMeliProducSpecs(products);
    res.status(200).json(specs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCompare = async (req, res) => {
  try {
    const products = req.body;
    const compare = await getProductComparison(products);
    res.status(200).json(compare);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
