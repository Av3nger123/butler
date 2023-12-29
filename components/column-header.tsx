import {
	AlignJustify,
	Braces,
	ChevronsUpDown,
	EyeOff,
	SortAsc,
	SortDesc,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Column } from "@tanstack/react-table";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Schema } from "@/types";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useEffect, useMemo, useRef, useState } from "react";

interface DataTableColumnHeaderProps<TData, TValue>
	extends React.HTMLAttributes<HTMLDivElement> {
	column: Column<TData, TValue>;
	title: string;
	schema: Schema;
}

export function DataTableColumnHeader<TData, TValue>({
	column,
	title,
	className,
	schema,
}: Readonly<DataTableColumnHeaderProps<TData, TValue>>) {
	const ref = useRef<any>(null);

	const [initialWidth, setInitialWidth] = useState();
	useEffect(() => {
		if (ref.current) {
			const divWidth = ref.current?.offsetWidth;
			setInitialWidth(divWidth);
		}
	}, []);

	const width = useMemo(() => {
		if (initialWidth) {
			if (initialWidth > column.getSize()) {
				return initialWidth;
			} else {
				return column.getSize();
			}
		}
	}, [column.getSize(), initialWidth]);

	if (!column.getCanSort()) {
		return <div className={cn(className)}>{title}</div>;
	}

	return (
		<div
			ref={ref}
			className={cn("flex items-center space-x-1", className)}
			style={{ width: width }}
		>
			<Popover>
				<PopoverTrigger asChild>
					<Button variant="ghost" size="sm">
						<span>{title}</span>
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-80">
					<div className="grid gap-4">
						<div className="space-y-2">
							<h4 className="font-medium leading-none">Column Details</h4>
						</div>
						<div className="grid gap-2">
							<div className="grid grid-cols-3 items-center gap-4">
								<Label htmlFor="column">Column Name</Label>
								<Input
									id="column"
									value={schema?.column}
									className="col-span-2 h-8"
								/>
							</div>
							<div className="grid grid-cols-3 items-center gap-4">
								<Label htmlFor="columnDef">Column Default</Label>
								<Input
									id="columnDef"
									value={schema?.columnDefault}
									className="col-span-2 h-8"
								/>
							</div>
							<div className="grid grid-cols-3 items-center gap-4">
								<Label htmlFor="dataType">Data Type</Label>
								<Input
									id="dataType"
									value={schema?.dataType}
									className="col-span-2 h-8"
								/>
							</div>
							<div className="grid grid-cols-3 items-center gap-4">
								<Label htmlFor="fk">Foreign Key</Label>
								<Input
									id="fk"
									value={schema?.foreignKey}
									className="col-span-2 h-8"
								/>
							</div>
							<div className="grid grid-cols-3 items-center gap-4">
								<Label htmlFor="pk">Is Primary</Label>
								<Input
									id="pk"
									value={String(schema?.isPrimary)}
									className="col-span-2 h-8"
								/>
							</div>
							<div className="grid grid-cols-3 items-center gap-4">
								<Label htmlFor="idx">Index</Label>
								<Input
									id="idx"
									value={String(schema?.index)}
									className="col-span-2 h-8"
								/>
							</div>
							<div className="grid grid-cols-3 items-center gap-4">
								<Label htmlFor="isNull">Is Nullable</Label>
								<Input
									id="isNull"
									value={schema?.isNullable}
									className="col-span-2 h-8"
								/>
							</div>
						</div>
					</div>
				</PopoverContent>
			</Popover>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						size="sm"
						className="h-8 data-[state=open]:bg-accent"
					>
						{column.getIsSorted() === "desc" ? (
							<SortDesc className="h-4 w-4" />
						) : column.getIsSorted() === "asc" ? (
							<SortAsc className="h-4 w-4" />
						) : (
							<ChevronsUpDown className="h-4 w-4" />
						)}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start">
					<DropdownMenuItem onClick={() => column.toggleSorting(false)}>
						<SortAsc className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
						Asc
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => column.toggleSorting(true)}>
						<SortDesc className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
						Desc
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => column.clearSorting()}>
						<AlignJustify className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
						Clear
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
						<EyeOff className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
						Hide
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
