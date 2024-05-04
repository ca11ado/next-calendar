// @ts-nocheck
// TODO: add middlewares functional
import { hasKey } from "@/types/utils/hasKey";
import { NextResponse } from "next/server";

type User = {
  id: string;
};
type Context = {
  user: User | null;
};

type Result = {
  data: unknown;
};

const isResult = (ctx: unknown): ctx is Result => {
  try {
    return typeof ctx === "object" && ctx !== null && hasKey("data", ctx);
  } catch (e) {
    return false;
  }
};

type Error = {
  error: unknown;
  status?: number;
};

const isError = (ctx: unknown): ctx is Error => {
  try {
    return typeof ctx === "object" && ctx !== null && hasKey("error", ctx);
  } catch (e) {
    return false;
  }
};

type MiddlewareResult = Context | Result | Error;

export type Middleware = (
  ctx: Context
) => Promise<MiddlewareResult> | MiddlewareResult;

export const processMiddlewares = async (
  middlewares: Middleware[],
  ctx?: Context
) => {
  try {
    const finalResult = await middlewares.reduce((accum, current) => {
      if (isError(accum) || isError(current)) {
        return current;
      }
      if (isContext) {
        // TODO: execute middleware
      }

      if (isResult(newContext)) {
        return NextResponse.json({ status: "ok", data: newContext });
      }
    }, Promise<null>);
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 });
  }
};
