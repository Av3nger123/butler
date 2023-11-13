import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as CryptoJS from "crypto-js";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function encrypt(payload: string) {
	const nonce = CryptoJS.lib.WordArray.random(12);
	const cipherText = CryptoJS.AES.encrypt(payload, "your_encrypt_key", {
		iv: nonce,
		mode: CryptoJS.mode.GCM,
	});

	// Combine nonce, cipherText, and authentication tag
	const encryptedData = CryptoJS.enc.Base64.stringify(
		nonce.concat(cipherText.ciphertext).concat(cipherText.finalize())
	);

	return encryptedData;
}
export const decrypt = (encryptedData: string) => {
	const decodedData = CryptoJS.enc.Base64.parse(encryptedData);
	const nonce = decodedData.words.slice(0, 3);

	const decryptedText = CryptoJS.AES.decrypt(
		{
			ciphertext: CryptoJS.lib.WordArray.create(decodedData.words.slice(3)),
		},
		"your_encrypt_key",
		{
			iv: CryptoJS.lib.WordArray.create(nonce),
			mode: CryptoJS.mode.GCM,
		}
	).toString(CryptoJS.enc.Utf8);

	return decryptedText;
};
