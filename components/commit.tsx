import { useMemo } from "react";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";
import { firaCode } from "./ui/fonts";
import { cn } from "@/lib/utils";

export function Commit({ commit }: Readonly<{ commit: any }>) {
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
		const executed = new Date(commit.executedAt);
		return executed.toLocaleDateString("en-US", {
			month: "long",
			day: "numeric",
			year: "numeric",
		});
	}, [commit]);

	const executedTime = useMemo(() => {
		const executed = new Date(commit.executedAt);
		return executed.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			timeZoneName: "short",
		});
	}, [commit]);

	return (
		<div
			className={cn(
				"border rounded-2xl p-3 flex flex-col gap-2",
				firaCode.className
			)}
		>
			<div>
				<h4 className="font-bold">{commit.title}</h4>
			</div>
			<div>
				<Textarea value={commit.sqlQuery} readOnly />
			</div>
			<div className="flex gap-1 h-5">
				<div>
					<span>Created At: </span>
					<span className="italic font-thin">
						{createdDate} {createdTime}
					</span>
				</div>
				<Separator orientation="vertical" />
				<div>
					<span>Executed At: </span>
					<span className="italic font-thin">
						{executedDate} {executedTime}
					</span>
				</div>
			</div>
		</div>
	);
}
