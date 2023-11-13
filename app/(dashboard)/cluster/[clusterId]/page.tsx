"use client";
import { SidebarNav } from "@/components/side-nav";
import { databaseClusters, databases } from "@/lib/placeholder";
import { encrypt } from "@/lib/utils";
import { SidebarNavItem } from "@/types";
import { useQuery } from "@tanstack/react-query";

export default function ClusterPage({
	params,
}: {
	params: {
		clusterId: string;
	};
}) {
	const { data: cluster } = useQuery({
		queryKey: ["cluster", params.clusterId],
		queryFn: async () => {
			return await fetch("/api/clusters/" + params.clusterId).then(
				async (res) => {
					return await res.json();
				}
			);
		},
	});

	const { data: databases, refetch } = useQuery({
		queryKey: ["databases", params.clusterId],
		queryFn: async () => {
			return await fetch("http://localhost:8080/databases", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					encrypted_payload: encrypt(JSON.stringify(cluster.data[0])),
				}),
			});
		},
		enabled: !!cluster,
	});

	return (
		<div className="h-full">
			{/* <SidebarNav
				type="database"
				items={databases[params.clusterId].map((element: SidebarNavItem) => ({
					name: element.name,
					link: element.link,
				}))}
			/> */}
		</div>
	);
}
