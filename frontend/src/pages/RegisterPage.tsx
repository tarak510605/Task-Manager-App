import { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthCard } from "../components/auth/AuthCard";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { useAuth } from "../context/AuthContext";
import type { RegisterInput } from "../services/authService";

export const RegisterPage = () => {
  const { register: createAccount, token } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const {
    formState: { errors },
    handleSubmit,
    register
  } = useForm<RegisterInput>();

  if (token) return <Navigate to="/" replace />;

  const onSubmit = async (values: RegisterInput) => {
    try {
      setSubmitting(true);
      await createAccount(values);
    } catch (error) {
      const message = error instanceof AxiosError ? error.response?.data?.message : "Registration failed";
      toast.error(message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthCard title="Create account" subtitle="Start with a private task board secured by JWT auth.">
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input label="Name" error={errors.name} {...register("name", { required: "Name is required" })} />
        <Input label="Email" type="email" error={errors.email} {...register("email", { required: "Email is required" })} />
        <Input
          label="Password"
          type="password"
          error={errors.password}
          {...register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "Use at least 6 characters" }
          })}
        />
        <Button className="w-full" isLoading={submitting} type="submit">
          Register
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-ink/65 dark:text-white/65">
        Already have an account?{" "}
        <Link className="font-semibold text-steel dark:text-sky-200" to="/login">
          Login
        </Link>
      </p>
    </AuthCard>
  );
};
