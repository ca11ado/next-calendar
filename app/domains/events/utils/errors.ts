export class WrongClientData extends Error {
  constructor(message: string, public code?: number) {
    super(message);
    this.name = "WrongClientData";
    this.code = code;
  }
}
