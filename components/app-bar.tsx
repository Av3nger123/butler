"use client";

import Link from "next/link";
import { ModeToggle } from "./theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getServerSession } from "next-auth";
import { Label } from "./ui/label";
import { signOut, useSession } from "next-auth/react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
	Cloud,
	CreditCard,
	Github,
	Keyboard,
	LifeBuoy,
	LogOut,
	Mail,
	MessageSquare,
	Plus,
	PlusCircle,
	Settings,
	User,
	UserPlus,
	Users,
} from "lucide-react";
import { Button } from "./ui/button";
import { useQuery } from "@tanstack/react-query";
import { getApi } from "@/lib/api";
import useWorkspaceStore from "@/lib/store/workspacestore";
import { Suspense, useMemo } from "react";
import { CreateWorkspace, WorkspaceDetails } from "./profile-menu/workspace";
import { Workspace } from "@prisma/client";
import dynamic from "next/dynamic";
import useUserStore from "@/lib/store/userstore";

const Combobox = dynamic(() => import("@/components/combobox"), { ssr: false });

export function AppBar() {
	const { data: session } = useSession();
	const setUser = useUserStore((state) => state.setUser);

	const [workspace, setWorkspace] = useWorkspaceStore((state) => [
		state.workspace,
		state.setWorkspace,
	]);

	const { data, refetch } = useQuery({
		queryKey: ["workspaces"],
		queryFn: async () => {
			let res = await getApi("/api/workspaces");
			if (workspace == {}) setWorkspace(res?.workspaces[0]);
			return res;
		},
	});

	const { data: user } = useQuery({
		queryKey: ["user", workspace?.id],
		queryFn: async () => {
			let res = await getApi(`/api/users/${session?.user?.email}`);
			let user = res?.user;
			let permissions = user?.WorkspaceUser.filter(
				(workspaceUser: any) => workspaceUser?.workspace_id == workspace?.id
			)[0]?.role?.RolePermissions?.map(
				(rolePermission: any) => rolePermission?.permissionId
			);
			setUser(
				{
					email: user?.email,
					emailVerified: user?.emailVerified,
					id: user?.id,
					image: user?.image,
					name: user?.name,
					username: user?.username,
				},
				permissions
			);
			return res;
		},
	});

	const workspaces = useMemo(
		() =>
			data?.workspaces?.map((workspace: Workspace) => ({
				value: workspace?.id,
				label: workspace?.name,
			})),
		[data]
	);
	return (
		<div className="w-full grid grid-cols-10 items-center justify-between gap-6 md:gap-10">
			<div className="col-span-8 flex flex-row gap-2">
				<Link href="/" className="hidden items-center space-x-2 md:flex">
					<span className="hidden font-bold sm:inline-block">Butler</span>
				</Link>
				<Combobox
					items={workspaces ?? []}
					type={"Workspaces"}
					onChange={(value: String) => {
						setWorkspace(
							data?.workspaces?.filter(
								(workspace: Workspace) => workspace.name.toLowerCase() == value
							)[0]
						);
					}}
					value={workspace?.id}
				/>
			</div>
			<div className="flex gap-2 justify-end col-span-2 items-center">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Avatar>
							<AvatarImage src={session?.user?.image ?? ""} />
							<AvatarFallback>
								{session?.user?.name
									?.split(" ")
									.map((word) => word[0])
									.join("")}
							</AvatarFallback>
						</Avatar>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-56">
						<DropdownMenuLabel>My Account</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<WorkspaceDetails workspace={workspace} />
						<CreateWorkspace refetch={refetch} />
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={() => signOut()}>
							<LogOut className="mr-2 w-4 h-4" /> Log Out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
				<Label>{session?.username}</Label>
				<ModeToggle />
			</div>
		</div>
	);
}
