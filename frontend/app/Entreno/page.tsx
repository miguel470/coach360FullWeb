"use client";

import MyExercises from "./components/MyExercises";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import CombinedExercises from "./components/CombinedExercises";

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
        <div className="lg:ml-4">
          {/* <div className="ml-4"><Exercise /></div> */}
          <div className="md:grid md:grid-cols-3 md:gap-4 sm:flex-col">
            <div className="mt-28 md:col-span-1">
              <MyExercises />
            </div>
            <div className="md:col-span-2 md:mt-combined-exercises">
              <CombinedExercises />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
