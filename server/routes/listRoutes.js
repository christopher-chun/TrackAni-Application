import express from "express";
import requireAuth from "../middleware/auth.js";
import {
  getList,
  getListItem,
  addToList,
  updateListItem,
  removeFromList,
  getListStats,
} from "../controllers/listController.js";

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// GET /api/list - Get user's list (with optional filters)
router.get("/", getList);
// GET /api/list/stats/:itemType - Get list statistics
router.get("/stats/:itemType", getListStats);
// GET /api/list/:itemId/:itemType - Get single list item
router.get("/:itemId/:itemType", getListItem);
// POST /api/list - Add to list
router.post("/", addToList);
// PATCH /api/list/:itemId/:itemType - Update list item
router.patch("/:itemId/:itemType", updateListItem);
// DELETE /api/list/:itemId/:itemType - Remove from list
router.delete("/:itemId/:itemType", removeFromList);

export default router;
