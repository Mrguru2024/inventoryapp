import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TransponderLookup from "./transponder-lookup";

// Mock the search hook
jest.mock("@/hooks/useTransponderSearch", () => ({
  useTransponderSearch: () => ({
    search: jest.fn(),
    results: [],
    isLoading: false,
    error: null,
  }),
}));

describe("TransponderLookup", () => {
  const mockResults = [
    {
      id: "1",
      name: "Test Transponder",
      frequency: "315MHz",
      description: "Test Description",
    },
  ];

  it("renders search input and button", () => {
    render(<TransponderLookup />);
    expect(
      screen.getByPlaceholderText("Search transponders...")
    ).toBeInTheDocument();
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  it("handles search input changes", () => {
    render(<TransponderLookup />);

    const input = screen.getByPlaceholderText("Search transponders...");
    fireEvent.change(input, { target: { value: "test" } });

    expect(input).toHaveValue("test");
  });

  it("displays search results correctly", () => {
    render(<TransponderLookup initialResults={mockResults} />);
    expect(screen.getByText(mockResults[0].name)).toBeInTheDocument();
    expect(screen.getByText(mockResults[0].frequency)).toBeInTheDocument();
    expect(screen.getByText(mockResults[0].description)).toBeInTheDocument();
  });

  it("handles loading state", () => {
    render(<TransponderLookup isLoading={true} />);
    expect(screen.getByTestId("loading-skeleton")).toBeInTheDocument();
  });

  it("displays error state correctly", () => {
    const errorMessage = "Test error";
    render(<TransponderLookup error={errorMessage} />);
    expect(screen.getByText("Error")).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("displays no results message", () => {
    render(<TransponderLookup initialResults={[]} />);
    expect(screen.getByText("No results found")).toBeInTheDocument();
  });

  it("applies dark mode styles correctly", () => {
    render(<TransponderLookup darkMode={true} />);
    const container = screen.getByTestId("transponder-lookup");
    expect(container).toHaveClass("dark:bg-gray-800");
    expect(container).toHaveClass("text-white");
  });

  it("handles result selection", () => {
    const onSelect = jest.fn();
    render(
      <TransponderLookup initialResults={mockResults} onSelect={onSelect} />
    );
    fireEvent.click(screen.getByText(mockResults[0].name));
    expect(onSelect).toHaveBeenCalledWith(mockResults[0]);
  });
});
