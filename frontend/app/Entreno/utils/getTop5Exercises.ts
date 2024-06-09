import getUserId from "@/lib/getUserId";
import Cookies from "js-cookie";

export async function getTop5Exercises() {
  try {
    const token = Cookies.get("authToken");
    const userId = await getUserId();

    const exercisesResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/exercises?populate=*&[filters][creator_id][$ne]=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!exercisesResponse.ok) {
      throw new Error("Failed to fetch exercises");
    }

    const responseData = await exercisesResponse.json();

    if (!responseData || !responseData.data) {
      throw new Error("Invalid response structure");
    }

    const exercises = responseData.data;

    // Verifica que usersFav sea un array antes de usar some para verificar la existencia del userId
    const filteredExercises = exercises.filter(
      (exercise) =>
        Array.isArray(exercise.attributes.usersFav.data) &&
        !exercise.attributes.usersFav.data.some(
          (favUser) => favUser.id === userId
        )
    );

    // Ordena los ejercicios por la cantidad de favoritos (de mayor a menor)
    const sortedExercises = filteredExercises.sort(
      (a, b) =>
        b.attributes.usersFav.data.length - a.attributes.usersFav.data.length
    );

    // Devuelve los 5 ejercicios con más favoritos, excluyendo los favoritos del usuario
    return sortedExercises.slice(0, 5);
  } catch (error) {
    console.error("Error fetching exercises:", error);
  }
}
