import { StateCreator, create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface WorkspaceStoreState {
	workspace: any | null;
	setWorkspace: (workspace: any) => void;
	clear: () => void;
}

const createStore: StateCreator<WorkspaceStoreState> = (set) => ({
	workspace: {},
	setWorkspace: (workspace) => set((state) => ({ workspace: workspace })),
	clear: () => set(() => ({ workspace: {} })),
});

const useWorkspaceStore = create(
	persist(createStore, {
		name: "workspace-store",
		storage: createJSONStorage(() => sessionStorage),
	})
);

export default useWorkspaceStore;
