"use client";
import { SQLEditor } from "@/components/sql-editor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export default function Page({
	tableId,
	databaseId,
}: {
	tableId: string;
	databaseId: string;
}) {
	const [sqlQuery, setSqlQuery] = useState("");
	return (
		<div className="p-2">
			<Tabs defaultValue="queries" className="w-full">
				<TabsList className="w-full right-1/2">
					<TabsTrigger value="queries">Queries</TabsTrigger>
					<TabsTrigger value="data">Table</TabsTrigger>
					<TabsTrigger value="schema">Schema</TabsTrigger>
					<TabsTrigger value="editor">SQL</TabsTrigger>
				</TabsList>
				<TabsContent value="queries"></TabsContent>
				<TabsContent value="data"></TabsContent>
				<TabsContent value="schema">Change your password here.</TabsContent>
				<TabsContent value="editor">
					<SQLEditor code={sqlQuery} setCode={setSqlQuery} />
				</TabsContent>
			</Tabs>
		</div>
	);
}
