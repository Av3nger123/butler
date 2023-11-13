import { DatabaseCard } from "@/components/database-card";
import { Database } from "@/types";

export function DatabaseCards({
	clusters,
	refetch,
}: {
	clusters: Database[];
	refetch: Function;
}) {
	console.log(clusters);
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{clusters?.map((cluster: Database, index: Number) => (
				<DatabaseCard
					key={cluster?.id}
					databaseCluster={cluster}
					refetch={refetch}
				/>
			))}
		</div>
	);
}
