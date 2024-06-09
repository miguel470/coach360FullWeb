import Cookies from "js-cookie";
import getUserId from "@/lib/getUserId";

export const fetchExercises = async () => {
  try {
    const token = Cookies.get("authToken");
    const userId = await getUserId();

    const exercisesResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/exercises?filters[creator_id]=${userId}&populate=*`,
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

    return data;
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return null;
  }
};
