import { NextResponse } from "next/server";
import sanitizeHtml from "sanitize-html";
import { nanoid } from "nanoid";
import {
  addItems,
  getEventItem,
} from "@/domains/events/features/dashboard/api/events";
import { getUser } from "@/domains/events/features/dashboard/api/checkAuth";
import { Event } from "@/domains/events/types/Event";

type EventData = Exclude<Event, "id">;

const generateId = (): string => {
  // Ваша логика для генерации уникального ID
  // Например, использование UUID
  return nanoid(20);
};

const prepareEvent = (eventData: EventData): Event => {
  // TODO check for valid data, time and etc...
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

export async function POST(request: Request) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({}, { status: 401 });
  }

  const eventData = await request.json();

  const items = await getEventItem();

  // Вызов функции для добавления события в базу данных
  let event;
  try {
    event = prepareEvent(eventData);
    await addItems([event]);
    console.log("event", event);
  } catch (e) {
    console.log("Something wrong with event", e);
    return NextResponse.json({}, { status: 400 });
  }

  return NextResponse.json(event);
}
