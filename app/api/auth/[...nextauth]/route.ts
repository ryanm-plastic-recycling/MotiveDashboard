import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        if (process.env.AUTH_ENABLED !== "true") return { id: "demo", name: "Demo", email: "demo@example.com" };
        if (credentials?.email === process.env.DEMO_USER_EMAIL && credentials?.password === process.env.DEMO_USER_PASSWORD) {
          return { id: "demo", name: "Demo User", email: credentials.email };
        }
        return null;
      }
    })
  ],
  session: { strategy: "jwt" }
});

export { handler as GET, handler as POST };
