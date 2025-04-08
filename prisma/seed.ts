import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { bmwTransponderData } from "./seeds/bmwTransponders";
import { acuraTransponderData } from "./seeds/acuraTransponders";
import { chevroletTransponderData } from "./seeds/chevroletTransponders";
import { fordTransponderData } from "./seeds/fordTransponders";
import { hondaTransponderData } from "./seeds/hondaTransponders";
import { toyotaTransponderData } from "./seeds/toyotaTransponders";
import { volkswagenTransponderData } from "./seeds/volkswagenTransponders";
import { hyundaiTransponderData } from "./seeds/hyundaiTransponders";
import { kiaTransponderData } from "./seeds/kiaTransponders";
import { nissanTransponderData } from "./seeds/nissanTransponders";
import { audiTransponderData } from "./seeds/audiTransponders";
import { suzukiTransponderData } from "./seeds/suzukiTransponders";
import { fiatTransponderData } from "./seeds/fiatTransponders";
import { isuzuTransponderData } from "./seeds/isuzuTransponders";
import { peugeotTransponderData } from "./seeds/peugeotTransponders";
import { chryslerTransponderData } from "./seeds/chryslerTransponders";
import { lexusTransponderData } from "./seeds/lexusTransponders";
import { subaruTransponderData } from "./seeds/subaruTransponders";
import { landRoverTransponderData } from "./seeds/landRoverTransponders";
import { dodgeTransponderData } from "./seeds/dodgeTransponders";
import { transponderUpdates2022 } from "./seeds/transponderUpdates2022";
import { buickTransponderData } from "./seeds/buickTransponders";
import { seedCadillacTransponders } from "./seeds/cadillacTransponders";
import { FccService } from "../app/services/fccService";
import { KeyDataService } from "../app/services/keyDataService";

const prisma = new PrismaClient();

// Define types for seed data and key data
interface TransponderSeedData {
  make: string;
  model: string;
  yearStart: number;
  yearEnd: number | null;
  transponderType: string;
  chipType: string[] | string;
  compatibleParts: string[] | string;
  frequency: string | null;
  notes: string | null;
  dualSystem: boolean;
  fccId?: string; // Optional fccId
}

interface KeyData {
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

function generateFccId(make: string, model: string, year: number): string {
  // Create a unique FCC ID based on make, model, and year
  const prefix = make.substring(0, 3).toUpperCase();
  const modelCode = model.substring(0, 2).toUpperCase();
  const yearCode = year.toString().substring(2);
  const randomCode = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}${modelCode}${yearCode}${randomCode}`;
}

async function main() {
  console.log("Starting seed process...");
  const fccService = FccService.getInstance();
  const keyDataService = KeyDataService.getInstance();

  try {
    // Create admin user
    const adminPassword = await hash("admin123", 12);
    const admin = await prisma.user.upsert({
      where: { email: "admin@example.com" },
      update: {},
      create: {
        email: "admin@example.com",
        name: "Admin User",
        password: adminPassword,
        role: "ADMIN",
        isApproved: true,
        emailVerified: new Date(),
      },
    });

    console.log("Created admin user:", admin);

    // Create technician user
    const techPassword = await hash("tech123", 12);
    const technician = await prisma.user.upsert({
      where: { email: "tech@example.com" },
      update: {},
      create: {
        email: "tech@example.com",
        name: "Test Technician",
        password: techPassword,
        role: "TECHNICIAN",
        isApproved: true,
        emailVerified: new Date(),
      },
    });

    console.log("Created technician user:", technician);

    // Clear existing transponder data
    console.log("Clearing existing transponder data...");

    // First delete TransponderInventory records
    await prisma.transponderInventory.deleteMany();

    // Then delete TransponderKey records
    await prisma.transponderKey.deleteMany();

    // Seed all transponder data
    const allTransponderData: TransponderSeedData[] = [
      ...bmwTransponderData,
      ...toyotaTransponderData,
      ...hondaTransponderData,
      ...acuraTransponderData,
      ...chevroletTransponderData,
      ...fordTransponderData,
      ...volkswagenTransponderData,
      ...hyundaiTransponderData,
      ...kiaTransponderData,
      ...nissanTransponderData,
      ...audiTransponderData,
      ...suzukiTransponderData,
      ...fiatTransponderData,
      ...isuzuTransponderData,
      ...peugeotTransponderData,
      ...chryslerTransponderData,
      ...lexusTransponderData,
      ...subaruTransponderData,
      ...landRoverTransponderData,
      ...dodgeTransponderData,
      ...transponderUpdates2022,
      ...buickTransponderData,
    ];

    // Log the number of manufacturers
    const uniqueMakes = Array.from(
      new Set(allTransponderData.map((t) => t.make))
    );
    console.log(
      `Found ${uniqueMakes.length} manufacturers: ${uniqueMakes.join(", ")}`
    );

    // Seed new data with progress tracking
    console.log("Seeding transponder data...");
    let successCount = 0;
    let errorCount = 0;

    for (const data of allTransponderData) {
      try {
        // Always fetch key data from multiple sources for the most up-to-date information
        console.log(
          `Fetching key data for ${data.make} ${data.model} ${data.yearStart}...`
        );
        let keyDataList: KeyData[] = [];

        try {
          // Attempt to fetch data from external services
          keyDataList = await keyDataService.getKeyData(
            data.make,
            data.model,
            data.yearStart
          );
          console.log(
            `Found ${keyDataList.length} key data entries for ${data.make} ${data.model}`
          );
        } catch (error) {
          console.error(
            `Error fetching key data for ${data.make} ${data.model}:`,
            error
          );
          // Continue with empty keyDataList if fetch fails
        }

        // Generate a default FCC ID if none exists in the data
        const defaultFccId = generateFccId(
          data.make,
          data.model,
          data.yearStart
        );

        // Use the first matching key data or fall back to original data
        const keyData: KeyData =
          keyDataList.length > 0
            ? keyDataList[0]
            : {
                make: data.make,
                model: data.model,
                year: data.yearStart,
                fccId: data.fccId || defaultFccId,
                frequency: data.frequency || "",
                chipType: Array.isArray(data.chipType)
                  ? data.chipType
                  : typeof data.chipType === "string"
                  ? data.chipType.split(",").map((c) => c.trim())
                  : [],
                transponderType: data.transponderType,
                compatibleParts: Array.isArray(data.compatibleParts)
                  ? data.compatibleParts
                  : typeof data.compatibleParts === "string"
                  ? data.compatibleParts.split(",").map((p) => p.trim())
                  : [],
                notes: data.notes || undefined,
                source: "Default Generated Data",
                price: 89.99,
                sku: `${data.make.substring(0, 3)}${data.model.substring(
                  0,
                  3
                )}${data.yearStart}`,
              };

        // Ensure chipType and compatibleParts are properly formatted for storage
        const chipTypeString = Array.isArray(keyData.chipType)
          ? keyData.chipType.join(", ")
          : typeof keyData.chipType === "string"
          ? keyData.chipType
          : "";

        const compatiblePartsString = Array.isArray(keyData.compatibleParts)
          ? keyData.compatibleParts.join(", ")
          : typeof keyData.compatibleParts === "string"
          ? keyData.compatibleParts
          : "";

        // Create the transponder key with robust error handling
        console.log(
          `Creating transponder key for ${data.make} ${data.model} with FCC ID: ${keyData.fccId}`
        );

        const transponderKey = await prisma.transponderKey.create({
          data: {
            make: data.make.toUpperCase(),
            model: data.model.toUpperCase(),
            yearStart: data.yearStart,
            yearEnd: data.yearEnd,
            transponderType: data.transponderType,
            chipType: chipTypeString,
            compatibleParts: compatiblePartsString,
            frequency: keyData.frequency || data.frequency || null,
            notes: keyData.notes || data.notes || null,
            dualSystem: data.dualSystem || false,
            fccId: keyData.fccId,
          },
        });

        // Create transponder inventory for each key
        await prisma.transponderInventory.create({
          data: {
            transponderKeyId: transponderKey.id,
            quantity: Math.floor(Math.random() * 10) + 1,
            minimumStock: 5,
            location: "Main Warehouse",
            supplier: `${data.make} Parts`,
            lastOrdered: new Date(),
            notes: `Standard inventory for ${data.make} ${data.model}`,
          },
        });

        // Update inventory item with key data
        const sku =
          keyData.sku ||
          `${data.make.substring(0, 3)}${data.model.substring(0, 3)}${
            data.yearStart
          }`;
        const price = keyData.price || 89.99;

        await prisma.inventory.upsert({
          where: { sku },
          update: {},
          create: {
            sku,
            brand: data.make,
            model: `${data.model} Smart Key`,
            stockCount: 15,
            lowStockThreshold: 5,
            price,
            fccId: keyData.fccId,
            frequency: keyData.frequency || data.frequency || null,
            purchaseSource: `${data.make} Parts`,
            isSmartKey: true,
            isTransponderKey: true,
            carMake: data.make,
            carModel: data.model,
            carYear: data.yearStart,
            notes: `Smart key for ${data.make} ${data.model} ${
              data.yearStart
            }-${data.yearEnd || "Present"}`,
            status: "APPROVED",
            technicianId: technician.id,
            createdBy: admin.id,
          },
        });

        successCount++;
        console.log(`✓ Created transponder: ${data.make} ${data.model}`);
      } catch (error) {
        errorCount++;
        console.error(
          `✗ Failed to create transponder: ${data.make} ${data.model}`,
          error
        );
      }
    }

    const count = await prisma.transponderKey.count();
    console.log(`\nSeeding completed:`);
    console.log(`- Successfully created: ${successCount} records`);
    console.log(`- Failed to create: ${errorCount} records`);
    console.log(`- Total records in database: ${count}`);

    // Create sample request
    const firstInventoryItem = await prisma.inventory.findFirst();
    if (firstInventoryItem) {
      const request = await prisma.request.create({
        data: {
          technicianId: technician.id,
          inventoryId: firstInventoryItem.id,
          quantityRequested: 2,
          status: "PENDING",
        },
      });

      console.log("Created request:", request);

      // Create sample notification
      const notification = await prisma.notification.create({
        data: {
          userId: technician.id,
          message: "Your inventory request is pending approval",
          read: false,
        },
      });

      console.log("Created notification:", notification);

      // Create sample activity
      const activity = await prisma.activity.create({
        data: {
          type: "INVENTORY_REQUEST",
          description: "New inventory request created",
          userId: technician.id,
        },
      });

      console.log("Created activity:", activity);

      // Create sample message
      const message = await prisma.message.create({
        data: {
          content: "Please review my inventory request",
          isRead: false,
          senderId: technician.id,
          recipientId: admin.id,
        },
      });

      console.log("Created message:", message);
    }

    // After all main data is processed, call the Cadillac seeder
    await seedCadillacTransponders(prisma);
  } catch (error) {
    console.error("Error during seeding:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
