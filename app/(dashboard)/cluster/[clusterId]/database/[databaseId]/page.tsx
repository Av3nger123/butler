"use client";

import { SidebarNav } from "@/components/side-nav";
import { tables } from "@/lib/placeholder";
import { SidebarNavItem } from "@/types";

export default function Page({
	params,
}: {
	params: {
		databaseId: string;
	};
}) {
	return (
		<div className="h-full">
			<SidebarNav
				type="table"
				items={tables[params.databaseId]?.map((element: SidebarNavItem) => ({
					name: element.name,
					link: element.link,
				}))}
			/>
		</div>
	);
}
