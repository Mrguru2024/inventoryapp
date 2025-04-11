// updateFccIds.js
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function updateFccIds() {
  try {
    console.log("Updating FCC IDs from scraped data...");

    // Load scraped data
    const transponderyDataPath = path.join(
      __dirname,
      "../data/transpondery-fccid.json"
    );
    const uhsDataPath = path.join(__dirname, "../data/uhs-fccid.json");
    const buickDataPath = path.join(__dirname, "../data/buick-fccid.json");
    const northcoastFobdepotPath = path.join(
      __dirname,
      "../data/northcoast-fobdepot-fccid.json"
    );

    if (
      !fs.existsSync(transponderyDataPath) ||
      !fs.existsSync(uhsDataPath) ||
      !fs.existsSync(buickDataPath) ||
      !fs.existsSync(northcoastFobdepotPath)
    ) {
      console.error(
        "❌ Scraped data files not found. Please run the scrapers first."
      );
      return;
    }

    let transponderyData = [];
    let uhsData = [];
    let buickData = [];
    let northcoastFobdepotData = [];

    try {
      transponderyData = JSON.parse(
        fs.readFileSync(transponderyDataPath, "utf8")
      );
      console.log(
        `Loaded ${transponderyData.length} records from Transpondery.com`
      );
    } catch (err) {
      console.error("Error parsing Transpondery data:", err);
      transponderyData = [];
    }

    try {
      uhsData = JSON.parse(fs.readFileSync(uhsDataPath, "utf8"));
      console.log(`Loaded ${uhsData.length} records from UHS Hardware`);
    } catch (err) {
      console.error("Error parsing UHS data:", err);
      uhsData = [];
    }

    try {
      buickData = JSON.parse(fs.readFileSync(buickDataPath, "utf8"));
      console.log(`Loaded ${buickData.length} records from Buick database`);
    } catch (err) {
      console.error("Error parsing Buick data:", err);
      buickData = [];
    }

    try {
      northcoastFobdepotData = JSON.parse(
        fs.readFileSync(northcoastFobdepotPath, "utf8")
      );
      console.log(
        `Loaded ${northcoastFobdepotData.length} records from North Coast Keyless and Fob Depot`
      );
    } catch (err) {
      console.error(
        "Error parsing North Coast Keyless and Fob Depot data:",
        err
      );
      northcoastFobdepotData = [];
    }

    // Normalize and clean up the data before matching
    const normalizeData = (data) => {
      return data
        .map((item) => ({
          ...item,
          make: (item.make || "").toString().toUpperCase().trim(),
          model: (item.model || "").toString().toUpperCase().trim(),
          fccId: (item.fccId || "")
            .toString()
            .toUpperCase()
            .trim()
            .replace(/\s+/g, ""),
        }))
        .filter((item) => item.fccId && item.fccId.length > 3);
    };

    const normalizedTransponderyData = normalizeData(transponderyData);
    const normalizedUhsData = normalizeData(uhsData);
    const normalizedBuickData = normalizeData(buickData);
    const normalizedNorthcoastFobdepotData = normalizeData(
      northcoastFobdepotData
    );

    console.log(
      `After normalization: ${normalizedTransponderyData.length} Transpondery records, ${normalizedUhsData.length} UHS records, ${normalizedBuickData.length} Buick records, ${normalizedNorthcoastFobdepotData.length} North Coast/Fob Depot records`
    );

    // Get all transponders from database
    const transponders = await prisma.transponderKey.findMany();
    console.log(`Found ${transponders.length} transponders in database`);

    let updatedCount = 0;
    let noMatchCount = 0;

    // Process each transponder in the database
    for (const transponder of transponders) {
      if (!transponder.make || !transponder.model) {
        console.log(
          `Skipping transponder with missing make or model: ${transponder.id}`
        );
        continue;
      }

      const normalizedMake = transponder.make.toUpperCase().trim();
      const normalizedModel = transponder.model.toUpperCase().trim();

      // Flexible matching function that assigns a score to each match
      const findBestMatch = (dataSource, make, model) => {
        let bestMatch = null;
        let bestScore = 0;

        dataSource.forEach((item) => {
          let score = 0;

          // Exact make match is best
          if (item.make === make) {
            score += 10;
          }
          // Partial make matches are also valuable
          else if (item.make.includes(make) || make.includes(item.make)) {
            score += 5;
          }
          // Compare first 3 characters of make if both are at least 3 chars
          else if (
            item.make.length >= 3 &&
            make.length >= 3 &&
            item.make.substring(0, 3) === make.substring(0, 3)
          ) {
            score += 3;
          }

          // Exact model match is best
          if (item.model === model) {
            score += 10;
          }
          // Partial model matches are also valuable
          else if (item.model.includes(model) || model.includes(item.model)) {
            score += 5;
          }
          // Special case for model numbers with dashes or spaces
          else {
            const cleanItemModel = item.model.replace(/[-\s]/g, "");
            const cleanModel = model.replace(/[-\s]/g, "");
            if (cleanItemModel === cleanModel) {
              score += 8;
            } else if (
              cleanItemModel.includes(cleanModel) ||
              cleanModel.includes(cleanItemModel)
            ) {
              score += 4;
            }
          }

          // If the score is better than our current best match, update
          if (score > bestScore) {
            bestScore = score;
            bestMatch = item;
          }
        });

        // Only return matches with a reasonable score
        return bestScore >= 8 ? bestMatch : null;
      };

      // Try to find the best matches in both data sources
      const transponderyMatch = findBestMatch(
        normalizedTransponderyData,
        normalizedMake,
        normalizedModel
      );
      const uhsMatch = findBestMatch(
        normalizedUhsData,
        normalizedMake,
        normalizedModel
      );
      const buickMatch = findBestMatch(
        normalizedBuickData,
        normalizedMake,
        normalizedModel
      );
      const northcoastFobdepotMatch = findBestMatch(
        normalizedNorthcoastFobdepotData,
        normalizedMake,
        normalizedModel
      );

      // Prefer Transpondery data, fallback to UHS data, then Buick data, then North Coast/Fob Depot
      const matchedFccId =
        transponderyMatch?.fccId ||
        uhsMatch?.fccId ||
        buickMatch?.fccId ||
        northcoastFobdepotMatch?.fccId;

      if (
        matchedFccId &&
        (!transponder.fccId || matchedFccId !== transponder.fccId)
      ) {
        try {
          // Update the transponder with the new FCC ID
          await prisma.transponderKey.update({
            where: { id: transponder.id },
            data: { fccId: matchedFccId },
          });

          console.log(
            `✅ Updated ${transponder.make} ${transponder.model} with FCC ID: ${matchedFccId}`
          );
          updatedCount++;
        } catch (updateError) {
          console.error(
            `Error updating transponder ${transponder.id}:`,
            updateError
          );
        }
      } else if (!matchedFccId) {
        noMatchCount++;
      }
    }

    console.log(`\nUpdate complete:`);
    console.log(`- Total transponders: ${transponders.length}`);
    console.log(`- Updated: ${updatedCount}`);
    console.log(`- No matches found: ${noMatchCount}`);
    console.log(
      `- Unchanged: ${transponders.length - updatedCount - noMatchCount}`
    );
  } catch (error) {
    console.error("❌ Error updating FCC IDs:", error);
    console.error(error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

updateFccIds()
  .then(() => console.log("FCC ID update process completed"))
  .catch((e) => {
    console.error("Error in update process:", e);
    console.error(e.stack);
  });
