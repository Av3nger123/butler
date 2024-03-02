"use client";

import React, { useContext, useMemo, ReactNode } from "react";
import { useGetClusters } from "@/hooks/cluster";
import useClusterStore from "../store/clusterstore";
import { useGetCommits, useGetTables, useGetViews } from "@/hooks/databases";
import { usePathname } from "next/navigation";

interface DatabaseContextType {
	tables: any[];
	commits: any[];
	queries: any[];
	views: any[];
	commitRefetch: any;
	database: string;
}

const initialDatabaseContext: DatabaseContextType = {
	tables: [],
	commits: [],
	queries: [],
	views: [],
	commitRefetch: null,
	database: "",
};

const DatabaseContext = React.createContext<DatabaseContextType>(
	initialDatabaseContext
);

interface DatabaseContextProviderProps {
	children: ReactNode;
}

const useDatabase = () => {
	const state = useContext(DatabaseContext);
	return state;
};

const DatabaseContextProvider: React.FC<DatabaseContextProviderProps> = ({
	children,
}) => {
	const pathname = usePathname();
	const pathSegments = pathname.split("/").filter((segment) => segment !== "");
	const database: string = useMemo(() => {
		if (pathSegments?.length > 1) {
			return pathSegments[1];
		}
		return "";
	}, [pathSegments]);

	const { cluster } = useClusterStore();

	const { data: DatabaseTables } = useGetTables(cluster, database);

	const { data: DatabaseCommits, refetch: commitRefetch } = useGetCommits(
		cluster,
		database
	);

	const { data: DatabaseViews } = useGetViews(cluster, database);

	const value = useMemo(() => {
		return {
			tables: DatabaseTables?.tables?.map((table: string) => ({ name: table })),
			commits: DatabaseCommits?.commits,
			queries: DatabaseCommits?.queries,
			database: database,
			commitRefetch,
			views: DatabaseViews?.views,
		};
	}, [
		DatabaseTables?.tables,
		DatabaseCommits?.commits,
		DatabaseCommits?.queries,
		database,
		commitRefetch,
		DatabaseViews?.views,
	]);
	return (
		<DatabaseContext.Provider value={value}>
			{children}
		</DatabaseContext.Provider>
	);
};

export { useDatabase, DatabaseContextProvider };
