import { WrongClientData } from "@/domains/events/utils/errors";

type HandleErrorResponse = {
  error: string;
  status: number;
};

export const handleRequestError = (error: unknown): HandleErrorResponse => {
  if (error instanceof WrongClientData || error instanceof SyntaxError) {
    return {
      error: error.message,
      status: error instanceof WrongClientData && error.code ? error.code : 400,
    };
  }
  return { error: "Internal error", status: 500 };
};
