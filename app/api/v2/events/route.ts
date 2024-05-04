import { QueryResultRow, sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET() {
  const { rows } = await sql`SELECT * from events`;
  const events: QueryResultRow[] = rows;
  return NextResponse.json({ status: "ok", events });
}
