import Link from "next/link";
import { ModeToggle } from "./theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getServerSession } from "next-auth";

export async function AppBar() {
	const session = await getServerSession();
	return (
		<div className="w-full grid grid-cols-10 justify-between gap-6 md:gap-10">
			<Link
				href="/"
				className="hidden items-center col-span-9 space-x-2 md:flex"
			>
				<span className="hidden font-bold sm:inline-block">Butler</span>
			</Link>
			<div className="flex gap-2">
				<Avatar>
					<AvatarImage src={session?.user?.image ?? ""} />
					<AvatarFallback>
						{session?.user?.name
							?.split(" ")
							.map((word) => word[0])
							.join("")}
					</AvatarFallback>
				</Avatar>
				<ModeToggle />
			</div>
		</div>
	);
}
