"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
	CircleIcon,
	Delete,
	DeleteIcon,
	Edit,
	Edit2,
	LucideDelete,
	Settings2,
	StarIcon,
	Trash,
} from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { DatabaseForm } from "./database-form";
import Link from "next/link";
import { Database } from "@/types";
import { Skeleton } from "./ui/skeleton";
import { deleteApi } from "@/lib/api";
import useClusterStore from "@/lib/store/clusterstore";
import useUserStore from "@/lib/store/userstore";
import { useToast } from "./ui/use-toast";

interface DatabaseCardProps {
	databaseCluster: Database;
	refetch: any;
}

const colorTypes: { [key in Database["type"]]: string } = {
	postgres: "#0064a5",
	mysql: "#f29111",
	sqllite: "#044a64",
	mssql: "#ff0000",
};

export function DatabaseCard({
	databaseCluster,
	refetch,
}: Readonly<DatabaseCardProps>) {
	const { toast } = useToast();
	const permissions = useUserStore((state) => state.permissions);
	const { cluster, setCluster } = useClusterStore();
	async function handleDelete() {
		if (!permissions.includes("delete-cluster")) {
			toast({
				title: "Permission denied",
				description: "You are not authorized to delete this cluster",
			});
			return;
		}
		await deleteApi(`/api/clusters/${databaseCluster.id}`, "");
		refetch();
	}

	async function handleClusterCLick() {
		setCluster(databaseCluster);
	}
	return (
		<Card>
			<CardHeader className="grid grid-cols-[1fr_110px] items-start gap-1 space-y-0">
				<div className="space-y-1">
					<CardTitle>
						<Link
							href={`/cluster/${databaseCluster.id}`}
							onClick={handleClusterCLick}
						>
							{databaseCluster.name}
						</Link>
					</CardTitle>
					<CardDescription>
						{databaseCluster.host}:{databaseCluster.port}
					</CardDescription>
				</div>
				<div className="flex items-center space-x-1 rounded-md">
					<Dialog>
						<DialogTrigger>
							<Settings2 />
						</DialogTrigger>
						<DialogContent className="sm:max-w-[425px]">
							<DialogHeader>
								<DialogTitle>Edit Database</DialogTitle>
								<DialogDescription>
									Make changes to your database configuration here. Click save
									when you&apos;re done.
								</DialogDescription>
							</DialogHeader>
							<DatabaseForm
								databaseCluster={databaseCluster}
								refetch={refetch}
							/>
						</DialogContent>
					</Dialog>
					<Separator orientation="vertical" className="h-[20px]" />
					<AlertDialog>
						<AlertDialogTrigger>
							<Trash />
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. This will permanently delete the
									Database Cluster and remove all the data related to it from
									our servers.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction onClick={handleDelete}>
									Continue
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			</CardHeader>
			<CardContent>
				<div className="flex space-x-4 text-sm text-muted-foreground">
					<div className="flex items-center">
						<CircleIcon
							className={`mr-1 h-3 w-3 fill-[${
								colorTypes[databaseCluster.type]
							}] text-[${colorTypes[databaseCluster.type]}]`}
						/>
						{databaseCluster.type}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
