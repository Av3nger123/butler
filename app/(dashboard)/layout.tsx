import { AppBar } from "@/components/app-bar";

interface DashboardLayoutProps {
	children?: React.ReactNode;
}

export default async function DashboardLayout({
	children,
}: DashboardLayoutProps) {
	return (
		<div className="flex min-h-screen flex-col space-y-6">
			<header className="sticky top-0 z-40 border-b bg-background">
				<div className="container flex h-16 items-center justify-between p-4">
					<AppBar />
				</div>
			</header>
			<div className="container grid flex-1 gap-12">
				<main className="w-full overflow-hidden">{children}</main>
			</div>
		</div>
	);
}
