import { Input } from "../ui/input";
import Editor from "@monaco-editor/react";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Edit } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useState } from "react";
import { isEqual } from "lodash";
import { cn } from "@/lib/utils";

interface JsonInputProps {
	value: any;
	onChange: any;
	className: string;
}

export default function JsonInput({
	value,
	onChange,
	className,
}: Readonly<JsonInputProps>) {
	const [isValid, setIsValid] = useState<boolean>(true);
	const [input, setInput] = useState(JSON.stringify(value, null, 4));
	const { theme } = useTheme();

	const onValidate = (markers: any) => {
		if (markers.length > 0) {
			setIsValid(false);
		}
	};

	const handleInputChange = useCallback(
		(val: string | undefined) => {
			if (val) {
				setInput(val);
				try {
					onChange(JSON.parse(val));
				} catch (err) {
					console.log(err);
				}
			}
		},
		[onChange]
	);

	return (
		<div className="flex flex-row">
			<Input
				className={cn("min-w-[200px]", className)}
				value={JSON.stringify(value)}
				disabled
			/>
			<Dialog>
				<DialogTrigger asChild>
					<Button size={"icon"} variant={"ghost"}>
						<Edit className="w-4 h-4" />
					</Button>
				</DialogTrigger>
				<DialogContent className="w-full">
					<div className="flex flex-row justify-between items-center pt-3 ">
						<DialogTitle>Editor</DialogTitle>
						{/* <Button onClick={formatDocument} variant={"ghost"}>
							Format
						</Button> */}
					</div>
					<Editor
						language="json"
						className="py-2 pr-2"
						options={{
							minimap: { enabled: false },
						}}
						value={input}
						height="50vh"
						width="100%"
						onValidate={onValidate}
						onChange={(val, _) => handleInputChange(val)}
						theme={`${theme == "light" ? "light" : "vs-dark"}`}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
}
