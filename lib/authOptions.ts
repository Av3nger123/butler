import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
	providers: [
		GithubProvider({
			clientId: process.env.GITHUB_ID ?? "",
			clientSecret: process.env.GITHUB_SECRET ?? "",
		}),
	],
	adapter: PrismaAdapter(prisma),
	pages: {
		signIn: "/login",
	},
	session: {
		strategy: "jwt",
	},
	callbacks: {
		async session({ token, session }) {
			if (token) {
				session.user = {};
				session.user.name = token.name;
				session.user.email = token.email;
				session.user.image = token.picture;
			}
			return { ...session, username: token?.username };
		},
		async jwt({ token, user, profile, account }) {
			let dbUser = await prisma.user.findFirst({
				where: {
					email: token.email,
				},
			});

			if (!dbUser) {
				if (profile) {
					token.id = user?.id;
					token.username = profile?.login;
					token.accessToken = account?.access_token;
				}
				return token;
			}

			await prisma.user.update({
				data: {
					username: profile?.login,
				},
				where: {
					id: dbUser.id,
				},
			});
			return {
				id: dbUser.id,
				name: dbUser.name,
				email: dbUser.email,
				picture: dbUser.image,
				username: dbUser?.username,
			};
		},
	},
};
