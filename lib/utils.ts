import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
const Cryptr = require("cryptr");

const cryptr = new Cryptr("your_secret_key_here_of_32_chars");

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function encrypt(payload: string): string {
	const encryptedData = cryptr.encrypt(payload);
	return encryptedData;
}
export function decrypt(encryptedData: string): string {
	const decryptedData = cryptr.decrypt(encryptedData);
	return decryptedData;
}
