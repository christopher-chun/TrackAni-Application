import React from "react";
import { Link } from "react-router-dom";

const MangaCard = ({ manga }) => {
  const title =
    manga.attributes?.canonicalTitle || manga.attributes.titles?.en || "N/A";
  const posterImage =
    manga.attributes?.posterImage?.medium ||
    manga.attributes?.posterImage?.small;
  return (
    <Link
      to={`/manga/${manga.id}`}
      className="flex flex-col justify-between p-3 bg-gray-800 rounded-2xl hover:-translate-y-1 transition duration-300 w-66"
    >
      <img
        src={posterImage}
        alt={title}
        className="rounded-lg h-82 w-full object-cover object-right-bottom"
      />
      <p className="font-semibold mt-2 truncate">{title}</p>
    </Link>
  );
};

export default MangaCard;