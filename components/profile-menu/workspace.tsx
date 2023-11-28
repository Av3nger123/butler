import { Box, ChevronDownIcon, Delete, Plus, Trash } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "../ui/command";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { getApi, postApi } from "@/lib/api";
import { json } from "stream/consumers";
import { Workspace } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "../ui/badge";
import { User } from "../user";
import { debounce } from "lodash";

export function WorkspaceDetails({ workspace }: { workspace: any }) {
	const [email, setEmail] = useState("");

	const { data } = useQuery({
		queryKey: ["workspace", workspace?.id],
		queryFn: () => {
			return getApi(`/api/workspaces/${workspace?.id}`);
		},
		enabled: !!workspace?.id,
	});

	const { data: rolesData } = useQuery({
		queryKey: ["roles"],
		queryFn: () => {
			return getApi(`/api/roles`);
		},
	});

	const { data: usersData } = useQuery({
		queryKey: ["users", email],
		queryFn: () => {
			return getApi(`/api/users?email=${email}`);
		},
	});

	return (
		<Dialog>
			<DialogTrigger>
				<div className="flex flex-row items-center p-1">
					<Box className="mr-2 h-4 w-4" />
					Workspace
				</div>
			</DialogTrigger>
			<DialogContent className="flex justify-start items-start flex-col max-w-screen-sm h-[500px] grid-rows-6">
				<DialogHeader>
					<DialogTitle>Workspace</DialogTitle>
				</DialogHeader>
				<div className="grid grid-cols-4 items-center gap-x-5 row-span-1">
					<Label htmlFor="name" className="text-center">
						Workspace Name:
					</Label>
					<Input
						id="name"
						placeholder="Cosmic Venture"
						value={workspace?.name}
						className="col-span-3"
					/>
				</div>
				<Card className="w-full h-full row-span-3">
					<CardHeader>
						<CardTitle>Workspace Members</CardTitle>
						<CardDescription>
							Invite your team members to collaborate.
						</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-6 overflow-y-auto">
						{data?.workspace?.WorkspaceUser?.map((workspaceUser: any) => {
							return (
								<div
									className="flex items-center justify-start gap-4"
									key={workspaceUser?.user_id}
								>
									<div className="flex items-center space-x-4">
										<Avatar>
											<AvatarImage src={workspaceUser?.user?.image} />
											<AvatarFallback>
												{workspaceUser?.user?.name
													?.split(" ")
													.map((word: string) => word[0])
													.join("")}
											</AvatarFallback>
										</Avatar>
										<div>
											<p className="text-sm font-medium leading-none">
												{workspaceUser?.user?.username}
											</p>
											<p className="text-sm text-muted-foreground">
												{workspaceUser?.user?.email}
											</p>
										</div>
									</div>
									<Popover>
										<PopoverTrigger asChild>
											<Button variant="outline">
												{workspaceUser?.role?.label}
												<ChevronDownIcon className="ml-2 h-4 w-4 text-muted-foreground" />
											</Button>
										</PopoverTrigger>
										<PopoverContent className="p-0" align="end">
											<Command>
												<CommandInput placeholder="Select new role..." />
												<CommandList>
													<CommandEmpty>No roles found.</CommandEmpty>
													<CommandGroup>
														{rolesData?.roles?.map((role: any) => {
															return (
																<CommandItem
																	key={role?.id}
																	className="flex flex-col items-start px-4 py-2"
																>
																	<p>{role?.label}</p>
																</CommandItem>
															);
														})}
													</CommandGroup>
												</CommandList>
											</Command>
										</PopoverContent>
									</Popover>
									<Button variant={"ghost"} size={"icon"}>
										<Trash className="h-4 w-4" />
									</Button>
								</div>
							);
						})}
					</CardContent>
				</Card>
				<div className="w-full grid grid-cols-4 gap-3 items-start row-span-1">
					<Command className="rounded-lg border shadow-md col-span-3">
						<CommandInput
							placeholder="Type an email or search..."
							value={email}
							onChangeCapture={(e) => {
								setEmail(e.currentTarget.value);
							}}
						/>
						<CommandList>
							{usersData?.users?.length === 0 && (
								<CommandEmpty>No results found.</CommandEmpty>
							)}
							{usersData?.users?.length > 0 && (
								<CommandGroup heading="User Suggestions">
									{usersData?.users.map((user: any) => (
										<CommandItem key={user.email}>
											<div
												onClick={() => {
													console.log("click event");
													setEmail(user.email);
												}}
											>
												<User user={user} />
											</div>
										</CommandItem>
									))}
								</CommandGroup>
							)}
						</CommandList>
					</Command>
					<Button>Invite</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

export function CreateWorkspace({ refetch }: { refetch: any }) {
	const [name, setName] = useState<string>("");

	function addWorkspace() {
		postApi(
			"/api/workspaces",
			JSON.stringify({
				name: name,
				createdAt: new Date(),
			})
		);
		refetch();
	}
	return (
		<Dialog>
			<DialogTrigger>
				<div className="flex flex-row items-center p-1">
					<Plus className="mr-2 h-4 w-4" />
					New Workspace
				</div>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>New Workspace</DialogTitle>
					<DialogDescription>
						Please add a name to the workspace and click on confirm to create it
					</DialogDescription>
				</DialogHeader>
				<div className="grid grid-cols-4 items-center gap-4">
					<Label htmlFor="name" className="text-center">
						Name
					</Label>
					<Input
						id="name"
						placeholder="Cosmic Venture"
						value={name}
						onChange={(e) => setName(e.target.value)}
						className="col-span-3"
					/>
				</div>
				<div className="flex justify-end">
					<Button variant={"secondary"} onClick={addWorkspace}>
						Confirm
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
