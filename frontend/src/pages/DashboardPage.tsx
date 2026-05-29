import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { AxiosError } from "axios";
import { Filter, Plus, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../components/common/Button";
import { EmptyState } from "../components/common/EmptyState";
import { Spinner } from "../components/common/Spinner";
import { TaskColumn } from "../components/tasks/TaskColumn";
import { TaskForm } from "../components/tasks/TaskForm";
import { taskService } from "../services/taskService";
import type { Stage, Task, TaskPayload } from "../types";
import { STAGES } from "../utils/stages";

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof AxiosError ? error.response?.data?.message || fallback : fallback;

export const DashboardPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState<Stage | "All">("All");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchTasks = async (isInitialLoad = false) => {
  try {
    if (isInitialLoad) {
      setLoading(true);
    }

    setError("");

    const data = await taskService.list({
      search,
      stage: stageFilter,
      page,
      limit: 30
    });

    setTasks(data.tasks);
    setPages(data.pagination.pages);
    setTotal(data.pagination.total);
  } catch (fetchError) {
    setError(getErrorMessage(fetchError, "Unable to load tasks"));
  } finally {
    if (isInitialLoad) {
      setLoading(false);
    }
  }
};
  useEffect(() => {
  const handle = window.setTimeout(() => {
    fetchTasks(true);
  }, 250);

    return () => window.clearTimeout(handle);
  }, [page, search, stageFilter]);

  useEffect(() => {
    setPage(1);
  }, [search, stageFilter]);



  const tasksByStage = useMemo(
    () =>
      STAGES.reduce<Record<Stage, Task[]>>(
        (groups, stage) => ({
          ...groups,
          [stage]: tasks.filter((task) => task.stage === stage)
        }),
        { Todo: [], "In Progress": [], Done: [] }
      ),
    [tasks]
  );

  const closeForm = () => {
    setEditingTask(null);
    setIsFormOpen(false);
  };

  const handleSave = async (payload: TaskPayload) => {
    try {
      setSubmitting(true);
      if (editingTask) {
        await taskService.update(editingTask._id, payload);
        toast.success("Task updated");
      } else {
        await taskService.create(payload);
        toast.success("Task created");
      }
      closeForm();
      await fetchTasks();
    } catch (saveError) {
      toast.error(getErrorMessage(saveError, "Unable to save task"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (task: Task) => {
    const confirmed = window.confirm(`Delete "${task.title}"?`);
    if (!confirmed) return;

    try {
      await taskService.remove(task._id);
      toast.success("Task deleted");
      await fetchTasks();
    } catch (deleteError) {
      toast.error(getErrorMessage(deleteError, "Unable to delete task"));
    }
  };

  const moveTask = async (task: Task, stage: Stage) => {
  if (task.stage === stage) return;

  const previousTasks = tasks;

  // Update UI immediately
  setTasks((current) =>
    current.map((item) =>
      item._id === task._id
        ? { ...item, stage }
        : item
    )
  );

  try {
    await taskService.updateStage(task._id, stage);
    toast.success(`Moved to ${stage}`);

    // Don't reload tasks here
  } catch (moveError) {
    setTasks(previousTasks);
    toast.error(getErrorMessage(moveError, "Unable to move task"));
  }
};

  const handleDragEnd = (result: DropResult) => {
    const task = tasks.find((item) => item._id === result.draggableId);
    const destinationStage = result.destination?.droppableId as Stage | undefined;

    if (!task || !destinationStage) return;
    moveTask(task, destinationStage);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <section className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">Task Board</h2>
          <p className="mt-1 text-sm text-ink/60 dark:text-white/60">{total} tasks across your workflow</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40 dark:text-white/40" />
            <input
              className="h-10 w-full rounded-md border border-ink/10 bg-white pl-9 pr-3 text-sm outline-none focus:border-steel focus:ring-4 focus:ring-steel/10 dark:border-white/10 dark:bg-white/10 sm:w-72"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search tasks"
              value={search}
            />
          </div>
          <label className="relative">
            <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40 dark:text-white/40" />
            <select
              className="h-10 w-full rounded-md border border-ink/10 bg-white pl-9 pr-9 text-sm outline-none focus:border-steel focus:ring-4 focus:ring-steel/10 dark:border-white/10 dark:bg-white/10 sm:w-44"
              onChange={(event) => setStageFilter(event.target.value as Stage | "All")}
              value={stageFilter}
            >
              <option value="All">All stages</option>
              {STAGES.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </label>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4" />
            New task
          </Button>
        </div>
      </section>

      {isFormOpen || editingTask ? (
        <section className="mb-5 rounded-md border border-ink/10 bg-white p-4 shadow-soft dark:border-white/10 dark:bg-white/10">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold">{editingTask ? "Edit task" : "Create task"}</h2>
            <Button aria-label="Close form" className="h-9 w-9 px-0" onClick={closeForm} title="Close form" variant="ghost">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <TaskForm isSubmitting={submitting} onCancel={closeForm} onSubmit={handleSave} task={editingTask} />
        </section>
      ) : null}

      {loading ? <Spinner label="Loading tasks" /> : null}

      {!loading && error ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
          {error}
        </div>
      ) : null}

      {!loading && !error && tasks.length === 0 ? (
        <EmptyState title="Your board is clear" message="Create your first task or adjust the active filters." />
      ) : null}

      {!loading && !error && tasks.length > 0 ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid gap-4 lg:grid-cols-3">
            {STAGES.map((stage) => (
              <TaskColumn
                key={stage}
                onDelete={handleDelete}
                onEdit={(task) => {
                  setEditingTask(task);
                  setIsFormOpen(true);
                }}
                onMove={moveTask}
                stage={stage}
                tasks={tasksByStage[stage]}
              />
            ))}
          </div>
        </DragDropContext>
      ) : null}

      {pages > 1 ? (
        <div className="mt-5 flex items-center justify-end gap-2">
          <Button disabled={page === 1} onClick={() => setPage((current) => Math.max(current - 1, 1))} variant="secondary">
            Previous
          </Button>
          <span className="text-sm font-medium text-ink/65 dark:text-white/65">
            Page {page} of {pages}
          </span>
          <Button disabled={page === pages} onClick={() => setPage((current) => Math.min(current + 1, pages))} variant="secondary">
            Next
          </Button>
        </div>
      ) : null}
    </main>
  );
};
