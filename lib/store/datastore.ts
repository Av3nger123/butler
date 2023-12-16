// store.js
import { StateCreator, create } from "zustand";
import { StorageValue, createJSONStorage, persist } from "zustand/middleware";
import { encrypt, decrypt } from "@/lib/utils";
import { Database } from "@/types";
import { has, isEmpty } from "lodash";

interface DataStoreState {
	dataDiff: any | null;
	setDataDiff: (
		key: string,
		operation: string,
		pk: string,
		column: string,
		value: any
	) => void;
	revertDataDiff: (
		key: string,
		operation: string,
		pk: string,
		column: string
	) => void;
	clear: () => void;
}

const createStore: StateCreator<DataStoreState> = (set) => ({
	dataDiff: {},
	setDataDiff: (key, operation, pk, column, value) =>
		set((state) => {
			if (!has(state.dataDiff, key)) {
				state.dataDiff[key] = {
					update: {},
					add: {},
					delete: {},
				};
			}
			if (!has(state.dataDiff[key][operation], pk)) {
				state.dataDiff[key][operation][pk] = {};
			}
			state.dataDiff[key][operation][pk][column] = value;
			return {
				dataDiff: {
					...state.dataDiff,
				},
			};
		}),
	revertDataDiff: (key, operation, pk, column) =>
		set((state) => {
			if (!has(state.dataDiff, key)) {
				state.dataDiff[key] = {
					update: {},
					add: {},
					delete: {},
				};
			}
			if (!has(state.dataDiff[key][operation], pk)) {
				state.dataDiff[key][operation][pk] = {};
			}
			delete state.dataDiff[key][operation][pk][column];
			if (isEmpty(state.dataDiff[key][operation][pk])) {
				delete state.dataDiff[key][operation][pk];
			}
			return {
				dataDiff: {
					...state.dataDiff,
				},
			};
		}),
	clear: () => set(() => ({})),
});

const useDataStore = create(
	persist(createStore, {
		name: "data-store",
		storage: createJSONStorage(() => sessionStorage),
	})
);

export default useDataStore;
