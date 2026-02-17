import List from "../models/List.js";

// Getting user's list with optional filters
export const getList = async (req, res) => {
  try {
    const { status, itemType } = req.query;
    const filter = { userId: req.userId };
    if (status) filter.status = status;
    if (itemType) filter.itemType = itemType;
    const list = await List.find(filter).sort({ updatedAt: -1 });
    res.json(list);
  } catch (error) {
    console.error("Error fetching list:", error);
    res.status(500).json({ error: "Failed to fetch list" });
  }
};

// Getting single list item
export const getListItem = async (req, res) => {
  try {
    const { itemId, itemType } = req.params;
    const listItem = await List.findOne({
      userId: req.userId,
      itemId,
      itemType,
    });
    if (!listItem) {
      return res.status(404).json({ error: "Item not found in list" });
    }
    res.json(listItem);
  } catch (error) {
    console.error("Error fetching list item:", error);
    res.status(500).json({ error: "Failed to fetch list item" });
  }
};

// Adding item to list
export const addToList = async (req, res) => {
  try {
    const { itemId, itemType, status, progress, rating, notes } = req.body;
    if (!itemId || !itemType) {
      return res
        .status(400)
        .json({ error: "itemId and itemType are required" });
    }
    if (!["anime", "manga"].includes(itemType)) {
      return res.status(400).json({ error: "itemType must be anime or manga" });
    }
    // Checking if already in list
    const existing = await List.findOne({
      userId: req.userId,
      itemId,
      itemType,
    });
    if (existing) {
      return res.status(400).json({ error: "Item already in list" });
    }
    // Determining default status based on item type
    const defaultStatus = itemType === "anime" ? "plan_to_watch" : "plan_to_read";
    const listItem = await List.create({
      userId: req.userId,
      itemId,
      itemType,
      status: status || defaultStatus,
      progress: progress || 0,
      rating,
      notes,
    });
    res.status(201).json(listItem);
  } catch (error) {
    console.error("Error adding to list:", error);
    res.status(500).json({ error: "Failed to add to list" });
  }
};

// Updating list item
export const updateListItem = async (req, res) => {
  try {
    const { itemId, itemType } = req.params;
    const { status, progress, rating, notes } = req.body;
    const updateData = {};
    if (status !== undefined) updateData.status = status;
    if (progress !== undefined) updateData.progress = progress;
    if (rating !== undefined) updateData.rating = rating;
    if (notes !== undefined) updateData.notes = notes;
    updateData.updatedAt = Date.now();
    const listItem = await List.findOneAndUpdate(
      {
        userId: req.userId,
        itemId,
        itemType,
      },
      updateData,
      { new: true, runValidators: true },
    );
    if (!listItem) {
      return res.status(404).json({ error: "Item not found in list" });
    }
    res.json(listItem);
  } catch (error) {
    console.error("Error updating list item:", error);
    res.status(500).json({ error: "Failed to update list item" });
  }
};

// Removing item from list
export const removeFromList = async (req, res) => {
  try {
    const { itemId, itemType } = req.params;
    const result = await List.findOneAndDelete({
      userId: req.userId,
      itemId,
      itemType,
    });
    if (!result) {
      return res.status(404).json({ error: "Item not found in list" });
    }
    res.json({ message: "Removed from list", listItem: result });
  } catch (error) {
    console.error("Error removing from list:", error);
    res.status(500).json({ error: "Failed to remove from list" });
  }
};

// Getting list statistics
export const getListStats = async (req, res) => {
  try {
    const { itemType } = req.params;
    const stats = await List.aggregate([
      { $match: { userId: req.userId, itemType } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
    const formattedStats = stats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});
    res.json(formattedStats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
};
