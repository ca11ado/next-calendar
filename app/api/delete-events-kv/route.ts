import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { getUser } from "@/domains/events/features/dashboard/api/checkAuth";
import { EVENTS_KEY } from "@/config";
import { WrongClientData } from "@/domains/events/utils/errors";
import { Event } from "@/domains/events/types/Event";

export async function POST(request: Request) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({}, { status: 401 });
  }

  try {
    const { ids } = await request.json();
    if (!ids) {
      throw new WrongClientData(`ids should be specified`);
    }
    const eventsInBD: Event[] = await kv.lrange(EVENTS_KEY, 0, -1);
    const deletedEvents = eventsInBD.filter((event) =>
      ids.find((id: string) => event.id === id)
    );
    if (!deletedEvents.length) {
      throw new WrongClientData(`Events were not found`, 404);
    }
    await Promise.all(
      deletedEvents.map((deletedEvent) => kv.lrem(EVENTS_KEY, 0, deletedEvent))
    );
    return NextResponse.json({ status: "ok" });
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
