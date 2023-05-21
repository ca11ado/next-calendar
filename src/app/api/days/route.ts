import { NextResponse } from "next/server";
import { get } from "@vercel/edge-config";
import { EVENTS_KEY } from "@/config";

export async function GET() {
  try {
    const events = await get(EVENTS_KEY);
    return NextResponse.json(events || []);
  } catch (error) {
    console.error("Failed to get value from Edge Config:", error);
    return NextResponse.json({ error });
  }
}
