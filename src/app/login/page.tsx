"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Toast } from "@/common/utils";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Button from "@/common/Button";
import InputField from "@/common/InputField";
type Login = {
  email: string;
  password: string;
};
const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

export default function Page() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Login>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: Login) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
        data
      );
      if (response.data.status === true) {
        Cookies.set("token", response?.data?.token);
        localStorage.setItem(
          "employeeInfo",
          JSON.stringify(response?.data?.data)
        );
        if (response?.data?.data?.role === "ADMIN") {
          router.push("/admin/dashboard");
        } else {
          router.push("/user/dashboard");
        }
        Toast("Logged in successfully", "Success");
      }
    } catch (err) {
      console.error(err);
      Toast("Invalid email or password", "error");
    }
  };

  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="h-16 w-auto ">
          <img
            alt="Your Company"
            src="/assets/logo.png"
            className="h-full w-full object-contain"
          />
        </div>
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <InputField
            id="email"
            type="email"
            label="Email"
            {...register("email")}
            error={errors.email}
          />

          <InputField
            id="password"
            type="password"
            label="Password"
            {...register("password")}
            error={errors.password}
          />
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            {isSubmitting ? "Loading..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
