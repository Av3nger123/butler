"use client";

import React, { useContext, useMemo, ReactNode } from "react";
import { useGetClusters } from "@/hooks/cluster";
import useClusterStore from "../store/clusterstore";
import { useGetCommits, useGetTables } from "@/hooks/databases";
import { usePathname } from "next/navigation";

interface DatabaseContextType {
	tables: any[];
	commits: any[];
	database: string;
}

const initialDatabaseContext: DatabaseContextType = {
	tables: [],
	commits: [],
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

	const { data: DatabaseCommits } = useGetCommits(cluster, database);

	const value = useMemo(() => {
		return {
			tables: DatabaseTables?.tables?.map((table: string) => ({ name: table })),
			commits: DatabaseCommits?.commits,
			database: database,
		};
	}, [DatabaseTables?.tables, DatabaseCommits?.commits, database]);
	return (
		<DatabaseContext.Provider value={value}>
			{children}
		</DatabaseContext.Provider>
	);
};

export { useDatabase, DatabaseContextProvider };
