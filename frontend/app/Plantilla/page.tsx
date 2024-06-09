"use client";
import MyPlayers from "./components/MyPlayers";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get("authToken");

    if (token) {
      setIsLoggedIn(true);
    } else {
      router.push("/login");
    }
  }, []);
  return (
    <div>
      {isLoggedIn && (
        <div className="mt-24 mb-4 ml-4 mr-4">
          <MyPlayers />
        </div>
      )}
    </div>
  );
}
