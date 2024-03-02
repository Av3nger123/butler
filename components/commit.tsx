"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { SQLQuery } from "./sql-query";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ChevronsUpDown, Dot, GitCommitVertical } from "lucide-react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "./ui/collapsible";
import { Checkbox } from "./ui/checkbox";
import { has } from "lodash";

export function Commit({
	commit,
	queries,
	setSelectedCommits,
	selectedCommits,
}: Readonly<{
	commit: any;
	queries: any[];
	setSelectedCommits: any;
	selectedCommits: string[];
}>) {
	const [isOpen, setIsOpen] = useState(false);

	const createdDate = useMemo(() => {
		const created = new Date(commit.createdAt);
		return created.toLocaleDateString("en-US", {
			month: "long",
			day: "numeric",
			year: "numeric",
		});
	}, [commit]);

	const createdTime = useMemo(() => {
		const created = new Date(commit.createdAt);
		return created.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			timeZoneName: "short",
		});
	}, [commit]);

	const executedDate = useMemo(() => {
		if (commit.executedAt != "0001-01-01T00:00:00Z") {
			const executed = new Date(commit.executedAt);
			return executed.toLocaleDateString("en-US", {
				month: "long",
				day: "numeric",
				year: "numeric",
			});
		}
	}, [commit]);

	const executedTime = useMemo(() => {
		if (commit.executedAt != "0001-01-01T00:00:00Z") {
			const executed = new Date(commit.executedAt);
			return executed.toLocaleTimeString("en-US", {
				hour: "2-digit",
				minute: "2-digit",
				second: "2-digit",
				timeZoneName: "short",
			});
		}
	}, [commit]);
	const revertQueries: any = useMemo(() => {
		let queryStr: string = queries?.reduce(
			(combined: string, query: any) =>
				query?.type === "revert" ? combined + `${query?.query}\n` : "",
			""
		);
		return queryStr.slice(0, -1);
	}, [queries]);

	const defaultQueries: any = useMemo(() => {
		let queryStr: string = queries
			?.filter((query) => query?.type == "default")
			.reduce(
				(combined: string, query: any) => combined + `${query?.query}\n`,
				""
			);
		return queryStr.slice(0, -1);
	}, [queries]);

	return (
		<div className={cn("border rounded-2xl flex flex-col gap-2 m-2")}>
			<Collapsible open={isOpen} onOpenChange={setIsOpen}>
				<div
					className={cn(
						"flex flex-row gap-2 border-b p-2 items-center rounded-t-2xl justify-between",
						`${selectedCommits.includes(commit.id) ? " bg-secondary" : ""}`
					)}
				>
					<div className="flex flex-row gap-2 items-center">
						<GitCommitVertical className="" />
						{!commit.isExecuted && (
							<Checkbox
								checked={selectedCommits.includes(commit.id)}
								onCheckedChange={() =>
									!commit.isExecuted && setSelectedCommits(commit.id)
								}
							/>
						)}
						<Badge>{commit.id}</Badge>
						<h4 className="font-bold">{commit.title}</h4>
						<Dot
							size={48}
							color={commit.isExecuted ? "#00ff00" : "#ffca00"}
							strokeWidth={3}
						/>
					</div>
					<div className="flex flex-row gap-2 items-start">
						<CollapsibleTrigger asChild>
							<Button variant="ghost" size={"icon"}>
								<ChevronsUpDown className="w-4 h-4" />
							</Button>
						</CollapsibleTrigger>
					</div>
				</div>
				<CollapsibleContent className="space-y-2">
					<div className="p-3 gap-2">
						<div className="">
							<h5>Queries:</h5>
							<div>
								<SQLQuery value={defaultQueries} className="" />
							</div>
						</div>
						<div className="mt-2">
							<h5>Revert Queries:</h5>
							<div>
								<SQLQuery value={revertQueries} className="" />
							</div>
						</div>
					</div>
				</CollapsibleContent>
				<div
					className={cn(
						"flex gap-1 justify-between p-2",
						isOpen ? "border-t" : ""
					)}
				>
					<span className="italic font-thin">
						{createdDate} {createdTime}
					</span>
					{commit.isExecuted && executedDate && (
						<span className="italic font-thin">
							{executedDate} {executedTime}
						</span>
					)}
				</div>
			</Collapsible>
		</div>
	);
}
