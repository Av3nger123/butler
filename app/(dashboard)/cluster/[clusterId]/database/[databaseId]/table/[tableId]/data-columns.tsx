"use client";

import { DataTableColumnHeader } from "@/components/column-header";
import { Schema } from "@/types";
import { Column, ColumnDef } from "@tanstack/react-table";

export function dataColumns(
	keys: string[],
	schemas: Schema[]
): ColumnDef<any>[] {
	let result: ColumnDef<any>[] = [];
	keys.forEach((key) => {
		result.push({
			accessorKey: key,
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title={key}
					schema={schemas.filter((schema) => schema.column === key)[0]}
				/>
			),
			cell: ({ row }) => <div>{row.getValue(key)}</div>,
			enableSorting: true,
			enableHiding: true,
		});
	});
	return result;
}
