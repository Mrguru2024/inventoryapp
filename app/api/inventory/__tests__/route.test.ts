import { NextRequest } from "next/server";
import { GET, POST } from "../route";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

// Mock the dependencies
jest.mock("next-auth");
jest.mock("@/lib/prisma");

// Mock NextRequest
class MockHeaders {
  private headers: Map<string, string>;

  constructor(init?: Record<string, string>) {
    this.headers = new Map(Object.entries(init || {}));
  }

  get(key: string) {
    return this.headers.get(key);
  }

  has(key: string) {
    return this.headers.has(key);
  }

  entries() {
    return this.headers.entries();
  }
}

global.Headers = MockHeaders as any;

const mockSession = {
  user: {
    id: "1",
    role: "admin",
  },
};

const mockInventory = [
  {
    id: 1,
    name: "Test Item",
    quantity: 10,
    minimumStock: 5,
  },
];

describe("Inventory API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/inventory", () => {
    it("returns inventory items for admin users", async () => {
      (getServerSession as jest.Mock).mockResolvedValue(mockSession);
      (prisma.inventory.findMany as jest.Mock).mockResolvedValue(mockInventory);

      const request = new NextRequest("http://localhost:3000/api/inventory", {
        headers: {},
      });
      const response = await GET(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual(mockInventory);
    });

    it("returns 401 for unauthenticated users", async () => {
      (getServerSession as jest.Mock).mockResolvedValue(null);

      const request = new NextRequest("http://localhost:3000/api/inventory", {
        headers: {},
      });
      const response = await GET(request);

      expect(response.status).toBe(401);
    });
  });

  describe("POST /api/inventory", () => {
    const newItem = {
      name: "New Item",
      quantity: 5,
      minimumStock: 2,
    };

    const createdItem = {
      id: 2,
      ...newItem,
    };

    it("creates a new inventory item", async () => {
      (getServerSession as jest.Mock).mockResolvedValue(mockSession);
      (prisma.inventory.create as jest.Mock).mockResolvedValue(createdItem);

      const request = new NextRequest("http://localhost:3000/api/inventory", {
        method: "POST",
        headers: {},
        body: JSON.stringify(newItem),
      });
      const response = await POST(request);

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data).toEqual(createdItem);
    });

    it("returns 403 for non-admin users", async () => {
      (getServerSession as jest.Mock).mockResolvedValue({
        user: {
          id: "2",
          role: "user",
        },
      });

      const request = new NextRequest("http://localhost:3000/api/inventory", {
        method: "POST",
        headers: {},
        body: JSON.stringify({
          name: "New Item",
          quantity: 5,
          minimumStock: 2,
        }),
      });
      const response = await POST(request);

      expect(response.status).toBe(403);
    });
  });
});
