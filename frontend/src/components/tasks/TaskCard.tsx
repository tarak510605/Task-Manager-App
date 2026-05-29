import { Draggable } from "@hello-pangea/dnd";
import { ArrowRight, Pencil, Trash2 } from "lucide-react";
import { Button } from "../common/Button";
import type { Stage, Task } from "../../types";
import { nextStage, stageTone } from "../../utils/stages";

interface TaskCardProps {
  index: number;
  onDelete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onMove: (task: Task, stage: Stage) => void;
  task: Task;
}

export const TaskCard = ({ index, onDelete, onEdit, onMove, task }: TaskCardProps) => {
  const targetStage = nextStage(task.stage);

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <article
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`rounded-md border border-ink/10 bg-white p-4 shadow-sm transition dark:border-white/10 dark:bg-white/10 ${
            snapshot.isDragging ? "rotate-1 shadow-soft" : ""
          }`}
        >
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold leading-snug text-ink dark:text-white">{task.title}</h3>
              <span className={`mt-2 inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${stageTone[task.stage]}`}>
                {task.stage}
              </span>
            </div>
            <div className="flex shrink-0 gap-1">
              <Button aria-label="Edit task" className="h-8 w-8 px-0" onClick={() => onEdit(task)} title="Edit task" variant="ghost">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                aria-label="Delete task"
                className="h-8 w-8 px-0 text-red-600 dark:text-red-300"
                onClick={() => onDelete(task)}
                title="Delete task"
                variant="ghost"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="whitespace-pre-line text-sm leading-6 text-ink/65 dark:text-white/65">{task.description}</p>
          <Button className="mt-4 w-full" onClick={() => onMove(task, targetStage)} variant="secondary">
            <ArrowRight className="h-4 w-4" />
            Move to {targetStage}
          </Button>
        </article>
      )}
    </Draggable>
  );
};
