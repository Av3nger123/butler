"use client";
import { useTheme } from "next-themes";
import MarkdownPreview from "@uiw/react-markdown-preview";

export function SQLQuery({ value }: { value: string }) {
	const { theme } = useTheme();

	return (
		<div className="rounded-md border shadow-md w-full overflow-auto max-h-96">
			<MarkdownPreview
				source={"```sql\n" + value + "\n```"}
				className="rounded-xl"
				wrapperElement={{
					"data-color-mode": `${theme == "light" ? "light" : "dark"}`,
				}}
			/>
		</div>
	);
}
