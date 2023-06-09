import { BASE_URL } from "@/config";

export async function getEvents() {
  try {
    const response = await fetch(`${BASE_URL}/api/get-events-kv`);
    if (!response.ok) {
      throw new Error("Something wrong");
    }
    const { events } = await response.json();
    return events || [];
  } catch (error) {
    throw error;
  }
}
