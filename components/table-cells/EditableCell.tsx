import { useEffect, useMemo, useState } from "react";
import { Input } from "../ui/input";
import useDataStore from "@/lib/store/datastore";
import { Table } from "@tanstack/react-table";
import { usePathname } from "next/navigation";
import { has } from "lodash";
export function EditableCell({
	getValue,
	row,
	column,
	table,
}: {
	getValue: any;
	row: any;
	column: any;
	table: Table<any>;
}) {
	const { dataDiff, setDataDiff } = useDataStore();
	const initialValue = getValue();
	const [value, setValue] = useState(initialValue);

	const path = usePathname();
	const pathSegments = path
		.split("/")
		.filter((segment, index) => index % 2 != 1 && segment !== "");

	const key: string = useMemo(() => {
		return `${pathSegments[0]}~${pathSegments[1]}~${pathSegments[2]}~${table.options.state.pagination?.pageIndex}~${row.index}~${column.id}`;
	}, [pathSegments, table, row, column]);

	const onBlur = () => {
		if (initialValue !== value) setDataDiff(key, value);
	};

	useEffect(() => {
		setValue(initialValue);
	}, [initialValue]);

	return (
		<input
			value={value ?? ""}
			className={`${
				has(dataDiff, key) ? "bg-orange-300" : "bg-transparent "
			} border-none p-2 rounded outline-current`}
			onChange={(e) => setValue(e.target.value)}
			type="text"
			onBlur={onBlur}
		/>
	);
}
