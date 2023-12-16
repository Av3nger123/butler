"use client";

import { TableFilter } from "@/components/table-filter";
import { useTable } from "@/lib/context/table-context";
import useFilterStore from "@/lib/store/filterstore";
import { Schema } from "@/types";
import { has } from "lodash";
import { useEffect } from "react";
export function Filters() {
	const { key, schemas } = useTable();
	const filters = useFilterStore((state) => state.filters);
	return (
		<div>
			{has(filters, key) &&
				filters[key].length > 0 &&
				filters[key].map((filter, index) => {
					return (
						<div key={index} className="my-1">
							<TableFilter path={key} index={index} schemas={schemas} />
						</div>
					);
				})}
		</div>
	);
}
