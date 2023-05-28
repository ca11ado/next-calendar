import { EventData } from "@/domains/events/types/Event";
import { URL_ITEM, BASE_URL } from "@/config";

export const getEventItem = async () => {
  try {
    const readItems = await fetch(`${URL_ITEM}/events`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.EDGE_API_TOKEN}`,
      },
    });
    return await readItems.json();
  } catch (error) {
    console.log("get items error", error);
  }
};

export const addItems = async (addedEvents: EventData[]) => {
  try {
    return fetch(`${BASE_URL}/api/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        operation: "write",
        events: addedEvents,
      }),
    });
  } catch (error) {
    console.log("[addItems]: ", error);
  }
};
