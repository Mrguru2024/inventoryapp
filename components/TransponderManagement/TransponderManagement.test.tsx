import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useTransponderStore } from "@/lib/store/transponderStore";
import TransponderManagement from "./index";
import userEvent from "@testing-library/user-event";

// Mock hooks
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@tanstack/react-query", () => ({
  ...jest.requireActual("@tanstack/react-query"),
  useQuery: jest.fn(),
}));

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

jest.mock("@/lib/store/transponderStore", () => ({
  useTransponderStore: jest.fn(),
}));

// Mock data
const mockTransponders = [
  {
    id: "1",
    make: "Toyota",
    model: "Camry",
    yearStart: 2015,
    yearEnd: 2020,
    transponderType: "TRANSPONDER",
    chipType: ["Chip 1"],
    compatibleParts: ["Part 1", "Part 2"],
    frequency: "433MHz",
    notes: "Test notes",
    dualSystem: false,
    fccId: "FCC123",
  },
  {
    id: "2",
    make: "Honda",
    model: "Civic",
    yearStart: 2018,
    yearEnd: 2023,
    transponderType: "SMART",
    chipType: ["Chip 2"],
    compatibleParts: ["Part 3", "Part 4"],
    frequency: "315MHz",
    notes: "Test notes 2",
    dualSystem: true,
    fccId: "FCC456",
  },
];

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
};

describe("TransponderManagement", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useTransponderStore as unknown as jest.Mock).mockReturnValue({
      transponders: mockTransponders,
      removeTransponder: jest.fn(),
      addTransponder: jest.fn(),
      updateTransponder: jest.fn(),
    });
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { role: "admin" } },
      status: "authenticated",
    });
    (useQuery as jest.Mock).mockReturnValue({
      data: mockTransponders,
      isLoading: false,
      error: null,
    });
  });

  it("renders the component with transponder data", () => {
    renderWithProviders(<TransponderManagement />);
    expect(screen.getByText("Transponder Management")).toBeInTheDocument();
    expect(screen.getByText("Toyota")).toBeInTheDocument();
    expect(screen.getByText("Honda")).toBeInTheDocument();
  });

  it("shows loading state when data is being fetched", () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    renderWithProviders(<TransponderManagement />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows error state when data fetch fails", () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error("Failed to fetch data"),
    });

    renderWithProviders(<TransponderManagement />);
    expect(screen.getByText("Error loading transponders")).toBeInTheDocument();
  });

  it("allows filtering transponders by make", async () => {
    renderWithProviders(<TransponderManagement />);
    const filterInput = screen.getByPlaceholderText("Filter by make...");
    await userEvent.type(filterInput, "Toyota");
    expect(screen.getByText("Toyota")).toBeInTheDocument();
    expect(screen.queryByText("Honda")).not.toBeInTheDocument();
  });

  it("handles transponder deletion", async () => {
    const removeTransponder = jest.fn();
    (useTransponderStore as unknown as jest.Mock).mockReturnValue({
      transponders: mockTransponders,
      removeTransponder,
    });

    renderWithProviders(<TransponderManagement />);
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    await userEvent.click(deleteButtons[0]);

    expect(removeTransponder).toHaveBeenCalledWith("1");
  });

  it("shows no results message when no transponders match filters", async () => {
    renderWithProviders(<TransponderManagement />);
    const filterInput = screen.getByPlaceholderText("Filter by make...");
    await userEvent.type(filterInput, "NonExistentMake");
    expect(screen.getByText("No transponders found")).toBeInTheDocument();
  });
});
