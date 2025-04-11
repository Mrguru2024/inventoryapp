import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TransponderManagement } from "./TransponderManagement";
import { useTransponderStore } from "@/store/transponderStore";
import { TransponderKeyData } from "@/types/transponder";

// Mock the store
jest.mock("@/store/transponderStore", () => ({
  useTransponderStore: jest.fn(),
}));

describe("TransponderManagement", () => {
  const mockTransponders: TransponderKeyData[] = [
    {
      id: "1",
      keyNumber: "123",
      keyType: "Physical",
      keyStatus: "Active",
      keyLocation: "Main Office",
      keyHolder: "John Doe",
      keyNotes: "Test note",
      keyLastUsed: "2024-02-20",
      keyNextService: "2025-02-20",
      keyHistory: [
        {
          date: "2024-02-20",
          action: "Assigned",
          user: "Admin",
          notes: "Initial assignment",
        },
      ],
    },
    {
      id: "2",
      keyNumber: "456",
      keyType: "Digital",
      keyStatus: "Inactive",
      keyLocation: "Branch Office",
      keyHolder: "Jane Smith",
      keyNotes: "Digital key",
      keyLastUsed: "2024-02-19",
      keyNextService: "2025-02-19",
      keyHistory: [
        {
          date: "2024-02-19",
          action: "Created",
          user: "System",
          notes: "Digital key created",
        },
      ],
    },
  ];

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Mock the store implementation
    (useTransponderStore as jest.Mock).mockImplementation((selector) => {
      const state = {
        transponders: mockTransponders,
        loading: false,
        error: null,
        fetchTransponders: jest.fn(),
        addTransponder: jest.fn(),
        updateTransponder: jest.fn(),
        deleteTransponder: jest.fn(),
      };
      return selector(state);
    });
  });

  it("renders the component with initial state", () => {
    render(<TransponderManagement />);

    // Check if the main elements are rendered
    expect(screen.getByText("Transponder Management")).toBeInTheDocument();
    expect(screen.getByText("Add New Transponder")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Search transponders...")
    ).toBeInTheDocument();
  });

  it("filters transponders based on search input", async () => {
    render(<TransponderManagement />);

    // Open the dialog
    const addButton = screen.getByText("Add New Transponder");
    fireEvent.click(addButton);

    // Wait for the dialog to be open
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    // Get the search input
    const searchInput = screen.getByPlaceholderText("Search transponders...");

    // Type in the search input
    fireEvent.change(searchInput, { target: { value: "123" } });

    // Check if the filtered transponder is displayed
    expect(screen.getByText("123")).toBeInTheDocument();
    expect(screen.queryByText("456")).not.toBeInTheDocument();
  });

  it("opens the add transponder dialog", async () => {
    render(<TransponderManagement />);

    // Click the add button
    const addButton = screen.getByText("Add New Transponder");
    fireEvent.click(addButton);

    // Wait for the dialog to be open
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    // Check if the dialog title is present
    expect(screen.getByText("Add New Transponder")).toBeInTheDocument();
  });
});
