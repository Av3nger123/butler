"use client";

import dynamic from "next/dynamic";
import { firaCode } from "@/components/ui/fonts";
import { cn } from "@/lib/utils";

const BreadcrumbsNoSSR = dynamic(() => import("@/components/breadcrumbs"), {
	ssr: false,
});

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className={cn("flex flex-col h-full bg-background")}>
			<div className="border rounded-t-xl">
				<BreadcrumbsNoSSR />
			</div>
			<div className="border rounded-b-xl mb-6">{children}</div>
		</div>
	);
}
