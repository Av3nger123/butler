import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Input } from "../ui/input";
import useDataStore from "@/lib/store/datastore";
import { usePathname } from "next/navigation";
import { get, has } from "lodash";
import { useTable } from "@/lib/context/table-context";
import { cn, getPrimaryKey } from "@/lib/utils";
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
	const { key, pkFormat, schemas } = useTable();

	const columnProps = useMemo(() => {
		return schemas[column.id];
	}, [schemas, column]);
	const primaryKey = useMemo(() => {
		return getPrimaryKey(pkFormat, row.original);
	}, [pkFormat, row]);

	const initialValue = getValue();
	const [value, setValue] = useState(
		has(dataDiff, `${key}.update.${primaryKey}.${column.id}`)
			? get(dataDiff, `${key}.update.${primaryKey}.${column.id}`)
			: initialValue
	);

	const onChange = (val: any) => {
		setValue(val);
		if (initialValue !== val)
			setDataDiff(key, "update", primaryKey, column.id, val);
		else {
			revertDataDiff(key, "update", primaryKey, column.id);
		}
	};

	useEffect(() => {
		setValue(initialValue);
	}, [initialValue]);

	return (
		<DynamicInput
			value={value ?? ""}
			className={cn(
				"rounded outline-current",
				has(dataDiff, `${key}.update.${primaryKey}.${column.id}`)
					? "border-2 border-orange-500"
					: "border-none"
			)}
			onChange={onChange}
			type={columnProps && columnProps["dataType"]}
		/>
	);
}
