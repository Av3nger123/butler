import { AppBar } from "@/components/app-bar";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
interface DashboardLayoutProps {
	children?: React.ReactNode;
}

export default async function DashboardLayout({
	children,
}: Readonly<DashboardLayoutProps>) {
	const session = await getServerSession();
	if (!session?.user) {
		redirect("/login");
	}
	return (
		<div className="flex min-h-screen flex-col space-y-6">
			<header className="sticky top-0 z-40 border-b bg-background">
				<div className="flex h-16 items-center justify-between p-4">
					<AppBar />
				</div>
			</header>
			<div className="px-4 grid flex-1 gap-12">
				<main className="w-full overflow-hidden">{children}</main>
			</div>
		</div>
	);
}
