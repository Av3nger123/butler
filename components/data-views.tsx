"use client";

import { useDatabase } from "@/lib/context/database-context";
import { ScrollArea } from "./ui/scroll-area";

import { useTheme } from "next-themes";
import { Separator } from "./ui/separator";
import marked from "marked";
import { Editor } from "@monaco-editor/react";
import { Textarea } from "./ui/textarea";
import { Asterisk, SearchIcon } from "lucide-react";
import { Input } from "./ui/input";
import Fuse from "fuse.js";
import { useState } from "react";
import { SQLQuery } from "./sql-query";

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

export function DataView() {
	const { views } = useDatabase();
	const { theme } = useTheme();
	const [search, setSearch] = useState("");

	const fuse = new Fuse(views, fuseOptions);

	const [filteredViews, setFilteredViews] = useState(views);

	const handleSearch = (searchValue: string) => {
		if (searchValue == "") {
			setFilteredViews(views);
		} else {
			let filteredValues = fuse.search(search);
			setFilteredViews(
				filteredValues?.map((filteredValue) => filteredValue.item)
			);
		}
		setSearch(searchValue);
	};

	return (
		<div>
			<div className="py-2 flex flex-row gap-2 items-center">
				<div className="border rounded-lg px-2 flex flex-row gap-2 items-center">
					<Input
						value={search}
						placeholder="Search..."
						onChange={(e) => handleSearch(e.target.value)}
						className="w-80 border-none focus-visible:ring-offset-0 focus-visible:ring-0  focus-visible:ring-offset-ring"
					/>
				</div>
			</div>
			<ScrollArea>
				{filteredViews?.map((view: any) => (
					<div key={view?.id} className="border rounded-lg p-2">
						<label className="ml-2 font-bold font-xl flex flex-row items-center">
							<Asterisk className="w-8 h-8" />
							{view?.title}
						</label>
						<SQLQuery value={view?.query} className="mt-2 rounded-xl" />
					</div>
				))}
			</ScrollArea>
		</div>
	);
}
