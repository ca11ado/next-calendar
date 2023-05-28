import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { EVENTS_KEY } from "@/config";
import { Event, EventData } from "@/domains/events/types/Event";
import { handleRequestError } from "@/utils/server/handleRequestError";
import { getUser } from "@/domains/events/features/dashboard/api/checkAuth";
import { WrongClientData } from "@/domains/events/utils/errors";
import {
  findEventWithMissingProperties,
  prepareEvents,
  requiredKeys,
} from "@/api/events/utils";

export async function GET() {
  try {
    const events: Event[] = await kv.lrange(EVENTS_KEY, 0, -1);
    return NextResponse.json({ status: "ok", events });
  } catch (e) {
    const { error, status } = handleRequestError(e);
    return NextResponse.json({ error }, { status });
  }
}

const SUPPORTED_OPERATIONS = ["write", "delete", "delete-all"] as const;
type SupportedOperation = typeof SUPPORTED_OPERATIONS[number];
type RequestBodyCommon = {
  operation: SupportedOperation;
};
type RequestBodyWrite = RequestBodyCommon & {
  operation: "write";
  events: EventData[];
};
type RequestBodyDelete = RequestBodyCommon & {
  operation: "delete";
  events: Event["id"][];
};
type RequestBodyDeleteAll = RequestBodyCommon & {
  operation: "delete-all";
  events: never;
};
type RequestBody = RequestBodyWrite | RequestBodyDelete | RequestBodyDeleteAll;
export async function POST(request: Request) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({}, { status: 401 });
  }

  try {
    const requestBody: RequestBody = await request.json();
    const { operation, events } = requestBody;

    if (!SUPPORTED_OPERATIONS.includes(operation)) {
      throw new WrongClientData("Not supported operation");
    }

    switch (operation) {
      case "delete": {
        if (!events) {
          throw new WrongClientData(`ids should be specified`);
        }
        const eventsInBD: Event[] = await kv.lrange(EVENTS_KEY, 0, -1);
        const deletedEvents = eventsInBD.filter((event) =>
          events.find((eventId) => event.id === eventId)
        );
        if (!deletedEvents.length) {
          throw new WrongClientData(`Events were not found`, 404);
        }
        await Promise.all(
          deletedEvents.map((deletedEvent) =>
            kv.lrem(EVENTS_KEY, 0, deletedEvent)
          )
        );
        return NextResponse.json({ status: "ok" });
      }
      case "delete-all": {
        await kv.del(EVENTS_KEY);
        return NextResponse.json({ status: "ok" });
      }
      case "write": {
        if (!events) {
          throw new WrongClientData(
            `Empty '${EVENTS_KEY}' array in request body`
          );
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
      }
    }
  } catch (e) {
    const { error, status } = handleRequestError(e);
    return NextResponse.json({ error }, { status });
  }
}
