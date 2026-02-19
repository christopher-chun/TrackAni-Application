import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useManga } from "../hooks/useKitsuAPI";
import { useAuth } from "@clerk/clerk-react";
import { ArrowLeft, Star, Calendar, Book, Heart, BookmarkPlus } from "lucide-react";
import { addFavorite, removeFavorite, checkFavorite, addToList, getListItem } from "../utils/api";
import toast from "react-hot-toast";

const MangaDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken, isSignedIn } = useAuth();
  const { data, loading, error } = useManga(id);

  const [isFavorited, setIsFavorited] = useState(false);
  const [listStatus, setListStatus] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showListDropdown, setShowListDropdown] = useState(false);

  useEffect(() => {
    if (!isSignedIn || !id) return;
    const checkStatus = async () => {
      try {
        const [favoriteStatus, listItem] = await Promise.all([
          checkFavorite(getToken, id, 'manga'),
          getListItem(getToken, id, 'manga').catch(() => null)
        ]);
        setIsFavorited(favoriteStatus.isFavorite);
        setListStatus(listItem?.status || null);
      } catch (error) {
        console.error('Error checking status:', error);
      }
    };
    checkStatus();
  }, [id, isSignedIn]);

  const handleFavorite = async () => {
    if (!isSignedIn) {
      toast.error('Please login to add favorites');
      return;
    }
    setActionLoading(true);
    try {
      if (isFavorited) {
        await removeFavorite(getToken, id, 'manga');
        setIsFavorited(false);
        toast.success('Removed from favorites');
      } else {
        await addFavorite(getToken, id, 'manga');
        setIsFavorited(true);
        toast.success('Added to favorites!');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddToList = async (status) => {
    if (!isSignedIn) {
      toast.error('Please login to add to list');
      return;
    }
    setActionLoading(true);
    setShowListDropdown(false);
    try {
      await addToList(getToken, id, 'manga', status);
      setListStatus(status);
      toast.success(`Added to ${status.replace('_', ' ')} list!`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setActionLoading(false);
    }
  };

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
          onClick={() => navigate("/manga")}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition"
        >
          Back to Manga List
        </button>
      </div>
    );
  }

  const manga = data?.data || data;
  const attrs = manga.attributes;

  const coverImage = attrs?.coverImage?.large || attrs?.coverImage?.original;
  const posterImage = attrs?.posterImage?.large || attrs?.posterImage?.medium;
  const title = attrs?.canonicalTitle || attrs?.titles?.en || "N/A";
  const synopsis = attrs?.synopsis || "N/A";
  const rating = attrs?.averageRating;
  const startDate = attrs?.startDate;
  const endDate = attrs?.endDate;
  const chapterCount = attrs?.chapterCount;
  const volumeCount = attrs?.volumeCount;
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
                    {parseFloat(rating / 10).toFixed(1)}
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
              {chapterCount && (
                <div className="flex items-center gap-3 text-gray-300">
                  <Book className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Chapters
                    </p>
                    <p className="font-medium">{chapterCount}</p>
                  </div>
                </div>
              )}
              {volumeCount && (
                <div className="flex items-center gap-3 text-gray-300">
                  <Book className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Volumes
                    </p>
                    <p className="font-medium">{volumeCount}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-8 relative">
              {/* Favorites Button */}
              <button
                onClick={handleFavorite}
                disabled={actionLoading}
                className={`flex items-center gap-2 px-6 py-3 transition-colors rounded-full font-medium cursor-pointer disabled:opacity-50 ${
                  isFavorited
                    ? 'bg-primary hover:bg-teal-400'
                    : 'bg-gray-800 hover:bg-gray-700 border border-gray-700'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                {isFavorited ? 'Favorited' : 'Add to Favorites'}
              </button>
              <div className="relative">
                {/* Add to List Button */}
                <button
                  onClick={() => setShowListDropdown(!showListDropdown)}
                  disabled={actionLoading}
                  className={`flex items-center gap-2 px-6 py-3 transition-colors rounded-full font-medium cursor-pointer disabled:opacity-50 ${
                    listStatus
                      ? 'bg-primary-dull hover:bg-primary'
                      : 'bg-gray-800 hover:bg-gray-700 border border-gray-700'
                  }`}
                >
                  <BookmarkPlus className="w-5 h-5" />
                  {listStatus ? listStatus.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Add to List'}
                </button>
                {/* Dropdown Menu */}
                {showListDropdown && (
                  <div className="absolute top-14 left-0 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl z-50 min-w-48">
                    {['reading', 'plan_to_read', 'completed', 'on_hold', 'dropped'].map((s) => (
                      <button
                        key={s}
                        onClick={() => handleAddToList(s)}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-700 transition-colors capitalize first:rounded-t-lg last:rounded-b-lg ${
                          listStatus === s ? 'text-primary font-medium' : 'text-white'
                        }`}
                      >
                        {s.replace(/_/g, ' ')}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Synopsis */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Synopsis</h2>
              <p className="text-gray-300 leading-relaxed text-lg">
                {synopsis}
              </p>
              {/* Back Button */}
              <button
                onClick={() => navigate("/manga")}
                className="flex items-center gap-1 px-6 py-3 mt-10 text-sm bg-primary-dull hover:bg-primary transition rounded-full font-medium cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Manga
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MangaDetails;
