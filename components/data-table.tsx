"use client";
import {
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import React, { useState } from "react";
import { Input } from "./ui/input";
import { DataTablePagination } from "./table-pagination";
import { DataTableViewOptions } from "./column-toggle";
import { useTable } from "@/lib/context/table-context";
import useDataStore from "@/lib/store/datastore";
import { has } from "lodash";

interface DataTableProps<TData, TValue> {
	filterColumn: string | null;
}

export function DataTable<TData, TValue>({
	filterColumn,
}: Readonly<DataTableProps<TData, TValue>>) {
	const { dataDiff } = useDataStore((state) => state.dataDiff);
	const {
		pageIndex,
		pageSize,
		data,
		columns,
		setSorting,
		count,
		setRowSelection,
		setPagination,
		sorting,
		rowSelection,
	} = useTable();
	const pagination = React.useMemo(
		() => ({
			pageIndex,
			pageSize,
		}),
		[pageIndex, pageSize]
	);

	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		manualPagination: true,
		manualSorting: true,
		pageCount: count,
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		onPaginationChange: setPagination,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			pagination,
			sorting,
			columnFilters,
			rowSelection,
		},
	});

	return (
		<div>
			{filterColumn && (
				<div className="flex items-center py-4">
					<Input
						placeholder={`Filter ${filterColumn}s...`}
						value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
						onChange={(event) =>
							table.getColumn(filterColumn)?.setFilterValue(event.target.value)
						}
						className="max-w-sm"
					/>
					<DataTableViewOptions table={table} />
				</div>
			)}
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id} className="border">
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
												  )}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell
											key={cell.id}
											className="whitespace-nowrap border"
										>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<DataTablePagination table={table} />
		</div>
	);
}

export default DataTable;
