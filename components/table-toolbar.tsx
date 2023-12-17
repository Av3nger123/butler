"use client";

import {
	ArrowUpFromLine,
	Eye,
	Filter,
	Play,
	Plus,
	Trash2,
	XCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import useFilterStore from "@/lib/store/filterstore";
import { has, uniqueId } from "lodash";
import { useTable } from "@/lib/context/table-context";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import useDataStore from "@/lib/store/datastore";
import { defaultRow, generateQuery } from "@/lib/utils";
import { SQLEditor } from "./sql-editor";

const TableToolbar: React.FC = () => {
	const { filters, addFilter, clear } = useFilterStore();
	const [dataDiff, setDataDiffRow, clearDataDiff, deleteDataDiff] =
		useDataStore((state) => [
			state.dataDiff,
			state.setDataDiffRow,
			state.clearDataDiff,
			state.deleteDataDiff,
		]);
	const {
		key: path,
		selectedIds,
		tableId,
		schemas,
		refetch,
		pkFormat,
		setData,
	} = useTable();
	return (
		<div className="flex items-center justify-center mb-1 gap-1 rounded-sm p-1">
			<Button variant="secondary" onClick={() => refetch()}>
				<Play className="mr-2 h-4 w-4 opacity-70" />{" "}
				{has(filters, path) && filters[path].length > 0 ? "Execute" : "Refetch"}
			</Button>
			<Popover>
				<PopoverTrigger asChild>
					<Button variant="secondary">
						<Eye className="mr-2 h-4 w-4 opacity-70" /> Query
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-[1000px] min-w-96">
					{!!dataDiff && (
						<SQLEditor
							code={generateQuery(tableId, dataDiff[path], pkFormat)}
							setCode={() => {}}
						/>
					)}
				</PopoverContent>
			</Popover>

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
					clearDataDiff(path);
				}}
			>
				<XCircle className="mr-2 h-4 w-4 opacity-70" /> Clear
			</Button>
			<Button
				variant="secondary"
				onClick={() => {
					let pk = uniqueId(`${path}_`);
					let defaultRowVal = { ...defaultRow(schemas), primaryKey: pk };
					setData((prev: any[]) => [defaultRowVal, ...prev]);
					setDataDiffRow(path, "add", pk, defaultRowVal);
				}}
			>
				<Plus className="mr-2 h-4 w-4 opacity-70" /> Add row
			</Button>
			<Button
				variant="secondary"
				onClick={() => {
					selectedIds.forEach((id) => {
						deleteDataDiff(path, id);
					});
				}}
			>
				<Trash2 className="mr-2 h-4 w-4 opacity-70" /> Delete row
			</Button>
		</div>
	);
};
export default TableToolbar;
