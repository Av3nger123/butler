import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Input } from "../ui/input";
import useDataStore from "@/lib/store/datastore";
import { usePathname } from "next/navigation";
import { get, has } from "lodash";
import { useTable } from "@/lib/context/table-context";
import { cn, defaultRow, getPrimaryKey } from "@/lib/utils";
import { DynamicInput } from "./dynamic-input";
export function EditableCell({
	getValue,
	row,
	column,
}: {
	getValue: any;
	row: any;
	column: any;
}) {
	const ref = useRef<boolean>(true);
	const [dataDiff, setDataDiff, revertDataDiff] = useDataStore((state) => [
		state.dataDiff,
		state.setDataDiff,
		state.revertDataDiff,
	]);
	const { key, pkFormat, schemas, defaultPrimaryKey } = useTable();

	const columnProps = useMemo(() => {
		return schemas[column.id];
	}, [schemas, column]);

	const pk = useMemo(() => {
		return getPrimaryKey(pkFormat, row.original);
	}, [pkFormat, row.original]);

	const operation = useMemo(() => {
		if (pk === defaultPrimaryKey) {
			return "add";
		} else {
			return "update";
		}
	}, [defaultPrimaryKey, pk]);

	const initialValue = getValue();
	const [value, setValue] = useState(
		has(dataDiff, `${key}.${operation}.${row.original.primaryKey}.${column.id}`)
			? get(
					dataDiff,
					`${key}.${operation}.${row.original.primaryKey}.${column.id}`
			  )
			: initialValue
	);

	const onChange = useCallback(
		(val: any) => {
			setValue(val);
			if (initialValue !== val)
				setDataDiff(key, operation, row.original.primaryKey, column.id, val);
			else if (pk !== defaultPrimaryKey) {
				revertDataDiff(key, operation, row.original.primaryKey, column.id);
			}
		},
		[
			column.id,
			defaultPrimaryKey,
			initialValue,
			key,
			operation,
			pk,
			revertDataDiff,
			row.original,
			setDataDiff,
		]
	);

	useEffect(() => {
		setValue(initialValue);
	}, [initialValue]);

	return (
		<DynamicInput
			value={value ?? ""}
			className={cn(
				"rounded outline-current",
				has(dataDiff, `${key}.delete.${row.original.primaryKey}`)
					? "border-2  border-red-500"
					: has(
							dataDiff,
							`${key}.${operation}.${row.original.primaryKey}.${column.id}`
					  )
					? `border-2 ${
							operation === "add" ? "border-green-500" : "border-orange-500"
					  }`
					: "border-none"
			)}
			onChange={onChange}
			type={columnProps && columnProps["dataType"]}
		/>
	);
}
