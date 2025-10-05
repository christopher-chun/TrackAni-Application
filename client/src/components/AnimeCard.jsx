import React from "react";
import { Link, useNavigate } from "react-router-dom";

const AnimeCard = ({ anime }) => {
  const title =
    anime.attributes?.canonicalTitle || anime.attributes.titles?.en || "N/A";
  const posterImage =
    anime.attributes?.posterImage?.medium ||
    anime.attributes?.posterImage?.small;
  const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-between p-3 bg-gray-800 rounded-2xl hover:-translate-y-1 transition duration-300 w-66">
      <img
        onClick={() => navigate(`/anime/${anime.id}`)}
        src={posterImage}
        alt=""
        className="rounded-lg h-82 w-full object-cover object-right-bottom cursor-pointer"
      />
      <p className="font-semibold mt-2 truncate">{title}</p>
    </div>
  );
};

export default AnimeCard;
