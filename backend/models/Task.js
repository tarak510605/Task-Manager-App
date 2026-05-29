import mongoose from "mongoose";

export const TASK_STAGES = ["Todo", "In Progress", "Done"];

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [2, "Title must be at least 2 characters"],
      maxlength: [120, "Title must be at most 120 characters"]
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [1000, "Description must be at most 1000 characters"]
    },
    stage: {
      type: String,
      enum: TASK_STAGES,
      default: "Todo"
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    }
  },
  { timestamps: true }
);

taskSchema.index({ userId: 1, stage: 1, updatedAt: -1 });

const Task = mongoose.model("Task", taskSchema);

export default Task;
