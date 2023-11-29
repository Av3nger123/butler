"use client";

import {
	CommandGroup,
	CommandItem,
	CommandList,
	CommandInput,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { useState, useRef, useCallback, type KeyboardEvent } from "react";

import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { getApi } from "@/lib/api";

export type Option = {
	id: string;
	name: string;
	email: string;
	emailVerified: Date;
	image: string;
	username: string;
};

type AutoCompleteProps = {
	emptyMessage: string;
	value?: Option;
	onValueChange?: (value: Option | null) => void;
	isLoading?: boolean;
	disabled?: boolean;
	placeholder?: string;
};

export const AutoComplete = ({
	placeholder,
	emptyMessage,
	value,
	onValueChange,
	disabled = false,
}: AutoCompleteProps) => {
	const inputRef = useRef<HTMLInputElement>(null);

	const [isOpen, setOpen] = useState(false);
	const [selected, setSelected] = useState<Option | null>(value as Option);
	const [inputValue, setInputValue] = useState<string>(value?.email || "");

	const { data: usersData, isLoading } = useQuery({
		queryKey: ["users", inputValue],
		queryFn: () => {
			return getApi(`/api/users?email=${inputValue}`);
		},
	});

	const handleKeyDown = useCallback(
		(event: KeyboardEvent<HTMLDivElement>) => {
			const input = inputRef.current;
			if (!input) {
				return;
			}

			// Keep the options displayed when the user is typing
			if (!isOpen) {
				setOpen(true);
			}

			// This is not a default behaviour of the <input /> field
			if (event.key === "Enter" && input.value !== "") {
				const optionToSelect = usersData?.users.find(
					(option: Option) => option.email === input.value
				);
				if (optionToSelect) {
					setSelected(optionToSelect);
					onValueChange?.(optionToSelect);
				}
			}

			if (event.key === "Escape") {
				input.blur();
			}

			if (event.key === "Backspace") {
				onValueChange?.(null);
				setSelected?.(null);
			}
		},
		[isOpen, usersData, onValueChange]
	);

	const handleBlur = useCallback(() => {
		setOpen(false);
		setInputValue(selected?.email ?? "");
	}, [selected]);

	const handleSelectOption = useCallback(
		(selectedOption: Option) => {
			setInputValue(selectedOption.email);

			setSelected(selectedOption);
			onValueChange?.(selectedOption);

			// This is a hack to prevent the input from being focused after the user selects an option
			// We can call this hack: "The next tick"
			setTimeout(() => {
				inputRef?.current?.blur();
			}, 0);
		},
		[onValueChange]
	);

	return (
		<CommandPrimitive onKeyDown={handleKeyDown}>
			<div>
				<CommandInput
					ref={inputRef}
					value={inputValue}
					onValueChange={isLoading ? undefined : setInputValue}
					onBlur={handleBlur}
					onFocus={() => setOpen(true)}
					placeholder={placeholder}
					disabled={disabled}
					className="text-base"
				/>
			</div>
			<div className="mt-1 relative">
				{isOpen ? (
					<div className="absolute top-0 z-10 w-full rounded-xl bg-stone-50 outline-none animate-in fade-in-0 zoom-in-95">
						<CommandList className="ring-1 ring-slate-200 rounded-lg">
							{isLoading ? (
								<CommandPrimitive.Loading>
									<div className="p-1">
										<Skeleton className="h-8 w-full" />
									</div>
								</CommandPrimitive.Loading>
							) : null}
							{usersData?.users?.length > 0 && !isLoading ? (
								<CommandGroup>
									{usersData?.users?.map((option: Option) => {
										const isSelected = selected?.email === option.email;
										return (
											<CommandItem
												key={option.email}
												value={option.email}
												onMouseDown={(event) => {
													event.preventDefault();
													event.stopPropagation();
												}}
												onSelect={() => handleSelectOption(option)}
												className={cn(
													"flex items-center gap-2 w-full",
													!isSelected ? "pl-8" : null
												)}
											>
												{isSelected ? <Check className="w-4" /> : null}
												{option.email}
											</CommandItem>
										);
									})}
								</CommandGroup>
							) : null}
							{!isLoading ? (
								<CommandPrimitive.Empty className="select-none rounded-sm px-2 py-3 text-sm text-center">
									{emptyMessage}
								</CommandPrimitive.Empty>
							) : null}
						</CommandList>
					</div>
				) : null}
			</div>
		</CommandPrimitive>
	);
};
