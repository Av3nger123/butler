"use client";
import DataTable from "@/components/data-table";
import { Commits } from "@/components/commits";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getApi, postApi } from "@/lib/api";
import useClusterStore from "@/lib/store/clusterstore";
import { decrypt } from "@/lib/utils";
import { Schema } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Suspense, useEffect, useMemo, useState } from "react";
import { dataColumns } from "./data-columns";
import { PaginationState } from "@tanstack/react-table";
import useFilterStore from "@/lib/store/filterstore";
import { TableToolbar } from "@/components/table-toolbar";
import { has } from "lodash";
import { TableFilter } from "@/components/table-filter";
import { Skeleton } from "@/components/ui/skeleton";
import { Filters } from "./filters";

export default function Page({
	params,
}: {
	params: { clusterId: string; tableId: string; databaseId: string };
}) {
	const { cluster } = useClusterStore();
	const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});

	const { data: queryData } = useQuery({
		queryKey: ["queries", params.clusterId, params.databaseId, params.tableId],
		queryFn: async () => {
			return await getApi(
				`/api/clusters/${params.clusterId}/commits?databaseId=${params.databaseId}&tableId=${params.tableId}`
			);
		},
		enabled: !!cluster,
	});

	const { data: schemaData } = useQuery({
		queryKey: ["schema", params.clusterId, params.databaseId, params.tableId],
		queryFn: async () => {
			if (cluster)
				return await postApi(
					`http://localhost:8080/metadata`,
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

	const { data: tableData, isLoading } = useQuery({
		queryKey: [
			"data",
			params.clusterId,
			params.databaseId,
			params.tableId,
			pageIndex,
			pageSize,
		],
		queryFn: async () => {
			if (cluster)
				return await postApi(
					`http://localhost:8080/data?page=${pageIndex}&size=${pageSize}`,
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
		let schemas: { [key: string]: Schema } = {};
		if (schemaData) {
			Object.keys(schemaData?.metadata).forEach((key) => {
				schemas[key] = {
					column: key,
					dataType: `${schemaData.metadata[key]["dataType"]}${
						schemaData.metadata[key]["maxLength"]["Valid"] === true
							? `(${schemaData.metadata[key]["maxLength"]["Int64"]})`
							: ""
					}`,
					isNullable: schemaData.metadata[key]["isNullable"],
					columnDefault: `${
						schemaData.metadata[key]["columnDefault"]["Valid"] === true
							? `${schemaData.metadata[key]["columnDefault"]["String"]}`
							: " - "
					}`,
					position: parseInt(schemaData.metadata[key]["position"]),
					isPrimary: schemaData.metadata[key]["isPrimary"],
					index: schemaData.metadata[key]["index"],
					foreignKey: schemaData.metadata[key]["foreignKey"],
				};
			});
		}
		return schemas;
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

	const key = `${params.clusterId}~${params.databaseId}~${params.tableId}`;
	return (
		<div className="p-2">
			<Tabs defaultValue="data" className="w-full">
				<TabsList>
					<TabsTrigger value="data">Table</TabsTrigger>
					<TabsTrigger value="commits">Commits</TabsTrigger>
				</TabsList>
				<TabsContent value="data">
					<TableToolbar path={key} />
					<Filters path={key} schemas={schemas} />
					<DataTable
						columns={dataColumns(Object.keys(data[0] ?? {}), schemas)}
						data={data}
						filterColumn={null}
						pageIndex={pageIndex}
						pageSize={pageSize}
						setPagination={setPagination}
						count={Math.ceil(tableData?.count / pageSize)}
					/>
				</TabsContent>
				<TabsContent value="commits">
					<Commits commits={queryData?.commits} />
				</TabsContent>
			</Tabs>
		</div>
	);
}
