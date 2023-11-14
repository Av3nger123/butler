import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: { clusterId: string } }
) {
	const cluster = await prisma.cluster.findUnique({
		where: {
			id: parseInt(params.clusterId),
		},
	});
	return Response.json({ cluster });
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: { clusterId: string } }
) {
	const cluster = await prisma.cluster.delete({
		where: {
			id: parseInt(params.clusterId),
		},
	});
	return Response.json({ cluster });
}
