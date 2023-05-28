import { useState, FormEvent } from "react";
import { addItems } from "@/domains/events/features/dashboard/api/events";

export const useEventForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Проверка, что данные не пустые
    if (!name || !description || !date || !time) {
      alert("Please enter name, description, date, and time");
      return;
    }

    // Отправка данных на сервер
    try {
      const response = await addItems([{ name, description, date }]);

      if (!response?.ok) {
        throw new Error("Failed to add event");
      }

      // Очистка полей формы после успешной отправки
      setName("");
      setDescription("");
      setDate("");
      setTime("");
      alert("Event added successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to add event");
    }
  };

  return {
    name,
    setName,
    description,
    setDescription,
    date,
    setDate,
    time,
    setTime,
    handleSubmit,
  };
};
