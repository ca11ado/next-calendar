import { NextResponse } from "next/server";

type Middleware = () => Promise<NextResponse>;

export const withMiddlewares = (
  middlewares: Array<Middleware>
): Promise<NextResponse> => {
  return middlewares[0]();
};
