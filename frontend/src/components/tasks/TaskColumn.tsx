import { Droppable } from "@hello-pangea/dnd";
import { EmptyState } from "../common/EmptyState";
import { TaskCard } from "./TaskCard";
import type { Stage, Task } from "../../types";
import { stageTone } from "../../utils/stages";

interface TaskColumnProps {
  onDelete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onMove: (task: Task, stage: Stage) => void;
  stage: Stage;
  tasks: Task[];
}

export const TaskColumn = ({ onDelete, onEdit, onMove, stage, tasks }: TaskColumnProps) => (
  <section className="flex min-h-[24rem] flex-col rounded-md border border-ink/10 bg-white/55 p-3 dark:border-white/10 dark:bg-white/5">
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-sm font-bold uppercase tracking-[0.12em]">{stage}</h2>
      <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${stageTone[stage]}`}>{tasks.length}</span>
    </div>
    <Droppable droppableId={stage}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`grid flex-1 content-start gap-3 rounded-md transition ${snapshot.isDraggingOver ? "bg-ink/5 dark:bg-white/10" : ""}`}
        >
          {tasks.length ? (
            tasks.map((task, index) => (
              <TaskCard key={task._id} index={index} onDelete={onDelete} onEdit={onEdit} onMove={onMove} task={task} />
            ))
          ) : (
            <EmptyState title="No tasks here" message="Drop or create a task for this stage." />
          )}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  </section>
);
