import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { SQLEditor } from "./sql-editor";
import { firaCode } from "./ui/fonts";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ScrollArea } from "./ui/scroll-area";

export function Commits({ commits }: { commits: any[] }) {
	const [code, setCode] = useState<string>("");
	return (
		<div className={cn("p-3 pt-5 w-full", firaCode.className)}>
			<div className="grid grid-cols-5">
				<div className="col-span-3">
					<SQLEditor code={code} setCode={setCode} />
				</div>
				<div className="pr-4 col-span-2">
					<ScrollArea>
						{commits?.map((commit) => (
							<Alert key={commit.id} className="w-full my-2">
								<Terminal className="h-4 w-4" />
								<AlertTitle>{commit.sqlQuery}</AlertTitle>
								<AlertDescription>
									{
										commit.createdAt
											.replace("T", " ")
											.replace("Z", "")
											.split(".")[0]
									}
								</AlertDescription>
							</Alert>
						))}
					</ScrollArea>
				</div>
			</div>
		</div>
	);
}
