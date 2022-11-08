import Stripe from "stripe";

const stripeApiKey = process.env.NEXT_PUBLIC_STRIPE_API_KEY || "";

export const stripe = new Stripe(
  stripeApiKey,
  {
    apiVersion: "2022-11-15",
    appInfo: {
      name: "devnews",
      version: "0.1.0",
    },
  }
);
