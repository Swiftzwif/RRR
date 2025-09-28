import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = body.email || (await req.formData().then((f)=>f.get("email"))) || "";
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "email_required" }, { status: 400 });
    }

    const provider = process.env.EMAIL_PROVIDER || "convertkit";

    if (provider === "mailchimp") {
      const MC_API_KEY = process.env.MAILCHIMP_API_KEY;
      const MC_SERVER_PREFIX = process.env.MAILCHIMP_DC; // e.g. us21
      const MC_LIST_ID = process.env.MAILCHIMP_LIST_ID;
      if (MC_API_KEY && MC_SERVER_PREFIX && MC_LIST_ID) {
        const res = await fetch(`https://${MC_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${MC_LIST_ID}/members`, {
          method: "POST",
          headers: {
            Authorization: `apikey ${MC_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email_address: email, status: "subscribed" }),
        });
        if (!res.ok) {
          const t = await res.text();
          console.error("mailchimp_error", t);
        }
      }
    } else {
      const CK_API_KEY = process.env.CONVERTKIT_API_KEY;
      const CK_FORM_ID = process.env.CONVERTKIT_FORM_ID;
      if (CK_API_KEY && CK_FORM_ID) {
        const res = await fetch("https://api.convertkit.com/v3/forms/" + CK_FORM_ID + "/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ api_key: CK_API_KEY, email }),
        });
        if (!res.ok) {
          const t = await res.text();
          console.error("convertkit_error", t);
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

