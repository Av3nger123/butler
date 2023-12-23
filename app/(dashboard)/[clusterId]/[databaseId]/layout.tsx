import { SidebarNav } from "@/components/side-nav";
import { tables } from "@/lib/placeholder";
import { SidebarNavItem } from "@/types";

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <div>{children}</div>;
}
