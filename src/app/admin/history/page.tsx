"use client";
import Header from "@/common/Header";
import { Toast } from "@/common/utils";
import { Field, Label, Select } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import axios from "axios";
import clsx from "clsx";
import { useEffect, useState } from "react";

interface Employee {
  _id: string;
  name: string;
  email: string;
  role: string;
  totalHours: string;
  totalDays: number;
}

export default function Page() {
  const currentDate = new Date();
  const [employees, setEmployees] = useState([]);
  const [data, setData] = useState({
    employeeId: "",
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear(),
  });
  useEffect(() => {
    const currentUser = JSON.parse(
      localStorage.getItem("employeeInfo") || "null"
    );

    if (currentUser?._id) {
      setData((prev) => ({ ...prev, employeeId: currentUser._id }));
    }
  }, []);

  useEffect(() => {
    if (!data.employeeId) return;
    const employeeList = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/attendance/list/${data.month}/${data.year}`
        );
        if (response?.data?.status === true) {
          Toast("Employees Fetched successfully", "Success");
          setEmployees(response.data.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    employeeList();
  }, [data]);

  return (
    <div>
      <Header />
      <div className="pt-32 max-w-screen-2xl mx-auto w-full">
        <div className="flex gap-5 justify-center  pb-5">
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
                  Total Work Hours
                </th>
                <th scope="col" className="px-6 py-3">
                  Total Work Day
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
                  <td className="px-6 py-4">
                    {employee?.totalHours || 0} hours
                  </td>
                  <td className="px-6 py-4">{employee?.totalDays || 0} days</td>
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
    </div>
  );
}
