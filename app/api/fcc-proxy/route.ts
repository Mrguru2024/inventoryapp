import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const make = searchParams.get("make");
    const model = searchParams.get("model");
    const year = searchParams.get("year");

    if (!make || !model || !year) {
      return NextResponse.json(
        { error: "Missing parameters: make, model, and year are required" },
        { status: 400 }
      );
    }

    const searchTerm = `${make} ${model} ${year}`;
    console.log(`Searching for FCC data: ${searchTerm}`);

    // Fetch data from UHS Hardware
    const uhsData = await fetchUhsData(make, model, parseInt(year));

    // Fetch data from OEM Car Key Mall
    const oemData = await fetchOemData(make, model, parseInt(year));

    // Combine results, filtering out null values
    const results = [uhsData, oemData].filter((data) => data !== null);

    console.log(`Found ${results.length} FCC data results for ${searchTerm}`);

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error in FCC proxy:", error);
    return NextResponse.json(
      { error: "Failed to fetch FCC data" },
      { status: 500 }
    );
  }
}

async function fetchUhsData(make: string, model: string, year: number) {
  try {
    const searchUrl = `https://www.uhs-hardware.com/products/search?q=${encodeURIComponent(
      `${make} ${model} ${year}`
    )}`;
    console.log(`Fetching UHS data from: ${searchUrl}`);

    const response = await axios.get(searchUrl);
    const $ = cheerio.load(response.data);

    // Find the first product that matches our criteria
    const productCard = $(".product-card").first();
    if (!productCard.length) {
      console.log("No products found on UHS Hardware");
      return null;
    }

    // Extract data from UHS Hardware page
    const productUrl = productCard.find("a.product-link").attr("href");
    if (!productUrl) {
      console.log("No product URL found on UHS Hardware");
      return null;
    }

    // Fetch detailed product page
    const detailResponse = await axios.get(
      `https://www.uhs-hardware.com${productUrl}`
    );
    const $detail = cheerio.load(detailResponse.data);

    const fccId = $detail(".product-specs tr:contains('FCC ID') td:last-child")
      .text()
      .trim();
    const frequency = $detail(
      ".product-specs tr:contains('Frequency') td:last-child"
    )
      .text()
      .trim();
    const chipTypeText = $detail(
      ".product-specs tr:contains('Chip Type') td:last-child"
    )
      .text()
      .trim();
    const chipType = chipTypeText
      ? chipTypeText.split(",").map((t) => t.trim())
      : [];
    const transponderType = $detail(
      ".product-specs tr:contains('Type') td:last-child"
    )
      .text()
      .trim();
    const compatiblePartsText = $detail(
      ".product-specs tr:contains('Compatible Parts') td:last-child"
    )
      .text()
      .trim();
    const compatibleParts = compatiblePartsText
      ? compatiblePartsText.split(",").map((p) => p.trim())
      : [];
    const notes = $detail(".product-description").text().trim();
    const price = parseFloat(
      $detail(".product-price")
        .text()
        .replace(/[^0-9.]/g, "")
    );

    if (fccId) {
      return {
        make,
        model,
        year,
        fccId,
        frequency,
        chipType,
        transponderType,
        compatibleParts,
        notes,
        price,
        source: "UHS Hardware",
      };
    }

    console.log("No FCC ID found in UHS Hardware product");
    return null;
  } catch (error) {
    console.error("Error fetching UHS data:", error);
    return null;
  }
}

async function fetchOemData(make: string, model: string, year: number) {
  try {
    const searchUrl = `https://oemcarkeymall.com/search?type=product&q=${encodeURIComponent(
      `${make} ${model} ${year}`
    )}`;
    console.log(`Fetching OEM data from: ${searchUrl}`);

    const response = await axios.get(searchUrl);
    const $ = cheerio.load(response.data);

    // Find the first product that matches our criteria
    const productCard = $(".product-item").first();
    if (!productCard.length) {
      console.log("No products found on OEM Car Key Mall");
      return null;
    }

    // Extract data from OEM Car Key Mall page
    const productUrl = productCard.find("a.product-title").attr("href");
    if (!productUrl) {
      console.log("No product URL found on OEM Car Key Mall");
      return null;
    }

    // Fetch detailed product page
    const detailResponse = await axios.get(
      `https://oemcarkeymall.com${productUrl}`
    );
    const $detail = cheerio.load(detailResponse.data);

    const fccId = $detail(".product-info tr:contains('FCC ID') td:last-child")
      .text()
      .trim();
    const frequency = $detail(
      ".product-info tr:contains('Frequency') td:last-child"
    )
      .text()
      .trim();
    const chipTypeText = $detail(
      ".product-info tr:contains('Chip Type') td:last-child"
    )
      .text()
      .trim();
    const chipType = chipTypeText
      ? chipTypeText.split(",").map((t) => t.trim())
      : [];
    const transponderType = $detail(
      ".product-info tr:contains('Type') td:last-child"
    )
      .text()
      .trim();
    const compatiblePartsText = $detail(
      ".product-info tr:contains('Compatible Parts') td:last-child"
    )
      .text()
      .trim();
    const compatibleParts = compatiblePartsText
      ? compatiblePartsText.split(",").map((p) => p.trim())
      : [];
    const notes = $detail(".product-description").text().trim();
    const price = parseFloat(
      $detail(".product-price")
        .text()
        .replace(/[^0-9.]/g, "")
    );
    const sku = $detail(".product-info tr:contains('SKU') td:last-child")
      .text()
      .trim();

    if (fccId) {
      return {
        make,
        model,
        year,
        fccId,
        frequency,
        chipType,
        transponderType,
        compatibleParts,
        notes,
        price,
        sku,
        source: "OEM Car Key Mall",
      };
    }

    console.log("No FCC ID found in OEM Car Key Mall product");
    return null;
  } catch (error) {
    console.error("Error fetching OEM data:", error);
    return null;
  }
}
