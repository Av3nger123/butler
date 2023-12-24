import { DatabaseCard } from "@/components/database-card";
import { DatabaseCluster } from "@/types";

export function DatabaseCards({
	clusters,
	refetch,
}: Readonly<{
	clusters: DatabaseCluster[];
	refetch: Function;
}>) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
