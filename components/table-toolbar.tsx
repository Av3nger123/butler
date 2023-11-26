"use client";

import {
	ArrowUpFromLine,
	Eye,
	Filter,
	GitCommit,
	Play,
	XCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import useFilterStore from "@/lib/store/filterstore";
import { has } from "lodash";

export function TableToolbar({
	path,
	refetch,
}: {
	path: string;
	refetch: any;
}) {
	const { filters, addFilter, clear } = useFilterStore();

	return (
		<div className="flex items-center justify-center mb-1 gap-1 rounded-sm p-1">
			<Button variant="secondary" onClick={() => refetch()}>
				<Play className="mr-2 h-4 w-4 opacity-70" />{" "}
				{typeof window !== "undefined"
					? has(filters, path) && filters[path].length > 0
						? "Execute"
						: "Refetch"
					: "Refetch"}
			</Button>
			<Button variant="secondary">
				<Eye className="mr-2 h-4 w-4 opacity-70" /> Query
			</Button>
			<Button variant="secondary">
				<ArrowUpFromLine className="mr-2 h-4 w-4 opacity-70" /> Commit
			</Button>
			<Button
				variant="secondary"
				onClick={() => addFilter(path)}
				disabled={
					typeof window !== "undefined"
						? has(filters, path) && filters[path].length > 0
						: false
				}
			>
				<Filter className="mr-2 h-4 w-4 opacity-70" /> Filter
			</Button>
			<Button
				variant="secondary"
				onClick={() => {
					clear(path);
				}}
			>
				<XCircle className="mr-2 h-4 w-4 opacity-70" /> Clear
			</Button>
		</div>
	);
}
