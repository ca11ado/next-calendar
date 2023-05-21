import { NextResponse } from "next/server";
import { get } from "@vercel/edge-config";
import { EVENTS_KEY } from "@/config";

// FIXME: https://stackoverflow.com/questions/76285120/error-dynamic-server-usage-headers-on-next-13-4
// безо всякой причины стала генериться ошибка для этой страницы, удалось поправить только добавлением этого экспорта
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const events = await get(EVENTS_KEY);
    return NextResponse.json(events || []);
  } catch (error) {
    console.error("Failed to get value from Edge Config:", error);
    return NextResponse.json({ error });
  }
}
