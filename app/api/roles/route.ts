import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	const session = await getServerSession(authOptions);
	const roles = await prisma.role.findMany({
		include: {
			RolePermissions: {
				include: {
					permission: true,
				},
			},
		},
	});
	return Response.json({ roles });
}
