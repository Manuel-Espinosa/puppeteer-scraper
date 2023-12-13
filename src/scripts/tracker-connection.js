import axios from "axios";

const ids = ["MLM2735965404", "MLM1873897427"]

const fetchProductDetails = async (ids) => {
    const formattedProducts = [];
    const localTracker = 'http://meli-price-tracker:3000/api/product'
  
    for (const id of ids) {
      try {
        const response = await axios.get(`${localTracker}/${id}/identifier`, {
          headers: { 'User-Agent': 'Insomnia/2023.5.7' }
        });
  
        const product = response.data;
        if (product && product.pictures && product.pictures.length > 0) {
          formattedProducts.push({
            image: product.pictures[0].url,
            link: product.permalink,
            price: product.price,
            product: product.title,
            source: 'meli'
          });
        }
      } catch (error) {
        console.error(`Error fetching details for ID ${id}: ${error.message}`);
      }
    }
  
    return formattedProducts;
  };

fetchProductDetails(ids)