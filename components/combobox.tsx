import React, { useState } from "react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "./ui/command";
import { cn } from "@/lib/utils";

interface ComboboxProps {
	items: any[];
	value: any;
	onChange: any;
	type: string;
	disabled: boolean;
}

const Combobox: React.FC<ComboboxProps> = ({
	items,
	value,
	onChange,
	type,
	disabled = false,
}) => {
	const [open, setOpen] = useState<boolean>(false);
	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-full justify-between"
					disabled={disabled}
				>
					{value
						? items.find((item) => item.value === value)?.label
						: `Select ${type}`}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-fit p-0" align="start">
				<Command>
					<CommandInput placeholder={`Search ${type}...`} />
					<CommandEmpty>No {type} found.</CommandEmpty>
					<CommandGroup className="overflow-y-auto min-h-fit max-h-96">
						{items.map((item) => (
							<CommandItem
								key={item?.value}
								value={item?.value}
								onChange={(e) => {}}
								onSelect={(currentValue) => {
									onChange(currentValue);
									setOpen(false);
								}}
							>
								<Check
									className={cn(
										"mr-2 h-4 w-4",
										value === item?.value ? "opacity-100" : "opacity-0"
									)}
								/>
								{item?.label}
							</CommandItem>
						))}
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	);
};

export default Combobox;
