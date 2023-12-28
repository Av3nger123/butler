import { getApi, postApi } from "@/lib/api";
import { decrypt } from "@/lib/utils";
import { DatabaseCluster } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useGetDatabases = (cluster: DatabaseCluster | null) => {
	return useQuery({
		queryKey: ["databases", cluster?.id],
		queryFn: async () => {
			if (cluster)
				return await postApi(
					"http://localhost:8080/databases",
					JSON.stringify({
						...cluster,
						port: parseInt(cluster.port),
						password: decrypt(cluster.password),
					})
				);
		},
		enabled: !!cluster,
	});
};

export const useGetTables = (
	cluster: DatabaseCluster | null,
	database: string
) => {
	return useQuery({
		queryKey: ["tables", cluster?.id, database],
		queryFn: async () => {
			if (cluster)
				return await postApi(
					"http://localhost:8080/tables",
					JSON.stringify({
						...cluster,
						port: parseInt(cluster.port),
						password: decrypt(cluster.password),
						database: database,
					})
				);
		},
		enabled: !!cluster,
	});
};

export const useGetCommits = (
	cluster: DatabaseCluster | null,
	database: string
) => {
	return useQuery({
		queryKey: ["queries", cluster?.id, database],
		queryFn: async () => {
			return await getApi(
				`/api/clusters/${cluster?.id}/commits?databaseId=${database}`
			);
		},
		enabled: !!cluster,
	});
};
