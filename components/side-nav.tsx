"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SidebarNavItem } from "@/types/index";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useEffect, useRef, useState } from "react";
import { ChevronsLeftRightIcon } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

export interface SidebarNavProps {
	items: SidebarNavItem[];
	type: string;
}

export function SidebarNav({ items, type }: SidebarNavProps) {
	const [width, setWidth] = useState<number>(250);
	const isResized = useRef(false);
	const path = usePathname();
	const pathname = usePathname();

	useEffect(() => {
		window.addEventListener("mousemove", (e) => {
			if (!isResized.current) {
				return;
			}
			setWidth((previousWidth) => previousWidth + e.movementX / 2);
		});
		window.addEventListener("mouseup", () => {
			isResized.current = false;
		});
	}, []);

	return items?.length ? (
		<div className="flex">
			<ScrollArea
				className="w-fit h-[79vh] overflow-x-hidden overflow-y-auto p-2"
				style={{ width: `${width / 16}rem` }}
			>
				{items.map((item, index) => (
					<Link
						key={item.name}
						href={path + `/${item.name}`}
						className="flex items-start"
					>
						<div className={cn("pb-1")}>
							<h4
								className={cn("flex w-full rounded-md p-2 hover:underline", {
									"bg-muted": pathname === path + `/${item.name}`,
								})}
							>
								{item.name}
							</h4>
						</div>
					</Link>
				))}
			</ScrollArea>
			<div
				onMouseDown={() => {
					isResized.current = true;
				}}
				className="w-px cursor-col-resize select-none"
			/>
		</div>
	) : null;
}
