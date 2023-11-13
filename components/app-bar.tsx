import Link from "next/link";
import { ModeToggle } from "./theme-toggle";

export function AppBar() {
	return (
		<div className="flex gap-6 md:gap-10">
			<Link href="/" className="hidden items-center space-x-2 md:flex">
				<span className="hidden font-bold sm:inline-block">Butler</span>
			</Link>
			<ModeToggle />
		</div>
	);
}
