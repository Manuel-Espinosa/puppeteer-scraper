import {searchInMultipleDomains} from "../usecases/search_products.js"

export const searchRoute = async (req, res) => {
  try {
    const { prompt, domains, price_range } = req.body;
    console.log(`Domain: "${domains}", prompt="${prompt}", priceRange=${price_range}`);

    const products = await searchInMultipleDomains(prompt, domains, price_range);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message, });
  }
};
