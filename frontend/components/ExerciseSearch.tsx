import React, { useState } from "react";

const ExerciseSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("title");

  const typeOptions = [
    "Tiros",
    "Pases",
    "Regates",
    "Defensa",
    "Táctica",
    "Condición Física",
  ];

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectChange = (e) => {
    setSearchField(e.target.value);
    setSearchTerm("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ searchField, searchTerm: searchTerm.trim() });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-4 flex flex-nowrap items-center text-black space-x-2 w-full"
    >
      <div className="flex-grow">
        <select
          id="searchField"
          value={searchField}
          onChange={handleSelectChange}
          className="border border-gray-300 rounded-md p-2 w-full bg-transparent"
        >
          <option value="title">Título</option>
          <option value="type">Tipo</option>
        </select>
      </div>
      <div className="flex-grow">
        {searchField === "type" ? (
          <select
            value={searchTerm}
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-2 w-full bg-transparent"
          >
            <option value="">Seleccione un tipo</option>
            {typeOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            value={searchTerm}
            onChange={handleChange}
            placeholder={`Buscar por ${searchField}`}
            className="border border-gray-300 rounded-md p-2 w-full bg-transparent placeholder-black"
          />
        )}
      </div>
      <button type="submit" className="custom-button-2 p-2 flex-shrink-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14"
          />
        </svg>
      </button>
    </form>
  );
};

export default ExerciseSearch;
