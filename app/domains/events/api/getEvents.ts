import { BASE_URL } from "@/config";

export async function getEvents() {
  try {
    const headers = new Headers({
      Authorization: `Bearer ${process.env.AUTH_TOKEN_ADMIN}`,
    });
    const response = await fetch(`${BASE_URL}/api/v2/events`, {
      method: "GET",
      headers,
    });
    const responseData = await response.json();
    if (responseData?.error) {
      throw new Error(`Something wrong: ${responseData.error}`);
    }
    const { data: events } = responseData;
    return events || [];
  } catch (error) {
    throw error;
  }
}
