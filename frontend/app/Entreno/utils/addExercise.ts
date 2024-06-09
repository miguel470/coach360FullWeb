import Cookies from "js-cookie";

const addExercise = async (exerciseData: any) => {
  try {
    const token = Cookies.get("authToken");
    if (!token) {
      throw new Error("Token de autenticación no encontrado");
    }
    const formData = new FormData();
    formData.append("data", JSON.stringify(exerciseData));
    formData.append("files.img", exerciseData.img);

    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/exercises",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );
    if (response.ok) {
      console.log(response);
      console.log("Ejercicio guardado exitosamente");
      return true;
    } else {
      console.error("Error al guardar el ejercicio:", response.statusText);
      return false;
    }
  } catch (error) {
    console.error("Error al conectar con el backend:", error);
    return false;
  }
};

export default addExercise;
