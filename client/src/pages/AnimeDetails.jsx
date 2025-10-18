import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAnime } from "../hooks/useKitsuAPI";
import { ArrowLeft, Star, Calendar, Tv, Clock } from "lucide-react";

const AnimeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = useAnime(id);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center gap-4 px-6 md:px-16 lg:px-36 bg-gray-900 h-screen">
        <div className="text-white text-xl">Loading...</div>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col justify-center items-center gap-4 px-6 md:px-16 lg:px-36 bg-gray-900 h-screen">
        <div className="text-gray-400">Error: {error}</div>
        <button
          onClick={() => navigate("/anime")}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition"
        >
          Back to Anime List
        </button>
      </div>
    );
  }

  const anime = data?.data || data;
  const attrs = anime.attributes;

  const coverImage = attrs?.coverImage?.large || attrs?.coverImage?.original;
  const posterImage = attrs?.posterImage?.large || attrs?.posterImage?.medium;
  const title = attrs?.canonicalTitle || attrs?.titles?.en || "N/A";
  const synopsis = attrs?.synopsis || "N/A";
  const rating = attrs?.averageRating;
  const startDate = attrs?.startDate;
  const endDate = attrs?.endDate;
  const episodeCount = attrs?.episodeCount;
  const episodeLength = attrs?.episodeLength;
  const status = attrs?.status;
  const ageRating = attrs?.ageRating;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Cover Image Banner */}
      <div
        className="h-96 bg-cover bg-center relative"
        style={{
          backgroundImage: coverImage
            ? `linear-gradient(to bottom, rgba(17, 24, 39, 0.5), rgba(17, 24, 39, 0.95)), url(${coverImage})`
            : 'linear-gradient(to bottom, rgba(17, 24, 39, 0.8), rgba(17, 24, 39, 1))'
        }}
      />

      {/* Main Content */}
      <div className="px-6 md:px-16 lg:px-36 -mt-32 relative z-10 pb-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster Image */}
          <div className="flex-shrink-0">
            <img
              src={posterImage}
              alt={title}
              className="w-64 h-96 object-cover rounded-lg shadow-2xl border border-gray-700"
            />
          </div>

          {/* Info Section */}
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {rating && (
                <div className="flex items-center gap-2 bg-yellow-600 px-4 py-2 rounded-full">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-semibold">
                    {parseFloat(rating).toFixed(1)}
                  </span>
                </div>
              )}
              {status && (
                <span className="bg-primary-dull px-4 py-2 rounded-full capitalize font-medium">
                  {status}
                </span>
              )}
              {ageRating && (
                <span className="bg-primary-dull px-4 py-2 rounded-full font-medium">
                  {ageRating}
                </span>
              )}
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-900 p-6 rounded-lg">
              {startDate && (
                <div className="flex items-center gap-3 text-gray-300">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Start Date
                    </p>
                    <p className="font-medium">
                      {new Date(startDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
              {endDate && (
                <div className="flex items-center gap-3 text-gray-300">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      End Date
                    </p>
                    <p className="font-medium">
                      {new Date(endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
              {episodeCount && (
                <div className="flex items-center gap-3 text-gray-300">
                  <Tv className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Episodes
                    </p>
                    <p className="font-medium">{episodeCount}</p>
                  </div>
                </div>
              )}
              {episodeLength && (
                <div className="flex items-center gap-3 text-gray-300">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Episode Length
                    </p>
                    <p className="font-medium">{episodeLength} min</p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
              <button className="flex items-center gap-2 px-6 py-3 bg-primary-dull hover:bg-primary transition rounded-full font-medium cursor-pointer">
                Add to My List {/* need to implement functionality */}
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 transition rounded-full font-medium cursor-pointer border border-gray-700">
                Add to Favorites {/* need to implement functionality */}
              </button>
            </div>

            {/* Synopsis */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Synopsis</h2>
              <p className="text-gray-300 leading-relaxed text-lg">
                {synopsis}
              </p>
              {/* Back Button */}
              <button
                onClick={() => navigate("/anime")}
                className="flex items-center gap-1 px-6 py-3 mt-10 text-sm bg-primary-dull hover:bg-primary transition rounded-full font-medium cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Anime
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeDetails;
