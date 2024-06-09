"use client";
import React, { useState, useEffect } from "react";

const Slider = () => {
  const images = ["entrenador1.jpg", "entrenador2.jpg"];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [currentSlide]);

  return (
    <div className="w-full max-w-3xl mt-28 mb-10 mx-auto relative overflow-hidden rounded-lg z-0">
      <div className="relative">
        <img
          src={images[currentSlide]}
          alt={`Imagen ${currentSlide + 1}`}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
    </div>
  );
};

export default Slider;
