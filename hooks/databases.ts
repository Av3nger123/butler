import { getApi, postApi } from "@/lib/api";
import { DatabaseCluster } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export const useGetDatabases = (cluster: DatabaseCluster | null) => {
	return useQuery({
		queryKey: ["databases", cluster?.id],
		queryFn: async () => {
			if (cluster) {
				return await getApi(
					`${process.env.NEXT_PUBLIC_SERVER_URL}/cluster/databases/${cluster.id}`
				);
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
			if (cluster && database) {
				return await getApi(
					`${process.env.NEXT_PUBLIC_SERVER_URL}/cluster/tables/${cluster?.id}?db=${database}`
				);
			}
		},
		enabled: !!cluster,
	});
};

export const useGetViews = (
	cluster: DatabaseCluster | null,
	database: string
) => {
	return useQuery({
		queryKey: ["views", cluster?.id, database],
		queryFn: async () => {
			if (cluster && database) {
				return await getApi(
					`${process.env.NEXT_PUBLIC_SERVER_URL}/views?clusterId=${cluster?.id}&databaseId=${database}`
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
			if (cluster && database) {
				return await getApi(
					`${process.env.NEXT_PUBLIC_SERVER_URL}/commits?clusterId=${cluster?.id}&databaseId=${database}`
				);
			}
		},
		enabled: !!cluster,
	});
};
