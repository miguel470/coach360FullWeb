import Link from "next/link";
import React from "react";

// @ts-expect-error
const Card = (propsCard) => {
  const { name, img } = propsCard;
  return (
    <Link href={`/login`}>
      <div className="flex items-center justify-center flex-col mt-4 mb-4 btn-gradient">
        <h1 className="text-2xl font-bold mb-4">{name}</h1>
        <img
          src={img}
          alt=""
          className="w-40 h-40 object-cover object-center mb-4 rounded-full"
        />
      </div>
    </Link>
  );
};

export default Card;
