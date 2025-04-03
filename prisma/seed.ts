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

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed process...");

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
    const allTransponderData = [
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
        const transponderKey = await prisma.transponderKey.create({
          data: {
            make: data.make.toUpperCase(),
            model: data.model.toUpperCase(),
            yearStart: data.yearStart,
            yearEnd: data.yearEnd,
            transponderType: data.transponderType,
            chipType: data.chipType,
            compatibleParts: data.compatibleParts,
            frequency: data.frequency,
            notes: data.notes,
            dualSystem: data.dualSystem,
          },
        });

        // Create transponder inventory for each key
        await prisma.transponderInventory.create({
          data: {
            transponderKeyId: transponderKey.id,
            quantity: Math.floor(Math.random() * 10) + 1, // Random quantity between 1-10
            minimumStock: 5,
            location: "Main Warehouse",
            supplier: `${data.make} Parts`,
            lastOrdered: new Date(),
            notes: `Standard inventory for ${data.make} ${data.model}`,
          },
        });

        // Create inventory item
        const sku = `${data.make.substring(0, 3)}${data.model.substring(0, 3)}${
          data.yearStart
        }`;
        await prisma.inventory.upsert({
          where: { sku },
          update: {},
          create: {
            sku,
            brand: data.make,
            model: `${data.model} Smart Key`,
            stockCount: 15,
            lowStockThreshold: 5,
            price: 89.99,
            fccId: `FCC${Math.random()
              .toString(36)
              .substring(7)
              .toUpperCase()}`,
            frequency: data.frequency,
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
