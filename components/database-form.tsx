"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormProvider, useForm } from "react-hook-form";
import * as z from "zod";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { Eye, EyeIcon, EyeOffIcon } from "lucide-react";
import { EyeClosedIcon } from "@radix-ui/react-icons";
import { DatabaseCluster } from "@/types";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { decrypt, encrypt } from "@/lib/utils";
import { postApi } from "@/lib/api";
import useWorkspaceStore from "@/lib/store/workspacestore";
import useUserStore from "@/lib/store/userstore";
import { toast } from "sonner";

const databaseSchema = z.object({
	name: z.string().min(2, {
		message: "Username must be at least 2 characters.",
	}),
	host: z.string().min(2, {
		message: "Username must be at least 2 characters.",
	}),
	port: z.string().min(3, {
		message: "Username must be at least 2 characters.",
	}),
	username: z.string().min(2, {
		message: "Username must be at least 2 characters.",
	}),
	password: z.string().min(2, {
		message: "Username must be at least 2 characters.",
	}),
	type: z.string().min(2, {
		message: "Username must be at least 2 characters.",
	}),
});
interface DatabaseFormProps {
	databaseCluster: DatabaseCluster | null;
	refetch: Function;
}

const portTypes: { [key in DatabaseCluster["type"]]: string } = {
	postgres: "5432",
	mysql: "3306",
	sqllite: "8191",
};

export function DatabaseForm({
	databaseCluster,
	refetch,
}: Readonly<DatabaseFormProps>) {
	const permissions = useUserStore((state) => state.permissions);
	const workspace = useWorkspaceStore((state) => state.workspace);
	const form = useForm<z.infer<typeof databaseSchema>>({
		resolver: zodResolver(databaseSchema),
		defaultValues: {
			name: databaseCluster?.name,
			host: databaseCluster?.host,
			port: databaseCluster?.port,
			username: databaseCluster?.username,
			password: databaseCluster?.password
				? decrypt(databaseCluster?.password)
				: "",
			type: databaseCluster?.type,
		},
	});

	async function onSubmit(values: z.infer<typeof databaseSchema>) {
		if (
			!permissions.includes("add-cluster") &&
			!permissions.includes("edit-cluster")
		) {
			return toast.error("You are not authorized to add/edit the cluster");
		} else {
			let request: any = { ...values };
			if (databaseCluster) {
				request["id"] = databaseCluster?.id;
			}
			request["workspace_id"] = workspace?.id;
			request["password"] = encrypt(values.password);
			postApi("/api/clusters", JSON.stringify(request)).then((response) => {
				toast.success("Cluster Saved successfully");
				refetch();
			});
		}
	}
	return (
		<FormProvider {...form}>
			<form className="space-y-8">
				<div className="grid grid-cols-3 gap-2">
					<div className="col-span-2">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormDescription />
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<FormField
						control={form.control}
						name="type"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Type</FormLabel>
								<FormControl>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												<SelectItem value="postgres">PostgreSQL</SelectItem>
												<SelectItem value="mysql">MySQL</SelectItem>
												<SelectItem value="mssql">MSSQl</SelectItem>
												<SelectItem value="mariadb">Maria DB</SelectItem>
											</SelectGroup>
										</SelectContent>
									</Select>
								</FormControl>
								<FormDescription />
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className="grid grid-cols-3 gap-2">
					<div className="col-span-2">
						<FormField
							control={form.control}
							name="host"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Host</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormDescription />
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<FormField
						control={form.control}
						name="port"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Port</FormLabel>
								<FormControl>
									<Input
										type="text"
										placeholder={
											databaseCluster?.type
												? String(portTypes[databaseCluster.type])
												: ""
										}
										{...field}
									/>
								</FormControl>
								<FormDescription />
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="grid grid-cols-2 gap-2">
					<FormField
						control={form.control}
						name="username"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Username</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormDescription />
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input type="password" {...field} />
								</FormControl>
								<FormDescription />
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<Button onClick={form.handleSubmit(onSubmit)} type="submit">
					Submit
				</Button>
			</form>
		</FormProvider>
	);
}
