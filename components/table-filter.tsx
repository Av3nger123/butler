"use client";

import { Schema } from "@/types";
import { Popover, PopoverTrigger } from "./ui/popover";
import { useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import useFilterStore from "@/lib/store/filterstore";
import { Plus, X } from "lucide-react";
import dynamic from "next/dynamic";

const Combobox = dynamic(() => import("@/components/combobox"), { ssr: false });

type Operator = {
	value: String;
	label: String;
};

const operators: Operator[] = [
	{ value: "=", label: "=" },
	{ value: "!=", label: "!=" },
	{ value: "<", label: "<" },
	{ value: ">", label: ">" },
	{ value: ">=", label: ">=" },
	{ value: "<=", label: "<=" },
	{ value: "in", label: "in" },
	{ value: "not in", label: "not in" },
	{ value: "is null", label: "is null" },
	{ value: "is not null", label: "is not null" },
	{ value: "between", label: "between" },
	{ value: "not between", label: "not between" },
	{ value: "contains", label: "contains" },
	{ value: "not contains", label: "not contains" },
	{ value: "contains_ci", label: "contains (case insensitive)" },
	{ value: "not contains_ci", label: "not contains (case insensitive)" },
	{ value: "has suffix", label: "has suffix" },
	{ value: "has prefix", label: "has prefix" },
];

export function TableFilter({
	schemas,
	index,
	path,
}: Readonly<{
	schemas: { [key: string]: Schema };
	index: number;
	path: string;
}>) {
	const [setColumn, setOperator, setValue, filters, addFilter, clearFilter] =
		useFilterStore((state) => [
			state.setColumn,
			state.setOperator,
			state.setValue,
			state.filters,
			state.addFilter,
			state.clearFilter,
		]);

	const schemaItems = Object.keys(schemas).map((value) => ({
		value: value,
		label: value,
	}));

	return (
		<div className="grid grid-cols-12 gap-1 min-w-max">
			<div className="col-span-2 w-full">
				<Combobox
					type="Column"
					items={schemaItems}
					value={filters[path][index]["column"] ?? ""}
					onChange={(val: any) => setColumn(path, index, val)}
					disabled={false}
				/>
			</div>
			<div className="col-span-2 w-full">
				<Combobox
					type="Operator"
					items={operators}
					value={filters[path][index]["operator"] ?? ""}
					onChange={(val: any) => setOperator(path, index, val)}
					disabled={false}
				/>
			</div>
			<Input
				className="col-span-7 bg-white dark:bg-black"
				type="text"
				value={filters[path][index]["value"] ?? ""}
				onChange={(e) => setValue(path, index, e.target.value)}
			/>

			<div className="flex gap-2 col-span-1 ml-1">
				<Button size={"icon"} onClick={() => addFilter(path)}>
					<Plus className="w-4 h-4" />
				</Button>
				<Button size={"icon"} onClick={() => clearFilter(path, index)}>
					<X className="w-4 h-4" />
				</Button>
			</div>
		</div>
	);
}
