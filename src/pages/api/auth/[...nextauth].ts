import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

import { query as qr } from "faunadb";

import { faunaClient } from "../../../services/fauna";

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret : process.env.GITHUB_SECRET as string,
      authorization: {
        params: {
          scope: 'read:user,user:email'
        }
      }
    }),
  ],
  callbacks: {
    async session({ session }) {
      if (!session.user || !session.user.email) {
        return session;
      }
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
    async signIn({ user }) {
      if (!user.email) {
        return false;
      }
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
  },
  secret: process.env.JWT_SECRET,
});
