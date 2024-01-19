import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
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

export async function POST(
	request: NextRequest,
	{ params }: { params: { workspaceId: string } }
) {
	const session = await getServerSession(authOptions);
	const requestBody = await request.json();
	const workspace = await prisma.workspaceUser.upsert({
		where: {
			workspace_id_user_id: {
				workspace_id: parseInt(params.workspaceId),
				user_id: requestBody.userId,
			},
		},
		update: {
			role_id: requestBody.roleId,
			user_id: requestBody.userId,
		},
		create: {
			workspace_id: parseInt(params.workspaceId),
			role_id: requestBody.roleId,
			user_id: requestBody.userId,
		},
	});
	return Response.json({ workspace });
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: { workspaceId: string } }
) {
	const session = await getServerSession(authOptions);
	const requestBody = await request.json();
	const workspace = await prisma.workspaceUser.delete({
		where: {
			workspace_id_user_id: {
				workspace_id: parseInt(params.workspaceId),
				user_id: requestBody.userId,
			},
		},
	});
	return Response.json({ workspace });
}
