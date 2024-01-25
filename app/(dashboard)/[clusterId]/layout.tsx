"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { ClusterContextProvider } from "@/lib/context/cluster-context";
import useWorkspaceStore from "@/lib/store/workspacestore";
import { WorkspaceContextProvider } from "@/lib/context/workspace-context";
import { DatabaseContextProvider } from "@/lib/context/database-context";

const BreadcrumbsNoSSR = dynamic(() => import("@/components/breadcrumbs"), {
	ssr: false,
});

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const workspace = useWorkspaceStore((state) => state.workspace);
	return (
		<WorkspaceContextProvider workspace={workspace}>
			<ClusterContextProvider>
				<DatabaseContextProvider>
					<div className={cn("flex flex-col h-full bg-background")}>
						<div className="border rounded-t-xl">
							<BreadcrumbsNoSSR />
						</div>
						<div className="border rounded-b-xl mb-6">{children}</div>
					</div>
				</DatabaseContextProvider>
			</ClusterContextProvider>
		</WorkspaceContextProvider>
	);
}
