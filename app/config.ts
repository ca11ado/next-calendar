/* API */
export const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}`;

export const URL_ITEM = `${process.env.EDGE_API_URL}/${process.env.EDGE_CONFIG_ID}/item`;
export const URL_ITEMS = `${process.env.EDGE_API_URL}/${process.env.EDGE_CONFIG_ID}/items`;

/* ITEMS */
export const EVENTS_KEY = "events";
export const REQUIRED_EVENT_KEYS = ["date", "name", "description"];
