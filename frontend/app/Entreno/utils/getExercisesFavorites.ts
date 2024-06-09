import Cookies from "js-cookie";
// import getUserId from "@/lib/getUserId";

export const fetchExercisesFav = async () => {
  try {
    const token = Cookies.get("authToken");
    // const userId = await getUserId();

    const userResponse = await fetch(
      //   "http://localhost:1337/api/users/me?populate[0]=exercises_fav",
      process.env.NEXT_PUBLIC_API_URL +
        "/api/users/me?populate[exercises_fav][populate][0]=img&populate[exercises_fav][populate][1]=usersFav",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!userResponse.ok) {
      throw new Error("Failed to fetch exercises");
    }

    const data = await userResponse.json();

    return data.exercises_fav;
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return null;
  }
};
