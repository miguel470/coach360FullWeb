import React from "react";
import Card from "./Card";

const GridCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 ml-4 mr-4 mb-4 mx-auto">
      <Card name="Plantilla" img="plantilla.png" />
      <Card name="Ejercicios" img="entreno.jpg" />
      <Card name="Calendario" img="calendario.jpg" />
    </div>
  );
};

export default GridCards;
