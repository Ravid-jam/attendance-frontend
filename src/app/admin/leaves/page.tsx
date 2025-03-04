"use client";
import { formatDate, Toast } from "@/common/utils";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { register } from "../employees/page";

type LeavesList = {
  _id: string;
  name: register;
  leaveType: string;
  startDate: string | Date;
  endDate: string | Date;
  reason: string;
  status: string;
};

export default function Page() {
  const token = Cookies.get("token");
  const [leaves, setLeaves] = useState([]);
  const [user, setCurrentUser] = useState({
    employeeId: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    const currentUser = JSON.parse(
      localStorage.getItem("employeeInfo") || "null"
    );

    if (currentUser?._id) {
      setCurrentUser((prev) => ({ ...prev, employeeId: currentUser._id }));
    }
  }, []);

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

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/leaves/updateStatus/${id}`,
        {
          status,
        },
        {
          headers: { Authorization: token },
        }
      );
      if (response?.data?.status === true) {
        Toast("Leave status updated successfully", "Success");
        livesList();
      }
    } catch (error) {
      console.error(error);
      Toast("Failed to update leave status", "error");
    }
  };

  return (
    <div className="pt-10 container w-full flex flex-col gap-5">
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
              {leaves?.map((employee: LeavesList, index: number) => (
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
                  <td className="px-6 py-4">{formatDate(employee?.endDate)}</td>
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
                  <td className="px-6 py-4 font-bold">
                    <select
                      name="status"
                      id="status"
                      defaultValue={employee.status}
                      onChange={(e) =>
                        updateStatus(employee._id, e.target.value)
                      }
                      className="p-2 rounded-md border focus-within:outline-0"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Denied">Denied</option>
                    </select>
                  </td>
                </tr>
              ))}
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
  );
}
