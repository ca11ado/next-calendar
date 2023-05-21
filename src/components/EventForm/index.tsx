import React, { useState, FormEvent } from "react";

const EventForm: React.FC = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Проверка, что данные не пустые
    if (!name || !description) {
      alert("Please enter name and description");
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
          body: JSON.stringify({ name, description }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add event: 1");
      }

      // Очистка полей формы после успешной отправки
      setName("");
      setDescription("");
      alert("Event added successfully");
    } catch (error) {
      console.error(error);
      const name = "Failed to add event: 2";
      alert(name);
      console.log(name, error);
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
