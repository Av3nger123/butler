"use client";

import { ScrollArea } from "./ui/scroll-area";
import { Commit } from "./commit";
import { Button } from "./ui/button";
import { Play, Undo } from "lucide-react";
import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import { Input } from "./ui/input";
import { postApi } from "@/lib/api";
import { toast } from "sonner";
import useClusterStore from "@/lib/store/clusterstore";
import { useDatabase } from "@/lib/context/database-context";

const fuseOptions = {
	isCaseSensitive: false,
	// includeScore: false,
	shouldSort: true,
	// includeMatches: false,
	// findAllMatches: false,
	// minMatchCharLength: 1,
	// location: 0,
	// threshold: 0.6,
	// distance: 100,
	// useExtendedSearch: false,
	// ignoreLocation: false,
	// ignoreFieldNorm: false,
	// fieldNormWeight: 1,
	keys: ["title"],
};

export function Commits({
	commits,
	queries,
}: Readonly<{ commits: any[]; queries: any[] }>) {
	const { cluster } = useClusterStore();
	const { database, commitRefetch } = useDatabase();
	const [selectedCommits, setSelectedCommits] = useState<string[]>([]);
	const [search, setSearch] = useState("");

	const fuse = new Fuse(commits, fuseOptions);

	const [filteredCommits, setFilteredCommits] = useState(commits);

	const final = useMemo(() => {
		setFilteredCommits(commits);
		setSelectedCommits([]);
	}, [commits]);

	const lastExecutedCommit = useMemo(() => {
		if (commits?.length > 0)
			for (const element of commits) {
				if (element.isExecuted === true) {
					return element.id;
				}
			}
		return null;
	}, [commits]);

	const handleSearch = (searchValue: string) => {
		if (searchValue == "") {
			setFilteredCommits(commits);
		} else {
			let filteredValues = fuse.search(search);
			setFilteredCommits(
				filteredValues?.map((filteredValue) => filteredValue.item)
			);
		}
		setSearch(searchValue);
	};

	const toggleSelectCommit = (commitId: string) => {
		if (selectedCommits.includes(commitId)) {
			setSelectedCommits(selectedCommits.filter((id) => id !== commitId));
		} else {
			setSelectedCommits([...selectedCommits, commitId]);
		}
	};

	const handleExecuteQuery = (commits: string[], type: string) => {
		postApi(
			`${process.env.NEXT_PUBLIC_SERVER_URL}/cluster/execute/${cluster?.id}?db=${database}`,
			JSON.stringify({
				commits: commits.map((commit) => "" + commit),
				type: type,
			})
		)
			.then((response) => {
				toast.success(response.message);
				commitRefetch();
			})
			.catch((err: any) => {
				toast.error(err.response.data.message);
			});
	};

	return (
		<div className="pt-2 w-full">
			<div>
				<div className="flex justify-between">
					<div className="border rounded-lg px-2 flex flex-row gap-2 items-center">
						<Input
							value={search}
							placeholder="Search..."
							onChange={(e) => handleSearch(e.target.value)}
							className="w-80 border-none focus-visible:ring-offset-0 focus-visible:ring-0  focus-visible:ring-offset-ring"
						/>
					</div>
					<div className="flex gap-2">
						<Button
							variant="secondary"
							disabled={!lastExecutedCommit}
							onClick={() => handleExecuteQuery([lastExecutedCommit], "revert")}
						>
							<Undo className="mr-2 w-4 h-4" />
							Revert
						</Button>
						<Button
							variant="default"
							disabled={selectedCommits.length == 0}
							onClick={() => handleExecuteQuery(selectedCommits, "default")}
						>
							<Play className="mr-2 w-4 h-4" />
							Execute
						</Button>
					</div>
				</div>

				<div>
					<ScrollArea>
						{filteredCommits?.map((commit) => (
							<div key={commit.id}>
								<Commit
									commit={commit}
									queries={queries[commit?.id]}
									selectedCommits={selectedCommits}
									setSelectedCommits={toggleSelectCommit}
								/>
							</div>
						))}
					</ScrollArea>
				</div>
			</div>
		</div>
	);
}
