import type { Stage } from "../types";

export const STAGES: Stage[] = ["Todo", "In Progress", "Done"];

export const nextStage = (stage: Stage): Stage => {
  if (stage === "Todo") return "In Progress";
  if (stage === "In Progress") return "Done";
  return "Todo";
};

export const stageTone: Record<Stage, string> = {
  Todo: "border-steel/20 bg-steel/10 text-steel dark:border-sky-300/20 dark:bg-sky-300/10 dark:text-sky-200",
  "In Progress":
    "border-coral/20 bg-coral/10 text-coral dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-200",
  Done: "border-moss/20 bg-moss/10 text-moss dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-200"
};
