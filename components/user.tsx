import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function User({ user }: { user: any }) {
	return (
		<div className="flex items-center space-x-4">
			<Avatar>
				<AvatarImage src={user?.image} />
				<AvatarFallback>
					{user?.name
						?.split(" ")
						.map((word: string) => word[0])
						.join("")}
				</AvatarFallback>
			</Avatar>
			<div>
				<p className="text-sm font-medium leading-none">{user?.username}</p>
				<p className="text-sm text-muted-foreground">{user?.email}</p>
			</div>
		</div>
	);
}
