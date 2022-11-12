import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

import { query as qr } from "faunadb";

import { faunaClient } from "../../../services/fauna";

const clientId = process.env.GITHUB_ID as string;
const clientSecret = process.env.GITHUB_SECRET as string;

 interface signInProps {
  user: {
    email: string;
  };
  account: {
    provider: string;
  };
  profile: {
    email: string;
  };
}

if (!clientId || !clientSecret) throw new Error("Missing GitHub credentials");

export default NextAuth({
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
  callbacks: {
    async signIn({ user, account, profile }: signInProps) {
      const { email } = user;
      try {
        await faunaClient.query(
          qr.Create(qr.Collection("users"), {
            data: { email },
          })
        );
        return true;
      }
      catch (error) {
        console.log(error);
        return false;
      }
    }
  }
});
