import { StateCreator, create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface UserStoreState {
	user: any | null;
	permissions: string[];
	setUser: (user: any, permissions: string[]) => void;
	clear: () => void;
}

const createStore: StateCreator<UserStoreState> = (set) => ({
	user: {},
	permissions: [],
	setUser: (user, permissions) => set((state) => ({ user: user, permissions })),
	clear: () => set(() => ({ user: {}, permissions: [] })),
});

const useUserStore = create(
	persist(createStore, {
		name: "user-store",
		storage: createJSONStorage(() => sessionStorage),
	})
);

export default useUserStore;
