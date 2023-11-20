"use client";
import DataTable from "@/components/data-table";
import { Queries } from "@/components/queries";
import { SQLEditor } from "@/components/sql-editor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getApi, postApi } from "@/lib/api";
import useClusterStore from "@/lib/store/clusterstore";
import { decrypt } from "@/lib/utils";
import { Schema } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { schemaColumns } from "./schema-columns";
import { dataColumns } from "./data-columns";

export default function Page({
	params,
}: {
	params: { clusterId: string; tableId: string; databaseId: string };
}) {
	const { cluster } = useClusterStore();
	const { data: queryData } = useQuery({
		queryKey: ["queries", params.clusterId, params.databaseId, params.tableId],
		queryFn: async () => {
			return await getApi(
				`/api/clusters/${params.clusterId}/queries?databaseId=${params.databaseId}&tableId=${params.tableId}`
			);
		},
		enabled: !!cluster,
	});

	const { data: schemaData } = useQuery({
		queryKey: ["schema", params.clusterId, params.databaseId, params.tableId],
		queryFn: async () => {
			if (cluster)
				return await postApi(
					`http://localhost:8080/schema`,
					JSON.stringify({
						...cluster,
						password: decrypt(cluster.password),
						database: params.databaseId,
						table: params.tableId,
					})
				);
		},
		enabled: !!cluster,
	});

	const { data: tableData } = useQuery({
		queryKey: ["data", params.clusterId, params.databaseId, params.tableId],
		queryFn: async () => {
			if (cluster)
				return await postApi(
					`http://localhost:8080/data`,
					JSON.stringify({
						...cluster,
						password: decrypt(cluster.password),
						database: params.databaseId,
						table: params.tableId,
					})
				);
		},
		enabled: !!cluster,
	});

	const schemas = useMemo(() => {
		let schemas: Schema[] = [];
		if (schemaData) {
			Object.keys(schemaData?.schema).forEach((key) => {
				schemas.push({
					column: key,
					dataType: `${schemaData.schema[key]["dataType"]}${
						schemaData.schema[key]["maxLength"]["Valid"] === true
							? `(${schemaData.schema[key]["maxLength"]["Int64"]})`
							: ""
					}`,
					isNullable: schemaData.schema[key]["isNullable"],
					columnDefault: `${
						schemaData.schema[key]["columnDefault"]["Valid"] === true
							? `${schemaData.schema[key]["columnDefault"]["String"]}`
							: " - "
					}`,
					position: parseInt(schemaData.schema[key]["position"]),
				});
			});
		}
		return schemas.sort((a, b) => a.position - b.position);
	}, [schemaData]);

	const data = useMemo(() => {
		let data: any[] = [];
		if (tableData) {
			tableData?.data.forEach((row: any) => {
				data.push({
					...row,
				});
			});
		}
		return data;
	}, [tableData]);
	return (
		<div className="p-2">
			<Tabs defaultValue="queries" className="w-full">
				<TabsList className="w-full right-1/2">
					<TabsTrigger value="queries">Queries</TabsTrigger>
					<TabsTrigger value="data">Table</TabsTrigger>
					<TabsTrigger value="schema">Schema</TabsTrigger>
				</TabsList>
				<TabsContent value="queries">
					<Queries queries={queryData?.queries} />
				</TabsContent>
				<TabsContent value="data">
					<DataTable
						columns={dataColumns(Object.keys(data[0] ?? {}))}
						data={data}
						filterColumn={null}
					/>
				</TabsContent>
				<TabsContent value="schema">
					<DataTable
						columns={schemaColumns}
						data={schemas}
						filterColumn={null}
					/>
				</TabsContent>
			</Tabs>
		</div>
	);
}
