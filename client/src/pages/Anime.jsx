import React from "react";
import { useAnime } from "../hooks/useKitsuAPI";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AnimeCard from "../components/AnimeCard";

const Anime = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const animePerPage = 20;
  const { data, loading, error } = useAnime(null, {
    limit: animePerPage,
    offset: (currentPage - 1) * animePerPage,
    sort: "ratingRank", // sorted by rating. would like to add functionality to change sorting by alphabetical or popularity later.
  });
  const AnimeList = data?.data || [];
  const totalAnime = data?.meta?.count || 0;
  const totalPages = Math.ceil(totalAnime / animePerPage);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center gap-4 px-6 md:px-16 lg:px-36 bg-gray-900 h-screen">
        <div className="text-white text-xl">Loading...</div>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center gap-4 px-6 md:px-16 lg:px-36 bg-gray-900 h-screen">
        <div className="text-gray-400">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24 px-6 md:px-16 lg:px-36 pb-12">
      <h1 className="text-4xl md:text-5xl font-bold mb-8 mt-10">
        Browse Anime
      </h1>
      {/* Anime grid display */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-20 mb-12">
        {AnimeList.map((anime) => (
          <AnimeCard key={anime.id} anime={anime} />
        ))}
      </div>
      {/* Paging */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition"
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </button>

        <div className="flex items-center gap-2">
          {/* Show page numbers */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNumber;
            if (currentPage <= 3) {
              pageNumber = i + 1;
            } else {
              pageNumber = currentPage - 2 + i;
            }

            return (
              <button
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                className={`px-4 py-2 rounded-lg transition ${
                  currentPage === pageNumber ? "bg-primary text-white" : "bg-gray-800 hover:bg-gray-700"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(totalPages, prev + 1))
          }
          disabled={currentPage === totalPages}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition"
        >
          Next
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <p className="text-center text-white mt-4">
        Page {currentPage} of {totalPages}
      </p>
    </div>
  );
};

export default Anime;
