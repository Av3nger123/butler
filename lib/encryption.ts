import * as crypto from "crypto";

export function encrypt(payload: string): string {
	// Generate a random nonce (Initialization Vector)
	const nonce = crypto.randomBytes(12);
	// Create an AES-GCM cipher
	const cipher = crypto.createCipheriv(
		"aes-256-gcm",
		Buffer.from(process.env.NEXT_PUBLIC_AUTH_SECRET ?? ""),
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
		Buffer.from(process.env.NEXT_PUBLIC_AUTH_SECRET ?? ""),
		nonce
	);
	decipher.setAuthTag(tag);

	// Decrypt the payload
	const decryptedPayload =
		decipher.update(encryptedPayload, undefined, "utf8") +
		decipher.final("utf8");

	return decryptedPayload;
}
