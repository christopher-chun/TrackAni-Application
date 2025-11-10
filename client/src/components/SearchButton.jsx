// update styling

import React, { useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useAnime, useManga } from "../hooks/useKitsuAPI";

const SearchButton = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("anime");

  // Only search when user clicks the button
  const { data, loading, error } = useAnime(null, {
    search: searchType === "anime" ? searchQuery : "",
    limit: 10,
  });

  const mangaData = useManga(null, {
    search: searchType === "manga" ? searchQuery : "",
    limit: 10,
  });

  // Select the right results based on search type
  const results =
    searchType === "anime" ? data?.data || [] : mangaData.data?.data || [];

  const isLoading = searchType === "anime" ? loading : mangaData.loading;

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Reset when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setSearchQuery("");
    }
  }, [isOpen]);

  const handleSearch = () => {
    if (query.trim().length >= 2) {
      setSearchQuery(query);
    }
  };

  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    setSearchQuery(""); // Clear results when switching type
  };

  // Allow search on Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full border border-gray-300/20">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-300/20">
          <div className="flex items-center gap-4">
            <Search className="w-5 h-5 text-primary" />
            <div className="flex gap-2">
              <button
                onClick={() => handleSearchTypeChange("anime")}
                className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                  searchType === "anime"
                    ? "bg-primary-dull text-white"
                    : "bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                Anime
              </button>
              <button
                onClick={() => handleSearchTypeChange("manga")}
                className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                  searchType === "manga"
                    ? "bg-primary-dull text-white"
                    : "bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                Manga
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-primary transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-6 border-b border-gray-300/20">
          <div className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Search ${searchType}...`}
              className="flex-1 bg-gray-800/50 text-white px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-dull border border-gray-300/20 placeholder-gray-500"
              autoFocus
            />
            <button
              onClick={handleSearch}
              disabled={query.trim().length < 2}
              className="px-6 py-3 bg-primary-dull hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-full font-medium"
            >
              Search
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-6">
          {isLoading && (
            <div className="text-center text-gray-400 py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2">Searching...</p>
            </div>
          )}

          {!isLoading && searchQuery && results.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              No results found for "{searchQuery}"
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <div className="space-y-2">
              {results.map((item) => (
                <Link
                  key={item.id}
                  to={`/${searchType}/${item.id}`}
                  onClick={onClose}
                  className="flex items-center gap-4 p-4 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-colors border border-gray-300/10 hover:border-gray-300/20 group"
                >
                  <img
                    src={item.attributes?.posterImage?.small}
                    alt={item.attributes?.canonicalTitle}
                    className="w-12 h-16 object-cover rounded border border-gray-300/20"
                  />
                  <div className="flex-1">
                    <h3 className="text-white font-medium group-hover:text-primary transition-colors">
                      {item.attributes?.canonicalTitle}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      {item.attributes?.averageRating && (
                        <span>
                          ⭐{" "}
                          {parseFloat(item.attributes.averageRating / 10).toFixed(1)}
                        </span>
                      )}
                      {item.attributes?.status && (
                        <span className="capitalize">
                          • {item.attributes.status.replace("_", " ")}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!searchQuery && (
            <div className="text-center text-gray-400 py-8">
              {searchType === 'anime' ? `Type an ${searchType} name and click search` : `Type a ${searchType} name and click search`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchButton;
