import Stripe from "stripe";

let stripe;

/** Returns a configured Stripe client, or null if no secret key is set. */
export function getStripe() {
  if (stripe) return stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  stripe = new Stripe(key, { apiVersion: "2024-06-20" });
  return stripe;
}

export const SUPPORT_LABELS = {
  flowers: "Floral Tribute",
  grocery: "Grocery Support",
  meals: "Meal Support",
  meal: "Meal Support",
  funeral: "Funeral Contribution",
  gift: "Family Tribute Gift",
  candle: "Candle of Remembrance",
  book: "Remembrance Book",
};
