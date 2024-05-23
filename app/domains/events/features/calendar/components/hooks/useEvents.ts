import { useState } from "react";
import { Event } from "@/domains/events/types/Event";

export const useEvents = (initialEvents: Event[]) => {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);

  return {
    events,
    setEvents,
    activeEvent,
    setActiveEvent,
  };
};
