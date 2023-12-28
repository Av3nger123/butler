import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import {
	Fira_Code,
	Inter as FontSans,
	Fira_Code as FiraCode,
} from "next/font/google";
import Provider from "./client-provider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Toaster } from "sonner";

export const fontSans = FontSans({
	subsets: ["latin"],
	variable: "--font-sans",
});

export const firaCode = FiraCode({
	subsets: ["greek"],
	variable: "--font-sans",
});

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await getServerSession(authOptions);

	return (
		<html lang="en">
			<head />
			<body
				className={cn(
					"min-h-screen bg-background font-sans antialiased",
					firaCode.variable
				)}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<Provider session={session}>{children}</Provider>
				</ThemeProvider>
				<Toaster position="top-right" closeButton richColors />
			</body>
		</html>
	);
}
