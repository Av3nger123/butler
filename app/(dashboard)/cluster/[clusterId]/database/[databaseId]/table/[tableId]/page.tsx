"use client";
import { Queries } from "@/components/queries";
import { SQLEditor } from "@/components/sql-editor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getApi } from "@/lib/api";
import useClusterStore from "@/lib/store/clusterstore";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function Page({
	params,
}: {
	params: { clusterId: string; tableId: string; databaseId: string };
}) {
	const { cluster } = useClusterStore();
	const { data } = useQuery({
		queryKey: ["queries", params.clusterId, params.databaseId, params.tableId],
		queryFn: async () => {
			return await getApi(
				`/api/clusters/${params.clusterId}/queries?databaseId=${params.databaseId}&tableId=${params.tableId}`
			);
		},
		enabled: !!cluster,
	});
	return (
		<div className="p-2">
			<Tabs defaultValue="queries" className="w-full">
				<TabsList className="w-full right-1/2">
					<TabsTrigger value="queries">Queries</TabsTrigger>
					<TabsTrigger value="data">Table</TabsTrigger>
					<TabsTrigger value="schema">Schema</TabsTrigger>
				</TabsList>
				<TabsContent value="queries">
					<Queries queries={data?.queries} />
				</TabsContent>
				<TabsContent value="data"></TabsContent>
				<TabsContent value="schema">Change your password here.</TabsContent>
			</Tabs>
		</div>
	);
}
