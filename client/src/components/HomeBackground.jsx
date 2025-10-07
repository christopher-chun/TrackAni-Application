import React from "react";
import { useRandomAnime } from "../hooks/useKitsuAPI";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const HomeBackground = () => {
  const navigate = useNavigate();
  const { anime, loading, error } = useRandomAnime();

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center gap-4 px-6 md:px-16 lg:px-36 bg-gray-900 h-screen">
        <div className="text-white text-xl">Loading...</div>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="flex flex-col justify-center items-center gap-4 px-6 md:px-16 lg:px-36 bg-gray-900 h-screen">
        <div className="text-white text-xl">Welcome to TrackAni!</div>
        <div className="text-gray-400">
          Discover and track your favorite anime and manga!
        </div>
      </div>
    );
  }

  const coverImage =
    anime.attributes?.coverImage?.large ||
    anime.attributes?.coverImage?.original;
  const title =
    anime.attributes?.canonicalTitle || anime.attributes?.titles?.en || "N/A";
  const startDate = anime.attributes?.startDate || "N/A";
  const episodeCount = anime.attributes?.episodeCount || "N/A";
  const synopsis = anime.attributes?.synopsis || "N/A";

  return (
    <div
      className="flex flex-col justify-center items-start gap-4 px-6 md:px-16 lg:px-36 bg-cover bg-center h-screen text-white"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${coverImage})`,
      }}
    >
      <h1 className="text-5xl md:text-[70px] md:leading-[80px] font-semibold max-w-[800px]">
        {title}
      </h1>
      <div className="flex items-center gap-4 text-gray-300">
        <span>{new Date(startDate).toLocaleDateString()}</span>
        <span> | </span>
        <span>{episodeCount} Episodes</span>
      </div>
      <p className="max-w-2xl text-gray-300">
        {synopsis.length > 500 ? synopsis.slice(0, 500) + "..." : synopsis}
      </p>
      <button
        onClick={() => navigate("/anime")}
        className="flex items-center gap-1 px-6 py-3 text-sm bg-primary-dull hover:bg-primary transition rounded-full font-medium cursor-pointer"
      >
        Explore Anime
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default HomeBackground;
