import { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthCard } from "../components/auth/AuthCard";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { useAuth } from "../context/AuthContext";
import type { LoginInput } from "../services/authService";

export const LoginPage = () => {
  const { login, token } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const {
    formState: { errors },
    handleSubmit,
    register
  } = useForm<LoginInput>();

  if (token) return <Navigate to="/" replace />;

  const onSubmit = async (values: LoginInput) => {
    try {
      setSubmitting(true);
      await login(values);
    } catch (error) {
      const message = error instanceof AxiosError ? error.response?.data?.message : "Login failed";
      toast.error(message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthCard title="Welcome back" subtitle="Sign in to continue managing your board.">
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input label="Email" type="email" error={errors.email} {...register("email", { required: "Email is required" })} />
        <Input
          label="Password"
          type="password"
          error={errors.password}
          {...register("password", { required: "Password is required" })}
        />
        <Button className="w-full" isLoading={submitting} type="submit">
          Login
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-ink/65 dark:text-white/65">
        New here?{" "}
        <Link className="font-semibold text-steel dark:text-sky-200" to="/register">
          Create an account
        </Link>
      </p>
    </AuthCard>
  );
};
