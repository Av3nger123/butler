// store.js
import { StateCreator, create } from "zustand";
import { StorageValue, persist } from "zustand/middleware";
import { encrypt, decrypt } from "@/lib/utils";
import { DatabaseCluster } from "@/types";

interface ClusterStoreState {
	cluster: DatabaseCluster | null;
	setCluster: (cluster: DatabaseCluster) => void;
	clear: () => void;
}

const createStore: StateCreator<ClusterStoreState> = (set) => ({
	cluster: null,
	setCluster: (cluster) => set(() => ({ cluster: cluster })),
	clear: () => set(() => ({ cluster: null })),
});

const useClusterStore = create(
	persist(createStore, {
		name: "cluster-store",
		storage: {
			getItem: async (name: string) => {
				const encryptedData = sessionStorage.getItem(name);
				if (encryptedData) {
					return JSON.parse(decrypt(encryptedData));
				}
				return null;
			},
			setItem: async (name: string, data: StorageValue<ClusterStoreState>) => {
				const encryptedData = encrypt(JSON.stringify(data));
				sessionStorage.setItem(name, encryptedData);
			},
			removeItem: async (name: string) => {
				sessionStorage.removeItem(name);
			},
		},
	})
);

export default useClusterStore;
