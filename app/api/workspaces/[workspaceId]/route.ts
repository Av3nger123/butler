import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { WorkspaceUser } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: { workspaceId: string } }
) {
	const session = await getServerSession(authOptions);
	let workspace = await prisma.workspace.findFirst({
		where: {
			id: parseInt(params.workspaceId),
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
					user: true,
				},
			},
		},
	});

	return Response.json({ workspace });
}
