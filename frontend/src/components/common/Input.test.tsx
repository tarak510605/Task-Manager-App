import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";
import { Input } from "./Input";

interface FormValues {
  name: string;
}

const TestForm = ({ onSubmit }: { onSubmit: (values: FormValues) => void }) => {
  const { handleSubmit, register } = useForm<FormValues>();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input label="Name" {...register("name", { required: "Name is required" })} />
      <Button type="submit">Save</Button>
    </form>
  );
};

describe("Input", () => {
  it("forwards refs so React Hook Form receives typed values", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<TestForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Name"), "Tarak");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(onSubmit).toHaveBeenCalledWith({ name: "Tarak" }, expect.anything());
  });
});
