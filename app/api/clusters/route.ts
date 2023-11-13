import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
	const clusters = await prisma.cluster.findMany();
	return Response.json({ clusters });
}

export async function POST(request: NextRequest) {
	const requestBody = await request.json();
	const cluster = await prisma.cluster.create({
		data: requestBody,
	});
	return Response.json({ cluster });
}
