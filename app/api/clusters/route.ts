import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
	const clusters = await prisma.cluster.findMany();
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
