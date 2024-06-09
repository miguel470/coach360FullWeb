"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import MyCalendar from "./components/MyCalendar";

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
        <div>
          <MyCalendar />
        </div>
      )}
    </div>
  );
}
