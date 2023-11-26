"use client";

import { TableFilter } from "@/components/table-filter";
import useFilterStore from "@/lib/store/filterstore";
import { Schema } from "@/types";
import { has } from "lodash";
import { useEffect } from "react";
export function Filters({
	path,
	schemas,
}: Readonly<{
	path: string;
	schemas: { [key: string]: Schema };
}>) {
	const filters = useFilterStore((state) => state.filters);
	return (
		<div>
			{has(filters, path) &&
				filters[path].length > 0 &&
				filters[path].map((filter, index) => {
					return (
						<div key={index} className="my-1">
							<TableFilter path={path} index={index} schemas={schemas} />
						</div>
					);
				})}
		</div>
	);
}
