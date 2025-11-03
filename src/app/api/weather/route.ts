import { NextResponse } from "next/server";
import { getWeatherByLocation } from "@/lib/weather";

export async function POST(req: Request) {
  try {
    // req.json() throws on empty body -> catch and treat as undefined
    let body: unknown = undefined;
    try {
      body = await req.json();
    } catch {
      // empty or invalid JSON; leave body undefined so we return a clear 400 below
      body = undefined;
    }

    const parsed = (body as Record<string, unknown>) ?? {};
    const { lat, lon, location } = parsed as {
      lat?: number;
      lon?: number;
      location?: string;
    };

    let locParam: string | undefined;
    if (location && typeof location === "string") {
      locParam = location;
    } else if (typeof lat === "number" && typeof lon === "number") {
      // assume lexlink accepts "lat,lon" as a location identifier
      locParam = `${lat},${lon}`;
    }

    if (!locParam)
      return NextResponse.json({ error: "Missing location" }, { status: 400 });

    const data = await getWeatherByLocation(locParam);
    if (!data) return NextResponse.json({ error: "No data" }, { status: 502 });
    return NextResponse.json(data);
  } catch (err) {
    console.error("/api/weather error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
