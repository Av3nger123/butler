"use client";

import { Boxes, ChevronsRight, Database, Dot, Table2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import useClusterStore from "@/lib/store/clusterstore";

const breadIcons: any = [
	<Boxes key={0} size={20} />,
	<Database key={1} size={20} />,
	<Table2 key={1} size={20} />,
];

const Breadcrumbs: React.FC = () => {
	const { cluster } = useClusterStore();
	const pathname = usePathname();
	const pathSegments = pathname.split("/").filter((segment) => segment !== "");

	return (
		<nav className="flex p-2 px-4 border-rounded-xl" aria-label="Breadcrumb">
			<ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
				{pathSegments.map((segment, index) => {
					return (
						<li key={segment} className="inline-flex items-center">
							{index != 0 && (
								<span>
									<ChevronsRight />
								</span>
							)}
							<Button variant="ghost" asChild>
								<Link href={`/${pathSegments.slice(0, index + 1).join("/")}`}>
									{breadIcons[index]}&nbsp;
									{index == 0 ? cluster?.name : segment}
								</Link>
							</Button>
						</li>
					);
				})}
			</ol>
		</nav>
	);
};

export default Breadcrumbs;
