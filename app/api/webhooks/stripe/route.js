import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

// Stripe requires the raw body for signature verification.
export async function POST(request) {
  const stripe = getStripe();
  const admin = getSupabaseAdmin();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !secret || !admin) {
    return NextResponse.json({ received: true, skipped: true });
  }

  const sig = request.headers.get("stripe-signature");
  const raw = await request.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (err) {
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const s = event.data.object;
    await admin.from("purchases").insert({
      memorial_id: s.metadata?.memorial_id || null,
      type: s.metadata?.type || "gift",
      amount_cents: s.amount_total ?? null,
      currency: s.currency || "zar",
      buyer_name: s.metadata?.buyer_name || null,
      buyer_email: s.customer_details?.email || null,
      message: s.metadata?.message || null,
      stripe_session_id: s.id,
      status: "paid",
    });
  }

  return NextResponse.json({ received: true });
}
