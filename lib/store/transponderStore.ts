import { create } from "zustand";

interface Transponder {
  id: string;
  serialNumber: string;
  fccId: string;
  status: string;
  lastSeen: string;
}

interface TransponderStore {
  transponders: Transponder[];
  setTransponders: (transponders: Transponder[]) => void;
  addTransponder: (transponder: Transponder) => void;
  updateTransponder: (id: string, updates: Partial<Transponder>) => void;
  removeTransponder: (id: string) => void;
}

export const useTransponderStore = create<TransponderStore>((set) => ({
  transponders: [],
  setTransponders: (transponders) => set({ transponders }),
  addTransponder: (transponder) =>
    set((state) => ({
      transponders: [...state.transponders, transponder],
    })),
  updateTransponder: (id, updates) =>
    set((state) => ({
      transponders: state.transponders.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      ),
    })),
  removeTransponder: (id) =>
    set((state) => ({
      transponders: state.transponders.filter((t) => t.id !== id),
    })),
}));
