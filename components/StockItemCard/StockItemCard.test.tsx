import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { StockItemCard } from "./index";

describe("StockItemCard", () => {
  const mockItem = {
    sku: "TEST123",
    name: "Test Item",
    quantity: 10,
    lowStockThreshold: 5,
    price: 29.99,
    purchaseSource: "Test Supplier",
    lastRestocked: "2024-03-20T00:00:00.000Z",
  };

  it("renders stock item information correctly", () => {
    render(<StockItemCard item={mockItem} />);

    expect(screen.getByText("Test Item")).toBeInTheDocument();
    expect(screen.getByText("SKU: TEST123")).toBeInTheDocument();
    expect(screen.getByText("Quantity: 10")).toBeInTheDocument();
    expect(screen.getByText("Price: $29.99")).toBeInTheDocument();
    expect(screen.getByText("Source: Test Supplier")).toBeInTheDocument();
    expect(screen.getByText(/Last Restocked:/)).toBeInTheDocument();
  });

  it("displays low stock warning when quantity is below threshold", () => {
    const lowStockItem = { ...mockItem, quantity: 3 };
    render(<StockItemCard item={lowStockItem} />);

    expect(screen.getByText("Low Stock")).toBeInTheDocument();
  });

  it("does not display low stock warning when quantity is above threshold", () => {
    render(<StockItemCard item={mockItem} />);

    expect(screen.queryByText("Low Stock")).not.toBeInTheDocument();
  });

  it("handles edit button click correctly", () => {
    const handleEdit = jest.fn();
    render(<StockItemCard item={mockItem} onEdit={handleEdit} />);

    fireEvent.click(screen.getByText("Edit"));
    expect(handleEdit).toHaveBeenCalledWith("TEST123");
  });

  it("displays purchase source information", () => {
    render(<StockItemCard item={mockItem} />);

    expect(screen.getByText("Source: Test Supplier")).toBeInTheDocument();
  });

  it("formats price correctly", () => {
    render(<StockItemCard item={mockItem} />);

    expect(screen.getByText("Price: $29.99")).toBeInTheDocument();
  });

  it("applies dark mode styles correctly", () => {
    render(<StockItemCard item={mockItem} darkMode={true} />);

    const card = screen.getByTestId("stock-item-card");
    expect(card).toHaveClass("bg-gray-800");
    expect(card).toHaveClass("text-white");
  });

  it("handles out of stock state correctly", () => {
    const outOfStockItem = { ...mockItem, quantity: 0 };
    render(<StockItemCard item={outOfStockItem} />);

    expect(screen.getByText("Out of Stock")).toBeInTheDocument();
    expect(screen.queryByText("Low Stock")).not.toBeInTheDocument();
  });
});
