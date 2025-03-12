"use client";
import InputField from "@/common/InputField";
import TextareaField from "@/common/TextareaField";
import { PencilIcon } from "@heroicons/react/16/solid";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useQuery } from "@tanstack/react-query";
import { getEmployeeDetails, updateEmployee } from "@/services/work.services";
import moment from "moment-timezone";
import { Toast } from "@/common/utils";
import { Icons } from "@/common/Icons";
import { useRouter } from "next/navigation";
import Button from "@/common/Button";

const schema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  birthDate: yup
    .string()
    .required("Birth Date is required")
    .test("valid-date", "Birth Date must be in DD-MM-YYYY format", (value) => {
      return moment(value, "DD-MM-YYYY", true).isValid();
    }),
  contactNumber: yup
    .string()
    .matches(/^[0-9]{10}$/, "Contact Number must be 10 digits")
    .required("Contact Number is required"),
  gender: yup
    .string()
    .oneOf(["Male", "Female"], "Gender is required")
    .required("Gender is required"),
  address: yup.string().required("Address is required"),
  password: yup.string().required("Password is required"),
});

export default function Page() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState({
    employeeId: "",
    role: "",
  });

  const { data, refetch } = useQuery({
    queryKey: ["employee", currentUser.employeeId],
    queryFn: async () => {
      if (!currentUser.employeeId) return;
      const response = await getEmployeeDetails(currentUser.employeeId);
      return response;
    },
    refetchOnWindowFocus: false,
  });

  const [image, setImage] = React.useState(undefined);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (profile: any) => {
    try {
      const updatedEmployee: any = await updateEmployee(
        currentUser.employeeId,
        {
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          dateOfBirth: profile.birthDate,
          contactNumber: profile.contactNumber,
          gender: profile.gender,
          address: profile.address,
          password: profile.password,
          profile_Image:
            image !== undefined ? image : data?.data?.profile_Image,
        }
      );

      if (updatedEmployee.status === true) {
        Toast("Profile updated successfully", "Success");
        reset();
        refetch();
        if (currentUser.role === "ADMIN") {
          router.push("/dashboard");
        } else {
          router.push("/");
        }
        const storedEmployeeInfo = JSON.parse(
          localStorage.getItem("employeeInfo") || "{}"
        );

        const updatedEmployeeInfo = {
          ...storedEmployeeInfo,
          ...updatedEmployee?.data,
        };
        localStorage.setItem(
          "employeeInfo",
          JSON.stringify(updatedEmployeeInfo)
        );
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImage(reader.result as any);
      };
    }
  };

  useEffect(() => {
    const currentUser = JSON.parse(
      localStorage.getItem("employeeInfo") || "null"
    );

    if (currentUser?._id) {
      setCurrentUser((prev) => ({
        ...prev,
        employeeId: currentUser._id,
        role: currentUser.role,
      }));
    }
  }, []);

  useEffect(() => {
    reset({
      firstName: data?.data?.firstName || "",
      lastName: data?.data?.lastName || "",
      email: data?.data?.email || "",
      birthDate: data?.data?.dateOfBirth || "",
      contactNumber: data?.data?.contactNumber || "",
      gender: data?.data?.gender || "Male",
      address: data?.data?.address || "",
      password: data?.data?.password || "",
    });
    setImage(data?.data?.profile_Image?.url);
  }, [data?.data]);

  return (
    <form
      className="container flex flex-col gap-10 pt-14"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div
        className="relative mx-auto flex justify-center w-[141px] h-[141px] rounded-full bg-cover bg-center bg-no-repeat border"
        style={{
          backgroundImage: `url(${image || "/assets/profile.png"})`,
        }}
      >
        <div className="absolute top-3 -right-1 bg-blue-500 rounded-full w-8 h-8 flex justify-center items-center ">
          <input
            type="file"
            name="profile"
            id="upload_profile"
            hidden
            accept="image/*"
            onChange={handleImageChange}
          />
          <label
            htmlFor="upload_profile"
            className="flex justify-center items-center cursor-pointer"
          >
            <PencilIcon className="text-white h-5 w-5" />
          </label>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-10 gap-y-9">
        <InputField
          id="FirstName"
          label="First Name"
          type="text"
          {...register("firstName")}
          error={errors.firstName}
        />
        <InputField
          id="LastName"
          label="Last Name"
          type="text"
          {...register("lastName")}
          error={errors.lastName}
        />
        <Controller
          name="birthDate"
          control={control}
          render={({ field }) => (
            <InputField
              id="BirthDate"
              label="Birth Date"
              type="date"
              value={
                field.value
                  ? moment(field.value, "DD-MM-YYYY").format("YYYY-MM-DD")
                  : ""
              }
              onChange={(e) =>
                field.onChange(
                  moment(e.target.value, "YYYY-MM-DD").format("DD-MM-YYYY")
                )
              }
              error={errors.birthDate}
            />
          )}
        />

        <InputField
          id="contactNumber"
          label="Contact Number"
          type="tel"
          {...register("contactNumber")}
          error={errors.contactNumber}
        />

        <InputField
          id="Email"
          label="Email"
          type="email"
          {...register("email")}
          error={errors.email}
        />

        <InputField
          id="password"
          label="Password"
          type="password"
          {...register("password")}
          error={errors.password}
        />

        <TextareaField
          id="Address"
          label="Address"
          rows={5}
          {...register("address")}
          error={errors.address}
        />
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Gender</label>
          <div className="flex items-center gap-5">
            <label className="flex items-center gap-2">
              <Controller
                name="gender"
                control={control}
                defaultValue={"Male"}
                render={({ field }) => (
                  <input
                    type="radio"
                    {...field}
                    value="Male"
                    checked={field.value === "Male"}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                )}
              />
              Male
            </label>
            <label className="flex items-center gap-2">
              <Controller
                name="gender"
                control={control}
                defaultValue={"Female"}
                render={({ field }) => (
                  <input
                    type="radio"
                    {...field}
                    value="Female"
                    checked={field.value === "Female"}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                )}
              />
              Female
            </label>
          </div>
          <p className="text-red-500 text-xs">{errors.gender?.message}</p>
        </div>
      </div>
      <div className="flex justify-end gap-5">
        <div className="flex gap-5 w-96">
          <Button
            onClick={() => {
              if (currentUser.role === "ADMIN") {
                router.push("/admin/dashboard");
              } else {
                router.push("/user/dashboard");
              }
            }}
            variant="secondary"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            {isSubmitting ? "Loading..." : "Save"}
          </Button>
        </div>
      </div>
    </form>
  );
}
