import { NextResponse } from "next/server";

/**
 * Foreign-exchange rates for the currency-converter reel card.
 *
 * This route exists for one reason: the card runs in the browser, so anything
 * it fetches directly would need a `NEXT_PUBLIC_*` key — which ships in the JS
 * bundle for anyone to read and spend the quota on. The key stays here,
 * server-side, and the card calls this instead.
 *
 * It also narrows the payload. Upstream returns 160-odd currencies; the card
 * uses six, and sending the rest would be ~7 KB of noise on every visit.
 */

/** The card's currencies. Anything outside this list is dropped. */
const CODES = ["PHP", "USD", "EUR", "JPY", "SGD", "AUD"] as const;

/**
 * Upstream publishes once a day (`time_next_update_utc` is ~24h out), so an
 * hour of caching costs nothing in freshness and keeps this to a couple of
 * dozen upstream calls a day no matter how much traffic the landing page sees.
 */
const REVALIDATE_SECONDS = 3600;

type Upstream = {
  result: string;
  time_last_update_unix: number;
  conversion_rates: Record<string, number>;
};

export async function GET() {
  const key = process.env.EXCHANGERATE_API_KEY;
  if (!key) {
    // Deliberately vague to the client, specific in the server log — a 500
    // body is not the place to discuss which secrets a deployment is missing.
    console.error("[api/rates] EXCHANGERATE_API_KEY is not set");
    return NextResponse.json({ error: "rates unavailable" }, { status: 503 });
  }

  try {
    const res = await fetch(
      `https://v6.exchangerate-api.com/v6/${key}/latest/USD`,
      { next: { revalidate: REVALIDATE_SECONDS } },
    );
    if (!res.ok) throw new Error(`upstream ${res.status}`);

    const data = (await res.json()) as Upstream;
    if (data.result !== "success") throw new Error("upstream result not success");

    // Upstream quotes per 1 USD; the card wants pesos per unit, so re-base
    // through PHP. Doing it here means the client never has to know which base
    // the provider happens to use.
    const usd = data.conversion_rates;
    const php = usd.PHP;
    if (!php) throw new Error("upstream missing PHP");

    const rates: Record<string, number> = {};
    for (const code of CODES) {
      const q = usd[code];
      if (typeof q === "number" && q > 0) rates[code] = php / q;
    }

    return NextResponse.json({
      base: "PHP",
      rates,
      updated: data.time_last_update_unix,
    });
  } catch (err) {
    // Never surface `err` to the client: the message can carry the upstream
    // URL, and that URL has the key in its path.
    console.error("[api/rates]", err);
    return NextResponse.json({ error: "rates unavailable" }, { status: 502 });
  }
}
