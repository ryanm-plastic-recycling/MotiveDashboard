import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { env } from "@/lib/env";

const handler = NextAuth({
  secret: env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        if (!env.AUTH_ENABLED) return { id: "demo", name: "Demo", email: "demo@example.com" };
        if (credentials?.email === env.DEMO_USER_EMAIL && credentials?.password === env.DEMO_USER_PASSWORD) {
          return { id: "demo", name: "Demo User", email: credentials.email };
        }
        return null;
      }
    })
  ],
  session: { strategy: "jwt" }
});

export { handler as GET, handler as POST };
