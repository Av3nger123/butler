"use client";
import DataTable from "@/components/data-table";
import { Commits } from "@/components/commits";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TableToolbar } from "@/components/table-toolbar";
import { Filters } from "./filters";
import { TableContextProvider } from "@/lib/context/table-context";

export default function Page({
	params,
}: {
	params: { clusterId: string; tableId: string; databaseId: string };
}) {
	return (
		<div className="p-2">
			<TableContextProvider
				clusterId={params.clusterId}
				tableId={params.tableId}
				databaseId={params.databaseId}
			>
				<Tabs defaultValue="data" className="w-full">
					<TabsList>
						<TabsTrigger value="data">Table</TabsTrigger>
						<TabsTrigger value="commits">Commits</TabsTrigger>
					</TabsList>
					<TabsContent value="data">
						<TableToolbar />
						<Filters />
						<DataTable filterColumn={null} />
					</TabsContent>
					<TabsContent value="commits">
						<Commits commits={[]} />
					</TabsContent>
				</Tabs>
			</TableContextProvider>
		</div>
	);
}
