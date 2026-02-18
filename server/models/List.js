import mongoose from "mongoose";

const listSchema = new mongoose.Schema({
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
    enum: ["anime", "manga"],
    required: true,
  },
  status: {
    type: String,
    enum: [
      "watching",
      "reading",
      "completed",
      "plan_to_watch",
      "plan_to_read",
      "dropped",
      "on_hold",
    ],
    default: "plan_to_watch",
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
  },
  notes: {
    type: String,
    maxLength: 500,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Updating the updatedAt timestamp before saving
listSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
});

listSchema.index({ userId: 1, itemId: 1, itemType: 1 }, { unique: true });

const List = mongoose.model("List", listSchema);

export default List;
