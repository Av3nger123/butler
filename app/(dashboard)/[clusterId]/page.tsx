"use client";
import { SidebarNav } from "@/components/side-nav";
import { SidebarNavItem } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import useClusterStore from "@/lib/store/clusterstore";
import { useGetDatabases } from "@/hooks/databases";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useCluster } from "@/lib/context/cluster-context";

export default function ClusterPage({
	params,
}: Readonly<{
	params: {
		clusterId: string;
	};
}>) {
	const { databases } = useCluster();
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
