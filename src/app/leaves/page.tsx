"use client";
import Header from "@/common/Header";
import { formatDate, Toast } from "@/common/utils";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/16/solid";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import Cookies from "js-cookie";
import { register } from "../admin/employees/page";

interface Employee {
  _id: string;
  name: string;
  reason: string;
  startDate: Date;
  endDate: Date;
  status: number;
}

type LeavesList = {
  _id: string;
  name: register;
  leaveType: string;
  startDate: string | Date;
  endDate: string | Date;
  reason: string;
  status: string;
};

type formData = {
  leaveType: string;
  startDate: Date;
  endDate: Date;
  reason: string;
};
const leaveSchema = yup.object().shape({
  leaveType: yup
    .string()
    .oneOf(
      ["Sick", "Vacation", "Maternity Leave", "Paternity Leave"],
      "Invalid leave type"
    )
    .required("Leave type is required"),
  startDate: yup.date().required("Start date is required"),
  endDate: yup
    .date()
    .required("End date is required")
    .min(yup.ref("startDate"), "End date must be after start date"),
  reason: yup
    .string()
    .required("Reason is required")
    .min(10, "Reason must be at least 10 characters"),
});

export default function Page() {
  const token = Cookies.get("token");
  const [isOpen, setIsOpen] = useState(false);
  const [leaves, setLeaves] = useState([]);
  const [objLeaves, setObjLives] = useState<LeavesList>();
  const [user, setCurrentUser] = useState({
    employeeId: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const router = useRouter();

  useEffect(() => {
    const currentUser = JSON.parse(
      localStorage.getItem("employeeInfo") || "null"
    );

    if (currentUser?._id) {
      setCurrentUser((prev) => ({ ...prev, employeeId: currentUser._id }));
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(leaveSchema),
  });

  const livesList = async (page = 1) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/leaves/listLeave?page=${page}&limit=${limit}`,
        {
          headers: { Authorization: token },
        }
      );
      if (response?.data?.status === true) {
        setLeaves(response.data.data);
        setTotalPages(response.data.totalCount);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!user.employeeId) return;
    livesList(currentPage);
  }, [user, currentPage]);

  const deleteLeave = async (leaveId: string) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/leaves/remove/${leaveId}`,
        {
          headers: { Authorization: token },
        }
      );
      if (response?.data?.status === true) {
        Toast("Leave deleted successfully", "Success");
        setLeaves(leaves.filter((emp: Employee) => emp._id !== leaveId));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = async (data: formData) => {
    if (objLeaves?._id) {
      try {
        console.log(formatDate(data.startDate), "gg");
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/leaves/update/${objLeaves._id}`,
          {
            name: objLeaves.name._id,
            leaveType: data.leaveType,
            startDate: data.startDate,
            endDate: data.endDate,
            reason: data.reason,
          },
          {
            headers: { Authorization: token },
          }
        );
        if (response.data.status === true) {
          setIsOpen(false);
          Toast("Updated successfully", "Success");
          livesList();
          router.push("/leaves");
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/leaves/addLeave`,
          {
            name: user.employeeId,
            leaveType: data.leaveType,
            startDate: data.startDate,
            endDate: data.endDate,
            reason: data.reason,
          },
          {
            headers: { Authorization: token },
          }
        );
        if (response.data.status === true) {
          setIsOpen(false);
          router.push("/leaves");
          livesList();
          Toast("Added successfully", "Success");
        }
      } catch (err) {
        console.error(err);
        Toast("Invalid email or password", "error");
      }
    }
  };

  return (
    <div>
      <Header />
      <div className="pt-10 container w-full flex flex-col gap-5">
        <div className="flex justify-end">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white bg-gradient-to-br  from-[#2596be] to-[#5c85d6] hover:bg-gradient-to-bl font-medium rounded-lg text-base px-4 py-2.5 text-center me-2"
          >
            New Leave
          </button>
        </div>
        {leaves?.length > 0 ? (
          <div className="overflow-auto rounded-lg shadow-md min-h-[50%]">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead className="text-xs text-white uppercase bg-[#2596be]">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Start Date
                  </th>
                  <th scope="col" className="px-6 py-3">
                    End Date
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Leave Type
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Reson of Lives
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {leaves?.map(
                  (employee: LeavesList, index: number) => (
                    console.log(employee.status),
                    (
                      <tr
                        key={index}
                        className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 ${
                          index === leaves.length - 1 ? "" : "border-b"
                        }`}
                      >
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {employee?.name?.name}
                        </th>
                        <td className="px-6 py-4">
                          {formatDate(employee?.startDate)}
                        </td>
                        <td className="px-6 py-4">
                          {formatDate(employee?.endDate)}
                        </td>
                        <td className="px-6 py-4">{employee.leaveType}</td>
                        <td className="px-6 py-4">{employee.reason}</td>
                        {employee.status === "Pending" && (
                          <td className="px-6 py-4 text-yellow-600 font-bold">
                            {employee?.status}
                          </td>
                        )}
                        {employee.status === "Approved" && (
                          <td className="px-6 py-4 text-green-500 font-bold">
                            {employee?.status}
                          </td>
                        )}
                        {employee.status === "Denied" && (
                          <td className="px-6 py-4 text-red-500 font-bold">
                            {employee?.status}
                          </td>
                        )}
                        <td className="px-6 py-4 flex justify-start items-center gap-5 ">
                          <PencilIcon
                            className="h-6 w-6 cursor-pointer !text-[#2596be]"
                            onClick={() => {
                              setIsOpen(true);
                              setObjLives(employee);
                            }}
                          />
                          <TrashIcon
                            className="h-6 w-6 cursor-pointer"
                            color="red"
                            onClick={() => {
                              if (
                                window.confirm(
                                  `Are you sure you want to delete ${employee?.name?.name}'s Leaves`
                                )
                              ) {
                                deleteLeave(employee._id);
                              }
                            }}
                          />
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            No attendance records found.
          </div>
        )}
        <div className="flex justify-center gap-10 items-center mt-4">
          <button
            className="px-4 py-2 text-white bg-[#2596be] rounded disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>

          <button
            className="px-4 py-2 text-white bg-[#2596be] rounded disabled:opacity-50"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        transition
        className="fixed inset-0 flex min-w-screen items-center justify-center bg-black/80 p-4 transition duration-300 ease-out data-[closed]:opacity-0"
      >
        <DialogPanel className="w-[50%] space-y-4 bg-white p-12 rounded-md">
          <DialogTitle className="font-bold">Leaves</DialogTitle>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-10">
              <div>
                <label
                  htmlFor="LiveType"
                  className="block text-sm font-medium text-gray-900"
                >
                  Live Type
                </label>
                <div className="mt-2">
                  <select
                    id="LiveType"
                    {...register("leaveType")}
                    defaultValue={objLeaves?._id ? objLeaves.leaveType : ""}
                    className={`block w-full rounded-md border px-3 py-2 text-base text-gray-900 sm:text-sm ${
                      errors.leaveType
                        ? "border-red-500 focus:outline-red-500"
                        : "border-gray-300 focus:outline-[#2596be]"
                    }`}
                  >
                    <option value="" disabled>
                      Select Leave Type
                    </option>
                    <option value="Sick">Sick</option>
                    <option value="Vacation">Vacation</option>
                    <option value="Maternity Leave">Maternity Leave</option>
                    <option value="Paternity Leave">Paternity Leave</option>
                  </select>
                  {errors.leaveType && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.leaveType.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-900"
                >
                  Start Date
                </label>
                <div className="mt-2">
                  <input
                    id="startDate"
                    type="date"
                    {...register("startDate")}
                    defaultValue={
                      objLeaves?._id
                        ? formatDate(objLeaves.startDate)
                        : formatDate(new Date())
                    }
                    className={`block w-full rounded-md border px-3 py-2 text-base text-gray-900 sm:text-sm ${
                      errors.startDate
                        ? "border-red-500 focus:outline-red-500"
                        : "border-gray-300 focus:outline-[#2596be]"
                    }`}
                  />
                  {errors.startDate && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.startDate.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-gray-900"
                >
                  End Date
                </label>
                <div className="mt-2">
                  <input
                    id="endDate"
                    type="date"
                    {...register("endDate")}
                    defaultValue={
                      objLeaves?._id
                        ? formatDate(objLeaves.endDate)
                        : formatDate(new Date())
                    }
                    className={`block w-full rounded-md border px-3 py-2 text-base text-gray-900 sm:text-sm ${
                      errors.endDate
                        ? "border-red-500 focus:outline-red-500"
                        : "border-gray-300 focus:outline-[#2596be]"
                    }`}
                  />
                  {errors.endDate && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.endDate.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="reason"
                  className="block text-sm font-medium text-gray-900"
                >
                  Reason for Leave
                </label>
                <div className="mt-2">
                  <textarea
                    id="reason"
                    {...register("reason")}
                    defaultValue={objLeaves?._id ? objLeaves.reason : ""}
                    className={`block w-full rounded-md border px-3 py-2 text-base text-gray-900 sm:text-sm ${
                      errors.reason
                        ? "border-red-500 focus:outline-red-500"
                        : "border-gray-300 focus:outline-[#2596be]"
                    }`}
                    rows={3}
                    placeholder="Enter reason"
                  ></textarea>
                  {errors.reason && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.reason.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-10 gap-4">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 text-gray-600 bg-gray-200 rounded-lg text-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                className="text-white bg-gradient-to-br from-[#2596be] to-[#5c85d6] hover:bg-gradient-to-bl font-medium rounded-lg text-lg px-4 py-1.5"
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
