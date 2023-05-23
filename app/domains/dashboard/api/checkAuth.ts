import { User } from "@/app/domains/dashboard/types/User";
import { get } from "@vercel/edge-config";
import { cookies } from "next/headers";

export async function getUser() {
  const tokens = await get<Array<User>>("users");
  const cookieToken = cookies().get("cl-token")?.value;
  return !!(
    Array.isArray(tokens) && tokens.some((user) => user?.token === cookieToken)
  );
}
