import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { getUser } from "@/domains/events/features/dashboard/api/checkAuth";
import { EVENTS_KEY } from "@/config";
import { WrongClientData } from "@/domains/events/utils/errors";

export async function POST() {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({}, { status: 401 });
  }

  try {
    await kv.del(EVENTS_KEY);
    return NextResponse.json({ status: "ok" });
  } catch (error) {
    if (error instanceof WrongClientData || error instanceof SyntaxError) {
      return NextResponse.json(
        { error: error.message },
        {
          status:
            error instanceof WrongClientData && error.code ? error.code : 400,
        }
      );
    }

    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
