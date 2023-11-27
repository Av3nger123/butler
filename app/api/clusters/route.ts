import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
	const workspaceId = request.nextUrl.searchParams.get("workspaceId");
	if (workspaceId == null) {
		return Response.json({ clusters: [] });
	}
	const clusters = await prisma.cluster.findMany({
		where: {
			workspace_id: parseInt(workspaceId),
		},
	});
	return Response.json({ clusters });
}

export async function POST(request: NextRequest) {
	const requestBody = await request.json();
	if (requestBody?.id) {
		const cluster = await prisma.cluster.update({
			where: {
				id: parseInt(requestBody?.id),
			},
			data: requestBody,
		});
		return Response.json({ cluster });
	} else {
		const cluster = await prisma.cluster.create({
			data: requestBody,
		});
		return Response.json({ cluster });
	}
}
