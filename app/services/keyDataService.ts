import axios from "axios";
import * as cheerio from "cheerio";

export interface KeyData {
  make: string;
  model: string;
  year: number;
  fccId: string;
  frequency: string;
  chipType: string[];
  transponderType: string;
  compatibleParts: string[];
  notes?: string;
  source: string;
  price?: number;
  sku?: string;
}

export class KeyDataService {
  private static instance: KeyDataService;
  private uhsBaseUrl = "https://www.uhs-hardware.com";
  private oemBaseUrl = "https://oemcarkeymall.com";

  private constructor() {}

  public static getInstance(): KeyDataService {
    if (!KeyDataService.instance) {
      KeyDataService.instance = new KeyDataService();
    }
    return KeyDataService.instance;
  }

  async getKeyData(
    make: string,
    model: string,
    year: number
  ): Promise<KeyData[]> {
    try {
      const [uhsData, oemData] = await Promise.all([
        this.getUhsData(make, model, year),
        this.getOemData(make, model, year),
      ]);

      // Filter out null values and cast the array to KeyData[]
      const validData = [uhsData, oemData].filter(
        (data): data is KeyData => data !== null
      );

      // Merge and deduplicate data
      return this.mergeKeyData(validData);
    } catch (error) {
      console.error("Error fetching key data:", error);
      return [];
    }
  }

  private async getUhsData(
    make: string,
    model: string,
    year: number
  ): Promise<KeyData | null> {
    try {
      const searchUrl = `${
        this.uhsBaseUrl
      }/products/search?q=${encodeURIComponent(`${make} ${model} ${year}`)}`;
      const response = await axios.get(searchUrl);
      const $ = cheerio.load(response.data);

      // Find the first product that matches our criteria
      const productCard = $(".product-card").first();
      if (!productCard.length) return null;

      // Extract data from UHS Hardware page
      const productUrl = productCard.find("a.product-link").attr("href");
      if (!productUrl) return null;

      // Fetch detailed product page
      const detailResponse = await axios.get(`${this.uhsBaseUrl}${productUrl}`);
      const $detail = cheerio.load(detailResponse.data);

      const fccId = $detail(
        ".product-specs tr:contains('FCC ID') td:last-child"
      )
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
      return null;
    } catch (error) {
      console.error("Error fetching UHS data:", error);
      return null;
    }
  }

  private async getOemData(
    make: string,
    model: string,
    year: number
  ): Promise<KeyData | null> {
    try {
      const searchUrl = `${
        this.oemBaseUrl
      }/search?type=product&q=${encodeURIComponent(
        `${make} ${model} ${year}`
      )}`;
      const response = await axios.get(searchUrl);
      const $ = cheerio.load(response.data);

      // Find the first product that matches our criteria
      const productCard = $(".product-item").first();
      if (!productCard.length) return null;

      // Extract data from OEM Car Key Mall page
      const productUrl = productCard.find("a.product-title").attr("href");
      if (!productUrl) return null;

      // Fetch detailed product page
      const detailResponse = await axios.get(`${this.oemBaseUrl}${productUrl}`);
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
      return null;
    } catch (error) {
      console.error("Error fetching OEM data:", error);
      return null;
    }
  }

  private mergeKeyData(data: KeyData[]): KeyData[] {
    // Group by FCC ID to deduplicate
    const groupedData = data.reduce((acc, curr) => {
      const key = curr.fccId;
      if (!acc[key]) {
        acc[key] = curr;
      } else {
        // Convert arrays to sets and back to arrays to deduplicate
        const chipTypeSet = new Set([...acc[key].chipType, ...curr.chipType]);
        const compatiblePartsSet = new Set([
          ...acc[key].compatibleParts,
          ...curr.compatibleParts,
        ]);

        // Merge data from different sources
        acc[key] = {
          ...acc[key],
          chipType: Array.from(chipTypeSet),
          compatibleParts: Array.from(compatiblePartsSet),
          notes: acc[key].notes || curr.notes,
          price: acc[key].price || curr.price,
          sku: acc[key].sku || curr.sku,
        };
      }
      return acc;
    }, {} as Record<string, KeyData>);

    return Object.values(groupedData);
  }
}
