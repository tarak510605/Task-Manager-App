import Task from "../models/Task.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const findOwnedTask = (taskId, userId) => Task.findOne({ _id: taskId, userId });

export const getTasks = asyncHandler(async (req, res) => {
  const { stage, search = "", page = 1, limit = 50 } = req.query;
  const query = { userId: req.user._id };

  if (stage) {
    query.stage = stage;
  }

  if (search.trim()) {
    query.$or = [
      { title: { $regex: search.trim(), $options: "i" } },
      { description: { $regex: search.trim(), $options: "i" } }
    ];
  }

  const pageNumber = Math.max(Number(page), 1);
  const pageSize = Math.min(Math.max(Number(limit), 1), 100);
  const skip = (pageNumber - 1) * pageSize;

  const [tasks, total] = await Promise.all([
    Task.find(query).sort({ updatedAt: -1 }).skip(skip).limit(pageSize),
    Task.countDocuments(query)
  ]);

  res.json({
    tasks,
    pagination: {
      page: pageNumber,
      limit: pageSize,
      total,
      pages: Math.ceil(total / pageSize) || 1
    }
  });
});

export const createTask = asyncHandler(async (req, res) => {
  const task = await Task.create({
    title: req.body.title,
    description: req.body.description,
    stage: req.body.stage || "Todo",
    userId: req.user._id
  });

  res.status(201).json(task);
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await findOwnedTask(req.params.id, req.user._id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  task.title = req.body.title;
  task.description = req.body.description;
  task.stage = req.body.stage || task.stage;

  const updated = await task.save();
  res.json(updated);
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await findOwnedTask(req.params.id, req.user._id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  await task.deleteOne();
  res.json({ message: "Task deleted" });
});

export const updateTaskStage = asyncHandler(async (req, res) => {
  const task = await findOwnedTask(req.params.id, req.user._id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  task.stage = req.body.stage;
  const updated = await task.save();

  res.json(updated);
});
