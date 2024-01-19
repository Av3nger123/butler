// store.js
import { has, isEmpty } from "lodash";
import { StateCreator, create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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
		newValue: any,
		oldValue: any
	) => void;
	deleteDataDiff: (key: string, pk: string, oldValue: any) => void;
	revertDataDiff: (
		key: string,
		operation: string,
		pk: string,
		column: string
	) => void;
	clearDataDiff: (key: string) => void;
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
				state.dataDiff[key][operation][pk] = { newValue: {}, oldValue: {} };
			}
			state.dataDiff[key][operation][pk]["newValue"] = value;
			return {
				dataDiff: {
					...state.dataDiff,
				},
			};
		}),
	deleteDataDiff: (key: string, pk: string, oldValue: any) =>
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
					state.dataDiff[key]["delete"][pk] = {
						newValue: {},
						oldValue: oldValue,
					};
				}
			}

			return {
				dataDiff: {
					...state.dataDiff,
				},
			};
		}),
	setDataDiff: (key, operation, pk, column, newValue, oldValue) =>
		set((state) => {
			if (!has(state.dataDiff, key)) {
				state.dataDiff[key] = {
					update: {},
					add: {},
					delete: {},
				};
			}
			if (!has(state.dataDiff[key][operation], pk)) {
				state.dataDiff[key][operation][pk] = { newValue: {}, oldValue: {} };
			}
			state.dataDiff[key][operation][pk]["newValue"][column] = newValue;
			state.dataDiff[key][operation][pk]["oldValue"] = {
				...state.dataDiff[key][operation][pk]["oldValue"],
				[column]: oldValue,
			};
			return {
				dataDiff: {
					...state.dataDiff,
				},
			};
		}),
	revertDataDiff: (key, operation, pk, column) =>
		set((state) => {
			if (has(state.dataDiff, key) && has(state.dataDiff[key][operation], pk)) {
				delete state.dataDiff[key][operation][pk]["newValue"][column];
				delete state.dataDiff[key][operation][pk]["oldValue"][column];
				if (isEmpty(state.dataDiff[key][operation][pk]["newValue"])) {
					delete state.dataDiff[key][operation][pk];
				}
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
