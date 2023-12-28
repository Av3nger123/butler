import { ScrollArea } from "./ui/scroll-area";
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
