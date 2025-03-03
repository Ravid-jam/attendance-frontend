"use client";
import Header from "@/common/Header";
import { Toast } from "@/common/utils";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/16/solid";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

interface Employee {
  _id: string;
  name: string;
  email: string;
  role: string;
  totalWorkHours: string;
  totalDays: number;
  password: string;
}

type register = {
  name: string;
  email: string;
  password: string;
  role: string;
};
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
  role: yup.string().required("Role is required"),
});

export default function Page() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const [employees, setEmployees] = useState([]);
  const [objEmployee, setObjEmployee] = useState<Employee>();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<register>({
    resolver: yupResolver(schema),
  });

  const employeeList = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/listEmployees`
      );
      if (response?.data?.status === true) {
        Toast("Employees Fetched successfully", "Success");
        setEmployees(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    employeeList();
  }, []);

  const deleteEmployee = async (employeeId: string) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/remove/${employeeId}`
      );
      if (response?.data?.status === true) {
        Toast("Employee deleted successfully", "Success");
        setEmployees(
          employees.filter((emp: Employee) => emp._id !== employeeId)
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = async (data: register) => {
    if (objEmployee?.role === "ADMIN" || objEmployee?.role === "STAFF") {
      try {
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/update/${objEmployee._id}`,
          data
        );
        if (response.data.status === true) {
          setIsOpen(false);
          router.push("/admin/employees");
          employeeList();
          Toast("Updated successfully", "Success");
        }
      } catch (err) {
        console.error(err);
        Toast("Invalid email or password", "error");
      }
    } else {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`,
          data
        );
        if (response.data.status === true) {
          setIsOpen(false);
          router.push("/admin/employees");
          employeeList();
          Toast("Added successfully", "Success");
        }
      } catch (err) {
        console.error(err);
        Toast("Invalid email or password", "error");
      }
    }
  };

  useEffect(() => {
    if (objEmployee) {
      reset({
        role: objEmployee.role,
        password: objEmployee.password,
        name: objEmployee.name,
        email: objEmployee.email,
      });
    }
  }, [isOpen]);

  return (
    <div>
      <Header />
      <div className="pt-32 max-w-screen-2xl mx-auto w-full flex flex-col gap-5">
        <div className="flex justify-end">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white bg-gradient-to-br  from-[#2596be] to-[#5c85d6] hover:bg-gradient-to-bl font-medium rounded-lg text-lg px-4 py-2.5 text-center me-2"
          >
            New Employee
          </button>
        </div>
        {employees?.length > 0 ? (
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-white uppercase bg-[#2596be]">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  email
                </th>
                <th scope="col" className="px-6 py-3">
                  role
                </th>

                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {employees?.map((employee: Employee, index: number) => (
                <tr
                  key={index}
                  className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 ${
                    index === employees.length - 1 ? "" : "border-b"
                  }`}
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {employee?.name}
                  </th>
                  <td className="px-6 py-4">{employee.email}</td>
                  <td className="px-6 py-4">{employee.role}</td>

                  <td className="px-6 py-4 flex justify-start items-center gap-5 ">
                    <PencilIcon
                      className="h-6 w-6 cursor-pointer !text-[#2596be]"
                      onClick={() => {
                        setIsOpen(true);
                        setObjEmployee(employee);
                      }}
                    />
                    <TrashIcon
                      className="h-6 w-6 cursor-pointer"
                      color="red"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Are you sure you want to delete ${employee.name}?`
                          )
                        ) {
                          deleteEmployee(employee._id);
                        }
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-4 text-gray-500">
            No attendance records found.
          </div>
        )}
      </div>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        transition
        className="fixed inset-0 flex min-w-screen items-center justify-center bg-black/30 p-4 transition duration-300 ease-out data-[closed]:opacity-0"
      >
        <DialogPanel className="w-[50%] space-y-4 bg-white p-12 rounded-md">
          <DialogTitle className="font-bold">ADD</DialogTitle>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-10">
              <div>
                <label
                  htmlFor="Name"
                  className="block text-sm font-medium text-gray-900"
                >
                  Name
                </label>
                <div className="mt-2">
                  <input
                    id="name"
                    type="text"
                    {...register("name")}
                    className={`block w-full rounded-md bg-white border px-3 py-2 text-base text-gray-900 placeholder:text-gray-400 sm:text-sm ${
                      errors.name
                        ? "border-red-500 focus:outline-2 focus:outline-red-500"
                        : "border-gray-300 focus:outline-2 focus:outline-[#2596be]"
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-900"
                >
                  Email
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    type="email"
                    {...register("email")}
                    className={`block w-full rounded-md bg-white border px-3 py-2 text-base text-gray-900 placeholder:text-gray-400 sm:text-sm ${
                      errors.email
                        ? "border-red-500 focus:outline-2 focus:outline-red-500"
                        : "border-gray-300 focus:outline-2 focus:[#2596be]"
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
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-900"
                >
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    type="password"
                    {...register("password")}
                    className={`block w-full rounded-md bg-white border px-3 py-2 text-base text-gray-900 placeholder:text-gray-400 sm:text-sm ${
                      errors.password
                        ? "border-red-500 focus:outline-2 focus:outline-red-500"
                        : "border-gray-300 focus:outline-2 focus:[#2596be]"
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
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-900"
                >
                  Role
                </label>
                <div className="mt-2">
                  <select
                    id="role"
                    {...register("role")}
                    className={`block w-full rounded-md bg-white border px-3 py-2 text-base text-gray-900 placeholder:text-gray-400 sm:text-sm ${
                      errors.role
                        ? "border-red-500 focus:outline-2 focus:outline-red-500"
                        : "border-gray-300 focus:outline-2 focus:[#2596be]"
                    }`}
                  >
                    <option value="" disabled>
                      Select Role
                    </option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="STAFF">STAFF</option>
                  </select>
                  {errors.role && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.role.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-10 gap-4">
              <button onClick={() => setIsOpen(false)}>Cancel</button>
              <button
                className="text-white bg-gradient-to-br  from-[#2596be] to-[#5c85d6] hover:bg-gradient-to-bl font-medium rounded-lg text-lg px-4 py-1.5 text-center me-2"
                type="submit"
              >
                Save
              </button>
            </div>
          </form>
        </DialogPanel>
      </Dialog>
    </div>
  );
}
