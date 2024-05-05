import { User } from "@/domains/events/features/dashboard/types/User";
import { headers } from "next/headers";

export async function checkAuthUser() {
  const tokens: User[] = [
    {
      id: "1",
      name: "admin",
      token: process.env.AUTH_TOKEN_ADMIN!,
      rights: ["all"],
    },
  ];
  const authToken = headers().get("authorization");
  return !!(
    authToken &&
    Array.isArray(tokens) &&
    tokens.some((user) => authToken.includes(user.token))
  );
}
