import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	const session = await getServerSession(authOptions);

	const dbUser = await prisma.user.findFirst({
		where: {
			email: session?.user?.email,
		},
		include: {
			WorkspaceUser: {
				include: {
					workspace: true,
				},
			},
		},
	});

	if (dbUser?.WorkspaceUser?.length == 0) {
		const newWorkspace = await prisma.workspace.create({
			data: {
				name: "My Workspace",
				createdAt: new Date(),
			},
		});

		// Map the new workspace to the current user
		await prisma.workspaceUser.create({
			data: {
				workspace_id: newWorkspace.id,
				user_id: dbUser.id,
				role_id: "admin",
			},
		});

		return Response.json({ workspaces: [newWorkspace] });
	}

	const workspaces = dbUser?.WorkspaceUser.map(
		(workspaceRelation: any) => workspaceRelation.workspace
	);

	return Response.json({ workspaces });
}

export async function POST(
	request: NextRequest,
	{ params }: { params: { clusterId: string } }
) {
	const session = await getServerSession(authOptions);
	const dbUser = await prisma.user.findFirst({
		where: {
			email: session?.user?.email,
		},
	});
	if (dbUser == null) {
		return Response.json({ message: "Unauthorized" });
	}
	const requestBody = await request.json();
	if (requestBody?.id) {
		const workspace = await prisma.workspace.update({
			where: {
				id: parseInt(requestBody?.id),
			},
			data: requestBody,
		});
		return Response.json({ workspace });
	} else {
		const workspace = await prisma.workspace.create({
			data: requestBody,
		});
		await prisma.workspaceUser.create({
			data: {
				workspace_id: workspace.id,
				user_id: dbUser.id,
				role_id: "admin",
			},
		});
		return Response.json({ workspace });
	}
}
