import getUserId from "@/lib/getUserId";
import Cookies from "js-cookie";

export async function getPlayers() {
  try {
    const token = Cookies.get("authToken");
    const userId = await getUserId();

    const playersResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/players?filters[creator_id]=${userId}&populate=*`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!playersResponse.ok) {
      throw new Error("Failed to fetch exercises");
    }

    const data = await playersResponse.json();
    return data;
  } catch (error) {
    console.error("Error fetching exercises:", error);
  }
}
