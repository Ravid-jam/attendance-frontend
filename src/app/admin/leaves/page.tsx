"use client";
import Loader from "@/common/Loader";
import { Toast } from "@/common/utils";
import {
  getEmployee,
  getLeaveByDateRange,
  updateLeaveStatus,
} from "@/services/work.services";
import { Field, Select } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { useQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import moment from "moment-timezone";
import { useState } from "react";

export default function Page() {
  const currentYear = moment().year();
  const employeeOptions = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );

  const yearOptions = Array.from({ length: 50 }, (_, i) =>
    (currentYear - 10 + i).toString()
  );

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [objLeave, setObjLeave] = useState<any>({
    employeeId: "",
    month: moment().format("MM"),
    year: moment().format("YYYY"),
  });

  const userList = useQuery({
    queryKey: ["employees"],
    queryFn: async () => await getEmployee(),
  });

  const { data, refetch, isLoading, isFetching, isPending }: any = useQuery({
    queryKey: ["works", objLeave, pagination],
    queryFn: async () => {
      const response = await getLeaveByDateRange(
        objLeave.employeeId,
        objLeave.month,
        objLeave.year,
        pagination
      );
      return response;
    },
    refetchOnWindowFocus: false,
  });

  const columns = [
    {
      accessorKey: "name",
      cell: (info: any) => {
        return (
          <span className="!tw-font-semibold tw-text-sm tw-text-gray-900">
            {info?.row?.original?.name?.firstName}&nbsp;
            {info?.row?.original?.name?.lastName}
          </span>
        );
      },
      header: "Name",
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
    },
    {
      accessorKey: "endDate",
      header: "End Date",
    },
    {
      accessorKey: "leaveType",
      header: "Leave Type",
    },
    {
      accessorKey: "reason",
      header: "Reason For Leave",
    },
    {
      accessorKey: "status",
      cell: (info: any) => {
        return (
          <>
            {info?.row?.original?.status === "Pending" && (
              <span className="text-yellow-600 font-bold">
                {info?.row?.original?.status}
              </span>
            )}
            {info?.row?.original?.status === "Approved" && (
              <span className="text-green-500 font-bold">
                {info?.row?.original?.status}
              </span>
            )}
            {info?.row?.original?.status === "Denied" && (
              <span className="text-red-500 font-bold">
                {info?.row?.original?.status}
              </span>
            )}
          </>
        );
      },
      header: "Status",
    },

    {
      accessorKey: "Action",
      cell: (info: any) => {
        console.log(info?.row?.original);
        return (
          <div className="flex justify-center">
            <Field className="relative w-40">
              <Select
                id="role"
                defaultValue={info?.row?.original?.status}
                className={clsx(
                  " block w-full appearance-none cursor-pointer rounded-md border border-gray-300 bg-white py-2 px-3 text-sm/6 text-black outline-red outline-[#2596be]"
                )}
                onChange={(e) =>
                  updateStatus(info?.row?.original?._id, e.target.value)
                }
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Denied">Denied</option>
              </Select>
              <ChevronDownIcon
                className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-black"
                aria-hidden="true"
              />
            </Field>
          </div>
        );
      },
      header: "Action",
    },
  ];

  const updateStatus = async (id: string, status: string) => {
    try {
      const response: any = await updateLeaveStatus(id, status);
      if (response?.status === true) {
        Toast("Leave status updated successfully", "Success");
        refetch();
      }
    } catch (error) {
      Toast("Failed to update leave status", "error");
    }
  };

  const table = useReactTable({
    data: data?.data || [],
    columns,
    state: {
      pagination,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    manualPagination: true,
    rowCount: data?.totalCount || 0,
  });

  if (isLoading || isFetching || isPending) {
    return <Loader />;
  }

  return (
    <div className="pt-10 container w-full flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-5 justify-between">
        <h1 className="font-semibold text-2xl text-primary">
          Manage Employee Leaves
        </h1>
        <div className="flex gap-5 justify-end ">
          <div className="flex flex-col gap-1">
            <Field className="w-44">
              <label
                htmlFor="employee"
                className="block text-sm font-medium text-gray-900"
              >
                Employee
              </label>
              <div className="relative">
                <Select
                  className={clsx(
                    "mt-2 block w-full appearance-none cursor-pointer rounded-md border border-gray-300 bg-white py-1.5 px-3 text-sm/6 text-black outline-red outline-[#2596be]"
                  )}
                  defaultValue={""}
                  value={objLeave.employeeId}
                  onChange={(e) => {
                    setObjLeave({ ...objLeave, employeeId: e.target.value });
                  }}
                >
                  <option value={""} disabled>
                    Select Employee
                  </option>
                  {userList &&
                    userList?.data &&
                    userList?.data?.data
                      ?.filter((data: any) => data.role === "STAFF")
                      .map((user: any, index: number) => (
                        <option value={user._id} key={index}>
                          {user.firstName}
                        </option>
                      ))}
                </Select>
                <ChevronDownIcon
                  className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-black"
                  aria-hidden="true"
                />
              </div>
            </Field>
          </div>
          <div className="flex flex-col gap-1">
            <Field className="w-44">
              <label
                htmlFor="Month"
                className="block text-sm font-medium text-gray-900"
              >
                Month
              </label>
              <div className="relative">
                <Select
                  className={clsx(
                    "mt-2 block w-full appearance-none cursor-pointer rounded-md border border-gray-300 bg-white py-1.5 px-3 text-sm/6 text-black outline-red outline-[#2596be]"
                  )}
                  defaultValue={""}
                  value={objLeave.month}
                  onChange={(e) => {
                    setObjLeave({ ...objLeave, month: e.target.value });
                  }}
                >
                  <option value={""} disabled>
                    Select Month
                  </option>

                  {employeeOptions.map((id) => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  ))}
                </Select>
                <ChevronDownIcon
                  className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-black"
                  aria-hidden="true"
                />
              </div>
            </Field>
          </div>
          <div className="flex flex-col gap-1">
            <Field className="w-44">
              <label
                htmlFor="Year"
                className="block text-sm font-medium text-gray-900"
              >
                Year
              </label>
              <div className="relative">
                <Select
                  className={clsx(
                    "mt-2 block w-full appearance-none cursor-pointer rounded-md border border-gray-300 bg-white py-1.5 px-3 text-sm/6 text-black outline-red outline-[#2596be]"
                  )}
                  defaultValue={""}
                  value={objLeave.year}
                  onChange={(e) => {
                    setObjLeave({ ...objLeave, year: e.target.value });
                  }}
                >
                  <option value={""} disabled>
                    Select Year
                  </option>

                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </Select>
                <ChevronDownIcon
                  className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-black"
                  aria-hidden="true"
                />
              </div>
            </Field>
          </div>
        </div>
      </div>
      <div className="w-full overflow-x-auto border shadow border-gray-200 rounded-2xl">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-primary">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="border border-gray-300 text-white p-3"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table?.getRowModel()?.rows.map((row) => (
              <tr key={row.id} className="border-b border-black text-center">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="border border-gray-300 p-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between  mt-4">
        <div className="flex-1 text-center w-full">
          <span>
            Page {table.getState().pagination.pageIndex + 1} of&nbsp;
            {table.getPageCount()}
          </span>
        </div>
        <div className="flex gap-3">
          <button
            className="px-3 py-1 border rounded bg-primary text-white disabled:opacity-50"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Prev
          </button>
          <button
            className="px-3 py-1 border rounded bg-primary text-white disabled:opacity-50"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
