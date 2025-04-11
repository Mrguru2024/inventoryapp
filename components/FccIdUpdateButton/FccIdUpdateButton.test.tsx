import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { FccIdUpdateButton } from "./index";
import { useRouter } from "next/navigation";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock console.error
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe("FccIdUpdateButton", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the button with correct text", () => {
    render(<FccIdUpdateButton fccId="test-fcc-id" />);
    expect(screen.getByText("Update FCC ID")).toBeInTheDocument();
  });

  it("navigates to the correct route when clicked", async () => {
    render(<FccIdUpdateButton fccId="test-fcc-id" />);
    const button = screen.getByText("Update FCC ID");

    fireEvent.click(button);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/fcc-id-management/test-fcc-id");
    });
  });

  it("shows loading state when clicked", async () => {
    render(<FccIdUpdateButton fccId="test-fcc-id" />);
    const button = screen.getByText("Update FCC ID");

    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
  });

  it("disables the button while loading", async () => {
    render(<FccIdUpdateButton fccId="test-fcc-id" />);
    const button = screen.getByText("Update FCC ID");

    fireEvent.click(button);

    await waitFor(() => {
      expect(button).toBeDisabled();
    });
  });

  it("applies correct styling classes", () => {
    render(<FccIdUpdateButton fccId="test-fcc-id" darkMode={true} />);
    const button = screen.getByText("Update FCC ID");
    expect(button).toHaveClass("bg-blue-500");
    expect(button).toHaveClass("hover:bg-blue-600");
    expect(button).toHaveClass("text-white");
  });

  it("is accessible with proper ARIA attributes", () => {
    render(<FccIdUpdateButton fccId="test-fcc-id" />);
    const button = screen.getByRole("button", { name: /update fcc id/i });
    expect(button).toHaveAttribute("aria-label", "Update FCC ID");
  });

  it("handles navigation errors gracefully", async () => {
    const error = new Error("Navigation failed");
    mockPush.mockRejectedValueOnce(error);

    render(<FccIdUpdateButton fccId="test-fcc-id" />);
    const button = screen.getByText("Update FCC ID");

    fireEvent.click(button);

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith("Navigation failed:", error);
    });
  });

  it("applies disabled state correctly", () => {
    render(<FccIdUpdateButton fccId="test-fcc-id" disabled />);
    const button = screen.getByText("Update FCC ID");
    expect(button).toBeDisabled();
    expect(button).toHaveClass("disabled:opacity-50");
    expect(button).toHaveClass("disabled:cursor-not-allowed");
  });

  it("applies custom className when provided", () => {
    const customClass = "custom-class";
    render(<FccIdUpdateButton fccId="test-fcc-id" className={customClass} />);
    const button = screen.getByText("Update FCC ID");
    expect(button).toHaveClass(customClass);
  });

  it("maintains button state during navigation", async () => {
    render(<FccIdUpdateButton fccId="test-fcc-id" />);
    const button = screen.getByText("Update FCC ID");

    // Simulate multiple rapid clicks
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledTimes(1);
    });
  });

  it("applies dark mode styles when darkMode prop is true", () => {
    render(<FccIdUpdateButton fccId="test-fcc-id" darkMode={true} />);
    const button = screen.getByText("Update FCC ID");
    expect(button).toHaveClass("bg-blue-500");
    expect(button).toHaveClass("hover:bg-blue-600");
  });
});
