"use client";
import React, { useState, FormEvent } from "react";

const EventForm: React.FC = () => {
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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/add-event`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, description, date, time }),
        }
      );

      if (!response.ok) {
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

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="mb-4">
        <label htmlFor="name" className="block mb-2">
          Name:
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block mb-2">
          Description:
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2"
        ></textarea>
      </div>
      <div className="mb-4">
        <label htmlFor="date" className="block mb-2">
          Date:
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="time" className="block mb-2">
          Time:
        </label>
        <input
          type="time"
          id="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add Event
      </button>
    </form>
  );
};

export default EventForm;
