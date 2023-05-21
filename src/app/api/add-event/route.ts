import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import sanitizeHtml from "sanitize-html";
import { nanoid } from "nanoid";
import { getItems } from "@/components/Dashboard/api/addItem";
import { getUser } from "@/components/Dashboard/api/checkAuth";

type Event = {
  id: string;
  name: string;
  description: string;
};

type EventData = Exclude<Event, "id">;

const generateId = (): string => {
  // Ваша логика для генерации уникального ID
  // Например, использование UUID
  return nanoid(20);
};

const prepareEvent = (eventData: EventData): Event => {
  const sanitizedData = sanitizeEventData(eventData); // Фильтрация данных с помощью sanitizeHtml

  // Ваша логика для сохранения события в базе данных
  // Например, использование ORM или другой библиотеки для работы с базой данных

  const event = { ...sanitizedData, id: generateId() };
  return event;
};

const sanitizeEventData = (eventData: EventData): EventData => {
  // Фильтрация данных, чтобы удалить нежелательные символы или потенциально опасный код
  const sanitizedName = sanitizeHtml(eventData.name);
  const sanitizedDescription = sanitizeHtml(eventData.description);

  return {
    ...eventData,
    name: sanitizedName,
    description: sanitizedDescription,
  };
};

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  // TODO check authorization!!! Common module with all methods
  const user = await getUser();

  if (!user) {
    return NextResponse.json({}, { status: 401 });
  }

  const eventData: Event = req.body;

  const items = await getItems();
  console.log(">>>>>", items);

  // Вызов функции для добавления события в базу данных
  let event;
  try {
    event = prepareEvent(eventData);
  } catch (e) {
    console.log("Something wrong with event", e);
    return NextResponse.json({}, { status: 400 });
  }

  return NextResponse.json(event);
}
