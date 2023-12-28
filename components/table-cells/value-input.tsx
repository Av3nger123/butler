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

interface ValueInputProps {
	value: any;
	onChange: any;
	type: string;
}

export function ValueInput({ value, onChange, type }: ValueInputProps) {
	const inputType = useMemo(() => {
		if (type.includes("varchar")) {
			return "text";
		} else if (type.includes("int")) {
			return "number";
		}
	}, [type]);

	return (
		<Input
			className="min-w-[150px]"
			type={inputType}
			value={value}
			onChange={(e) => onChange(e.target.value)}
		/>
	);
}
