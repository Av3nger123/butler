"use client";

import { DataTableColumnHeader } from "@/components/column-header";
import { EditableCell } from "@/components/table-cells/EditableCell";
import { Checkbox } from "@/components/ui/checkbox";
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
		cell: ({ row }) => (
			<Checkbox
				className="mx-2"
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
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
