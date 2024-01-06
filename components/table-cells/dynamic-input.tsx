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
	const componentsMap: any = {
		boo: (
			<SelectInput value={value} onChange={onChange} options={[true, false]} />
		),
		var: <ValueInput value={value} onChange={onChange} type={type} />,
		jso: <JsonInput value={value} onChange={onChange} />,
		tim: <ValueInput value={value} onChange={onChange} type={type} />,
		int: (
			<ValueInput
				value={value}
				onChange={(val: string) => onChange?.(parseInt(val))}
				type={type}
			/>
		),
	};
	return <div className={className}>{componentsMap[type?.slice(0, 3)]}</div>;
};
export { DynamicInput };
