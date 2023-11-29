import { Metadata } from "next";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { UserAuthForm } from "@/components/user-auth-form";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Unlock from "@/public/images/unlock.svg";
import { Waypoints } from "lucide-react";

export const metadata: Metadata = {
	title: "Login",
	description: "Login to your account",
};

export default async function LoginPage() {
	const session = await getServerSession();
	if (session) {
		redirect("/");
	}
	return (
		<div className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
			<Link
				href="/"
				className={cn(
					buttonVariants({ variant: "ghost" }),
					"absolute left-4 top-4 md:left-8 md:top-8"
				)}
			>
				<>
					<Icons.chevronLeft className="mr-2 h-4 w-4" />
					Back
				</>
			</Link>
			<div className="h-full bg-muted flex justify-center items-center">
				<Image
					src={"/images/unlock.svg"}
					alt="unlock"
					width={400}
					height={400}
				/>
			</div>
			<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
				<div className="flex flex-col space-y-2 text-center">
					<Waypoints className="mx-auto h-6 w-6" />
					<h1 className="text-2xl font-semibold tracking-tight">Welcome</h1>
					<p className="text-sm text-muted-foreground">
						Please authorize yourself with github to continue
					</p>
				</div>
				<UserAuthForm />
			</div>
		</div>
	);
}
