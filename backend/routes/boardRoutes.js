import express from "express";
import {
  createBoard,
  getBoards,
  getBoard,
  inviteMember,
  removeMember,
  addTask,
  updateTask,
  deleteTask,
} from "../controllers/boardController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);
router.post("/", createBoard);
router.get("/", getBoards);
router.get("/:id", getBoard);
router.post("/:id/members", inviteMember);
router.delete("/:id/members/:userId", removeMember);
router.post("/:id/tasks", addTask);
router.patch("/:id/tasks/:taskId", updateTask);
router.delete("/:id/tasks/:taskId", deleteTask);

export default router;
