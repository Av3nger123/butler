import { Input } from "../ui/input";
import Editor from "@monaco-editor/react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Edit } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useState } from "react";
import { isEqual } from "lodash";

interface JsonInputProps {
	value: any;
	onChange: any;
}

export default function JsonInput({
	value,
	onChange,
}: Readonly<JsonInputProps>) {
	const [isValid, setIsValid] = useState<boolean>(true);
	const [input, setInput] = useState(JSON.stringify(value));
	const { theme } = useTheme();

	const onValidate = (markers: any) => {
		if (markers.length > 0) {
			setIsValid(false);
		}
	};

	const handleInputChange = useCallback(
		(val: string | undefined) => {
			if (isValid && val) {
				if (!isEqual(value, JSON.parse(val))) {
					setInput(val);
					onChange(JSON.parse(val));
				}
			}
		},
		[isValid, onChange, value]
	);

	const editorDidMount = (editor: any, monaco: any) => {
		setTimeout(function () {
			editor.getAction("editor.action.formatDocument").run();
		}, 0);
	};
	return (
		<div className="flex flex-row">
			<Input className="min-w-[200px]" value={input} disabled />
			<Dialog>
				<DialogTrigger asChild>
					<Button size={"icon"} variant={"ghost"}>
						<Edit className="w-4 h-4" />
					</Button>
				</DialogTrigger>
				<DialogContent className="w-full">
					<DialogTitle>Editor</DialogTitle>

					{/* <CodeEditor
						value={value}
						language="json"
						onChange={(evn) => onChange(evn.target.value)}
						padding={15}
						style={{
							fontSize: 14,
							height: "100%",
							overflow: "auto",
							backgroundColor: `${theme == "light" ? "#ffffff" : "#020817"}`,
							fontFamily:
								"ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
						}}
					/> */}
					<Editor
						language="json"
						className="border p-2"
						options={{
							minimap: { enabled: false },
						}}
						value={input}
						height="50vh"
						width="100%"
						onValidate={onValidate}
						onChange={(val, _) => handleInputChange(val)}
						onMount={editorDidMount}
						theme={`${theme == "light" ? "light" : "vs-dark"}`}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
}
