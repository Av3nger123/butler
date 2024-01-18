import PropTypes from "prop-types";
import { SelectInput } from "./select-input";
import { ValueInput } from "./value-input";
import React from "react";
import JsonInput from "./json-input";

interface DynamicInputProps {
	className: string;
	type: string;
	value: any;
	onChange: any;
}

const DynamicInput = ({
	className,
	type,
	value,
	onChange,
}: DynamicInputProps) => {
	const component = (type: string) => {
		if (type.includes("json")) {
			return (
				<JsonInput value={value} onChange={onChange} className={className} />
			);
		} else if (type.includes("int")) {
			return (
				<ValueInput
					value={value}
					onChange={(val: string) => onChange?.(parseInt(val))}
					type={type}
					className={className}
				/>
			);
		} else if (type.includes("bool")) {
			return (
				<SelectInput
					value={value}
					onChange={onChange}
					options={[true, false]}
					className={className}
				/>
			);
		} else {
			return (
				<ValueInput
					value={value}
					onChange={onChange}
					type={type}
					className={className}
				/>
			);
		}
	};
	const componentsMap: any = {};
	return <div>{component(type)}</div>;
};
export { DynamicInput };
