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

interface sessionProps {
  session: {
    user: {
      email: string;
    };
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
    async session({ session }: sessionProps) {
      try {
        const userActiveSubscription = await faunaClient.query(
          qr.Get(
            qr.Intersection([
              qr.Match(
                qr.Index('subscription_by_user_ref'),
                qr.Select(
                  "ref",
                  qr.Get(
                    qr.Match(
                      qr.Index('user_by_email'),
                      qr.Casefold(session.user.email)
                    )
                  )
                )
              ),
              qr.Match(
                qr.Index('subscription_by_status'),
                'active'
              )
            ])
          )
        );
        return {
          ...session,
          activeSubscription: userActiveSubscription
        }
      }
      catch (error) {
        return {
          ...session,
          activeSubscription: null
        }
      }
    },
    async signIn({ user, account, profile }: signInProps) {
      const { email } = user;
      try {
        await faunaClient.query(
          qr.If(
            qr.Not(
              qr.Exists(
                qr.Match(
                  qr.Index('user_by_email'),
                  qr.Casefold(user.email)
                )
              )
            ),
            qr.Create(
              qr.Collection('users'),
              { data: { email } }
            ),
            qr.Get(
              qr.Match(
                qr.Index('user_by_email'),
                qr.Casefold(user.email)
              )
            )
          )
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
