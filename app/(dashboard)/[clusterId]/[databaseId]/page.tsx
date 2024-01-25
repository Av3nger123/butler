"use client";

import { Commits } from "@/components/commits";
import { SidebarNav } from "@/components/side-nav";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useGetCommits, useGetTables } from "@/hooks/databases";
import { getApi, postApi } from "@/lib/api";
import useClusterStore from "@/lib/store/clusterstore";
import { SidebarNavItem } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SQLQuery } from "@/components/sql-query";
import { useDatabase } from "@/lib/context/database-context";

export default function Page() {
	const { tables, commits } = useDatabase();
	return (
		<ResizablePanelGroup direction="horizontal" className="min-h-[79vh] border">
			<ResizablePanel defaultSize={15}>
				<SidebarNav
					type="table"
					items={tables?.map((element: SidebarNavItem) => ({
						name: element.name,
					}))}
				/>
			</ResizablePanel>
			<ResizableHandle withHandle />
			<ResizablePanel defaultSize={85}>
				<div className="p-2">
					<Tabs defaultValue="sql" className="w-full h-full">
						<TabsList>
							<TabsTrigger value="sql">SQL</TabsTrigger>
							<TabsTrigger value="commits">Commits</TabsTrigger>
						</TabsList>
						<TabsContent value="sql">
							<SQLQuery />
						</TabsContent>
						<TabsContent value="commits">
							<Commits commits={commits} />
						</TabsContent>
					</Tabs>
				</div>
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}
