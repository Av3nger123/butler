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
		<div className="h-full min-h-[79vh] p-2">
			<TableContextProvider
				clusterId={params.clusterId}
				tableId={params.tableId}
				databaseId={params.databaseId}
			>
				<TableToolbarNoSSR />
				<FiltersNoSSR />
				<DataTable filterColumn={null} />
			</TableContextProvider>
		</div>
	);
}
