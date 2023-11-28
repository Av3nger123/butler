import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	const session = await getServerSession(authOptions);

	const email = request.nextUrl.searchParams.get("email");
	if (email == null || email == "") {
		return Response.json({ users: [] });
	}
	const users = await prisma.user.findMany({
		where: {
			email: {
				contains: email,
			},
		},
		take: 10,
	});
	return Response.json({ users });
}
