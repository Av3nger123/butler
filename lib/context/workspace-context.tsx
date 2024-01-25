"use client";

import React, { useContext, useMemo, ReactNode } from "react";
import { useGetClusters } from "@/hooks/cluster";

interface WorkspaceContextType {
	clusters: any[];
	refetch: () => void;
}

const initialWorkspaceContext: WorkspaceContextType = {
	clusters: [],
	refetch: () => {},
};

const WorkspaceContext = React.createContext<WorkspaceContextType>(
	initialWorkspaceContext
);

interface WorkspaceContextProviderProps {
	children: ReactNode;
	workspace: any;
}

const useWorkspace = () => {
	const state = useContext(WorkspaceContext);
	return state;
};

const WorkspaceContextProvider: React.FC<WorkspaceContextProviderProps> = ({
	children,
	workspace,
}) => {
	const { data: WorkspaceClusters, refetch } = useGetClusters(workspace);

	const value = useMemo(() => {
		return { clusters: WorkspaceClusters?.clusters, refetch };
	}, [WorkspaceClusters, refetch]);
	return (
		<WorkspaceContext.Provider value={value}>
			{children}
		</WorkspaceContext.Provider>
	);
};

export { useWorkspace, WorkspaceContextProvider };
