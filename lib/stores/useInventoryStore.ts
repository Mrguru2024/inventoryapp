import { create } from "zustand";
import { persist } from "zustand/middleware";

interface InventoryItem {
  id: string;
  sku: string;
  brand: string;
  model: string;
  stockCount: number;
  lowStockThreshold: number;
  price: number;
  purchaseSource: string;
  isDualSystem: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface InventoryState {
  items: InventoryItem[];
  selectedItem: InventoryItem | null;
  isLoading: boolean;
  error: string | null;
  setItems: (items: InventoryItem[]) => void;
  setSelectedItem: (item: InventoryItem | null) => void;
  addItem: (item: InventoryItem) => void;
  updateItem: (item: InventoryItem) => void;
  deleteItem: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set) => ({
      items: [],
      selectedItem: null,
      isLoading: false,
      error: null,
      setItems: (items) => set({ items }),
      setSelectedItem: (item) => set({ selectedItem: item }),
      addItem: (item) => set((state) => ({ items: [...state.items, item] })),
      updateItem: (item) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === item.id ? item : i)),
        })),
      deleteItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: "inventory-storage",
    }
  )
);
