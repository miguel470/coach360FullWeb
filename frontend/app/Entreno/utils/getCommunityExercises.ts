import Cookies from "js-cookie";
import getUserId from "@/lib/getUserId";

export const fetchCommunityExercises = async () => {
  try {
    const token = Cookies.get("authToken");
    const userId = await getUserId();

    const exercisesResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/exercises?filters[creator_id][$ne]=${userId}&populate=*`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!exercisesResponse.ok) {
      throw new Error("Failed to fetch exercises");
    }

    const data = await exercisesResponse.json();

    // Filtrar los ejercicios que no tengan el userId en usersFav
    const filteredExercises = data.data.filter((exercise) => {
      const usersFav = exercise.attributes.usersFav.data;
      return !usersFav.some((user) => user.id === userId);
    });

    console.log("consola ejercicios community", filteredExercises.length);

    return { data: filteredExercises, length: filteredExercises.length };
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return { error: true };
  }
};
