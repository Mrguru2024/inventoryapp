"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../hooks/useToast";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useTransponderStore } from "@/lib/store/transponderStore";
import styles from "./TransponderManagement.module.css";

interface TransponderKeyData {
  id: string | number;
  make: string;
  model: string;
  yearStart: number;
  yearEnd: number | null;
  transponderType: string;
  chipType: string[];
  compatibleParts: string[];
  frequency: string | null;
  notes: string | null;
  dualSystem: boolean;
  fccId: string | null;
}

interface TransponderSearchParams {
  make?: string;
  model?: string;
  year?: string;
  transponderType?: string;
}

interface TransponderInventoryItem {
  id: number;
  transponderType: string;
  quantity: number;
  minimumStock: number;
  location: string;
  chipType: string[];
}

interface TransponderManagementProps {
  darkMode?: boolean;
  loading?: boolean;
  error?: string | null;
  inventory?: {
    totalItems: number;
    lowStockItems: number;
    outOfStockItems: number;
  };
}

export default function TransponderManagement({
  darkMode = false,
  loading = false,
  error = null,
  inventory,
}: TransponderManagementProps) {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const [inventoryLevels, setInventoryLevels] = useState<
    TransponderInventoryItem[]
  >([]);
  const [selectedTransponder, setSelectedTransponder] =
    useState<TransponderKeyData | null>(null);
  const [searchParams, setSearchParams] = useState<TransponderSearchParams>({});
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMake, setSelectedMake] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedTransponderType, setSelectedTransponderType] =
    useState<string>("");
  const [loadingStatus, setLoadingStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorState, setErrorState] = useState<string | null>(error);
  const [selectedTransponderDetails, setSelectedTransponderDetails] =
    useState<TransponderKeyData | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [transponderToDelete, setTransponderToDelete] = useState<
    string | number | undefined
  >(undefined);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [fccId, setFccId] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  const queryClient = useQueryClient();
  const transponderStore = useTransponderStore();

  const {
    data: transponders,
    isLoading: isTranspondersLoading,
    error: transponderError,
  } = useQuery<TransponderKeyData[]>({
    queryKey: ["transponders"],
    queryFn: () => fetch("/api/transponders").then((res) => res.json()),
  });

  useEffect(() => {
    if (!isTranspondersLoading) {
      setIsLoading(false);
    }
  }, [isTranspondersLoading]);

  const getUniqueMakes = (data: TransponderKeyData[]) => {
    return Array.from(
      new Set(data.map((t: TransponderKeyData) => t.make))
    ).filter(Boolean) as string[];
  };

  const getUniqueModels = (data: TransponderKeyData[]) => {
    return Array.from(
      new Set(data.map((t: TransponderKeyData) => t.model))
    ).filter(Boolean) as string[];
  };

  const handleMakeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const make = e.target.value;
    setSelectedMake(make);
    setSelectedModel("");
    setSelectedYear("");
    setSearchParams({ ...searchParams, make: make || undefined });

    if (make && transponders) {
      const models = getUniqueModels(transponders);
      setAvailableModels(models);
    } else {
      setAvailableModels([]);
    }
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const model = e.target.value;
    setSelectedModel(model);
    setSelectedYear("");
    setSearchParams({ ...searchParams, model: model || undefined });

    if (model && transponders) {
      const years = Array.from(
        new Set(
          transponders
            .filter((t) => t.make === selectedMake && t.model === model)
            .map((t) => t.yearStart.toString())
        )
      ).sort();
      setAvailableYears(years);
    } else {
      setAvailableYears([]);
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = e.target.value;
    setSelectedYear(year);
    setSearchParams({ ...searchParams, year: year || undefined });
  };

  const handleTransponderSelect = (transponder: TransponderKeyData) => {
    setSelectedTransponderDetails(transponder);
    setIsDetailsModalOpen(true);
  };

  const handleFccIdValidation = async () => {
    setIsValidating(true);
    // Simulating validation
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsValidating(false);
  };

  const handleUpdateStatus = async (transponderId: string | number) => {
    if (!transponderId) {
      showToast("Invalid transponder ID", "error");
      return;
    }
    try {
      await router.push(`/fcc-id-management/${transponderId.toString()}`);
    } catch (error) {
      showToast("Failed to navigate to FCC ID management", "error");
    }
  };

  const handleDelete = async () => {
    if (transponderToDelete) {
      try {
        await transponderStore.removeTransponder(
          transponderToDelete.toString()
        );
        setTransponderToDelete(undefined);
        setIsDeleteModalOpen(false);
      } catch (error) {
        showToast("Failed to delete transponder", "error");
      }
    }
  };

  const filteredTransponderData = (transponders || []).filter((transponder) => {
    const matchesSearch = searchTerm
      ? transponder.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transponder.model.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesMake = selectedMake ? transponder.make === selectedMake : true;

    const matchesModel = selectedModel
      ? transponder.model === selectedModel
      : true;

    const matchesYear = selectedYear
      ? transponder.yearStart.toString() === selectedYear
      : true;

    const matchesType = selectedTransponderType
      ? transponder.transponderType === selectedTransponderType
      : true;

    return (
      matchesSearch && matchesMake && matchesModel && matchesYear && matchesType
    );
  });

  if (isTranspondersLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner data-testid="loading-spinner" />
      </div>
    );
  }

  if (transponderError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div data-testid="error-message" className="text-red-500">
          Failed to load transponders
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${styles.container} ${
        darkMode ? "dark:bg-gray-900 dark:text-white" : ""
      }`}
      data-testid="transponder-management"
    >
      <h1 className={styles.header}>Transponder Management</h1>

      {inventory && (
        <div className="mb-4">
          <p>Total Items: {inventory.totalItems}</p>
          <p>Low Stock: {inventory.lowStockItems}</p>
          <p>Out of Stock: {inventory.outOfStockItems}</p>
        </div>
      )}

      <div className="mb-8">
        <h2>FCC ID Validation</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Enter FCC ID"
            value={fccId}
            onChange={(e) => setFccId(e.target.value)}
            className={styles.input}
          />
          <button
            onClick={handleFccIdValidation}
            className={styles.button}
            disabled={isValidating}
          >
            {isValidating ? "Validating..." : "Validate"}
          </button>
        </div>
      </div>

      <div className="mb-8">
        <h2>Inventory Status</h2>
        <button
          onClick={() => router.push("/fcc-id-management")}
          className={styles.button}
          data-testid="fcc-id-update-button"
        >
          Update FCC ID
        </button>
      </div>

      <div className={styles.filtersContainer}>
        <select
          value={selectedMake}
          onChange={handleMakeChange}
          className={styles.select}
          aria-label="Select vehicle make"
        >
          <option value="">Select Make</option>
          {getUniqueMakes(transponders || []).map((make) => (
            <option key={make} value={make}>
              {make}
            </option>
          ))}
        </select>

        <select
          value={selectedModel}
          onChange={handleModelChange}
          className={styles.select}
          disabled={!selectedMake}
          aria-label="Select vehicle model"
        >
          <option value="">Select Model</option>
          {availableModels.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>

        <select
          value={selectedYear}
          onChange={handleYearChange}
          className={styles.select}
          disabled={!selectedModel}
          aria-label="Select vehicle year"
        >
          <option value="">Select Year</option>
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <select
          value={selectedTransponderType}
          onChange={(e) => {
            const type = e.target.value;
            setSelectedTransponderType(type);
            setSearchParams({
              ...searchParams,
              transponderType: type || undefined,
            });
          }}
          className={styles.select}
          aria-label="Select transponder type"
        >
          <option value="">Select Type</option>
          <option value="SMART">Smart Key</option>
          <option value="TRANSPONDER">Transponder Key</option>
          <option value="REMOTE">Remote Key</option>
        </select>
      </div>

      {isLoading ? (
        <div className={styles.loadingContainer}>
          <LoadingSpinner />
        </div>
      ) : filteredTransponderData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTransponderData.map((transponder) => (
            <div
              key={transponder.id}
              className={`${styles.detailsContainer} ${styles.cardHover}`}
              onClick={() => handleTransponderSelect(transponder)}
            >
              <h3 className={styles.detailsTitle}>
                {transponder.make} {transponder.model}
              </h3>
              <div className={styles.detailsGrid}>
                <div className={styles.detailsSection}>
                  <div>
                    <h4 className={styles.detailsLabel}>Years</h4>
                    <p className={styles.detailsValue}>
                      {transponder.yearStart} -{" "}
                      {transponder.yearEnd || "Present"}
                    </p>
                  </div>
                  <div>
                    <h4 className={styles.detailsLabel}>Transponder Type</h4>
                    <p className={styles.detailsValue}>
                      {transponder.transponderType}
                    </p>
                  </div>
                </div>
              </div>
              <button
                data-testid={`delete-transponder-button-${transponder.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setTransponderToDelete(transponder.id);
                  setIsDeleteModalOpen(true);
                }}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
              <button
                data-testid={`update-status-button-${transponder.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpdateStatus(transponder.id);
                }}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Update Status
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="text-center py-8 text-gray-500"
          data-testid="no-results-message"
        >
          No transponders found matching the selected criteria.
        </div>
      )}

      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Transponder Details</DialogTitle>
            <DialogDescription>
              View detailed information about this transponder
            </DialogDescription>
          </DialogHeader>
          <div id="transponder-details-description">
            {selectedTransponderDetails && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300">
                      Make
                    </h4>
                    <p className="text-gray-100">
                      {selectedTransponderDetails.make}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300">
                      Model
                    </h4>
                    <p className="text-gray-100">
                      {selectedTransponderDetails.model}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300">
                      Year Range
                    </h4>
                    <p className="text-gray-100">
                      {selectedTransponderDetails.yearStart} -{" "}
                      {selectedTransponderDetails.yearEnd || "Present"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300">
                      Transponder Type
                    </h4>
                    <p className="text-gray-100">
                      {selectedTransponderDetails.transponderType}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Transponder</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this transponder? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div id="delete-confirmation-description">
            Are you sure you want to delete this transponder?
          </div>
          <DialogFooter>
            <button
              data-testid="confirm-delete-button"
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded ml-2"
            >
              Cancel
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
