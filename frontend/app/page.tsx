"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import GridCards from "@/components/GridCards";
import Slider from "@/components/Slider";
import TextSlider from "@/components/TextSlider";
import NextTrainings from "@/components/NextTrainnings";
import NextGames from "@/components/NextGames";
import TopExercises from "@/components/TopExercises";

const Home = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get("authToken");

    if (token) {
      setIsLoggedIn(true);
    } else {
      router.push("/");
    }
  }, []);

  return (
    <div>
      {isLoggedIn ? (
        <div className="mt-28">
          <div className="md:flex md:flex-row md:justify-center md:items-center sm:flex sm:flex-col sm:mt-2 ">
            <div className="mt-3">
              <NextTrainings />
            </div>
            <div className="mt-3">
              <NextGames />
            </div>
          </div>
          <div className="max-w-screen-lg mx-auto flex flex-col justify-center items-center mb-6">
            <TopExercises />
          </div>
        </div>
      ) : (
        // Contenido para usuarios no logueados
        <div>
          <Slider />
          <TextSlider />
          <GridCards />
        </div>
      )}
    </div>
  );
};

export default Home;
