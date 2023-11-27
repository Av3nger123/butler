import { ThemeProvider } from "@/components/theme-provider";
import { firaCode } from "@/components/ui/fonts";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { Inter as FontSans } from "next/font/google";
import Provider from "./client-provider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export const fontSans = FontSans({
	subsets: ["latin"],
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
					fontSans.variable
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
			</body>
		</html>
	);
}
