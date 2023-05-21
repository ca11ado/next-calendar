import { Event } from "@/types/Event";

const URL_ITEM = `${process.env.EDGE_API_URL}/${process.env.EDGE_CONFIG_ID}/item`;
const URL_ITEMS = `${process.env.EDGE_API_URL}/${process.env.EDGE_CONFIG_ID}/items`;
const EVENTS_KEY = "events";

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

export const addItems = async (addedEvents: Array<Event>) => {
  try {
    const items = await getEventItem();
    const addItems = await fetch(URL_ITEMS, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${process.env.EDGE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [
          {
            operation: "update",
            key: EVENTS_KEY,
            value: [...items.value, ...addedEvents],
          },
        ],
      }),
    });
    const responseJSON = await addItems.json();
    if (!responseJSON.ok) {
      throw new Error("somethiing wrong");
    }
    return responseJSON;
  } catch (error) {
    console.log("[addItems]: ", error);
  }
};
