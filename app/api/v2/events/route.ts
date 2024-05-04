import { checkAuthUser } from "@/domains/events/utils/checkAuthUser";
import { WrongClientData } from "@/domains/events/utils/errors";
import { handleRequestError } from "@/utils/server/handleRequestError";
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const loggedCustomer = await checkAuthUser();
    if (!loggedCustomer) {
      throw new WrongClientData("Not auth", 401);
    }
    const { rows: data } = await sql`SELECT * from events`;
    return NextResponse.json({ status: "ok", data });
  } catch (e) {
    const { error, status } = handleRequestError(e);
    return NextResponse.json({ error }, { status });
  }
}
