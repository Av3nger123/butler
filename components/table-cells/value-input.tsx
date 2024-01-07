import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

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
		<Input
			className={cn("min-w-[150px]", className)}
			type={inputType}
			value={value}
			onChange={(e) => onChange(e.target.value)}
		/>
	);
}
