"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
	OnChangeFn,
	PaginationState,
	SortingState,
} from "@tanstack/react-table";
import React, {
	Dispatch,
	SetStateAction,
	useContext,
	useEffect,
	useMemo,
	useState,
	ReactNode,
} from "react";
import { getApi, postApi } from "../api";
import useClusterStore from "../store/clusterstore";
import { Schema } from "@/types";
import { createHashId, decrypt, defaultRow, getPrimaryKey } from "../utils";
import useFilterStore from "../store/filterstore";
import { has, isEmpty } from "lodash";
import useDataStore from "../store/datastore";
import { dataColumns } from "@/components/data-columns";

interface TableContextType {
	clusterId: string;
	pkFormat: string;
	tableId: string;
	databaseId: string;
	defaultPrimaryKey: string;
	key: string;
	selectedIds: { [key: string]: any };
	refetch: () => void;
	schemas: any;
	data: any[];
	columns: any;
	setData: (newData: any) => void;
	pageIndex: number;
	pageSize: number;
	count: number;
	setPagination: Dispatch<SetStateAction<PaginationState>>;
	sorting: SortingState;
	rowSelection: any;
	setRowSelection: any;
	setSorting: OnChangeFn<SortingState>;
}

const initialTableContext: TableContextType = {
	key: "",
	clusterId: "",
	tableId: "",
	pkFormat: "",
	databaseId: "",
	selectedIds: [],
	defaultPrimaryKey: "",
	refetch: () => {},
	schemas: {},
	data: [],
	setData: () => {},
	pageIndex: 0,
	pageSize: 10,
	count: 0,
	columns: [],
	setPagination: () => {},
	sorting: [],
	rowSelection: null,
	setRowSelection: () => {},
	setSorting: () => {},
};

const TableContext = React.createContext<TableContextType>(initialTableContext);

interface TableContextProviderProps {
	children: ReactNode;
	clusterId: string;
	tableId: string;
	databaseId: string;
}

const useTable = () => {
	const state = useContext(TableContext);
	return state;
};

const TableContextProvider: React.FC<TableContextProviderProps> = ({
	children,
	clusterId,
	tableId,
	databaseId,
}) => {
	const { cluster } = useClusterStore();
	const dataDiff = useDataStore((state) => state.dataDiff);
	const filters = useFilterStore((state) => state.filters);
	const [rowSelection, setRowSelection] = useState({});
	const [selectedIndex, setSelectedIndex] = useState({});
	const [selectedIds, setSelectedIds] = useState<{ [key: string]: any }>({});
	const [sorting, setSorting] = useState<SortingState>([]);
	const [data, setData] = useState<any>([]);
	const [pk, setPk] = useState<string>("");
	const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});

	useEffect(() => {
		Object.keys(rowSelection).forEach((value) => {
			let val = parseInt(value);
			let final = val + pageSize * pageIndex;
			setSelectedIndex((prev) => ({ ...prev, [final]: val }));
		});
	}, [rowSelection]);

	useEffect(() => {
		let finalState: any = {};
		Object.keys(selectedIndex).forEach((value) => {
			let val = parseInt(value);
			let final = val - pageSize * pageIndex;
			if (final > 0 && final < pageSize) {
				finalState[final] = true;
			}
			setRowSelection(finalState);
		});
	}, [pageIndex, pageSize]);
	const { data: queryData } = useQuery({
		queryKey: ["queries", clusterId, databaseId, tableId],
		queryFn: async () => {
			return await getApi(
				`/api/clusters/${clusterId}/commits?databaseId=${databaseId}&tableId=${tableId}`
			);
		},
		enabled: !!cluster,
	});

	const { data: schemaData } = useQuery({
		queryKey: ["schema", clusterId, databaseId, tableId],
		queryFn: async () => {
			if (cluster)
				return await postApi(
					`http://localhost:8080/metadata`,
					JSON.stringify({
						...cluster,
						port: parseInt(cluster.port),
						password: decrypt(cluster.password),
						database: databaseId,
						table: tableId,
					})
				);
		},
		enabled: !!cluster,
	});

	const {
		data: tableData,
		isFetching,
		refetch,
	} = useQuery({
		queryKey: [
			"data",
			clusterId,
			databaseId,
			tableId,
			pageIndex,
			pageSize,
			sorting,
		],
		queryFn: async () => {
			if (cluster) {
				let url = `http://localhost:8080/data?page=${pageIndex}&size=${pageSize}`;
				if (has(filters, key)) {
					let filterStrings: string[] = [];
					filters[key].forEach((filter) => {
						filterStrings.push(
							`${filter.column}:${filter.operator}:${filter.value}`
						);
					});
					url += `&filter=${filterStrings.join("|")}`;
					if (filterStrings.length > 1) {
						url += "&operator=and";
					}
				}
				if (sorting.length > 0) {
					url += `&sort=${sorting[0]?.id}&order=${
						sorting[0].desc ? "desc" : "asc"
					}`;
				}
				return await postApi(
					url,
					JSON.stringify({
						...cluster,
						port: parseInt(cluster.port),
						password: decrypt(cluster.password),
						database: databaseId,
						table: tableId,
					})
				);
			}
		},
		enabled: !!cluster,
		placeholderData: keepPreviousData,
	});

	useEffect(() => {
		let keys: { [key: string]: any } = {};
		Object.keys(rowSelection).forEach((value) => {
			let row = data[parseInt(value)];
			keys[row?.primaryKey] = row;
		});
		setSelectedIds(keys);
	}, [rowSelection, data]);

	const schemas = useMemo(() => {
		let schemas: { [key: string]: Schema } = {};
		let pk: string[] = [];
		if (schemaData) {
			Object.keys(schemaData?.metadata).forEach((key) => {
				if (schemaData.metadata[key]["isPrimary"]) {
					pk.push(key);
				}
				schemas[key] = {
					column: key,
					dataType: `${schemaData.metadata[key]["dataType"]}${
						schemaData.metadata[key]["maxLength"]["Valid"] === true
							? `(${schemaData.metadata[key]["maxLength"]["Int64"]})`
							: ""
					}`,
					isNullable: schemaData.metadata[key]["isNullable"],
					columnDefault: `${
						schemaData.metadata[key]["columnDefault"]["Valid"] === true
							? `${schemaData.metadata[key]["columnDefault"]["String"]}`
							: " - "
					}`,
					position: parseInt(schemaData.metadata[key]["position"]),
					isPrimary: schemaData.metadata[key]["isPrimary"],
					index: schemaData.metadata[key]["index"],
					foreignKey: schemaData.metadata[key]["foreignKey"],
				};
			});
		}
		let pkFormat = pk.join("~");
		if (pkFormat == "") {
			pkFormat = Object.keys(schemas).join("~");
		}
		setPk(pkFormat);
		return schemas;
	}, [schemaData]);

	const key = useMemo(() => {
		return `${clusterId}~${databaseId}~${tableId}`;
	}, [clusterId, databaseId, tableId]);

	useEffect(() => {
		let data: any[] = [];
		if (tableData) {
			tableData?.data?.forEach((row: any) => {
				data.push({
					...row,
					primaryKey: createHashId(row),
				});
			});
		}
		if (has(dataDiff, key) && !isEmpty(dataDiff[key]["add"])) {
			let newRows = Object.values(dataDiff[key]["add"]).map(
				(val: any) => val["newValue"]
			);
			data = newRows.concat(data);
		}
		setData(data);
	}, [dataDiff, key, pk, tableData]);

	const defaultPrimaryKey = useMemo(() => {
		let defaultRowVal = defaultRow?.(schemas);
		if (pk === "") {
			return createHashId(defaultRowVal);
		}
		return getPrimaryKey(pk, defaultRowVal);
	}, [pk, schemas]);

	const value: TableContextType = useMemo(() => {
		if (data && schemas) {
			let cols = dataColumns(schemas);
			return {
				selectedIds,
				pkFormat: pk,
				clusterId,
				tableId,
				defaultPrimaryKey,
				databaseId,
				key: key,
				refetch,
				columns: cols,
				schemas: schemas,
				data: data,
				setData,
				pageIndex: pageIndex,
				pageSize: pageSize,
				count: Math.ceil(tableData?.count / pageSize),
				setPagination: setPagination,
				sorting: sorting,
				rowSelection: rowSelection,
				setRowSelection: setRowSelection,
				setSorting: setSorting,
			};
		}
		return initialTableContext;
	}, [
		clusterId,
		data,
		databaseId,
		defaultPrimaryKey,
		key,
		pageIndex,
		pageSize,
		pk,
		refetch,
		rowSelection,
		schemas,
		selectedIds,
		sorting,
		tableData?.count,
		tableId,
	]);

	return (
		<TableContext.Provider value={value}>{children}</TableContext.Provider>
	);
};

export { useTable, TableContextProvider };
