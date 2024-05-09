import { useState, FormEvent } from "react";
import { addItems } from "@/domains/events/features/dashboard/api/events";

export const useEventForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [type, setType] = useState("");
  const [tags, setTags] = useState([""]);
  const [time, setTime] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Проверка, что данные не пустые
    if (!name || !description || !startDate || !endDate || !time) {
      alert("Please enter name, description, date, and time");
      return;
    }

    // Отправка данных на сервер
    try {
      const response = await addItems([
        { name, description, start_at: startDate, end_at: endDate, tags, type },
      ]);

      if (!response?.ok) {
        throw new Error("Failed to add event");
      }

      // Очистка полей формы после успешной отправки
      setName("");
      setDescription("");
      setStartDate("");
      setEndDate("");
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
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    type,
    setType,
    tags,
    setTags,
    time,
    setTime,
    handleSubmit,
  };
};
