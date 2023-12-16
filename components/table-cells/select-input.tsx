interface SelectInputProps {
	value: any;
	onChange: any;
	options: any[];
}

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export function SelectInput({ value, onChange, options }: SelectInputProps) {
	return (
		<Select onValueChange={onChange} defaultValue={value}>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder="Select a fruit" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					{options?.map((option) => (
						<SelectItem key={option} value={option}>
							{option.toString()}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}
