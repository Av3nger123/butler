"use client";

import { Boxes, ChevronsRight, Database, Dot, Table2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import useClusterStore from "@/lib/store/clusterstore";

const breadIcons: any = {
	cluster: <Boxes size={20} />,
	database: <Database size={20} />,
	table: <Table2 size={20} />,
};

const Breadcrumbs: React.FC = () => {
	const { cluster } = useClusterStore();
	const pathname = usePathname();
	const pathSegments = pathname.split("/").filter((segment) => segment !== "");

	return (
		<nav className="flex p-2 px-4 border-rounded-xl" aria-label="Breadcrumb">
			<ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
				{pathSegments.map((segment, index) => {
					if (index % 2 == 1) {
						return (
							<li key={index} className="inline-flex items-center">
								{index != 1 && (
									<span>
										<ChevronsRight />
									</span>
								)}
								<Button variant="ghost" asChild>
									<Link href={`/${pathSegments.slice(0, index + 1).join("/")}`}>
										{breadIcons[pathSegments[index - 1]]}&nbsp;
										{pathSegments[index - 1] === "cluster"
											? cluster?.name
											: segment}
									</Link>
								</Button>
							</li>
						);
					}
				})}
			</ol>
		</nav>
	);
};

export default Breadcrumbs;
