import { StateCreator, create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface UserStoreState {
	user: any | null;
	account: any | null;
	permissions: string[];
	setUser: (user: any, permissions: string[], account: any) => void;
	clear: () => void;
}

const createStore: StateCreator<UserStoreState> = (set) => ({
	user: {},
	permissions: [],
	account: {},
	setUser: (user, permissions, account) =>
		set((state) => ({ user, permissions, account })),
	clear: () => set(() => ({ user: {}, permissions: [], account: {} })),
});

const useUserStore = create(createStore);

export default useUserStore;
