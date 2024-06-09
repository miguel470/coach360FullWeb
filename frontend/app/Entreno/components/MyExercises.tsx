"use client";

import React, { useState, useEffect } from "react";
import Pagination from "@/components/Pagination";
import ExerciseSearch from "@/components/ExerciseSearch";
import { deleteExercise } from "../utils/deleteExercise";
import editExercise from "../utils/editExercise";
import Exercise from "./Exercise";
import { fetchExercises } from "../utils/getExercises";

const MyExercises = () => {
  const itemsPerPage = 3;
  const [exercises, setExercises] = useState([]);
  const [totalData, setTotalData] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editExerciseId, setEditExerciseId] = useState();
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    type: "",
    img: null,
    trainings: [],
    creator_id: "",
    users_exercises_fav: [],
  });
  const [filter, setFilter] = useState({
    type: "",
    title: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchExercises();
        setExercises(data.data);
        setFilteredExercises(data.data);
        setTotalData(data);
      } catch (error) {
        console.error("Error fetching exercises:", error);
      }
    }
    fetchData();
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      setEditFormData({
        ...editFormData,
        img: file,
      });
    }
  };

  const handleExerciseAdded = async () => {
    try {
      const data = await fetchExercises();
      setExercises(data.data);
      setFilteredExercises(data.data);
      setTotalData(data);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  };
  const handleSearch = ({ searchField, searchTerm }) => {
    if (
      typeof totalData === "object" &&
      totalData.data &&
      Array.isArray(totalData.data)
    ) {
      let filtered;
      if (searchTerm === "") {
        filtered = totalData.data;
      } else {
        filtered = totalData.data.filter((exercise) => {
          const fieldValue =
            exercise.attributes[searchField] &&
            exercise.attributes[searchField].toLowerCase();
          return fieldValue && fieldValue.includes(searchTerm.toLowerCase());
        });
      }
      setFilteredExercises(filtered);
      setCurrentPage(1);
    } else {
      console.error("totalData is not an object with an array of exercises");
    }
  };

  const handleEditClick = (exerciseId) => {
    const exerciseToEdit = exercises.find(
      (exercise) => exercise.id === exerciseId
    );
    if (exerciseToEdit) {
      setEditFormData({
        title: exerciseToEdit.attributes.title,
        description: exerciseToEdit.attributes.description || "",
        type: exerciseToEdit.attributes.type || "",
      });
      setEditExerciseId(exerciseId);
      setEditModalOpen(true);
    }
  };

  const handleDeleteClick = async (exerciseId) => {
    try {
      await deleteExercise(exerciseId);
      const data = await fetchExercises();
      setExercises(data.data);
      setFilteredExercises(data.data);
      setTotalData(data);
    } catch (error) {
      console.error("Error deleting exercise:", error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const exerciseToEdit = exercises.find(
      (exercise) => exercise.id === editExerciseId
    );

    try {
      const editedExerciseData = {
        title: editFormData.title || exerciseToEdit.attributes.title,
        description:
          editFormData.description || exerciseToEdit.attributes.description,
        type: editFormData.type || exerciseToEdit.attributes.type,
        img:
          editFormData.img || exerciseToEdit.attributes.img.data.attributes.url,
        trainings: exerciseToEdit.attributes.trainings.data,
        creator_id: exerciseToEdit.attributes.creator_id,
        usersFav: exerciseToEdit.attributes.usersFav.data,
      };

      const formData = new FormData();
      formData.append("data", JSON.stringify(editedExerciseData));
      formData.append("files.img", editedExerciseData.img);

      await editExercise(editExerciseId, formData);

      const data = await fetchExercises();
      setExercises(data.data);
      setFilteredExercises(data.data);
      setTotalData(data);
      setEditModalOpen(false);
    } catch (error) {
      console.error("Fallo al editar el ejercicio:", error);
    }
  };

  const updateExerciseLocally = (exerciseId, updatedData) => {
    const updatedExercises = exercises.map((exercise) =>
      exercise.id === exerciseId
        ? { ...exercise, attributes: updatedData }
        : exercise
    );
    setExercises(updatedExercises);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredExercises.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <div className="mt-2">
      <Exercise onExerciseAdded={handleExerciseAdded} />
      <div className="container bg-exercises shadow-md rounded-md p-6 mt-4 mb-2">
        <h1 className="text-3xl font-semibold mb-4">Mis Ejercicios</h1>

        {exercises.length > 0 && <ExerciseSearch onSearch={handleSearch} />}

        {currentItems.length > 0 ? (
          currentItems.map((exercise) => (
            <div key={exercise.id} className="flex mb-4 items-center">
              <div className="flex-shrink-0 w-24 h-24 mr-4">
                <img
                  src={
                    exercise.attributes?.img?.data?.attributes?.url
                      ? process.env.NEXT_PUBLIC_API_URL +
                        exercise.attributes.img.data.attributes.url
                      : ""
                  }
                  alt={exercise.attributes?.title || ""}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              <div className="flex-grow">
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    {exercise.attributes.title}
                  </h2>
                  <p className="text-gray-600 mb-2">
                    {exercise.attributes.description || "No hay descripción"}
                  </p>
                  <p className="text-gray-600">
                    Tipo: {exercise.attributes.type || "No especificado"}
                  </p>
                </div>
                <div className="flex items-center mt-2">
                  <button
                    onClick={() => handleEditClick(exercise.id)}
                    className="mr-2 bg-transparent border border-transparent rounded-full p-1 hover:bg-green-500 transition duration-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M5 19h1.098L16.796 8.302l-1.098-1.098L5 17.902zm-1 1v-2.52L17.18 4.288q.155-.137.34-.212T17.907 4t.39.064q.19.063.35.228l1.067 1.074q.165.159.226.35q.06.19.06
                        .35q0 .204-.068.39q-.069.185-.218.339L6.519 20zM19.02 6.092l-1.112-1.111zm-2.782 1.67l-.54-.558l1.098 1.098z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteClick(exercise.id)}
                    className="bg-transparent border border-transparent rounded-full p-1 hover:bg-red-400 transition duration-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M7 21q-.825 0-1.412-.587T5 19V6q-.425 0-.712-.288T4 5t.288-.712T5 4h4q0-.425.288-.712T10 3h4q.425 0 .713.288T15 4h4q.425 0 .713.288T20 5t-.288.713T19 6v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zm-7 11q.425 0 .713-.288T11 16V9q0-.425-.288-.712T10 8t-.712.288T9 9v7q0 .425.288.713T10 17m4 0q.425 0 .713-.288T15 16V9q0-.425-.288-.712T14 8t-.712.288T13 9v7q0 .425.288.713T14 17M7 6v13z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No tienes ejercicios creados.</p>
        )}
        {currentItems.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredExercises.length / itemsPerPage)}
            onPageChange={handlePageChange}
          />
        )}
        {editModalOpen && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-8 rounded-md">
              <h2 className="text-2xl font-semibold mb-4">Editar Ejercicio</h2>
              <form onSubmit={handleEditSubmit}>
                <div className="mb-4">
                  <label htmlFor="title" className="block font-medium">
                    Título
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={editFormData.title}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="description" className="block font-medium">
                    Descripción
                  </label>
                  <input
                    id="description"
                    type="text"
                    name="description"
                    value={editFormData.description}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="type" className="block font-medium">
                    Tipo
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={editFormData.type}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                  >
                    <option value="">Seleccione tipo</option>
                    <option value="Tiros">Tiros</option>
                    <option value="Pases">Pases</option>
                    <option value="Regates">Regates</option>
                    <option value="Defensa">Defensa</option>
                    <option value="Táctica">Táctica</option>
                    <option value="Condición Física">Condición Física</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="file" className="block font-medium">
                    Imagen
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    id="img"
                    name="img"
                    onChange={handleImageChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="px-4 py-2 custom-button-2 mr-2"
                    onClick={() => setEditModalOpen(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="px-4 py-2 custom-button">
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyExercises;
