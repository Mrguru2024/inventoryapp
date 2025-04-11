import { NextRequest } from "next/server";
import { PUT, DELETE } from "../route";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { UserRole } from "@/lib/auth/types";

// Mock the dependencies
jest.mock("next-auth");
jest.mock("@/lib/prisma");

const mockSession = {
  user: {
    id: "test-user-id",
    role: UserRole.ADMIN,
  },
};

describe("Inventory Item API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
  });

  describe("PUT /api/inventory/[id]", () => {
    it("updates an inventory item", async () => {
      const mockItem = {
        id: "1",
        sku: "TEST-001",
        brand: "Updated Brand",
        model: "Updated Model",
        stockCount: 10,
        lowStockThreshold: 5,
        price: 149.99,
        purchaseSource: "Updated Source",
        isDualSystem: true,
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
        createdById: "test-user-id",
      };

      (prisma.inventory.update as jest.Mock).mockResolvedValue(mockItem);

      const request = new NextRequest("http://localhost:3000/api/inventory/1", {
        method: "PUT",
        body: JSON.stringify({
          sku: "TEST-001",
          brand: "Updated Brand",
          model: "Updated Model",
          stockCount: 10,
          lowStockThreshold: 5,
          price: 149.99,
          purchaseSource: "Updated Source",
          isDualSystem: true,
        }),
      });

      const response = await PUT(request, { params: { id: "1" } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockItem);
      expect(prisma.inventory.update).toHaveBeenCalledWith({
        where: {
          id: "1",
        },
        data: {
          sku: "TEST-001",
          brand: "Updated Brand",
          model: "Updated Model",
          stockCount: 10,
          lowStockThreshold: 5,
          price: 149.99,
          purchaseSource: "Updated Source",
          isDualSystem: true,
        },
      });
    });

    it("returns 403 for non-admin users", async () => {
      (getServerSession as jest.Mock).mockResolvedValue({
        user: {
          id: "test-user-id",
          role: UserRole.TECHNICIAN,
        },
      });

      const request = new NextRequest("http://localhost:3000/api/inventory/1", {
        method: "PUT",
        body: JSON.stringify({
          sku: "TEST-001",
          brand: "Updated Brand",
          model: "Updated Model",
          stockCount: 10,
          lowStockThreshold: 5,
          price: 149.99,
          purchaseSource: "Updated Source",
          isDualSystem: true,
        }),
      });

      const response = await PUT(request, { params: { id: "1" } });

      expect(response.status).toBe(403);
    });
  });

  describe("DELETE /api/inventory/[id]", () => {
    it("soft deletes an inventory item", async () => {
      (prisma.inventory.update as jest.Mock).mockResolvedValue({
        id: "1",
        status: "DELETED",
      });

      const request = new NextRequest("http://localhost:3000/api/inventory/1", {
        method: "DELETE",
      });

      const response = await DELETE(request, { params: { id: "1" } });

      expect(response.status).toBe(204);
      expect(prisma.inventory.update).toHaveBeenCalledWith({
        where: {
          id: "1",
        },
        data: {
          status: "DELETED",
        },
      });
    });

    it("returns 403 for non-admin users", async () => {
      (getServerSession as jest.Mock).mockResolvedValue({
        user: {
          id: "test-user-id",
          role: UserRole.TECHNICIAN,
        },
      });

      const request = new NextRequest("http://localhost:3000/api/inventory/1", {
        method: "DELETE",
      });

      const response = await DELETE(request, { params: { id: "1" } });

      expect(response.status).toBe(403);
    });
  });
});
