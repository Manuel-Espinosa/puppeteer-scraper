import { fetchMeliProductSpecs } from "../utils/meli_utils.js";

export const getMeliProducSpecs = async (payload) => {
    const productsSpecs = [];
  
    await Promise.all(payload.map(async (item) => {
      const productDetail = await fetchMeliProductSpecs(item.id);
      productsSpecs.push(productDetail);
    }));
  
    return productsSpecs;
  };
  