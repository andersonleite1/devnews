import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

const clientId = process.env.GITHUB_ID as string;
const clientSecret = process.env.GITHUB_SECRET as string;

if (!clientId || !clientSecret) throw new Error("Missing GitHub credentials");

export const authOptions = {
  providers: [
    GithubProvider({
      clientId,
      clientSecret,
      authorization: {
        params: {
          scope: 'read:user,user:email'
        }
      }
    }),
  ],
};

export default NextAuth(authOptions);
