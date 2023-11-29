const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seedRoles() {
	try {
		// Seed the "admin" role
		const adminRole = await prisma.roles.create({
			data: {
				id: "admin",
				createdAt: new Date(),
			},
		});

		const permissions = await Promise.all([
			prisma.permissions.create({
				data: {
					id: "add-cluster",
					createdAt: new Date(),
				},
			}),
			prisma.permissions.create({
				data: {
					id: "edit-cluster",
					createdAt: new Date(),
				},
			}),
			prisma.permissions.create({
				data: {
					id: "delete-cluster",
					createdAt: new Date(),
				},
			}),
			prisma.permissions.create({
				data: {
					id: "invite-members",
					createdAt: new Date(),
				},
			}),
		]);

		// Associate permissions with the admin role
		await Promise.all(
			permissions.map((permission) =>
				prisma.rolePermissions.create({
					data: {
						roleId: adminRole.id,
						permissionId: permission.id,
					},
				})
			)
		);

		// Seed the "member" role
		await prisma.roles.create({
			data: {
				id: "member",
				createdAt: new Date(),
			},
		});
	} catch (error) {
		console.error("Error seeding roles:", error);
	} finally {
		await prisma.$disconnect();
	}
}

// Call the function to seed roles
seedRoles();
