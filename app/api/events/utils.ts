import { nanoid } from "nanoid";
import sanitizeHtml from "sanitize-html";
import { REQUIRED_EVENT_KEYS } from "@/config";
import { Event, EventData } from "@/domains/events/types/Event";

export const requiredKeys = REQUIRED_EVENT_KEYS;

export const areRequiredKeysPresented = (eventData: EventData): boolean => {
  return requiredKeys.every((requiredKey) =>
    Object.keys(eventData).some((eventKey) => eventKey === requiredKey)
  );
};

export const findEventWithMissingProperties = (
  events: EventData[]
): EventData | undefined => {
  return events.find((event) => !areRequiredKeysPresented(event));
};

const generateId = (): string => {
  return nanoid(20);
};

export const sanitizeEventData = (eventData: EventData): EventData => {
  // Фильтрация данных, чтобы удалить нежелательные символы или потенциально опасный код
  const sanitizedName = sanitizeHtml(eventData.name);
  const sanitizedDescription = sanitizeHtml(eventData.description);

  return {
    ...eventData,
    name: sanitizedName,
    description: sanitizedDescription,
  };
};

export const prepareEvent = (eventData: EventData): Event => {
  const sanitizedData = sanitizeEventData(eventData); // Фильтрация данных с помощью sanitizeHtml
  const event = { ...sanitizedData, id: generateId() };
  return event;
};

export const prepareEvents = (events: EventData[]): Event[] => {
  return events.map(prepareEvent);
};
