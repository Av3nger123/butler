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
	Loader2,
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
import { DatabaseCluster } from "@/types";
import { Skeleton } from "./ui/skeleton";
import { deleteApi, getApi, postApi } from "@/lib/api";
import useClusterStore from "@/lib/store/clusterstore";
import useUserStore from "@/lib/store/userstore";
import { useToast } from "./ui/use-toast";
import { toast } from "sonner";
import Image from "next/image";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { decrypt } from "@/lib/encryption";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";

interface DatabaseCardProps {
	databaseCluster: DatabaseCluster;
	refetch: any;
}

const colorTypes: { [key in DatabaseCluster["type"]]: string } = {
	postgres: "#0064a5",
	mysql: "#f29111",
	sqllite: "#044a64",
	mssql: "#ff0000",
};

export function DatabaseCard({
	databaseCluster,
	refetch,
}: Readonly<DatabaseCardProps>) {
	const [permissions, account] = useUserStore((state) => [
		state.permissions,
		state.account,
	]);
	const { data: session } = useSession();
	const { cluster, setCluster } = useClusterStore();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [success, setSuccess] = useState(false);

	async function handleDelete() {
		if (!permissions.includes("delete-cluster")) {
			return toast.error("You are not authorized to delete this cluster");
		}
		await deleteApi(`/api/clusters/${databaseCluster.id}`, "");
		refetch();
	}

	async function handleClusterCLick() {
		setLoading(true);
		setError(false);
		setSuccess(false);
		getApi(
			`${process.env.NEXT_PUBLIC_SERVER_URL}/cluster/ping/${databaseCluster?.id}`,
			{
				Authorization: account?.access_token,
			}
		)
			.then((response) => {
				if (response.error) {
					setError(true);
				} else {
					setSuccess(true);
				}
				setLoading(false);
			})
			.catch((err) => {
				setError(true);
				setLoading(false);
			});
	}

	useEffect(() => {
		if (success) {
			toast.success("Connection established successfully");
			setCluster(databaseCluster);
			redirect(`/${databaseCluster?.id}`);
		}
	}, [databaseCluster?.id, success]);

	useEffect(() => {
		if (error) {
			toast.error("Failed connecting to the cluster");
		}
	}, [error]);
	return (
		<Card className="flex flex-col justify-between">
			<CardHeader className="grid grid-cols-[1fr_110px] items-start gap-1 space-y-0">
				<div className="space-y-1">
					<CardTitle>{databaseCluster.name}</CardTitle>
					<CardDescription>
						{databaseCluster.host}:{databaseCluster.port}
					</CardDescription>
				</div>
				<div className="flex items-start justify-end gap-1 rounded-md">
					<Dialog>
						<DialogTrigger asChild>
							<Button size={"icon"} variant={"outline"}>
								<Edit className="w-4 h-4" />
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[425px]">
							<DialogHeader>
								<DialogTitle>Edit Database</DialogTitle>
								<DialogDescription>
									Make changes to your database configuration here. Click save
									when you&apos;re done.
								</DialogDescription>
							</DialogHeader>
							<DatabaseForm cluster={databaseCluster} />
						</DialogContent>
					</Dialog>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button size={"icon"} variant={"outline"}>
								<Trash className="w-4 h-4" />
							</Button>
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
				<div className="flex justify-between space-x-4 text-sm text-muted-foreground">
					<div className="flex items-center gap-2">
						<Image
							src={`/images/${databaseCluster?.type}.svg`}
							alt="unlock"
							width={20 * (databaseCluster?.type === "mysql" ? 2 : 1)}
							height={20 * (databaseCluster?.type === "mysql" ? 2 : 1)}
						/>
						{databaseCluster.type}
					</div>
					<Button disabled={loading} onClick={handleClusterCLick}>
						{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						{loading ? "Connecting" : success ? "Connected" : "Connect"}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
