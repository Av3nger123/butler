// store.js
import { StateCreator, create } from "zustand";
import { StorageValue, createJSONStorage, persist } from "zustand/middleware";
import { encrypt, decrypt } from "@/lib/utils";
import { Database } from "@/types";

interface DataStoreState {
	dataDiff: any | null;
	setDataDiff: (key: string, value: any) => void;
	clear: () => void;
}

const createStore: StateCreator<DataStoreState> = (set) => ({
	dataDiff: {},
	setDataDiff: (key, value) =>
		set((state) => ({ dataDiff: { ...state.dataDiff, [key]: value } })),
	clear: () => set(() => ({})),
});

const useDataStore = create(
	persist(createStore, {
		name: "data-store",
		storage: createJSONStorage(() => sessionStorage),
	})
);

export default useDataStore;
