import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Apple from "next-auth/providers/apple";
import Credentials from "next-auth/providers/credentials";

// Admin emails that have full admin access
const ADMIN_EMAILS = [
  "admin@cwl.org",
  // Add more admin emails here
];

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Apple({
      clientId: process.env.APPLE_CLIENT_ID,
      clientSecret: process.env.APPLE_CLIENT_SECRET,
    }),
    // Demo credentials provider for testing without OAuth setup
    Credentials({
      name: "Demo Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Demo login: admin@cwl.org / admin123
        if (
          credentials?.email === "admin@cwl.org" &&
          credentials?.password === "admin123"
        ) {
          return {
            id: "admin-001",
            name: "Quản Trị Viên",
            email: "admin@cwl.org",
            image: null,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.email) {
        token.role = ADMIN_EMAILS.includes(user.email) ? "admin" : "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as unknown as Record<string, unknown>).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  trustHost: true,
});
