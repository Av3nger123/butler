import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: { clusterId: string } }
) {
	let databaseId = request.nextUrl.searchParams.get("databaseId");
	let tableId = request.nextUrl.searchParams.get("tableId");
	let page = parseInt(request.nextUrl.searchParams.get("page") ?? "0");
	let size = parseInt(request.nextUrl.searchParams.get("size") ?? "10");
	let filter: any = {};
	if (tableId) {
		filter["tableId"] = tableId;
	}
	if (databaseId) {
		filter["databaseId"] = databaseId;
	}
	const queries = await prisma.query.findMany({
		skip: page * size,
		take: size,
		orderBy: {
			createdAt: "desc",
		},
		where: filter,
	});
	return Response.json({ queries });
}
