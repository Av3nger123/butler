import { DatabaseContextProvider } from "@/lib/context/database-context";

export default function Layout({
	children,
	params,
}: Readonly<{
	params: {
		databaseId: string;
	};
	children: React.ReactNode;
}>) {
	return <div>{children}</div>;
}
