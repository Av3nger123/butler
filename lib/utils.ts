import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as crypto from "crypto";
import { isEmpty } from "lodash";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function encrypt(payload: string): string {
	// Generate a random nonce (Initialization Vector)
	const nonce = crypto.randomBytes(12);

	// Create an AES-GCM cipher
	const cipher = crypto.createCipheriv(
		"aes-256-gcm",
		Buffer.from("your_secret_key_here_of_32_chars"),
		nonce
	);

	// Encrypt the payload
	const encryptedPayload = Buffer.concat([
		cipher.update(payload, "utf8"),
		cipher.final(),
	]);

	// Get the authentication tag
	const tag = cipher.getAuthTag();

	// Combine nonce, encrypted payload, and authentication tag
	const encryptedData = Buffer.concat([nonce, encryptedPayload, tag]).toString(
		"base64"
	);

	return encryptedData;
}
export function decrypt(encryptedData: string): string {
	// Decode the base64-encoded input
	const buffer = Buffer.from(encryptedData, "base64");

	// Extract the nonce, encrypted payload, and authentication tag
	const nonce = buffer.slice(0, 12);
	const encryptedPayload = buffer.slice(12, -16);
	const tag = buffer.slice(-16);

	// Create an AES-GCM decipher
	const decipher = crypto.createDecipheriv(
		"aes-256-gcm",
		Buffer.from("your_secret_key_here_of_32_chars"),
		nonce
	);
	decipher.setAuthTag(tag);

	// Decrypt the payload
	const decryptedPayload =
		decipher.update(encryptedPayload, undefined, "utf8") +
		decipher.final("utf8");

	return decryptedPayload;
}

export function getPrimaryKey(pkFormat: string, payload: any) {
	let keys = pkFormat.split("~");
	let pk: any[] = [];
	keys.forEach((key: string) => {
		pk.push(payload[key]);
	});
	return pk.join("~");
}

export function generateQuery(
	table: string,
	diffObject: any,
	primaryKey: string
) {
	let arr: string[] = [];
	Object.keys(diffObject).forEach((operation) => {
		if (!isEmpty(diffObject[operation])) {
			Object.keys(diffObject[operation]).forEach((pk) => {
				let pks = pk.split("~");
				if (operation === "update") {
					arr.push(
						`UPDATE "${table}" SET ${Object.keys(diffObject[operation][pk])
							.map(
								(column) =>
									`"${column}" = '${diffObject[operation][pk][column]}'`
							)
							.join(", ")} WHERE ${primaryKey
							.split("~")
							.map((val, index) => `"${val}" = '${pks[index]}'`)
							.join(" AND ")};`
					);
				}
			});
		}
	});
	return arr.join("\n");
}
