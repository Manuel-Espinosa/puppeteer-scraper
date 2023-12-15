import compareProducts from "../frameworks/openai.js";

const promts = {
  compare:
    "Compara objetivamente estos productos y entregame la mejor opcion segun su precio y caracteristicas  e indica la tienda en donde se encuentra, usa no mas de 50 palabras, entrega esto en un objeto json con la siguiente esctructura {id: product.id,compare:tucomparacion}",
};
export const getProductComparison = async (products) => {
  const compare = compareProducts(products, promts.compare);
  return compare;
};
