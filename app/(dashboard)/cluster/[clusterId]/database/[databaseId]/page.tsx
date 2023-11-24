"use client";

import { Commits } from "@/components/commits";
import { SidebarNav } from "@/components/side-nav";
import { getApi, postApi } from "@/lib/api";
import { tables } from "@/lib/placeholder";
import useClusterStore from "@/lib/store/clusterstore";
import { decrypt } from "@/lib/utils";
import { SidebarNavItem, Database } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export default function Page({
	params,
}: {
	params: {
		databaseId: string;
		clusterId: string;
	};
}) {
	const { cluster } = useClusterStore();
	const {
		data: databaseTables,
		refetch,
		isLoading,
	} = useQuery({
		queryKey: ["tables", params.clusterId, params.databaseId],
		queryFn: async () => {
			if (cluster)
				return await postApi(
					"http://localhost:8080/tables",
					JSON.stringify({
						...cluster,
						password: decrypt(cluster.password),
						database: params.databaseId,
					})
				);
		},
		enabled: !!cluster,
	});
	const { data } = useQuery({
		queryKey: ["queries", params.clusterId, params.databaseId],
		queryFn: async () => {
			return await getApi(
				`/api/clusters/${params.clusterId}/commits?databaseId=${params.databaseId}`
			);
		},
		enabled: !!cluster,
	});

	const tables = useMemo(() => {
		let tables: SidebarNavItem[] = [];

		databaseTables?.tables.forEach((database: string) => {
			tables.push({ name: database });
		});
		return tables;
	}, [databaseTables]);

	return (
		<div className="h-full w-full">
			<div className="flex flex-row">
				<SidebarNav
					type="table"
					items={tables?.map((element: SidebarNavItem) => ({
						name: element.name,
					}))}
				/>
				<Commits commits={data?.commits} />
			</div>
		</div>
	);
}
