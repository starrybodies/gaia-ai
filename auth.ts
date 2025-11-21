import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        // Simple demo authentication - in production, validate against database
        const validUsers = [
          { id: "1", username: "admin", password: "gaia2025", name: "Admin", email: "admin@gaia.ai" },
          { id: "2", username: "demo", password: "demo", name: "Demo User", email: "demo@gaia.ai" },
          { id: "3", username: "hacker", password: "c4pher", name: "Cypherpunk", email: "hacker@gaia.ai" },
        ];

        const user = validUsers.find(
          (u) =>
            u.username === credentials.username &&
            u.password === credentials.password
        );

        if (user) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/demo");

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }

      return true;
    },
  },
});
