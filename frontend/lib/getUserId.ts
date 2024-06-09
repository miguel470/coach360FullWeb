import Cookies from "js-cookie";

const getUserId = async () => {
  const token = Cookies.get("authToken");
  if (!token) {
    throw new Error("Token de autenticación no encontrado");
  }

  const userResponse = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/api/users/me",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!userResponse.ok) {
    throw new Error("Error al obtener información del usuario");
  }

  const userData = await userResponse.json();
  const userId = userData.id;

  return userId;
};

export default getUserId;
