import { useState, useEffect } from "react";

//Generic Kitsu API hook for fetching data from any endpoint
const useKitsuAPI = (endpoint = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!endpoint) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Add small delay to prevent rapid requests
        await new Promise((resolve) => setTimeout(resolve, 300));

        const response = await fetch(`https://kitsu.io/api/edge/${endpoint}`, {
          headers: {
            Accept: "application/vnd.api+json",
            "Content-Type": "application/vnd.api+json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
        console.error("Kitsu API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return { data, loading, error, refetch: () => window.location.reload() };
};

// Specialized hooks that use the generic one
const useAnime = (id = null, filters = {}) => {
  let endpoint = "anime";
  if (id) {
    endpoint = `anime/${id}`;
  } else {
    const params = new URLSearchParams();
    if (filters.limit) params.append("page[limit]", filters.limit);
    if (filters.offset) params.append("page[offset]", filters.offset);
    if (filters.search) params.append("filter[text]", filters.search);
    if (filters.sort) params.append("sort", filters.sort);
    if (filters.status) params.append("filter[status]", filters.status);
    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }
  }
  return useKitsuAPI(endpoint, [id, JSON.stringify(filters)]);
};

const useManga = (id = null, filters = {}) => {
  let endpoint = "manga";
  if (id) {
    endpoint = `manga/${id}`;
  } else {
    const params = new URLSearchParams();
    if (filters.limit) params.append("page[limit]", filters.limit);
    if (filters.offset) params.append("page[offset]", filters.offset);
    if (filters.search) params.append("filter[text]", filters.search);
    if (filters.sort) params.append("sort", filters.sort);
    if (filters.status) params.append("filter[status]", filters.status);
    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }
  }
  return useKitsuAPI(endpoint, [id, JSON.stringify(filters)]);
};

const useRandomAnime = () => {
  // Use a fixed random offset to prevent infinite re-randomization
  const [randomOffset] = useState(() => Math.floor(Math.random() * 2000));

  const { data, loading, error } = useAnime(null, {
    limit: 1,
    offset: randomOffset,
    sort: "popularityRank",
  });

  // Extract anime from the data structure
  const anime = data?.data?.[0] || null;

  return { anime, loading, error };
};

export { useKitsuAPI, useAnime, useRandomAnime, useManga };
