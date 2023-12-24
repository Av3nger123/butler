// store.js
import { StateCreator, create } from "zustand";
import { StorageValue, createJSONStorage, persist } from "zustand/middleware";
import { encrypt, decrypt } from "@/lib/utils";
import { DatabaseCluster } from "@/types";
import { has, isEmpty } from "lodash";

interface DataStoreState {
	dataDiff: any | null;
	setDataDiffRow: (
		key: string,
		operation: string,
		pk: string,
		value: any
	) => void;
	setDataDiff: (
		key: string,
		operation: string,
		pk: string,
		column: string,
		value: any
	) => void;
	deleteDataDiff: (key: string, pk: string) => void;
	revertDataDiff: (
		key: string,
		operation: string,
		pk: string,
		column: string
	) => void;
	clearDataDiff: (ke: string) => void;
}

const createStore: StateCreator<DataStoreState> = (set) => ({
	dataDiff: {},
	setDataDiffRow: (key: string, operation: string, pk: string, value: any) =>
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
			state.dataDiff[key][operation][pk] = value;
			return {
				dataDiff: {
					...state.dataDiff,
				},
			};
		}),
	deleteDataDiff: (key: string, pk: string) =>
		set((state) => {
			if (!has(state.dataDiff, key)) {
				state.dataDiff[key] = {
					update: {},
					add: {},
					delete: {},
				};
			}
			if (has(state.dataDiff[key]["add"], pk)) {
				delete state.dataDiff[key]["add"][pk];
			} else {
				if (has(state.dataDiff[key]["update"], pk)) {
					delete state.dataDiff[key]["update"][pk];
				}
				if (!has(state.dataDiff[key]["delete"], pk)) {
					state.dataDiff[key]["delete"][pk] = true;
				}
			}

			console.log(state.dataDiff[key]);
			return {
				dataDiff: {
					...state.dataDiff,
				},
			};
		}),
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
	clearDataDiff: (key) =>
		set((state) => {
			if (has(state.dataDiff, key)) delete state.dataDiff[key];
			return {
				dataDiff: {
					...state.dataDiff,
				},
			};
		}),
});

const useDataStore = create(
	persist(createStore, {
		name: "data-store",
		storage: createJSONStorage(() => sessionStorage),
	})
);

export default useDataStore;
