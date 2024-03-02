"use client";

import {
	ArrowUpFromLine,
	Code,
	Eye,
	Filter,
	GitCommit,
	Play,
	Plus,
	RefreshCw,
	Trash2,
	X,
} from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
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
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useState } from "react";
import { postApi } from "@/lib/api";
import { useCluster } from "@/lib/context/cluster-context";
import { useWorkspace } from "@/lib/context/workspace-context";
import { usePathname } from "next/navigation";

const TableToolbar: React.FC = () => {
	const { filters, addFilter, clear } = useFilterStore();
	const [setDataDiffRow, clearDataDiff, deleteDataDiff] = useDataStore(
		(state) => [state.setDataDiffRow, state.clearDataDiff, state.deleteDataDiff]
	);

	const pathname = usePathname();

	const pathSegments = pathname.split("/").filter((segment) => segment !== "");
	const [title, setTitle] = useState<string>("");
	const {
		key: path,
		selectedIds,
		schemas,
		refetch,
		setData,
		generatedQueries,
		setPagination,
	} = useTable();

	const handleCommit = () => {
		postApi(
			`${process.env.NEXT_PUBLIC_SERVER_URL}/commits`,
			JSON.stringify({
				title,
				clusterId: pathSegments[0],
				databaseId: pathSegments[1],
				queries: generatedQueries?.queries,
				revertQueries: generatedQueries?.revertQueries,
				createdAt: new Date(),
			})
		);
	};

	const queryClient = useQueryClient();
	return (
		<div className="flex items-center justify-center mb-1 h-10 gap-2 rounded-lg">
			<TooltipProvider>
				<Button
					variant="secondary"
					onClick={() => {
						refetch();
						queryClient.invalidateQueries({ queryKey: ["data"] });
						setPagination((prev) => ({ ...prev, pageIndex: 0 }));
					}}
				>
					<RefreshCw className="mr-2 h-4 w-4" />
					<p>Refetch</p>
				</Button>

				<Popover>
					<PopoverTrigger asChild>
						<Button variant="secondary">
							<Code className="mr-2 h-4 w-4" />
							<p>Queries</p>
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
								className="w-full"
							/>
						)}
					</PopoverContent>
				</Popover>

				<Dialog>
					<DialogTrigger asChild>
						<Button variant="secondary" size="sm">
							<GitCommit className=" mr-2 h-4 w-4" />
							Commit Query
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Commit Query</DialogTitle>
							<DialogDescription>Add a message to the commit</DialogDescription>
						</DialogHeader>
						<div className="flex flex-col gap-2">
							<Input
								className="ml-2 w-80"
								id="title"
								value={title}
								placeholder="init changes"
								onChange={(e) => setTitle(e.target.value)}
							/>
						</div>
						<DialogFooter>
							<Button onClick={handleCommit} type="submit">
								Save changes
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>

				<Button
					variant="secondary"
					onClick={() => {
						clear(path);
						clearDataDiff(path);
					}}
				>
					<X className="mr-2 h-4 w-4" />
					<p>Clear</p>
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
					<Filter className="mr-2 h-4 w-4" />
					<p>Filter</p>
				</Button>
				<Button
					variant="secondary"
					onClick={() => {
						let defaultRowVal = defaultRow(schemas);
						let pk = uniqueId(`${createHashId(defaultRowVal)}_`);
						defaultRowVal = { ...defaultRowVal, primaryKey: pk };
						setData((prev: any[]) => [defaultRowVal, ...prev]);
						console.log(defaultRowVal);
						setDataDiffRow(path, "add", pk, defaultRowVal);
					}}
				>
					<Plus className="mr-2 h-4 w-4" />
					<p>Add Row</p>
				</Button>
				<Button
					variant="secondary"
					disabled={isEmpty(selectedIds)}
					onClick={() => {
						Object.keys(selectedIds).forEach((key) => {
							deleteDataDiff(path, key, selectedIds[key]);
						});
					}}
				>
					<Trash2 className="mr-2 h-4 w-4" />
					<p>Delete Row</p>
				</Button>
			</TooltipProvider>
		</div>
	);
};
export default TableToolbar;
