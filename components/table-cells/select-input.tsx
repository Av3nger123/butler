interface SelectInputProps {
	value: any;
	onChange: any;
	options: any[];
	className: string;
}

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export function SelectInput({
	value,
	onChange,
	options,
	className,
}: Readonly<SelectInputProps>) {
	return (
		<div className={className}>
			<Select onValueChange={onChange} defaultValue={value}>
				<SelectTrigger className="min-w-[150px]">
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
		</div>
	);
}
