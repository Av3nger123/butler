"use client";

import {
	ArrowUpFromLine,
	Eye,
	Filter,
	Play,
	Plus,
	Trash2,
	X,
} from "lucide-react";
import { Button } from "./ui/button";
import useFilterStore from "@/lib/store/filterstore";
import { has, isEmpty, uniqueId } from "lodash";
import { useTable } from "@/lib/context/table-context";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import useDataStore from "@/lib/store/datastore";
import { createHashId, defaultRow } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./ui/tooltip";
import { Separator } from "./ui/separator";
import { SQLQuery } from "./sql-query";

const TableToolbar: React.FC = () => {
	const { filters, addFilter, clear } = useFilterStore();
	const [setDataDiffRow, clearDataDiff, deleteDataDiff] = useDataStore(
		(state) => [state.setDataDiffRow, state.clearDataDiff, state.deleteDataDiff]
	);
	const {
		key: path,
		selectedIds,
		schemas,
		refetch,
		setData,
		generatedQueries,
		setPagination,
	} = useTable();

	const queryClient = useQueryClient();
	return (
		<div className="flex items-center justify-center mb-1 h-10 gap-2 rounded-lg">
			<TooltipProvider>
				<Button
					variant="secondary"
					size={"icon"}
					onClick={() => {
						refetch();
						queryClient.invalidateQueries({ queryKey: ["data"] });
						setPagination((prev) => ({ ...prev, pageIndex: 0 }));
					}}
				>
					<Tooltip>
						<TooltipTrigger>
							<Play className="h-4 w-4" />
						</TooltipTrigger>
						<TooltipContent>
							<p>Refetch</p>
						</TooltipContent>
					</Tooltip>
				</Button>
				<Separator orientation="vertical" />

				<Popover>
					<PopoverTrigger asChild>
						<Button variant="secondary" size={"icon"}>
							<Tooltip>
								<TooltipTrigger>
									<Eye className="h-4 w-4" />
								</TooltipTrigger>
								<TooltipContent>
									<p>Queries</p>
								</TooltipContent>
							</Tooltip>
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-[100vh]">
						{!!generatedQueries && (
							<SQLQuery
								value={`--- Queries ---\n${generatedQueries?.queries?.join(
									"\n\n"
								)}\n\n--- Revert queries ---\n${generatedQueries?.revertQueries?.join(
									"\n\n"
								)}`}
							/>
						)}
					</PopoverContent>
				</Popover>
				<Button variant="secondary" size={"icon"}>
					<Tooltip>
						<TooltipTrigger>
							<ArrowUpFromLine className="h-4 w-4" />
						</TooltipTrigger>
						<TooltipContent>
							<p>Commit</p>
						</TooltipContent>
					</Tooltip>
				</Button>
				<Button
					variant="secondary"
					size={"icon"}
					onClick={() => {
						clear(path);
						clearDataDiff(path);
					}}
				>
					<Tooltip>
						<TooltipTrigger>
							<X className="h-4 w-4" />
						</TooltipTrigger>
						<TooltipContent>
							<p>Clear</p>
						</TooltipContent>
					</Tooltip>
				</Button>
				<Separator orientation="vertical" />

				<Button
					variant="secondary"
					size={"icon"}
					onClick={() => addFilter(path)}
					disabled={
						typeof window !== "undefined"
							? has(filters, path) && filters[path].length > 0
							: false
					}
				>
					<Tooltip>
						<TooltipTrigger>
							<Filter className="h-4 w-4" />
						</TooltipTrigger>
						<TooltipContent>
							<p>Filter</p>
						</TooltipContent>
					</Tooltip>
				</Button>
				<Button
					variant="secondary"
					size={"icon"}
					onClick={() => {
						let defaultRowVal = defaultRow(schemas);
						let pk = uniqueId(`${createHashId(defaultRowVal)}_`);
						defaultRowVal = { ...defaultRowVal, primaryKey: pk };
						setData((prev: any[]) => [defaultRowVal, ...prev]);
						console.log(defaultRowVal);
						setDataDiffRow(path, "add", pk, defaultRowVal);
					}}
				>
					<Tooltip>
						<TooltipTrigger>
							<Plus className="h-4 w-4" />
						</TooltipTrigger>
						<TooltipContent>
							<p>Add Row</p>
						</TooltipContent>
					</Tooltip>
				</Button>
				<Button
					variant="secondary"
					size={"icon"}
					disabled={isEmpty(selectedIds)}
					onClick={() => {
						Object.keys(selectedIds).forEach((key) => {
							deleteDataDiff(path, key, selectedIds[key]);
						});
					}}
				>
					<Tooltip>
						<TooltipTrigger>
							<Trash2 className="h-4 w-4" />
						</TooltipTrigger>
						<TooltipContent>
							<p>Delete Row</p>
						</TooltipContent>
					</Tooltip>
				</Button>
			</TooltipProvider>
		</div>
	);
};
export default TableToolbar;
