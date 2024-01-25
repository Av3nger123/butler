import { DatabaseCard } from "@/components/database-card";
import { useWorkspace } from "@/lib/context/workspace-context";
import { DatabaseCluster } from "@/types";

export function DatabaseCards() {
	const { clusters, refetch } = useWorkspace();

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
			{clusters?.map((cluster: DatabaseCluster, index: number) => (
				<DatabaseCard
					key={cluster?.id}
					databaseCluster={cluster}
					refetch={refetch}
				/>
			))}
		</div>
	);
}
