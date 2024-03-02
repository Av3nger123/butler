"use client";

import { Commits } from "@/components/commits";
import { SidebarNav } from "@/components/side-nav";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { SidebarNavItem } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SQLEditor } from "@/components/sql-editor";
import { useDatabase } from "@/lib/context/database-context";
import { DataView } from "@/components/data-views";

export default function Page() {
	const { tables, commits, queries } = useDatabase();
	return (
		<ResizablePanelGroup direction="horizontal" className="min-h-[79vh]">
			<ResizablePanel defaultSize={15} className="min-w-fit">
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
					<Tabs defaultValue="sql" className="h-full w-full">
						<TabsList>
							<TabsTrigger value="sql">SQL</TabsTrigger>
							<TabsTrigger value="views">Views</TabsTrigger>
							<TabsTrigger value="commits">Commits</TabsTrigger>
						</TabsList>
						<TabsContent value="sql">
							<SQLEditor />
						</TabsContent>
						<TabsContent value="views">
							<DataView />
						</TabsContent>
						<TabsContent value="commits">
							<Commits commits={commits} queries={queries} />
						</TabsContent>
					</Tabs>
				</div>
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}
