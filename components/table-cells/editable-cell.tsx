import { useCallback, useEffect, useMemo, useState } from "react";
import useDataStore from "@/lib/store/datastore";
import { get, has, isEqual } from "lodash";
import { useTable } from "@/lib/context/table-context";
import { cn } from "@/lib/utils";
import { Base64 } from "js-base64";
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
	const [dataDiff, setDataDiff, revertDataDiff] = useDataStore((state) => [
		state.dataDiff,
		state.setDataDiff,
		state.revertDataDiff,
	]);
	const { key, schemas, defaultPrimaryKey } = useTable();

	const columnProps = useMemo(() => {
		return schemas[column.id];
	}, [schemas, column]);

	const operation = useMemo(() => {
		if (row.original.primaryKey?.indexOf("_") != -1) {
			return "add";
		} else {
			return "update";
		}
	}, [row.original.primaryKey]);
	const initialValue = useMemo(() => {
		return getValue();
	}, [getValue]);

	const [value, setValue] = useState(
		has(
			dataDiff,
			`${key}.${operation}.${row.original.primaryKey}.newValue.${column.id}`
		)
			? get(
					dataDiff,
					`${key}.${operation}.${row.original.primaryKey}.newValue.${column.id}`
			  )
			: initialValue
	);

	const onChange = useCallback(
		(val: any) => {
			setValue(val);
			if (!isEqual(initialValue, val)) {
				setDataDiff(
					key,
					operation,
					row.original.primaryKey,
					column.id,
					val,
					initialValue
				);
			} else if (row.original.primaryKey !== defaultPrimaryKey) {
				revertDataDiff(key, operation, row.original.primaryKey, column.id);
			}
		},
		[
			column.id,
			defaultPrimaryKey,
			initialValue,
			key,
			operation,
			revertDataDiff,
			row.original,
			setDataDiff,
		]
	);

	useEffect(() => {
		setValue(initialValue);
	}, [initialValue]);

	const bgColor: any = useMemo(() => {
		if (has(dataDiff, `${key}.add.${row.original?.primaryKey}`)) {
			return "bg-green-400 bg-opacity-25 dark:bg-opacity-70 dark:bg-green-800";
		}
		if (
			has(
				dataDiff,
				`${key}.update.${row.original?.primaryKey}.newValue.${column.id}`
			)
		) {
			return "bg-yellow-400 bg-opacity-25 dark:bg-opacity-70 dark:bg-yellow-800";
		}
		if (has(dataDiff, `${key}.delete.${row.original?.primaryKey}`)) {
			return "bg-red-400 bg-opacity-25 dark:bg-opacity-70 dark:bg-red-800";
		}
	}, [column.id, dataDiff, key, row.original?.primaryKey]);

	return (
		<DynamicInput
			value={value}
			className={cn("rounded outline-current", bgColor)}
			onChange={onChange}
			type={columnProps?.dataType}
		/>
	);
}
