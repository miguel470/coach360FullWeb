"use client";
import { useState } from "react";
import getUserId from "@/lib/getUserId";
import addExercise from "../utils/addExercise";

const Exercise: React.FC<{ onExerciseAdded: () => void }> = ({
  onExerciseAdded,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [exerciseData, setExerciseData] = useState({
    title: "",
    description: "",
    type: "",
    img: null,
    trainings: null,
    creator_id: null,
    usersFav: null,
  });

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setExerciseData({
      ...exerciseData,
      [name]: value,
    });
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    const id = await getUserId();
    if (file) {
      setExerciseData({
        ...exerciseData,
        img: file,
        creator_id: id,
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const success = await addExercise(exerciseData);
    if (success) {
      onExerciseAdded();
      setShowModal(false);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <div>
      <button
        onClick={toggleModal}
        className="custom-button ml-2 md:ml-0 lg:ml-0"
      >
        Añadir ejercicio
      </button>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
            <span
              className="absolute top-0 right-0 p-2 cursor-pointer"
              onClick={toggleModal}
            >
              &times;
            </span>
            <h2 className="text-2xl font-bold mb-4">Añadir ejercicio</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Título del ejercicio
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Título del ejercicio"
                  className="block w-full p-2 border border-gray-300 rounded"
                  value={exerciseData.title}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Descripción
                </label>
                <input
                  type="text"
                  name="description"
                  placeholder="Descripción"
                  className="block w-full p-2 border border-gray-300 rounded"
                  value={exerciseData.description}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Tipo
                </label>
                <select
                  name="type"
                  value={exerciseData.type}
                  onChange={handleChange}
                  className="block w-full p-2 border border-gray-300 rounded"
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
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Imagen
                </label>
                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  className="block w-full p-2 border border-gray-300 rounded"
                  onChange={handleImageChange}
                />
              </div>
              <div className="flex flex-row-reverse">
                <button type="submit" className="custom-button ml-3">
                  Añadir
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="custom-button-2"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exercise;
