import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: { email: string } }
) {
	const session = await getServerSession(authOptions);

	const user = await prisma.user.findFirst({
		where: {
			email: params.email,
		},
		include: {
			WorkspaceUser: {
				include: {
					role: {
						include: {
							RolePermissions: {
								include: {
									permission: true,
								},
							},
						},
					},
				},
			},
		},
	});
	return Response.json({ user });
}
