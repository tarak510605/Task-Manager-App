import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import type { Stage, Task, TaskPayload } from "../../types";
import { STAGES } from "../../utils/stages";

interface TaskFormProps {
  defaultStage?: Stage;
  isSubmitting: boolean;
  onCancel?: () => void;
  onSubmit: (payload: TaskPayload) => Promise<void>;
  task?: Task | null;
}

export const TaskForm = ({ defaultStage = "Todo", isSubmitting, onCancel, onSubmit, task }: TaskFormProps) => {
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset
  } = useForm<TaskPayload>({
    defaultValues: {
      title: "",
      description: "",
      stage: defaultStage
    }
  });

  useEffect(() => {
    reset({
      title: task?.title || "",
      description: task?.description || "",
      stage: task?.stage || defaultStage
    });
  }, [defaultStage, reset, task]);

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Title"
        placeholder="Design review checklist"
        error={errors.title}
        {...register("title", {
          required: "Title is required",
          minLength: { value: 2, message: "Use at least 2 characters" }
        })}
      />
      <Input
        label="Description"
        placeholder="What needs to happen?"
        error={errors.description}
        multiline
        {...register("description", {
          required: "Description is required",
          maxLength: { value: 1000, message: "Keep it under 1000 characters" }
        })}
      />
      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-ink/80 dark:text-white/80">Stage</span>
        <select
          className="w-full rounded-md border border-ink/10 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-steel focus:ring-4 focus:ring-steel/10 dark:border-white/10 dark:bg-white/10 dark:text-white"
          {...register("stage")}
        >
          {STAGES.map((stage) => (
            <option key={stage} value={stage}>
              {stage}
            </option>
          ))}
        </select>
      </label>
      <div className="flex justify-end gap-2">
        {onCancel ? (
          <Button onClick={onCancel} variant="secondary">
            Cancel
          </Button>
        ) : null}
        <Button isLoading={isSubmitting} type="submit">
          {task ? "Save task" : "Create task"}
        </Button>
      </div>
    </form>
  );
};
