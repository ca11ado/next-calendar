import { BASE_URL } from "@/config";
import axios from "axios";

export interface ApiResponse<T> {
  data: T;
  message: string;
}

export const apiClient = axios.create({
  baseURL: BASE_URL,
});
