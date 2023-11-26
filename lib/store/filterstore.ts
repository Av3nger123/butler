// store.js
import { has, unset } from "lodash";
import { StateCreator, create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface FilterStoreState {
	filters: { [key: string]: any[] };
	setColumn: (key: string, index: number, value: any) => void;
	setOperator: (key: string, index: number, value: any) => void;
	setValue: (key: string, index: number, value: any) => void;
	clearFilter: (key: string, index: number) => void;
	addFilter: (key: string) => void;
	clear: (key: string) => void;
}

const createStore: StateCreator<FilterStoreState> = (set) => ({
	filters: {},
	setColumn: (key, index, value) =>
		set((state) => ({
			filters: {
				...state.filters,
				[key]: state.filters[key].map((filter, idx) =>
					index === idx ? { ...filter, column: value } : filter
				),
			},
		})),
	setOperator: (key, index, value) =>
		set((state) => ({
			filters: {
				...state.filters,
				[key]: state.filters[key].map((filter, idx) =>
					index === idx ? { ...filter, operator: value } : filter
				),
			},
		})),
	setValue: (key, index, value) =>
		set((state) => ({
			filters: {
				...state.filters,
				[key]: state.filters[key].map((filter, idx) =>
					index === idx ? { ...filter, value: value } : filter
				),
			},
		})),
	clearFilter: (key, index) =>
		set((state) => {
			let { [key]: _, ...newFilters } = state.filters;
			return {
				filters: {
					...state.filters,
					[key]: [...state.filters[key].filter((_, idx) => idx !== index)],
				},
			};
		}),
	addFilter: (key) =>
		set((state) => {
			let filter = [];
			if (has(state.filters, key)) {
				filter = state.filters[key];
			}
			filter.push({
				column: "",
				operator: "",
				value: "",
			});

			return {
				filters: {
					...state.filters,
					[key]: filter,
				},
			};
		}),
	clear: (key) =>
		set((state) => {
			let { [key]: _, ...newFilters } = state.filters;
			return {
				filters: newFilters,
			};
		}),
});

const useFilterStore = create(
	persist(createStore, {
		name: "filter-store",
		storage: createJSONStorage(() => sessionStorage),
	})
);

export default useFilterStore;
