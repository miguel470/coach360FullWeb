import { getTop5Exercises } from "@/app/Entreno/utils/getTop5Exercises";
import React, { useState, useEffect } from "react";
import editExercise from "@/app/Entreno/utils/editExercise";
import getUserId from "@/lib/getUserId";

const TopExercises = () => {
  const [exercises, setExercises] = useState([]);
  

  const fetchExercises = async () => {
    try {
      const data = await getTop5Exercises();
      setExercises(data);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const handleAddToFavorites = async (exerciseId) => {
    try {
      const exercise = exercises.find((exercise) => exercise.id === exerciseId);

      if (!exercise || !exercise.attributes) {
        throw new Error("Exercise data not found");
      }

      const currentUsersFav = exercise.attributes.usersFav.data;

      const updatedUsersFav = [...currentUsersFav, await getUserId()];

      const objectUsersFav = {
        usersFav: updatedUsersFav,
      };
      const formData = new FormData();
      formData.append("data", JSON.stringify(objectUsersFav));

      await editExercise(exerciseId, formData);

      await fetchExercises();
    } catch (error) {
      console.error("Error adding exercise to favorites:", error);
    }
  };

  return (
    <div className="max-w-md w-full top-exercises sm:ml-4 bg-white shadow-md rounded-md p-6 bg-index-logged mt-3 sm:mt-6">
      <h2 className="text-2xl font-semibold mb-4 ml-6">Top 5 ejercicios</h2>
      <div className="ml-4 mr-4">
        {exercises.length > 0 ? (
          exercises.map((exercise) => (
            <div
              key={exercise.id}
              className="mb-6 flex hover:bg-blue-400 rounded-xl p-2"
              style={{ cursor: "pointer" }}
            >
              <div className="flex-shrink-0 w-24 h-24 mr-4">
                <img
                  src={
                    process.env.NEXT_PUBLIC_API_URL +
                    exercise.attributes.img.data.attributes.url
                  }
                  alt={exercise.attributes?.title || ""}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {exercise.attributes.title}
                </h3>
                <p>{exercise.attributes.description}</p>
                <p>{exercise.attributes.type}</p>
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
          ))
        ) : (
          <p>No hay ejercicios en la comunidad.</p>
        )}
      </div>
    </div>
  );
};

export default TopExercises;
