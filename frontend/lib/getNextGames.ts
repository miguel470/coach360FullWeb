import Cookies from "js-cookie";
import getUserId from "@/lib/getUserId";

const getNextGames = async () => {
  try {
    const id = await getUserId();

    const token = Cookies.get("authToken");
    if (!token) {
      throw new Error("Token de autenticación no encontrado");
    }

    const url =
      process.env.NEXT_PUBLIC_API_URL +
      "/api/games?populate=*&filters[user][id][$eq]=" +
      id;

    const response = await fetch(url, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    const data = await response.json();

    const currentDate = new Date().toISOString().split("T")[0];
    const filteredGames = data.data.filter(
      (game: any) => game.attributes.date >= currentDate
    );

    return filteredGames;
  } catch (error) {
    console.error("Error fetching games:", error);
    return [];
  }
};

export default getNextGames;
