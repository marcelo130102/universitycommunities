import { PrismaClient } from "@prisma/client";
import NextAuth from "next-auth";
import { NextAuthOptions } from "next-auth";

import GoogleProvider from "next-auth/providers/google";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    // ...añadir más proveedores aquí
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email as string },
      });

      if (!existingUser) {
        await prisma.user.create({
          data: {
            first_name: profile?.name ?? "",
            email: user?.email ?? "",
            username: (profile?.name ?? "").replace(/\s/g, "").toLowerCase(),
            image_url: user?.image ?? "",
          },
        });
      }
      prisma.$disconnect();
      return true;
    },
  },
};

export default NextAuth(authOptions)