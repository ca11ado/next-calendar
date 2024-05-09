import { Event } from "@/domains/events/types/Event";
import { ApiResponse, apiClient } from "@/utils/apiClient";
import { AxiosResponse } from "axios";

export async function getEvents() {
  try {
    const response: AxiosResponse<ApiResponse<Event[]>> = await apiClient.get(
      "/api/v2/events",
      {
        headers: {
          Authorization: `Bearer ${process.env.AUTH_TOKEN_ADMIN}`,
        },
      }
    );
    const { data: events } = response.data;
    return events || [];
  } catch (error) {
    throw error;
  }
}
