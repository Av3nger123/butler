"use client";

import {
	Boxes,
	ChevronDown,
	ChevronLeft,
	ChevronsRight,
	Database,
	Dot,
	MoveLeft,
	Table2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import useClusterStore from "@/lib/store/clusterstore";
import { useWorkspace } from "@/lib/context/workspace-context";
import { useCluster } from "@/lib/context/cluster-context";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDatabase } from "@/lib/context/database-context";
import { Separator } from "./ui/separator";

const breadIcons: any = [
	<Boxes key={0} size={20} />,
	<Database key={1} size={20} />,
	<Table2 key={1} size={20} />,
];

const Breadcrumbs: React.FC = () => {
	const { cluster } = useClusterStore();
	const pathname = usePathname();
	const pathSegments = pathname.split("/").filter((segment) => segment !== "");
	const { clusters } = useWorkspace();
	const { databases } = useCluster();
	const { tables } = useDatabase();
	return (
		<nav
			className="border-rounded-xl flex flex-rowp-2 px-4 items-center"
			aria-label="Breadcrumb"
		>
			<Button variant="ghost" className="mr-5">
				<ChevronLeft className="mr-2 w-4 h-4" />
				Back
			</Button>
			<Separator orientation="vertical" className="h-12" />
			<ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
				{pathSegments.map((segment, index) => {
					return (
						<li key={segment} className="inline-flex items-center">
							{index != 0 && (
								<span>
									<ChevronsRight />
								</span>
							)}
							<div className="ml-2 flex flex-row items-center gap-1">
								{breadIcons[index]}
								<Link
									href={`/${pathSegments.slice(0, index + 1).join("/")}`}
									className=" hover:underline"
								>
									{index == 0 ? cluster?.name : segment}
								</Link>
								{index != 0 && (
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant="ghost"
												size="sm"
												className="outline-none"
											>
												<ChevronDown className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent className="max-h-96 overflow-auto">
											<DropdownMenuLabel>
												{renderDropdownHeader(index)}
											</DropdownMenuLabel>
											<DropdownMenuSeparator />
											{renderDropdownItems(
												index,
												clusters,
												databases,
												tables,
												pathSegments
											)}
										</DropdownMenuContent>
									</DropdownMenu>
								)}
							</div>
						</li>
					);
				})}
			</ol>
		</nav>
	);
};

const renderDropdownHeader = (index: number) => {
	if (index == 0) {
		return "Clusters";
	} else if (index == 1) {
		return "Databases";
	} else {
		return "Tables";
	}
};
const renderDropdownItems = (
	index: number,
	clusters: any,
	databases: any,
	tables: any,
	pathSegments: any
) => {
	if (index == 1) {
		return databases?.map((database: any) => (
			<DropdownMenuItem key={database?.name}>
				<Link
					href={`/${pathSegments.slice(0, index).join("/")}/${database?.name}`}
					className=" hover:underline"
				>
					{database?.name}
				</Link>
			</DropdownMenuItem>
		));
	} else {
		return tables?.map((table: any) => (
			<DropdownMenuItem key={table?.name}>
				<Link
					href={`/${pathSegments.slice(0, index).join("/")}/${table?.name}`}
					className=" hover:underline"
				>
					{table?.name}
				</Link>
			</DropdownMenuItem>
		));
	}
};
export default Breadcrumbs;
