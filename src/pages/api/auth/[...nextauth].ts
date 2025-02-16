/* eslint-disable no-console */
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export default NextAuth({
  // Define authentication providers
  providers: [
    // Credentials provider for traditional email/password login
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
          console.error(`No user found with email: ${email}`);
          throw new Error("No user found");
        }

        // If no password is set, advise to use OAuth or set a password
        if (!user.password) {
          console.error(`User ${email} has no password set`);
          throw new Error("Please use OAuth login or set password first");
        }

        // Validate password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          console.error(`Invalid password for user ${email}`);
          throw new Error("Invalid password");
        }

        // Return user object for NextAuth (only required fields)
        return { id: user._id.toString(), email: user.email, name: user.name };
      },
    }),
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // GitHub OAuth Provider
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],

  // Customize the sign-in page
  pages: {
    signIn: "/auth/signin",
  },

  // Use JWT strategy for sessions
  session: {
    strategy: "jwt",
  },

  // Set secret for NextAuth
  secret: process.env.NEXTAUTH_SECRET,

  // Callbacks to extend token and session, and handle sign in logic
  callbacks: {
    /**
     * JWT Callback: Add user ID to the token on first sign in.
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    /**
     * Session Callback: Expose the user ID in the session.
     */
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },

    /**
     * signIn Callback: For OAuth sign ins, check if the user exists.
     * If not, create a new user.
     */
    async signIn({ user, account, profile }) {
      if (account?.provider !== "credentials") {
        await dbConnect();
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          // Create new user if one does not exist
          const newUser = await User.create({
            name: user.name || profile?.name || "No Name",
            email: user.email,
          });
          user.id = newUser._id.toString();
          console.info(`Created new user with email: ${user.email}`);
        } else {
          user.id = existingUser._id.toString();
          console.info(`Existing user found with email: ${user.email}`);
        }
      }
      return true;
    },
  },
});
