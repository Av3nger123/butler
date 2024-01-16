import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as crypto from "crypto";
import { isEmpty } from "lodash";
import { Schema } from "@/types";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getPrimaryKey(pkFormat: string, payload: any) {
	let keys = pkFormat.split("~");
	let pk: any[] = [];
	keys.forEach((key: string) => {
		pk.push(payload[key]);
	});
	return pk.join("~");
}

export function defaultRow(schemas: { [key: string]: Schema }) {
	let defaultRow: { [key: string]: any } = {};

	Object.keys(schemas).forEach((key) => {
		const schema = schemas[key];
		let defaultValue: any = "";

		// Set default value based on PostgreSQL data type
		switch (schema.dataType.slice(0, 3)) {
			case "tex":
			case "var":
			case "cha":
				defaultValue = schema.isNullable === "YES" ? null : "";
				break;
			case "int":
			case "big":
			case "sma":
			case "num":
			case "rea":
			case "dou":
				defaultValue = schema.isNullable === "YES" ? null : 0;
				break;
			case "boo":
				defaultValue = schema.isNullable === "YES" ? null : false;
				break;
			default:
				defaultValue = null;
		}
		defaultRow[key] = defaultValue;
	});
	return defaultRow;
}

export function createHashId(json: any) {
	const sortedJsonString = JSON.stringify(json, Object.keys(json).sort());
	const hash = crypto.createHash("sha256");
	hash.update(sortedJsonString);
	return hash.digest("hex");
}
