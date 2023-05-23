"use client";
import React from "react";
import { useEventForm } from "./hooks/useEventForm";

const EventForm: React.FC = () => {
  const {
    name,
    setName,
    description,
    setDescription,
    date,
    setDate,
    time,
    setTime,
    handleSubmit,
  } = useEventForm();

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
      <div className="flex mb-4">
        <div className="w-1/2 mr-2">
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
        <div className="w-1/2 ml-2">
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
      </div>
      <button
        type="submit"
        className="bg-primary bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add Event
      </button>
    </form>
  );
};

export default EventForm;
