import { useEffect } from "react";
import Cookies from "js-cookie";
import getUserId from "@/lib/getUserId";

const getEvents = async (setTrainings, setGames, signal) => {
  try {
    const userId = await getUserId();
    const token = Cookies.get("authToken");
    console.log(token);
    if (!token) {
      throw new Error("Token de autenticación no encontrado");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const requestOptions = {
      method: "GET",
      headers: headers,
    };

    const [trainingsResponse, gamesResponse] = await Promise.all([
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/trainings?populate=*&filters[user][id][$eq]=${userId}`,
        requestOptions
      ),
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/games?filters[user][id][$eq]=${userId}`,
        requestOptions
      ),
    ]);

    const [trainingsData, gamesData] = await Promise.all([
      trainingsResponse.json(),
      gamesResponse.json(),
    ]);
    setTrainings(trainingsData.data);
    setGames(gamesData.data);
  } catch (error) {
    console.error("Error fetching events:", error);
  }
};

const useGetEvents = (setTrainings, setGames, signal) => {
  useEffect(() => {
    getEvents(setTrainings, setGames, signal);
  }, [signal]);
};

export default useGetEvents;
