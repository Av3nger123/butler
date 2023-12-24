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
import { decrypt } from "@/lib/utils";
import { SidebarNavItem } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export default function Page({
	params,
}: Readonly<{
	params: {
		databaseId: string;
		clusterId: string;
	};
}>) {
	const { cluster } = useClusterStore();

	const { data: DatabaseTables } = useGetTables(cluster, params.databaseId);

	const { data: DatabaseCommits } = useGetCommits(cluster, params.databaseId);

	const tables = useMemo(() => {
		let tables: SidebarNavItem[] = [];

		DatabaseTables?.tables?.forEach((database: string) => {
			tables.push({ name: database });
		});
		return tables;
	}, [DatabaseTables]);

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
				<Commits commits={DatabaseCommits?.commits} />
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}
