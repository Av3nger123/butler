import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: { clusterId: number } }
) {
	const cluster = await prisma.cluster.findUnique({
		where: {
			id: params.clusterId,
		},
	});
	return Response.json({ cluster });
}
