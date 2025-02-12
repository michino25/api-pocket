import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Table {
  _id: string;
  tableName: string;
}

interface TableStore {
  tables: Table[] | null;
  setTables: (tables: Table[] | null) => void;
}

export const useSidebarTableStore = create<TableStore>()(
  persist(
    (set) => ({
      tables: null,
      setTables: (tables) => set({ tables }),
    }),
    {
      name: "tables-storage",
    }
  )
);
