import "@/styles/globals.css";
import { Inter as FontSans, Fira_Code as FiraCode } from "next/font/google";

export const fontSans = FontSans({
	subsets: ["latin"],
	variable: "--font-sans",
});

export const firaCode = FiraCode({ subsets: ["greek"], variable: "--" });
