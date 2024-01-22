import { getApi, postApi } from "@/lib/api";
import { DatabaseCluster } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export const useGetDatabases = (cluster: DatabaseCluster | null) => {
	return useQuery({
		queryKey: ["databases", cluster?.id],
		queryFn: async () => {
			if (cluster) {
				return await getApi(`${process.env.NEXT_PUBLIC_SERVER_URL}/databases/${cluster.id}`);
			}
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
			if (cluster) {
				return await getApi(
					`${process.env.NEXT_PUBLIC_SERVER_URL}/tables/${cluster?.id}?db=${database}`
				);
			}
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
