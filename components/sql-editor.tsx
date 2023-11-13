"use client";

import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";
import CodeEditor from "@uiw/react-textarea-code-editor";

export function SQLEditor({ code, setCode }: { code: string; setCode: any }) {
	const { theme } = useTheme();

	return (
		<div className="container mt-8 mx-auto">
			<div className="rounded-md  border shadow-md h-96 w-full">
				<CodeEditor
					value={code}
					language="sql"
					placeholder=""
					onChange={(evn) => setCode(evn.target.value)}
					padding={15}
					style={{
						fontSize: 18,
						height: "100%",
						backgroundColor: `${
							theme == "dark"
								? "#020817"
								: theme == "light"
								? "#ffffff"
								: window.matchMedia("(prefers-color-scheme: dark)").matches
								? "#020817"
								: "#ffffff"
						}`,
						fontFamily:
							"ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
					}}
				/>
			</div>
		</div>
	);
}
