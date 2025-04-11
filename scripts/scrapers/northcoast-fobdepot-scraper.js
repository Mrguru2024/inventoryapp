const puppeteer = require("puppeteer-core");
const fs = require("fs");
const path = require("path");

async function setupBrowser() {
  const browser = await puppeteer.launch({
    headless: "new",
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--disable-gpu",
      "--window-size=1920x1080",
    ],
  });
  const page = await browser.newPage();

  // Set viewport and user agent
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
  );

  // Enable request interception
  await page.setRequestInterception(true);

  // Block unnecessary resources
  page.on("request", (request) => {
    if (
      ["image", "stylesheet", "font", "media"].includes(request.resourceType())
    ) {
      request.abort();
    } else {
      request.continue();
    }
  });

  return { browser, page };
}

async function scrapeNorthCoastKeyless(page) {
  try {
    console.log("Scraping North Coast Keyless...");
    await page.goto("https://northcoastkeyless.com/sitemap_index.xml", {
      waitUntil: "networkidle0",
    });

    const sitemaps = await page.evaluate(() => {
      const locs = document.querySelectorAll("loc");
      return Array.from(locs).map((loc) => loc.textContent);
    });

    const productData = [];
    for (const sitemap of sitemaps) {
      try {
        await page.goto(sitemap, { waitUntil: "networkidle0" });

        const urls = await page.evaluate(() => {
          const locs = document.querySelectorAll("loc");
          return Array.from(locs)
            .map((loc) => loc.textContent)
            .filter((url) => url.includes("/product/"));
        });

        productData.push(
          ...urls.map((url) => ({ url, source: "North Coast Keyless" }))
        );

        // Add delay between requests
        await page.waitForTimeout(2000);
      } catch (error) {
        console.error(`Error processing sitemap ${sitemap}:`, error.message);
      }
    }

    return productData;
  } catch (error) {
    console.error("Error scraping North Coast Keyless:", error.message);
    return [];
  }
}

async function scrapeFobDepot(page) {
  try {
    console.log("Scraping Fob Depot...");
    await page.goto("https://fobdepot.com/sitemap.xml", {
      waitUntil: "networkidle0",
    });

    const productData = await page.evaluate(() => {
      const locs = document.querySelectorAll("loc");
      return Array.from(locs)
        .map((loc) => loc.textContent)
        .filter((url) => url.includes("/product/"))
        .map((url) => ({ url, source: "Fob Depot" }));
    });

    return productData;
  } catch (error) {
    console.error("Error scraping Fob Depot:", error.message);
    return [];
  }
}

async function scrapeProductDetails(page, url, source) {
  try {
    await page.goto(url, { waitUntil: "networkidle0" });

    const productData = await page.evaluate(() => {
      const title =
        document.querySelector("h1.product_title")?.textContent?.trim() || "";
      const description =
        document
          .querySelector(".woocommerce-product-details__short-description")
          ?.textContent?.trim() || "";
      const price = document.querySelector(".price")?.textContent?.trim() || "";

      return { title, description, price };
    });

    const makeModelMatch = productData.title.match(
      /([A-Za-z]+)\s+([A-Za-z0-9-]+)\s+(\d{4}(?:-\d{4})?)/
    );
    const fccIdMatch = productData.description.match(/FCC ID:\s*([A-Z0-9-]+)/i);

    if (makeModelMatch) {
      return {
        make: makeModelMatch[1].toUpperCase(),
        model: makeModelMatch[2].toUpperCase(),
        year: makeModelMatch[3],
        fccId: fccIdMatch ? fccIdMatch[1].toUpperCase() : null,
        title: productData.title,
        description: productData.description,
        price: productData.price,
        url,
        source,
      };
    }
    return null;
  } catch (error) {
    console.error(`Error scraping product ${url}:`, error.message);
    return null;
  }
}

async function main() {
  console.log("Starting scraping process...");

  const { browser, page } = await setupBrowser();

  try {
    const northCoastData = await scrapeNorthCoastKeyless(page);
    const fobDepotData = await scrapeFobDepot(page);

    console.log(
      `Found ${northCoastData.length} products on North Coast Keyless`
    );
    console.log(`Found ${fobDepotData.length} products on Fob Depot`);

    const allProducts = [...northCoastData, ...fobDepotData];
    const detailedData = [];

    for (const product of allProducts) {
      const details = await scrapeProductDetails(
        page,
        product.url,
        product.source
      );
      if (details) {
        detailedData.push(details);
      }
      // Add delay between requests
      await page.waitForTimeout(2000);
    }

    // Save the data
    const outputPath = path.join(
      __dirname,
      "../../data/northcoast-fobdepot-fccid.json"
    );
    fs.writeFileSync(outputPath, JSON.stringify(detailedData, null, 2));

    console.log(
      `Scraping complete. Saved ${detailedData.length} products to ${outputPath}`
    );
  } finally {
    await browser.close();
  }
}

main().catch(console.error);
