"use client";

import { DataTableColumnHeader } from "@/components/column-header";
import { CustomCheck } from "@/components/table-cells/custom-check";
import { EditableCell } from "@/components/table-cells/editable-cell";
import { Checkbox } from "@/components/ui/checkbox";
import { useTable } from "@/lib/context/table-context";
import { Schema } from "@/types";
import { Column, ColumnDef } from "@tanstack/react-table";

export function dataColumns(
	keys: string[],
	schemas: { [key: string]: Schema }
): ColumnDef<any>[] {
	let result: ColumnDef<any>[] = [];
	result.push({
		id: "select",
		header: ({ table }) => (
			<Checkbox
				className="mr-4"
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: CustomCheck,
		enableSorting: false,
		enableHiding: false,
	});
	keys.forEach((key) => {
		result.push({
			accessorKey: key,
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title={key}
					schema={schemas[key]}
				/>
			),
			cell: EditableCell,
			enableSorting: true,
			enableHiding: true,
		});
	});
	return result;
}
