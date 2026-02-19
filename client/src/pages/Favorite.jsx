import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate, Link } from 'react-router-dom';
import { getFavorites, removeFavorite } from '../utils/api';
// import { useAnime, useManga } from '../hooks/useKitsuAPI';
import { Trash2, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

const FavoriteCard = ({ favorite, onRemove }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(
          `https://kitsu.io/api/edge/${favorite.itemType}/${favorite.itemId}`,
          {
            headers: {
              'Accept': 'application/vnd.api+json',
              'Content-Type': 'application/vnd.api+json'
            }
          }
        );
        const data = await response.json();
        setDetails(data.data);
      } catch (error) {
        console.error('Error fetching details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [favorite.itemId, favorite.itemType]);
  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 animate-pulse">
        <div className="w-full h-64 bg-gray-700 rounded-lg mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
      </div>
    );
  }
  if (!details) return null;

  const title = details.attributes?.canonicalTitle || 'Unknown';
  const posterImage = details.attributes?.posterImage?.medium;
  const rating = details.attributes?.averageRating;

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:-translate-y-1 transition-transform duration-300 group relative">
      <Link to={`/${favorite.itemType}/${favorite.itemId}`}>
        <img
          src={posterImage}
          alt={title}
          className="w-full h-80 object-cover"
        />
        <div className="p-4">
          <h3 className="text-white font-semibold line-clamp-2 mb-2">{title}</h3>
          <div className="flex items-center justify-between">
            {rating && (
              <span className="text-yellow-400 text-sm">
                ⭐ {parseFloat(rating / 10).toFixed(1)}
              </span>
            )}
            <span className="text-gray-400 text-xs capitalize">{favorite.itemType}</span>
          </div>
        </div>
      </Link>
      <button
        onClick={(e) => {
          e.preventDefault();
          onRemove(favorite);
        }}
        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

const Favorite = () => {
  const { getToken, isSignedIn } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, anime, manga

  useEffect(() => {
    if (!isSignedIn) {
      navigate('/');
      return;
    }
    const fetchFavorites = async () => {
      try {
        const data = await getFavorites(getToken);
        setFavorites(data);
      } catch (error) {
        toast.error('Failed to load favorites');
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [isSignedIn]);

  const handleRemove = async (favorite) => {
    try {
      await removeFavorite(getToken, favorite.itemId, favorite.itemType);
      setFavorites(favorites.filter(f => f._id !== favorite._id));
      toast.success('Removed from favorites');
    } catch (error) {
      toast.error('Failed to remove favorite');
    }
  };

  const filteredFavorites = favorites.filter(f => 
    filter === 'all' ? true : f.itemType === filter
  );
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center pt-24">
        <div className="text-white text-xl">Loading favorites...</div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white pt-24 px-6 md:px-16 lg:px-36 pb-12">
      <div className="flex items-center justify-between mb-8 mt-10">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl md:text-5xl mt-10 font-bold">My Favorites</h1>
        </div>
        {/* Filter Buttons */}
        <div className="flex gap-2 mt-10">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full transition-colors ${
              filter === 'all'
                ? 'bg-primary text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            All ({favorites.length})
          </button>
          <button
            onClick={() => setFilter('anime')}
            className={`px-4 py-2 rounded-full transition-colors ${
              filter === 'anime'
                ? 'bg-primary text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            Anime ({favorites.filter(f => f.itemType === 'anime').length})
          </button>
          <button
            onClick={() => setFilter('manga')}
            className={`px-4 py-2 rounded-full transition-colors ${
              filter === 'manga'
                ? 'bg-primary text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            Manga ({favorites.filter(f => f.itemType === 'manga').length})
          </button>
        </div>
      </div>
      {filteredFavorites.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-xl mb-4">No favorites yet</p>
          <p className="text-gray-500 mb-8">Start adding anime and manga to your favorites!</p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/anime"
              className="px-6 py-3 bg-primary-dull hover:bg-primary rounded-full font-medium transition"
            >
              Browse Anime
            </Link>
            <Link
              to="/manga"
              className="px-6 py-3 bg-primary-dull hover:bg-primary rounded-full font-medium transition"
            >
              Browse Manga
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredFavorites.map((favorite) => (
            <FavoriteCard
              key={favorite._id}
              favorite={favorite}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorite;