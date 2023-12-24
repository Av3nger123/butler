"use client";
import DataTable from "@/components/data-table";
import { Commits } from "@/components/commits";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TableContextProvider } from "@/lib/context/table-context";
import dynamic from "next/dynamic";

const TableToolbarNoSSR = dynamic(() => import("@/components/table-toolbar"), {
	ssr: false,
});

const FiltersNoSSR = dynamic(() => import("@/components/filters"), {
	ssr: false,
});

export default function Page({
	params,
}: Readonly<{
	params: { clusterId: string; tableId: string; databaseId: string };
}>) {
	return (
		<div className="h-full p-2">
			<TableContextProvider
				clusterId={params.clusterId}
				tableId={params.tableId}
				databaseId={params.databaseId}
			>
				<Tabs defaultValue="data" className="w-full h-full">
					<TabsList>
						<TabsTrigger value="data">Table</TabsTrigger>
						<TabsTrigger value="commits">Commits</TabsTrigger>
					</TabsList>
					<TabsContent value="data">
						<TableToolbarNoSSR />
						<FiltersNoSSR />
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
