import { NextResponse } from "next/server";
import { getStripe, SUPPORT_LABELS } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

// Map non-monetary support types to a simple acknowledgement flow.
const NON_MONETARY = new Set(["candle", "prayer", "book"]);

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { memorialId, slug, type, amount, buyerName, buyerEmail, message } = body;

  if (!memorialId || !type) {
    return NextResponse.json({ error: "Missing details." }, { status: 400 });
  }

  const stripe = getStripe();
  const admin = getSupabaseAdmin();

  // Record the intent regardless of payment configuration (best-effort).
  if (admin) {
    await admin.from("purchases").insert({
      memorial_id: memorialId,
      type: NON_MONETARY.has(type) ? "candle" : type,
      amount_cents: amount ? Math.round(amount * 100) : null,
      currency: "zar",
      buyer_name: buyerName || null,
      buyer_email: buyerEmail || null,
      message: message || null,
      status: "pending",
    });
  }

  if (!stripe) {
    return NextResponse.json(
      {
        error:
          "Online contributions are being set up for this memorial. Your details have been noted — the family will be in touch.",
      },
      { status: 200 }
    );
  }

  const base = process.env.NEXT_PUBLIC_BASE_URL || new URL(request.url).origin;
  const label = SUPPORT_LABELS[type] || "Memorial Contribution";
  const cents = amount ? Math.round(amount * 100) : 0;

  if (!cents) {
    return NextResponse.json(
      { error: "Please choose a contribution amount." },
      { status: 400 }
    );
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "zar",
            product_data: { name: `${label} — in memory` },
            unit_amount: cents,
          },
          quantity: 1,
        },
      ],
      customer_email: buyerEmail || undefined,
      success_url: `${base}/${slug || ""}?support=success`,
      cancel_url: `${base}/${slug || ""}?support=cancelled`,
      metadata: {
        memorial_id: memorialId,
        type,
        buyer_name: buyerName || "",
        message: message || "",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Could not start checkout." },
      { status: 500 }
    );
  }
}
