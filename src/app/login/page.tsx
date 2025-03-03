"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Toast } from "@/common/utils";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
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
    formState: { errors },
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
          router.push("/");
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
        <div className="h-10 w-auto">
          <img
            alt="Your Company"
            src="/assets/logo.png"
            className="mx-auto bg-[#2596be] rounded-[18px] h-16 w-auto"
          />
        </div>
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                type="email"
                {...register("email")}
                className={`block w-full rounded-md bg-white border px-3 py-2 text-base text-gray-900 placeholder:text-gray-400 sm:text-sm ${
                  errors.email
                    ? "border-red-500 focus:outline-2 focus:outline-red-500"
                    : "border-gray-300 focus:outline-2 focus:outline-[#2596be]"
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900"
              >
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                type="password"
                {...register("password")}
                className={`block w-full rounded-md bg-white border px-3 py-2 text-base text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:outline-[#2596be] sm:text-sm ${
                  errors.password
                    ? "border-red-500 focus:outline-2 focus:outline-red-500"
                    : "border-gray-300 focus:outline-2 focus:outline-[#2596be]"
                }`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-[#2596be] px-3 py-1.5 text-sm font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
