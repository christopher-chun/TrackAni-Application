import Favorite from "../models/Favorite.js";

// Getting all favorites for logged-in user
export const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.userId }).sort({
      addedAt: -1,
    });

    res.json(favorites);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
};

// Adding item to favorites
export const addFavorite = async (req, res) => {
  try {
    const { itemId, itemType } = req.body;
    if (!itemId || !itemType) {
      return res
        .status(400)
        .json({ error: "itemId and itemType are required" });
    }
    if (!["anime", "manga"].includes(itemType)) {
      return res.status(400).json({ error: "itemType must be anime or manga" });
    }
    // Checking if already favorited
    const existing = await Favorite.findOne({
      userId: req.userId,
      itemId,
      itemType,
    });
    if (existing) {
      return res.status(400).json({ error: "Already in favorites" });
    }
    // Create new favorite
    const favorite = await Favorite.create({
      userId: req.userId,
      itemId,
      itemType,
    });
    res.status(201).json(favorite);
  } catch (error) {
    console.error("Error adding favorite:", error);
    res.status(500).json({ error: "Failed to add favorite" });
  }
};

// Removing item from favorites
export const removeFavorite = async (req, res) => {
  try {
    const { itemId, itemType } = req.params;
    const result = await Favorite.findOneAndDelete({
      userId: req.userId,
      itemId,
      itemType,
    });
    if (!result) {
      return res.status(404).json({ error: "Favorite not found" });
    }
    res.json({ message: "Removed from favorites", favorite: result });
  } catch (error) {
    console.error("Error removing favorite:", error);
    res.status(500).json({ error: "Failed to remove favorite" });
  }
};

// Checking if item is in favorites
export const checkFavorite = async (req, res) => {
  try {
    const { itemId, itemType } = req.params;
    const favorite = await Favorite.findOne({
      userId: req.userId,
      itemId,
      itemType,
    });
    res.json({ isFavorite: !!favorite });
  } catch (error) {
    console.error("Error checking favorite:", error);
    res.status(500).json({ error: "Failed to check favorite status" });
  }
};
