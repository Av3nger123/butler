"use client";

import { DataTableColumnHeader } from "@/components/column-header";
import { EditableCell } from "@/components/table-cells/EditableCell";
import { Schema } from "@/types";
import { Column, ColumnDef } from "@tanstack/react-table";

export function dataColumns(
	keys: string[],
	schemas: { [key: string]: Schema }
): ColumnDef<any>[] {
	let result: ColumnDef<any>[] = [];
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
