"use client";

import React, { useContext, useMemo, ReactNode } from "react";
import { useGetClusters } from "@/hooks/cluster";
import useClusterStore from "../store/clusterstore";
import {
	useGetCommits,
	useGetDatabases,
	useGetTables,
} from "@/hooks/databases";
import { SidebarNavItem } from "@/types";

interface ClusterContextType {
	databases: any[];
}

const initialClusterContext: ClusterContextType = {
	databases: [],
};

const ClusterContext = React.createContext<ClusterContextType>(
	initialClusterContext
);

interface ClusterContextProviderProps {
	children: ReactNode;
}

const useCluster = () => {
	const state = useContext(ClusterContext);
	return state;
};

const ClusterContextProvider: React.FC<ClusterContextProviderProps> = ({
	children,
}) => {
	const { cluster } = useClusterStore();

	const { data: ClusterDatabases } = useGetDatabases(cluster);

	const databases = useMemo(() => {
		let databases: SidebarNavItem[] = [];

		ClusterDatabases?.databases?.forEach((database: string) => {
			databases.push({ name: database });
		});
		return databases;
	}, [ClusterDatabases]);

	const value = useMemo(() => {
		return {
			databases,
		};
	}, [databases]);
	return (
		<ClusterContext.Provider value={value}>{children}</ClusterContext.Provider>
	);
};

export { useCluster, ClusterContextProvider };
