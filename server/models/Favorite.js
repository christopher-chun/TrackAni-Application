import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  itemId: {
    type: String,
    required: true,
  },
  itemType: {
    type: String,
    enum: ['anime', 'manga'],
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

// Preventing duplicate favorites
favoriteSchema.index({ userId: 1, itemId: 1, itemType: 1 }, { unique: true });

const Favorite = mongoose.model('Favorite', favoriteSchema);

export default Favorite;