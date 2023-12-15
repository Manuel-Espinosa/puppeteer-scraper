import compareProducts from "../frameworks/openai.js";
import { fetchMeliProductSpecs } from "../utils/meli_utils.js";

const promts = {
  compare:
    "Compara objetivamente estos productos y entregame la mejor opcion segun su precio y caracteristicas  e indica la tienda en donde se encuentra, usa no mas de 50 palabras, entrega esto en un objeto json con la siguiente esctructura {id: product.id,compare:tucomparacion}",
};
export const getProductComparison = async (products) => {
  const compare = await compareProducts(products, promts.compare);
  const data = await fetchMeliProductSpecs(compare.id)
  const best = {
    compare:compare,
    product:data.data
  }

  return best;
};
