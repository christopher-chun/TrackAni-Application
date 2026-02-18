import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate, Link } from 'react-router-dom';
import { getList, updateListItem, removeFromList } from '../utils/api';
import { Trash2, Edit2, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

const AnimeListCard = ({ listItem, onUpdate, onRemove }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [progress, setProgress] = useState(listItem.progress);
  const [rating, setRating] = useState(listItem.rating || '');
  const [status, setStatus] = useState(listItem.status);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(
          `https://kitsu.io/api/edge/anime/${listItem.itemId}`,
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
  }, [listItem.itemId]);

  const handleSave = async () => {
    try {
      await onUpdate(listItem.itemId, {
        progress: parseInt(progress),
        rating: rating ? parseInt(rating) : undefined,
        status
      });
      setEditing(false);
      toast.success('Updated!');
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 animate-pulse">
        <div className="flex gap-4">
          <div className="w-24 h-36 bg-gray-700 rounded"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-3 bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!details) return null;
  const title = details.attributes?.canonicalTitle || 'Unknown';
  const posterImage = details.attributes?.posterImage?.small;
  const totalEpisodes = details.attributes?.episodeCount || '?';
  return (
    <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors">
      <div className="flex gap-4">
        <Link to={`/anime/${listItem.itemId}`}>
          <img
            src={posterImage}
            alt={title}
            className="w-24 h-36 object-cover rounded"
          />
        </Link>
        <div className="flex-1">
          <Link to={`/anime/${listItem.itemId}`}>
            <h3 className="text-white font-semibold mb-2 hover:text-primary transition-colors">
              {title}
            </h3>
          </Link>
          {!editing ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Status:</span>
                <span className="text-sm text-white capitalize">{status.replace(/_/g, ' ')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Progress:</span>
                <span className="text-sm text-white">{progress} / {totalEpisodes}</span>
              </div>
              {rating && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">Rating:</span>
                  <span className="text-sm text-yellow-400">⭐ {rating}/10</span>
                </div>
              )}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition"
                >
                  <Edit2 className="w-3 h-3" />
                  Edit
                </button>
                <button
                  onClick={() => onRemove(listItem)}
                  className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm transition"
                >
                  <Trash2 className="w-3 h-3" />
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-gray-900 text-white px-2 py-1 rounded text-sm"
                >
                  <option value="watching">Watching</option>
                  <option value="completed">Completed</option>
                  <option value="plan_to_watch">Plan to Watch</option>
                  <option value="on_hold">On Hold</option>
                  <option value="dropped">Dropped</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Progress</label>
                <input
                  type="number"
                  value={progress}
                  onChange={(e) => setProgress(e.target.value)}
                  min="0"
                  max={totalEpisodes !== '?' ? totalEpisodes : 999}
                  className="w-full bg-gray-900 text-white px-2 py-1 rounded text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Rating (1-10)</label>
                <input
                  type="number"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  min="1"
                  max="10"
                  placeholder="Optional"
                  className="w-full bg-gray-900 text-white px-2 py-1 rounded text-sm"
                />
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm transition"
                >
                  <Save className="w-3 h-3" />
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setProgress(listItem.progress);
                    setRating(listItem.rating || '');
                    setStatus(listItem.status);
                  }}
                  className="flex items-center gap-1 px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm transition"
                >
                  <X className="w-3 h-3" />
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AnimeList = () => {
  const { getToken, isSignedIn } = useAuth();
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!isSignedIn) {
      navigate('/');
      return;
    }
    fetchList();
  }, [isSignedIn]);

  const fetchList = async () => {
    try {
      const data = await getList(getToken, 'anime');
      setList(data);
    } catch (error) {
      toast.error('Failed to load list');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (itemId, updateData) => {
    await updateListItem(getToken, itemId, 'anime', updateData);
    fetchList();
  };

  const handleRemove = async (listItem) => {
    try {
      await removeFromList(getToken, listItem.itemId, 'anime');
      setList(list.filter(item => item._id !== listItem._id));
      toast.success('Removed from list');
    } catch (error) {
      toast.error('Failed to remove');
    }
  };

  const filteredList = filter === 'all' 
    ? list 
    : list.filter(item => item.status === filter);

  const statusCounts = {
    all: list.length,
    watching: list.filter(i => i.status === 'watching').length,
    completed: list.filter(i => i.status === 'completed').length,
    plan_to_watch: list.filter(i => i.status === 'plan_to_watch').length,
    on_hold: list.filter(i => i.status === 'on_hold').length,
    dropped: list.filter(i => i.status === 'dropped').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center pt-24">
        <div className="text-white text-xl">Loading your anime list...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white pt-24 px-6 md:px-16 lg:px-36 pb-12">
      <h1 className="text-4xl md:text-5xl font-bold mt-10 mb-8">My Anime List</h1>
      <div className="flex flex-wrap gap-2 mb-8">
        {['all', 'watching', 'completed', 'plan_to_watch', 'on_hold', 'dropped'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full transition-colors capitalize ${
              filter === s
                ? 'bg-primary text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            {s.replace(/_/g, ' ')} ({statusCounts[s]})
          </button>
        ))}
      </div>
      {filteredList.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-xl mb-4">No anime in this category</p>
          <Link
            to="/anime"
            className="inline-block px-6 py-3 bg-primary hover:bg-primary-dull rounded-full font-medium transition"
          >
            Browse Anime
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredList.map((item) => (
            <AnimeListCard
              key={item._id}
              listItem={item}
              onUpdate={handleUpdate}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AnimeList;