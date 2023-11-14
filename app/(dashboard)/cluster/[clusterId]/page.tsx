"use client";
import { SidebarNav } from "@/components/side-nav";
import { decrypt, encrypt } from "@/lib/utils";
import { SidebarNavItem } from "@/types";
import { useQuery } from "@tanstack/react-query";
import {
	ClusterContextProvider,
	useClusterContext,
} from "@/components/context/cluster-context";
import { useMemo } from "react";

export default function ClusterPage({
	params,
}: Readonly<{
	params: {
		clusterId: string;
	};
}>) {
	const { myState } = useClusterContext();

	const { data: clusterDatabases, refetch } = useQuery({
		queryKey: ["databases", params.clusterId],
		queryFn: async () => {
			return await fetch("http://localhost:8080/databases", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...myState,
					password: decrypt(myState.password),
				}),
			}).then(async (res) => {
				return await res.json();
			});
		},
		enabled: !!myState,
	});

	const databases = useMemo(() => {
		let databases: SidebarNavItem[] = [];

		clusterDatabases?.databases.forEach((database: string) => {
			databases.push({ name: database });
		});
		return databases;
	}, [clusterDatabases]);

	return (
		<div className="h-full">
			<SidebarNav type="database" items={databases} />
		</div>
	);
}
