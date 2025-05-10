import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./db/prisma";
import { compareSync } from "bcrypt-ts-edge";
import type { NextAuthConfig } from "next-auth";

export const config = {
  pages: {
    signIn: "/auth/signIn",
    error: "/auth/signIn",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, //30 days
  },
  adapter: PrismaAdapter(prisma),
  providers: [CredentialsProvider({
    credentials:{
        email:{type:"email"},
        password:{type:"password"}
    },
    async authorize(credentials){
        if(credentials == null) return null;

        const user = prisma.user.findFirst({
            where:{
                email:credentials.email as string
            }
        });

        if(user & user.password){
            const isMatch = compareSync(credentials.password as string , user.password);

            if(isMatch) return {
                id:user.id,
                name:user.name,
                email:user.email,
                role:user.role

            }
        }

        return null;
    }
  })],
  callbacks:{
    async session({session , user , trigger , token}:any){
        // Set the userId from the token(it comes in token by default)
        session.user.id = token.sub;

        //If there is an update , then update the username(user can update its name)
        if(trigger === 'update')
        session.user.name = user.name;
        return session
    },
  }
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
