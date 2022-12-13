import { faunaClient } from "../../../services/fauna";
import { query as qr } from "faunadb";
import { stripe } from "../../../services/stripe";

export async function saveSubscription(
  subscriptionId: string,
  customerId: string,
  createAction = false,
) {
  // 1. Search for user in FaunaDB with id {customerId}
  // 2. Save subscription data in FaunaDB
  const userRef = await faunaClient.query(
    qr.Select(
      "ref",
      qr.Get(
        qr.Match(
          qr.Index('user_by_stripe_customer_id'),
          customerId,
        )
      )
    )
  );

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const subscriptionData = {
    id: subscription.id,
    userId: userRef,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
  };

  await faunaClient.query(
    qr.Create(
      qr.Collection('subscriptions'),
      { data: subscriptionData }
    )
  );

}