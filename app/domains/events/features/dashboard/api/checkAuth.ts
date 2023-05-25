import { User } from "@/domains/events/features/dashboard/types/User";
import { cookies } from "next/headers";

export async function getUser() {
  const tokens: User[] = [
    {
      id: "1",
      name: "admin",
      token: process.env.AUTH_TOKEN_ADMIN!,
      rights: ["all"],
    },
  ];
  const cookieToken = cookies().get("cl-token")?.value;
  return !!(
    Array.isArray(tokens) && tokens.some((user) => user?.token === cookieToken)
  );
}
