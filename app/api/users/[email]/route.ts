import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: { email: string } }
) {
	const session = await getServerSession(authOptions);
	if (!session) {
		return Response.json({});
	}
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
	const account = await prisma.account.findFirst({
		where: {
			userId: user?.id,
		},
	});
	return Response.json({ user, account });
}
