import React, { useState, useEffect } from "react";
import Pagination from "@/components/Pagination";
import ExerciseSearch from "@/components/ExerciseSearch";
import editExercise from "../utils/editExercise";
import getUserId from "@/lib/getUserId";
import { fetchExercisesFav } from "../utils/getExercisesFavorites";
import { fetchCommunityExercises } from "../utils/getCommunityExercises";

const CombinedExercises = () => {
  const itemsPerPage = 3;
  const [exercises, setExercises] = useState([]);
  const [filteredFavoriteExercises, setFilteredFavoriteExercises] = useState(
    []
  );
  const [filteredCommunityExercises, setFilteredCommunityExercises] = useState(
    []
  );
  const [favoriteExercises, setFavoriteExercises] = useState([]);
  const [currentPageCommunity, setCurrentPageCommunity] = useState(1);
  const [currentPageFavorites, setCurrentPageFavorites] = useState(1);
  const [userId, setUserId] = useState("");
  const [filter, setFilter] = useState({
    type: "",
    title: "",
  });

  const fetchExercises = async () => {
    const exercisesCommunity = await fetchCommunityExercises();
    const id = await getUserId();
    setUserId(id);
    if (!exercisesCommunity.error) {
      setExercises(exercisesCommunity);
      setFilteredCommunityExercises(exercisesCommunity.data);
    }
  };

  const fetchFavorites = async () => {
    const exercisesFavorites = await fetchExercisesFav();
    if (!exercisesFavorites.error) {
      setFavoriteExercises(exercisesFavorites);
      setFilteredFavoriteExercises(exercisesFavorites);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, [userId]);

  useEffect(() => {
    fetchFavorites();
  }, [userId]);

  const handleSearchCommunity = ({ searchField, searchTerm }) => {
    if (
      typeof exercises === "object" &&
      exercises.data &&
      Array.isArray(exercises.data)
    ) {
      let filtered;
      if (searchTerm === "") {
        // Si el término de búsqueda está vacío, mostrar todos los ejercicios
        filtered = exercises.data;
      } else {
        filtered = exercises.data.filter((exercise) => {
          const fieldValue =
            exercise.attributes[searchField] &&
            exercise.attributes[searchField].toLowerCase();
          return fieldValue && fieldValue.includes(searchTerm.toLowerCase());
        });
      }
      setFilteredCommunityExercises(filtered);
      setCurrentPageCommunity(1);
    } else {
      console.error("totalData is not an object with an array of exercises");
    }
  };

  const handleSearchFavorites = ({ searchField, searchTerm }) => {
    if (
      typeof favoriteExercises === "object" &&
      favoriteExercises.length &&
      Array.isArray(favoriteExercises)
    ) {
      let filtered;
      if (searchTerm === "") {
        filtered = favoriteExercises;
      } else {
        filtered = favoriteExercises.filter((exercise) => {
          const fieldValue =
            exercise[searchField] && exercise[searchField].toLowerCase();
          return fieldValue && fieldValue.includes(searchTerm.toLowerCase());
        });
      }
      setFilteredFavoriteExercises(filtered);
      setCurrentPageFavorites(1);
    } else {
      console.error("favoriteExercises is not an array of exercises");
    }
  };

  const handlePageChangeCommunity = (page) => {
    setCurrentPageCommunity(page);
  };

  const handlePageChangeFavorites = (page) => {
    setCurrentPageFavorites(page);
  };

  const handleAddToFavorites = async (exerciseId) => {
    try {
      const exercise = exercises.data.find(
        (exercise) => exercise.id === exerciseId
      );

      if (!exercise || !exercise.attributes) {
        throw new Error("Exercise data not found");
      }

      const currentUsersFav = exercise.attributes.usersFav.data;

      if (currentUsersFav.includes(userId)) {
        console.log("Exercise already in favorites");
        return;
      }

      const updatedUsersFav = [...currentUsersFav, userId];

      const objectUsersFav = {
        usersFav: updatedUsersFav,
      };
      const formData = new FormData();
      formData.append("data", JSON.stringify(objectUsersFav));

      await editExercise(exerciseId, formData);

      console.log("Exercise added to favorites successfully");

      // Después de agregar el ejercicio a favoritos, volver a cargar los ejercicios de la comunidad
      await fetchFavorites();
      await fetchExercises();

      // Filtrar el ejercicio de la lista de ejercicios de la comunidad
      const updatedFilteredExercises = filteredCommunityExercises.filter(
        (ex) => ex.id !== exerciseId
      );
      setFilteredCommunityExercises(updatedFilteredExercises);
    } catch (error) {
      console.error("Error adding exercise to favorites:", error);
    }
  };

  const handleRemoveFromFavorites = async (exerciseId) => {
    try {
      

      // Actualizar la lista de ejercicios favoritos
      const updatedExercises = favoriteExercises.map((exercise) => {
        if (exercise.id === exerciseId) {
          const updatedUsersFav = exercise.usersFav.filter(
            (user) => user.id !== userId
          );
          
          return {
            ...exercise,
            usersFav: updatedUsersFav,
          };
        }
        return exercise;
      });

      

      setFavoriteExercises(updatedExercises);

      // Obtener el ejercicio actualizado
      const updatedExercise = updatedExercises.find(
        (exercise) => exercise.id === exerciseId
      );

      

      // Crear el objeto de datos para actualizar el ejercicio
      const updatedData = {
        data: {
          title: updatedExercise.title,
          description: updatedExercise.description,
          img: updatedExercise.img.id, // Usar el id de la imagen si es necesario
          trainings: updatedExercise.trainings || [], // Asegurarse de incluir trainings si está presente
          creator_id: updatedExercise.creator_id,
          usersFav: updatedExercise.usersFav.map((user) => user.id), // Mapear solo los ids de los usuarios
          type: updatedExercise.type,
        },
      };

      

      // Crear el objeto FormData
      const formData = new FormData();
      formData.append("data", JSON.stringify(updatedData.data));

      // Enviar la solicitud para editar el ejercicio
      await editExercise(exerciseId, formData);

      // Después de eliminar el ejercicio de favoritos, volver a cargar los ejercicios favoritos
      await fetchFavorites();
      await fetchExercises();
    } catch (error) {
      console.error("Error removing exercise from favorites:", error);
    }
  };

  const indexOfLastItemCommunity = currentPageCommunity * itemsPerPage;
  const indexOfFirstItemCommunity = indexOfLastItemCommunity - itemsPerPage;

  const indexOfLastItemFavorites = currentPageFavorites * itemsPerPage;
  const indexOfFirstItemFavorites = indexOfLastItemFavorites - itemsPerPage;

  
  const currentFavoriteExercises = filteredFavoriteExercises.slice(
    indexOfFirstItemFavorites,
    indexOfLastItemFavorites
  );

  const filteredItemsCommunity = filteredCommunityExercises
    .filter(
      (exercise) =>
        !currentFavoriteExercises.find(
          (favExercise) => favExercise.id === exercise.id
        )
    )
    .slice(indexOfFirstItemCommunity, indexOfLastItemCommunity);

  return (
    <div className="flex flex-col sm:flex-row">
      <div className="container bg-exercises shadow-md rounded-md p-6 mt-2 mb-4">
        <h1 className="text-3xl font-semibold mb-4">
          Ejercicios de la comunidad
        </h1>

        {exercises.length > 0 && (
          <ExerciseSearch
            onSearch={handleSearchCommunity}
            className="w-full mb-4"
          />
        )}

        {filteredItemsCommunity.length > 0 ? (
          filteredItemsCommunity.map((exercise) => (
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

                  <button
                    onClick={() => handleAddToFavorites(exercise.id)}
                    className="bg-transparent border border-transparent rounded-full p-1 hover:bg-gray-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 48 48"
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="4"
                        d="M15 8C8.925 8 4 12.925 4 19c0 11 13 21 20 23.326C31 40 44 30 44 19c0-6.075-4.925-11-11-11c-3.72 0-7.01 1.847-9 4.674A10.987 10.987 0 0 0 15 8"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No hay ejercicios en la comunidad.</p>
        )}

        {filteredItemsCommunity.length > 0 && (
          <Pagination
            currentPage={currentPageCommunity}
            totalPages={Math.ceil(
              filteredCommunityExercises.length / itemsPerPage
            )}
            onPageChange={handlePageChangeCommunity}
          />
        )}
      </div>

      <div className="container bg-exercises shadow-md rounded-md p-6 mt-2 mb-4 lg:ml-4 lg:mr-4">
        <h1 className="text-3xl font-semibold mb-4">Ejercicios Favoritos</h1>

        {favoriteExercises.length > 0 && (
          <ExerciseSearch
            onSearch={handleSearchFavorites}
            className="w-full mb-4"
          />
        )}

        {currentFavoriteExercises.length > 0 ? (
          currentFavoriteExercises.map((exercise) => (
            <div key={exercise.id} className="flex mb-4 items-center">
              <div className="flex-shrink-0 w-24 h-24 mr-4">
                <img
                  src={
                    exercise.img.url
                      ? process.env.NEXT_PUBLIC_API_URL + exercise.img.url
                      : ""
                  }
                  alt={exercise.title || ""}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="flex-grow">
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    {exercise.title}
                  </h2>
                  <p className="text-gray-600 mb-2">
                    {exercise.description || "No hay descripción"}
                  </p>
                  <p className="text-gray-600">
                    Tipo: {exercise.type || "No especificado"}
                  </p>

                  <button
                    onClick={() => handleRemoveFromFavorites(exercise.id)}
                    className="bg-transparent border border-transparent rounded-full p-1 hover:bg-red-400 transition duration-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 48 48"
                    >
                      <path
                        fill="currentColor"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="4"
                        d="M15 8C8.925 8 4 12.925 4 19c0 11 13 21 20 23.326C31 40 44 30 44 19c0-6.075-4.925-11-11-11c-3.72 0-7.01 1.847-9 4.674A10.987 10.987 0 0 0 15 8"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No tienes ejercicios en favoritos.</p>
        )}

        {currentFavoriteExercises.length > 0 && (
          <Pagination
            currentPage={currentPageFavorites}
            totalPages={Math.ceil(
              filteredFavoriteExercises.length / itemsPerPage
            )}
            onPageChange={handlePageChangeFavorites}
          />
        )}
      </div>
    </div>
  );
};

export default CombinedExercises;
