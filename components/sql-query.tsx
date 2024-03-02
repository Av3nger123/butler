"use client";
import { useTheme } from "next-themes";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { cn } from "@/lib/utils";

export function SQLQuery({
	value,
	className,
}: Readonly<{
	value: string;
	className: string | undefined;
}>) {
	const { theme } = useTheme();

	return (
		<div
			className={cn(
				"rounded-md border shadow-md w-full overflow-auto max-h-96",
				className
			)}
		>
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
