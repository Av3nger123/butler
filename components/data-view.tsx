import {
	Table,
	TableCaption,
	TableHeader,
	TableBody,
	TableRow,
	TableCell,
	TableFooter,
	TableHead,
} from "@/components/ui/table";

import { Input } from "./ui/input";
import { useMemo } from "react";

export function DataViewTable({ data }: Readonly<{ data: any[] }>) {
	return (
		<div className="h-full overflow-auto">
			<Table className="border rounded-xl">
				<TableHeader>
					<TableRow>
						{data.length > 0 &&
							Object.keys(data[0]).map((column) => {
								return (
									<TableHead key={column} className="w-[100px] border">
										{column}
									</TableHead>
								);
							})}
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.map((record, index) => (
						<TableRow key={index}>
							{Object.values(record).map((value: any, idx) => (
								<TableCell key={idx} className="font-medium border">
									<CellInput value={value} />
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}

function CellInput({ value }: Readonly<{ value: any }>) {
	const val = useMemo(() => {
		const type = typeof value;
		if (value == null) {
			return value;
		}
		if (type == "object") {
			return JSON.stringify(value);
		} else {
			return value;
		}
	}, [value]);
	return (
		<Input
			className="min-w-[100px]"
			value={val}
			placeholder={val == "" ? "EMPTY" : "NULL"}
		/>
	);
}
