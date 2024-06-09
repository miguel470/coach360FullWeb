// deleteExercise.ts
import Cookies from "js-cookie";

export async function deleteExercise(exerciseId: number) {
  try {
    const token = Cookies.get("authToken");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/exercises/${exerciseId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete exercise");
    }
  } catch (error) {
    console.error("Error deleting exercise:", error);
    throw error;
  }
}
