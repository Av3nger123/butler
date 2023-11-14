"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { DatabaseForm } from "@/components/database-form";
import { useQuery } from "@tanstack/react-query";
import { DatabaseCards } from "./database-cards";
import { getApi } from "@/lib/api";

export default function Home() {
	const { data, refetch } = useQuery({
		queryKey: ["clusters"],
		queryFn: async () => {
			return await getApi("/api/clusters");
		},
	});
	return (
		<main className="flex flex-col items-center justify-between p-10">
			<div className="container mx-auto p-4">
				<div className="flex flex-row gap-2 items-start justify-between">
					<h1 className="text-2xl font-bold mb-4">Your Database clusters</h1>
					<Dialog>
						<DialogTrigger asChild>
							<Button variant={"outline"}>
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
				<DatabaseCards clusters={data?.clusters} refetch={refetch} />
			</div>
		</main>
	);
}
