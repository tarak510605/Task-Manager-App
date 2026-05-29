import { describe, expect, it } from "vitest";
import { nextStage, STAGES } from "./stages";

describe("stage utilities", () => {
  it("defines the expected task stages", () => {
    expect(STAGES).toEqual(["Todo", "In Progress", "Done"]);
  });

  it("cycles move-button target stages", () => {
    expect(nextStage("Todo")).toBe("In Progress");
    expect(nextStage("In Progress")).toBe("Done");
    expect(nextStage("Done")).toBe("Todo");
  });
});
