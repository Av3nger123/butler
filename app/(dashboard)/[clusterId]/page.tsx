"use client";
import { SidebarNav } from "@/components/side-nav";
import { decrypt } from "@/lib/utils";
import { SidebarNavItem } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { postApi } from "@/lib/api";
import useClusterStore from "@/lib/store/clusterstore";
import { useGetDatabases } from "@/hooks/databases";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function ClusterPage({
	params,
}: Readonly<{
	params: {
		clusterId: string;
	};
}>) {
	const { cluster } = useClusterStore();

	const { data: ClusterDatabases } = useGetDatabases(cluster);

	const databases = useMemo(() => {
		let databases: SidebarNavItem[] = [];

		ClusterDatabases?.databases.forEach((database: string) => {
			databases.push({ name: database });
		});
		return databases;
	}, [ClusterDatabases]);

	return (
		<ResizablePanelGroup direction="horizontal" className="min-h-[79vh] border">
			<ResizablePanel defaultSize={15}>
				<SidebarNav type="database" items={databases} />
			</ResizablePanel>
			<ResizableHandle withHandle />
			<ResizablePanel defaultSize={85}></ResizablePanel>
		</ResizablePanelGroup>
	);
}
