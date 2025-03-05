"use client";
import Header, { User } from "@/common/Header";
import { Toast } from "@/common/utils";
import { Field, Label, Select } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import axios from "axios";
import clsx from "clsx";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

interface History {
  attendanceRecords: HistoryItem[];
  employeeId: string;
  month: string;
  totalDays: number;
  totalHours: number;
  year: string;
}

interface HistoryItem {
  checkIn: string;
  checkOut: string;
  date: string;
  employeeId: User;
  workHours: number;
}

export default function Page() {
  const token = Cookies.get("token");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [historyData, setHistoryData] = useState<History>({
    employeeId: "",
    month: "",
    totalDays: 0,
    totalHours: 0,
    year: "",
    attendanceRecords: [],
  });

  const currentDate = new Date();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  useEffect(() => {
    const currentUser = JSON.parse(
      localStorage.getItem("employeeInfo") || "null"
    );

    if (currentUser?._id) {
      setData((prev) => ({ ...prev, employeeId: currentUser._id }));
    }
  }, []);

  const [data, setData] = useState({
    employeeId: "",
    month: month,
    year: year,
  });

  useEffect(() => {
    if (!data.employeeId) return;
    const fetchHistory = async (page = 1) => {
      try {
        const response = await axios(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/attendance/monthly/${data.employeeId}/${data.month}/${data.year}?page=${page}&limit=${limit}`,
          {
            headers: { Authorization: token },
          }
        );
        if (response?.data?.status === true) {
          setHistoryData(response.data.data);
          setTotalPages(response.data.totalCount);
          Toast("Success in getting employee History", "Success");
        }
      } catch (error) {
        console.error(error);
        Toast("Failed in getting employee History", "error");
      }
    };
    fetchHistory(currentPage);
  }, [data.employeeId, data.month, data.year, currentPage]);

  return (
    <div>
      <Header />
      <div className="pt-10 container w-full">
        <div className="flex gap-5 justify-center pb-5">
          <Field>
            <Label className="text-sm/6 font-bold text-black">
              Select Month
            </Label>

            <div className="relative">
              <Select
                className={clsx(
                  "mt-1 block w-full z-40 appearance-none cursor-pointer rounded-lg border border-black bg-white py-1.5 px-3 text-sm/6 text-black",
                  "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
                  "*:text-black"
                )}
                value={JSON.stringify(0 + data.month)}
                onChange={(e) => {
                  setData({ ...data, month: Number(e.target.value) });
                }}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
              </Select>
              <ChevronDownIcon
                className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-black"
                aria-hidden="true"
              />
            </div>
          </Field>
          <Field className="w-28">
            <Label className="text-sm/6 font-bold text-black">
              Select Year
            </Label>

            <div className="relative">
              <Select
                className={clsx(
                  "mt-1 block w-full appearance-none cursor-pointer rounded-lg border border-black bg-white py-1.5 px-3 text-sm/6 text-black",
                  "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
                  "*:text-black"
                )}
                value={JSON.stringify(data.year)}
                onChange={(e) => {
                  setData({ ...data, year: Number(e.target.value) });
                }}
              >
                <option value="2025">2024</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
                <option value="2028">2028</option>
                <option value="2029">2029</option>
                <option value="2030">2030</option>
                <option value="2031">2031</option>
                <option value="2032">2032</option>
                <option value="2033">2033</option>
                <option value="2034">2034</option>
                <option value="2035">2035</option>
                <option value="2036">2036</option>
                <option value="2037">2037</option>
                <option value="2038">2038</option>
                <option value="2039">2039</option>
                <option value="2040">2040</option>
                <option value="2041">2041</option>
                <option value="2042">2042</option>
                <option value="2043">2043</option>
                <option value="2044">2044</option>
                <option value="2045">2045</option>
                <option value="2046">2046</option>
                <option value="2047">2047</option>
              </Select>
              <ChevronDownIcon
                className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-black"
                aria-hidden="true"
              />
            </div>
          </Field>
        </div>
        {historyData?.attendanceRecords?.length > 0 ? (
          <>
            <div className="overflow-auto rounded-lg shadow-md min-h-[50%]">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-white uppercase bg-[#2596be]">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Check IN
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Check OUT
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Working Hours
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {historyData.attendanceRecords.map(
                    (product: HistoryItem, index: number) => (
                      <tr
                        key={index}
                        className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 ${
                          index === historyData.attendanceRecords.length - 1
                            ? ""
                            : "border-b"
                        }`}
                      >
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {product?.employeeId?.name}
                        </th>
                        <td className="px-6 py-4">{product.date}</td>
                        <td className="px-6 py-4">{product.checkIn}</td>
                        <td className="px-6 py-4">
                          {product.checkOut ? product.checkOut : "Not checkOut"}
                        </td>
                        <td className="px-6 py-4">
                          {Math.round(product.workHours)}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
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
          </>
        ) : (
          <div className="text-center py-4 text-gray-500">
            No attendance records found.
          </div>
        )}
      </div>
    </div>
  );
}
