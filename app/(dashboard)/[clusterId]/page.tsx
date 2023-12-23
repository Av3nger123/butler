"use client";
import { SidebarNav } from "@/components/side-nav";
import { decrypt } from "@/lib/utils";
import { SidebarNavItem } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { postApi } from "@/lib/api";
import useClusterStore from "@/lib/store/clusterstore";

export default function ClusterPage({
	params,
}: Readonly<{
	params: {
		clusterId: string;
	};
}>) {
	const { cluster } = useClusterStore();

	const { data: clusterDatabases } = useQuery({
		queryKey: ["databases", params.clusterId],
		queryFn: async () => {
			if (cluster)
				return await postApi(
					"http://localhost:8080/databases",
					JSON.stringify({
						...cluster,
						password: decrypt(cluster.password),
					})
				);
		},
		enabled: !!cluster,
	});

	const databases = useMemo(() => {
		let databases: SidebarNavItem[] = [];

		clusterDatabases?.databases.forEach((database: string) => {
			databases.push({ name: database });
		});
		return databases;
	}, [clusterDatabases]);

	return (
		<div className="flex flex-row">
			<div className="border-r">
				<SidebarNav type="database" items={databases} />
			</div>
		</div>
	);
}
