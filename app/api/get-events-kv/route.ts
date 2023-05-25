import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { EVENTS_KEY } from "@/config";
import { WrongClientData } from "@/domains/events/utils/errors";
import { Event } from "@/domains/events/types/Event";

export async function GET() {
  try {
    const events: Event[] = await kv.lrange(EVENTS_KEY, 0, -1);
    return NextResponse.json({ status: "ok", events });
  } catch (error) {
    if (error instanceof WrongClientData || error instanceof SyntaxError) {
      return NextResponse.json(
        { error: error.message },
        {
          status:
            error instanceof WrongClientData && error.code ? error.code : 400,
        }
      );
    }

    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
