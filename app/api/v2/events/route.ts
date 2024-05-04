import { checkAuthUser } from "@/domains/events/utils/checkAuthUser";
import { WrongClientData } from "@/domains/events/utils/errors";
import { handleRequestError } from "@/utils/server/handleRequestError";
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // defaults to auto

export async function GET() {
  try {
    const loggedCustomer = await checkAuthUser();
    if (!loggedCustomer) {
      throw new WrongClientData("Not auth", 401);
    }
    const { rows: data } = await sql`SELECT * from events`;
    return new Response(JSON.stringify({ status: "ok", data }), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json",
      },
    });
  } catch (e) {
    const { error, status } = handleRequestError(e);
    return NextResponse.json({ error }, { status });
  }
}
