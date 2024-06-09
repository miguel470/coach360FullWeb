import Cookies from "js-cookie";

const deleteEvent = async (
  eventId: number,
  eventType: string
): Promise<string> => {
  try {
    const token = Cookies.get("authToken");
    if (!token) {
      throw new Error("Token de autenticación no encontrado");
    }
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/${eventType}/${eventId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "DELETE",
      }
    );

    if (response.ok) {
      return "Evento eliminado exitosamente";
    } else {
      return "Error al eliminar el evento";
    }
  } catch (error) {
    console.error("Error al eliminar el evento:", error);
    return "Error al eliminar el evento";
  }
};

export default deleteEvent;
