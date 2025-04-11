import { render, screen } from "@testing-library/react";
import FccIdCard from "./index";

describe("FccIdCard", () => {
  const mockFccData = {
    id: "FCC123",
    status: "valid",
    manufacturer: "Test Manufacturer",
    model: "Test Model",
    frequency: "315MHz",
    lastUpdated: "2024-03-20",
  };

  it("renders FCC ID information correctly", () => {
    render(<FccIdCard data={mockFccData} />);

    expect(screen.getByText(mockFccData.id)).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(mockFccData.manufacturer))
    ).toBeInTheDocument();
    expect(screen.getByText(new RegExp(mockFccData.model))).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(mockFccData.frequency))
    ).toBeInTheDocument();
  });

  it("displays correct status badge color", () => {
    render(<FccIdCard data={mockFccData} />);
    const statusBadge = screen.getByText(mockFccData.status);
    expect(statusBadge).toHaveClass("bg-green-100");
    expect(statusBadge).toHaveClass("text-green-800");
  });

  it("handles click events correctly", () => {
    const onSelect = jest.fn();
    render(<FccIdCard data={mockFccData} onSelect={onSelect} />);

    const card = screen.getByTestId("fcc-id-card");
    card.click();

    expect(onSelect).toHaveBeenCalledWith(mockFccData.id);
  });

  it("applies dark mode styles correctly", () => {
    render(<FccIdCard data={mockFccData} darkMode />);

    const card = screen.getByTestId("fcc-id-card");
    expect(card).toHaveClass("dark:bg-gray-800");
    expect(card).toHaveClass("dark:text-white");
  });

  it("displays loading state correctly", () => {
    render(<FccIdCard loading />);

    expect(screen.getByTestId("loading-skeleton")).toBeInTheDocument();
    expect(screen.queryByText(mockFccData.id)).not.toBeInTheDocument();
  });

  it("handles error state correctly", () => {
    const errorMessage = "Failed to load FCC data";
    render(<FccIdCard error={errorMessage} />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByText("Error")).toHaveClass("text-red-500");
  });
});
