import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { SQLEditor } from "./sql-editor";
import { firaCode } from "./ui/fonts";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";
import { Commit } from "./commit";

export function Commits({ commits }: Readonly<{ commits: any[] }>) {
	return (
		<div className="p-3 pt-5 w-full">
			<div>
				<div>
					<ScrollArea>
						{commits?.map((commit) => (
							<Commit key={commit.id} commit={commit} />
						))}
					</ScrollArea>
				</div>
			</div>
		</div>
	);
}
