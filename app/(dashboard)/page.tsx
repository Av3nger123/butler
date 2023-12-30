"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { DatabaseForm } from "@/components/database-form";
import { DatabaseCards } from "../../components/database-cards";
import useWorkspaceStore from "@/lib/store/workspacestore";
import { useGetClusters } from "@/hooks/cluster";

export default function Home() {
	const workspace = useWorkspaceStore((state) => state.workspace);
	const { data: WorkspaceClusters, refetch } = useGetClusters(workspace);

	return (
		<main className="flex flex-col items-center justify-between p-10">
			<div className="container mx-auto border rounded-xl bg-primary-foreground">
				<div className="flex flex-row gap-2 items-center justify-between border-b p-4">
					<h1 className="text-2xl font-bold">Your Database clusters</h1>
					<Dialog>
						<DialogTrigger asChild>
							<Button>
								<PlusCircle className="mr-2 h-4 w-4" />
								Add Cluster
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[425px]">
							<DialogHeader>
								<DialogTitle>Add Cluster</DialogTitle>
								<DialogDescription>
									Add your database configuration here. Click save when
									you&apos;re done.
								</DialogDescription>
							</DialogHeader>
							<DatabaseForm databaseCluster={null} refetch={refetch} />
						</DialogContent>
					</Dialog>
				</div>
				<DatabaseCards
					clusters={WorkspaceClusters?.clusters}
					refetch={refetch}
				/>
			</div>
		</main>
	);
}
