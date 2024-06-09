import getUserId from "@/lib/getUserId";
import Cookies from "js-cookie";

export async function addPlayer(playerData: any) {
  try {
    const token = Cookies.get("authToken");
    const userId = await getUserId();
    const sendPlayer = {
      name: playerData.name,
      position: playerData.position,
      state: playerData.state,
      birth: playerData.birth,
      creator_id: userId,
      img: playerData.img,
    };
    console.log("fffff", sendPlayer);
    const formData = new FormData();
    formData.append("data", JSON.stringify(sendPlayer));
    formData.append("files.img", sendPlayer.img);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/players`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to add player");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding player:", error);
    throw error;
  }
}
