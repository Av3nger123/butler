"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SidebarNavItem } from "@/types/index";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useEffect, useRef, useState } from "react";
import { ChevronsLeftRightIcon, Database, Table, Table2 } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

export interface SidebarNavProps {
	items: SidebarNavItem[];
	type: string;
}

export function SidebarNav({ items, type }: SidebarNavProps) {
	const path = usePathname();
	const pathname = usePathname();
	const pathSegments = pathname.split("/").filter((segment) => segment !== "");
	return items?.length ? (
		<div className="flex">
			<ScrollArea className="w-full h-[79vh] overflow-x-hidden overflow-y-auto p-2">
				{items.map((item) => (
					<Link
						key={item.name}
						href={path + `/${item.name}`}
						className="flex items-start"
					>
						<div className={cn("pb-1 w-full", "mr-1")}>
							<h4
								className={cn(
									"flex gap-2 w-full rounded-md p-2 bg-secondary text-secondary-foreground hover:bg-primary/90 hover:text-primary-foreground",
									{
										"bg-muted": pathname === path + `/${item.name}`,
									}
								)}
							>
								{pathSegments.length == 1 && <Database size={20} />}
								{pathSegments.length == 2 && <Table2 size={20} />}
								{item.name}
							</h4>
						</div>
					</Link>
				))}
			</ScrollArea>
		</div>
	) : null;
}
