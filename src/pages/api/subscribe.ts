import { query as qr } from "faunadb";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { type } from "os";
import { faunaClient } from "../../services/fauna";
import { stripe } from "../../services/stripe";

type User = {
  ref: {
    id: string;
  },
  data: {
    stripe_customer_id: string;
  }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const session = await getSession({ req });

    if (!session?.user?.email) return res.status(401).end('Unauthorized');

    const user = await faunaClient.query<User>(
      qr.Get(
        qr.Match(
          qr.Index('user_by_email'),
          qr.Casefold(session.user.email)
        )
      )
    );

    let customerId = user.data.stripe_customer_id;

    if (!customerId) {
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email,
      });
      
      await faunaClient.query(
        qr.Update(
          qr.Ref(qr.Collection('users'), user.ref.id),
          {
            data: {
              stripe_customer_id: stripeCustomer.id,
            }
          }
        )
      );

      customerId = stripeCustomer.id;
    }

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      line_items: [
        { price: 'price_1M7RI8HRlVMCYkSYYdQn9nkx', quantity: 1 }
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL || '',
      cancel_url: process.env.STRIPE_CANCEL_URL || '',
    });

    return res.status(200).json({ sessionId: stripeCheckoutSession.id });
  }
  else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method not allowed');
  }
}
