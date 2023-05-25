import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import sanitizeHtml from "sanitize-html";
import { nanoid } from "nanoid";
import { getUser } from "@/domains/events/features/dashboard/api/checkAuth";
import { Event } from "@/domains/events/types/Event";
import { EVENTS_KEY } from "@/config";
import { REQUIRED_EVENT_KEYS } from "@/config";
import { WrongClientData } from "@/domains/events/utils/errors";

type EventData = Exclude<Event, "id">;

const requiredKeys = REQUIRED_EVENT_KEYS;

const generateId = (): string => {
  return nanoid(20);
};

const prepareEvent = (eventData: EventData): Event => {
  const sanitizedData = sanitizeEventData(eventData); // Фильтрация данных с помощью sanitizeHtml
  const event = { ...sanitizedData, id: generateId() };
  return event;
};

const sanitizeEventData = (eventData: EventData): EventData => {
  // Фильтрация данных, чтобы удалить нежелательные символы или потенциально опасный код
  const sanitizedName = sanitizeHtml(eventData.name);
  const sanitizedDescription = sanitizeHtml(eventData.description);

  return {
    ...eventData,
    name: sanitizedName,
    description: sanitizedDescription,
  };
};

const prepareEvents = (events: EventData[]): Event[] => {
  return events.map(prepareEvent);
};

const areRequiredKeysPresented = (eventData: EventData): boolean => {
  return requiredKeys.every((requiredKey) =>
    Object.keys(eventData).some((eventKey) => eventKey === requiredKey)
  );
};

const findEventWithMissingProperties = (
  events: EventData[]
): EventData | undefined => {
  return events.find((event) => !areRequiredKeysPresented(event));
};

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
