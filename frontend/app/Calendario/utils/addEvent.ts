import Cookies from "js-cookie";
import { format } from "date-fns";
import getUserId from "@/lib/getUserId";

const addEvent = async (
  eventType: string,
  title: string,
  description: string,
  opponent: string,
  location: string,
  trainingExercises: Exercise[],
  date: Date
) => {
  try {
    const token = Cookies.get("authToken");
    if (!token) {
      throw new Error("Token de autenticación no encontrado");
    }

    const user_id = await getUserId();

    const formattedDate = format(date, "yyyy-MM-dd");

    const eventData =
      eventType === "entrenamiento"
        ? {
            title: title,
            description: description,
            user: user_id,
            exercises: trainingExercises.map((exercise) => exercise.id),
            date: formattedDate,
          }
        : {
            opponent: opponent,
            location: location,
            user: user_id,
            date: formattedDate,
          };
    const endpoint =
      eventType === "entrenamiento"
        ? process.env.NEXT_PUBLIC_API_URL + "/api/trainings"
        : process.env.NEXT_PUBLIC_API_URL + "/api/games";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: eventData }),
    });
    console.log("eventData: ", JSON.stringify({ data: eventData }));
    if (response.ok) {
      console.log("adddddd ", response);
      return "Evento añadido exitosamente";
    } else {
      throw new Error(`Error al añadir evento: ${response.statusText}`);
    }
  } catch (error) {
    throw new Error(`Error al añadir evento: ${error}`);
  }
};

export default addEvent;
