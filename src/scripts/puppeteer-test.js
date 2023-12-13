import puppeteer from "puppeteer";

const initChromeTest = async () => {
    try {
      console.log("Connecting to browser...");
  
      // Connect to the remote Chrome instance
      const browser = await puppeteer.connect({
        browserWSEndpoint: `ws://chromium-node:3000`
      });
  
      console.log("Browser connected");
      const page = await browser.newPage();
      await page.goto('https://listado.mercadolibre.com.mx/xbox-series-s#D[A:xbox%20series%20s]');
      const title = await page.title();
      console.log(`Title of the page is: ${title}`);
  
      await browser.close();
    } catch (e) {
      console.error(`An error occurred: ${e}`);
    }
  };

await initChromeTest()