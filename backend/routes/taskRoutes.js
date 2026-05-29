import express from "express";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
  updateTaskStage
} from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateStage, validateTask } from "../middleware/validateRequest.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getTasks).post(validateTask, createTask);
router.route("/:id").put(validateTask, updateTask).delete(deleteTask);
router.patch("/:id/stage", validateStage, updateTaskStage);

export default router;
