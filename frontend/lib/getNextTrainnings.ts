import Cookies from "js-cookie";
import getUserId from "@/lib/getUserId";

const getNextTrainnings = async () => {
  try {
    const id = await getUserId();

    const token = Cookies.get("authToken");
    if (!token) {
      throw new Error("Token de autenticación no encontrado");
    }

    const url =
      process.env.NEXT_PUBLIC_API_URL +
      "/api/trainings?populate=exercises.img&filters[user][id][$eq]=" +
      id;

    const response = await fetch(url, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    const data = await response.json();

    const currentDate = new Date().toISOString().split("T")[0];
    const filteredTrainings = data.data.filter(
      (training: any) => training.attributes.date >= currentDate
    );

    return filteredTrainings;
  } catch (error) {
    console.error("Error fetching trainings:", error);
    return [];
  }
};

export default getNextTrainnings;
