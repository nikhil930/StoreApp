import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./db/prisma";
import { compareSync } from "bcrypt-ts-edge";
import { authConfig } from "./auth.config";

export const config = {
  pages: {
    signIn: "/auth/signIn",
    error: "/auth/signIn",
  },
  session: {
    session: {
      strategy: "jwt" as const,
    },
    maxAge: 30 * 24 * 60 * 60, //30 days
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (credentials == null) return null;

        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });

        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password
          );

          if (isMatch)
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    //JWT callback is called once when the JWT is created or updated , and session callback when useSession() or getSession() is invoked in files
    async session({ session, user, trigger, token }: any) {
      // Set the userId from the token(it comes in token by default)
      session.user.id = token.sub;
      //since we want to explicitly send the user.role to session callback too and we are already adding it custom in jwt callback
      session.user.role = token.role;
      session.user.name = token.name;
      //If there is an update , then update the username(user can update its name)
      if (trigger === "update") session.user.name = user.name;
      return session;
    },
    async jwt({ session, user, trigger, token }: any) {
      //Use to add any further user info to the JWT

      if (user) {
        token.role = user.role;

        //If no username present then first email word is treated as name(No name condition can be occured in case of Google provider or any case ehrer name is not mandatory)
        if (user.name === "NO_NAME") {
          token.name = user.email!.split("@")[0];

          //Update database with this name too
          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name },
          });
        }
      }
      return token;
    },
    ...authConfig.callbacks,
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
