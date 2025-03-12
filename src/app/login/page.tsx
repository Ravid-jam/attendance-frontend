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
    <div className="bg-gray-100">
      <div className="flex min-h-screen flex-1 flex-col justify-center max-w-xl mx-auto px-6  py-12 lg:px-8">
        <div className="p-7 border rounded-xl bg-white shadow-lg">
          <div className="flex flex-col gap-5">
            <div className="h-16 w-auto ">
              <img
                alt="Your Company"
                src="/assets/logo.png"
                className="h-full w-full object-contain"
              />
            </div>
            <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900">
              Keep Only Sign In
            </h2>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col w-full space-y-6"
          >
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
    </div>
  );
}
