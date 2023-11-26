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

export function TableToolbar({ path }: { path: string }) {
	const { filters, addFilter, clear } = useFilterStore();

	return (
		<div className="flex items-center justify-center mb-1 gap-1 rounded-sm p-1">
			<Button variant="secondary">
				<Play className="mr-2 h-4 w-4 opacity-70" /> Execute
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
				disabled={has(filters, path) && filters[path].length > 0}
			>
				<Filter className="mr-2 h-4 w-4 opacity-70" /> Filter
			</Button>
			<Button variant="secondary" onClick={() => clear(path)}>
				<XCircle className="mr-2 h-4 w-4 opacity-70" /> Clear
			</Button>
		</div>
	);
}
