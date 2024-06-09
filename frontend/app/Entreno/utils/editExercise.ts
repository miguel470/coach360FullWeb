import Cookies from "js-cookie";

const editExercise = async (exerciseId, formData) => {
  try {
    const token = Cookies.get("authToken");
    if (!token) {
      throw new Error("Token de autenticación no encontrado");
    }
    for (const entry of formData.entries()) {
      console.log(entry[0] + ": " + entry[1]);
    }
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/exercises/${exerciseId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorMessage = await response.json(); // Obtenemos el mensaje de error del servidor
      throw new Error(errorMessage.message); // Lanzamos el error con el mensaje recibido del servidor
    }

    console.log("Exercise updated successfully");
  } catch (error) {
    console.error(`Error updating exercise: ${error.message}`);
    throw new Error(`Error updating exercise: ${error.message}`);
  }
};

export default editExercise;
