import Cookies from "js-cookie";
import { format } from "date-fns";
import getUserId from "@/lib/getUserId";

const editEvent = async (
  idEvent: number,
  eventType: string,
  title: string,
  description: string | undefined,
  opponent: string | undefined,
  location: string | undefined,
  exercisesIds: number[],
  date: Date | string
): Promise<any> => {
  let apiUrl: string;
  let body: any;

  const token = Cookies.get("authToken");
  if (!token) {
    throw new Error("Token de autenticación no encontrado");
  }

  const user_id = await getUserId();

  const formattedDate = format(date, "yyyy-MM-dd");

  if (eventType === "entrenamiento") {
    apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/trainings/${idEvent}`;
    body = {
      data: {
        title,
        ...(description !== undefined && { description }),
        user: user_id,
        exercises: exercisesIds,
        date: formattedDate,
      },
    };
  } else if (eventType === "partido") {
    apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/games/${idEvent}`;
    body = {
      data: {
        ...(opponent !== undefined && { opponent }),
        ...(location !== undefined && { location }),
        user: user_id,
        date: formattedDate,
      },
    };
  } else {
    throw new Error("Tipo de evento no válido");
  }

  try {
    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("Error al editar el evento");
    }

    return await response.json();
  } catch (error) {
    throw new Error("Error al editar el evento: " + error.message);
  }
};

export default editEvent;
