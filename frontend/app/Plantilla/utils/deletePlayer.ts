import Cookies from "js-cookie";

export const deletePlayer = async (playerId: string): Promise<void> => {
  try {
    const token = Cookies.get("authToken");
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/players/${playerId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return;
  } catch (error) {
    throw new Error(`Failed to delete player with ID ${playerId}: ${error}`);
  }
};
