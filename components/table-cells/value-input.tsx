import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { DotsVerticalIcon } from "@radix-ui/react-icons";

interface ValueInputProps {
	value: any;
	onChange: any;
	className: string;
	type: string;
}

export function ValueInput({
	value,
	onChange,
	type,
	className,
}: Readonly<ValueInputProps>) {
	const inputType = useMemo(() => {
		if (type.includes("varchar") || type.includes("text")) {
			return "text";
		} else if (type.includes("int")) {
			return "number";
		}
	}, [type]);
	return (
		<div className="flex flex-row gap-2">
			<Input
				className={cn("min-w-[150px] placeholder:italic", className)}
				type={inputType}
				placeholder={value === "" ? "EMPTY" : "NULL"}
				value={value}
				onChange={(e) => onChange(e.target.value)}
			/>
			<DropdownMenu>
				<DropdownMenuTrigger>
					<DotsVerticalIcon className="h-4 w-4" />
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={() => onChange(null)}>
						NULL
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
