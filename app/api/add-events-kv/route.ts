import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { getUser } from "@/domains/events/features/dashboard/api/checkAuth";
import { EVENTS_KEY } from "@/config";
import { WrongClientData } from "@/domains/events/utils/errors";
import {
  findEventWithMissingProperties,
  requiredKeys,
  prepareEvents,
} from "@/api/events/utils";

export async function POST(request: Request) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({}, { status: 401 });
  }

  try {
    const { events } = await request.json();
    if (!events) {
      throw new WrongClientData(`Empty '${EVENTS_KEY}' array in request body`);
    }

    const invalidEvent = findEventWithMissingProperties(events);
    if (invalidEvent) {
      throw new WrongClientData(
        `Some event miss required properties. Required keys: ${requiredKeys.join(
          ", "
        )}`
      );
    }
    const addedEvents = prepareEvents(events);
    await Promise.all(
      addedEvents.map((addedEvent) => kv.rpush(EVENTS_KEY, addedEvent))
    );
    const kvResponse = await kv.lrange(EVENTS_KEY, 0, -1);
    return NextResponse.json({ events: kvResponse });
  } catch (error) {
    console.log(error);

    if (error instanceof WrongClientData || error instanceof SyntaxError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
