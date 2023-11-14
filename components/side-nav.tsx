"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SidebarNavItem } from "@/types/index";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

export interface SidebarNavProps {
	items: SidebarNavItem[];
	type: string;
}

export function SidebarNav({ items, type }: SidebarNavProps) {
	const path = usePathname();
	const pathname = usePathname();

	return items?.length ? (
		<div className="p-2 border-r w-fit h-full flex flex-col">
			{items.map((item, index) => (
				<Button key={index} variant="ghost" asChild>
					<Link href={path + "/" + type + `/${item.name}`}>
						<div className={cn("pb-1")}>
							<h4
								className={cn(
									"flex w-full items-center rounded-md p-2 hover:underline",
									{
										"bg-muted":
											pathname === path + "/" + type + `/${item.name}`,
									}
								)}
							>
								{item.name}
							</h4>
							{/* {item.items ? (
						<DocsSidebarNavItems items={item.items} pathname={pathname} />
					) : null} */}
						</div>
					</Link>
				</Button>
			))}
		</div>
	) : null;
}

// interface DocsSidebarNavItemsProps {
// 	items: SidebarNavItem[];
// 	pathname: string | null;
// }

// export function DocsSidebarNavItems({
// 	items,
// 	pathname,
// }: DocsSidebarNavItemsProps) {
// 	return items?.length ? (
// 		<div className="grid grid-flow-row auto-rows-max text-sm">
// 			{items.map((item, index) =>
// 				!item.disabled && item.href ? (
// 					<Link
// 						key={index}
// 						href={item.href}
// 						className={cn(
// 							"flex w-full items-center rounded-md p-2 hover:underline",
// 							{
// 								"bg-muted": pathname === item.href,
// 							}
// 						)}
// 						target={item.external ? "_blank" : ""}
// 						rel={item.external ? "noreferrer" : ""}
// 					>
// 						{item.title}
// 					</Link>
// 				) : (
// 					<span
// 						key={index}
// 						className="flex w-full cursor-not-allowed items-center rounded-md p-2 opacity-60"
// 					>
// 						{item.title}
// 					</span>
// 				)
// 			)}
// 		</div>
// 	) : null;
// }
