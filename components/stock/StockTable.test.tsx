import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { StockTable } from "./StockTable";
import { useInventoryStore } from "@/lib/stores/useInventoryStore";

// Mock the Zustand store
jest.mock("@/lib/stores/useInventoryStore");

const mockItems = [
  {
    id: "1",
    sku: "TEST-001",
    brand: "Test Brand",
    model: "Test Model",
    stockCount: 5,
    lowStockThreshold: 10,
    price: 99.99,
    purchaseSource: "Test Source",
    isDualSystem: false,
    status: "ACTIVE",
    createdAt: "2024-04-11T12:00:00Z",
    updatedAt: "2024-04-11T12:00:00Z",
  },
  {
    id: "2",
    sku: "TEST-002",
    brand: "Test Brand",
    model: "Test Model",
    stockCount: 15,
    lowStockThreshold: 10,
    price: 149.99,
    purchaseSource: "Test Source",
    isDualSystem: true,
    status: "ACTIVE",
    createdAt: "2024-04-11T12:00:00Z",
    updatedAt: "2024-04-11T12:00:00Z",
  },
];

describe("StockTable", () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useInventoryStore as jest.Mock).mockReturnValue({
      items: mockItems,
      isLoading: false,
      error: null,
    });
  });

  it("renders the table with correct headers", () => {
    render(
      <StockTable
        items={mockItems}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText("SKU")).toBeInTheDocument();
    expect(screen.getByText("Brand")).toBeInTheDocument();
    expect(screen.getByText("Model")).toBeInTheDocument();
    expect(screen.getByText("Quantity")).toBeInTheDocument();
    expect(screen.getByText("Price")).toBeInTheDocument();
    expect(screen.getByText("Purchase Source")).toBeInTheDocument();
    expect(screen.getByText("Last Updated")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("displays inventory items correctly", () => {
    render(
      <StockTable
        items={mockItems}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText("TEST-001")).toBeInTheDocument();
    expect(screen.getByText("Test Brand")).toBeInTheDocument();
    expect(screen.getByText("Test Model")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("$99.99")).toBeInTheDocument();
    expect(screen.getByText("Test Source")).toBeInTheDocument();
  });

  it("shows low stock badge when quantity is below threshold", () => {
    render(
      <StockTable
        items={mockItems}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText("Low Stock")).toBeInTheDocument();
  });

  it("shows dual system badge when isDualSystem is true", () => {
    render(
      <StockTable
        items={mockItems}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText("Dual System")).toBeInTheDocument();
  });

  it("calls onEdit when edit button is clicked", () => {
    render(
      <StockTable
        items={mockItems}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const editButtons = screen.getAllByText("Edit");
    fireEvent.click(editButtons[0]);

    expect(mockOnEdit).toHaveBeenCalledWith(mockItems[0]);
  });

  it("calls onDelete when delete button is clicked", () => {
    render(
      <StockTable
        items={mockItems}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const deleteButtons = screen.getAllByText("Delete");
    fireEvent.click(deleteButtons[0]);

    expect(mockOnDelete).toHaveBeenCalledWith("1");
  });
});
