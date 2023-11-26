"use client";

import dynamic from "next/dynamic";

const BreadcrumbsNoSSR = dynamic(() => import("@/components/breadcrumbs"), {
	ssr: false,
});

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="flex flex-col h-full bg-background">
			<div className="border rounded-t-xl">
				<BreadcrumbsNoSSR />
			</div>
			<div className="h-full border rounded-b-xl mb-6">{children}</div>
		</div>
	);
}
