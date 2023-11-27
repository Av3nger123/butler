import { ChevronDownIcon, Plus } from "lucide-react";
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
import { useState } from "react";
import { postApi } from "@/lib/api";
import { json } from "stream/consumers";

export function Workspace() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Team Members</CardTitle>
				<CardDescription>
					Invite your team members to collaborate.
				</CardDescription>
			</CardHeader>
			<CardContent className="grid gap-6">
				<div className="flex items-center justify-between space-x-4">
					<div className="flex items-center space-x-4">
						<Avatar>
							<AvatarImage src="/avatars/01.png" />
							<AvatarFallback>OM</AvatarFallback>
						</Avatar>
						<div>
							<p className="text-sm font-medium leading-none">Sofia Davis</p>
							<p className="text-sm text-muted-foreground">m@example.com</p>
						</div>
					</div>
					<Popover>
						<PopoverTrigger asChild>
							<Button variant="outline" className="ml-auto">
								Owner{" "}
								<ChevronDownIcon className="ml-2 h-4 w-4 text-muted-foreground" />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="p-0" align="end">
							<Command>
								<CommandInput placeholder="Select new role..." />
								<CommandList>
									<CommandEmpty>No roles found.</CommandEmpty>
									<CommandGroup>
										<CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
											<p>Viewer</p>
											<p className="text-sm text-muted-foreground">
												Can view and comment.
											</p>
										</CommandItem>
										<CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
											<p>Developer</p>
											<p className="text-sm text-muted-foreground">
												Can view, comment and edit.
											</p>
										</CommandItem>
										<CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
											<p>Billing</p>
											<p className="text-sm text-muted-foreground">
												Can view, comment and manage billing.
											</p>
										</CommandItem>
										<CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
											<p>Owner</p>
											<p className="text-sm text-muted-foreground">
												Admin-level access to all resources.
											</p>
										</CommandItem>
									</CommandGroup>
								</CommandList>
							</Command>
						</PopoverContent>
					</Popover>
				</div>
				<div className="flex items-center justify-between space-x-4">
					<div className="flex items-center space-x-4">
						<Avatar>
							<AvatarImage src="/avatars/02.png" />
							<AvatarFallback>JL</AvatarFallback>
						</Avatar>
						<div>
							<p className="text-sm font-medium leading-none">Jackson Lee</p>
							<p className="text-sm text-muted-foreground">p@example.com</p>
						</div>
					</div>
					<Popover>
						<PopoverTrigger asChild>
							<Button variant="outline" className="ml-auto">
								Member{" "}
								<ChevronDownIcon className="ml-2 h-4 w-4 text-muted-foreground" />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="p-0" align="end">
							<Command>
								<CommandInput placeholder="Select new role..." />
								<CommandList>
									<CommandEmpty>No roles found.</CommandEmpty>
									<CommandGroup className="p-1.5">
										<CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
											<p>Viewer</p>
											<p className="text-sm text-muted-foreground">
												Can view and comment.
											</p>
										</CommandItem>
										<CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
											<p>Developer</p>
											<p className="text-sm text-muted-foreground">
												Can view, comment and edit.
											</p>
										</CommandItem>
										<CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
											<p>Billing</p>
											<p className="text-sm text-muted-foreground">
												Can view, comment and manage billing.
											</p>
										</CommandItem>
										<CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
											<p>Owner</p>
											<p className="text-sm text-muted-foreground">
												Admin-level access to all resources.
											</p>
										</CommandItem>
									</CommandGroup>
								</CommandList>
							</Command>
						</PopoverContent>
					</Popover>
				</div>
			</CardContent>
		</Card>
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
