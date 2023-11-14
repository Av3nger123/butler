"use client";

import { useClusterContext } from "@/components/context/cluster-context";
import { SidebarNav } from "@/components/side-nav";
import { tables } from "@/lib/placeholder";
import { decrypt } from "@/lib/utils";
import { SidebarNavItem } from "@/types";
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
	const { myState } = useClusterContext();

	const { data: databaseTables, refetch } = useQuery({
		queryKey: ["tables", params.clusterId, params.databaseId],
		queryFn: async () => {
			return await fetch("http://localhost:8080/tables", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...myState,
					password: decrypt(myState.password),
					dbname: params.databaseId,
				}),
			}).then(async (res) => {
				return await res.json();
			});
		},
		enabled: !!myState,
	});

	const tables = useMemo(() => {
		let tables: SidebarNavItem[] = [];

		databaseTables?.tables.forEach((database: string) => {
			tables.push({ name: database });
		});
		return tables;
	}, [databaseTables]);
	return (
		<div className="h-full">
			<SidebarNav
				type="table"
				items={tables?.map((element: SidebarNavItem) => ({
					name: element.name,
				}))}
			/>
		</div>
	);
}
