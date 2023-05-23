import { get } from "@vercel/edge-config";
import { EVENTS_KEY } from "@/config";
import { Event } from "@/domains/events/types/Event";

export async function getEvents() {
  try {
    const events = await get<Array<Event>>(EVENTS_KEY);
    return events || [];
  } catch (error) {
    throw error;
  }
}
