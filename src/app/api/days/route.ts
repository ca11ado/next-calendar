import { NextResponse } from "next/server";
import { get } from "@vercel/edge-config";

export async function GET() {
  try {
    const events = await get("events");
    return NextResponse.json(events || []);
  } catch (error) {
    console.error("Failed to get value from Edge Config:", error);
    return NextResponse.json([]);
  }
}
