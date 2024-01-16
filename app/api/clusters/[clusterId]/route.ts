import { decrypt } from "@/lib/encryption";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: { clusterId: string } }
) {
	let admin = request.nextUrl.searchParams.get("admin");
	let auth = request.headers.get("api-key");
	const cluster = await prisma.cluster.findUnique({
		where: {
			id: parseInt(params.clusterId),
		},
	});
	if (admin === "true") {
		if (cluster && auth === process.env.NEXT_PUBLIC_AUTH_SECRET) {
			return Response.json({
				cluster: { ...cluster, password: decrypt(cluster.password) },
			});
		}
		return Response.json({});
	}
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
