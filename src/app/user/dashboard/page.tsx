"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import WorkForm, { IWork } from "./components/WorkForm";

import { displayDate, formatDate } from "@/common/utils";
import { PencilIcon } from "@heroicons/react/16/solid";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import moment from "moment-timezone";
import { getWorks } from "@/services/work.services";
import Loader from "@/common/Loader";

export default function Page() {
  const [objWork, setObjWork] = useState<IWork | any>();
  const [currentUser, setCurrentUser] = useState({
    employeeId: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  });

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, refetch, isFetching, isLoading, isPending }: any = useQuery({
    queryKey: ["works", currentUser.employeeId, pagination],
    queryFn: async () => {
      if (!currentUser.employeeId) return { data: [], totalCount: 0 };

      const response = await getWorks(currentUser.employeeId, pagination);
      return response;
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const currentUser = JSON.parse(
      localStorage.getItem("employeeInfo") || "null"
    );

    if (currentUser?._id) {
      setCurrentUser((prev) => ({
        ...prev,
        employeeId: currentUser._id,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        role: currentUser.role,
      }));
    }
  }, []);

  const columns = [
    {
      accessorKey: "startTime",
      cell: (info: any) => {
        return (
          <span className="!tw-font-semibold tw-text-sm tw-text-gray-900 text-nowrap">
            {info?.row?.original?.startTime}
          </span>
        );
      },
      header: "Start Time",
    },
    {
      accessorKey: "endTime",
      cell: (info: any) => {
        return (
          <span className="!tw-font-semibold tw-text-sm tw-text-gray-900 text-nowrap">
            {info?.row?.original?.endTime}
          </span>
        );
      },
      header: "End Time",
    },
    {
      accessorKey: "description",
      cell: (info: any) => {
        return (
          <span className="!tw-font-semibold tw-text-sm tw-text-gray-900 line-clamp-1 text-justify">
            {info?.row?.original?.description}
          </span>
        );
      },
      header: "Description",
    },

    {
      accessorKey: "date",
      cell: (info: any) => {
        return (
          <span className="!tw-font-semibold tw-text-sm tw-text-gray-900 text-nowrap">
            {displayDate(info?.row?.original?.date)}
          </span>
        );
      },
      header: "Date",
    },
    {
      accessorKey: "totalHours",
      header: "Working Hours",
    },
    {
      accessorKey: "Action",
      cell: (info: any) => {
        const currentDate = moment().format("YYYY-MM-DD");
        const isDisabled =
          formatDate(info?.row?.original?.date) === currentDate ? false : true;
        return (
          <div className="flex justify-center">
            <PencilIcon
              onClick={() => setObjWork(info?.row?.original)}
              className={`w-7 h-7 ${
                isDisabled
                  ? "text-gray-400 cursor-not-allowed pointer-events-none"
                  : "cursor-pointer text-primary"
              }`}
            />
          </div>
        );
      },
      header: "Action",
    },
  ];
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
    <div className="container pt-10">
      <div className="lg:flex xl:flex md:gap-10 lg:gap-10 xl:gap-20">
        <div className="w-full lg:w-[70%] flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <div className="flex">
              <h1 className="text-gray-500">Name</h1>:&nbsp;
              <span className="text-base font-bold">
                {currentUser?.firstName}&nbsp;
                {currentUser?.lastName}
              </span>
            </div>
            <div className="flex">
              <h1 className="text-gray-500">Email</h1>:&nbsp;
              <span className="text-base font-bold"> {currentUser.email}</span>
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
                  <tr
                    key={row.id}
                    className="border-b border-black text-center"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="border border-gray-300 p-2">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
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
        <div className="w-full lg:w-[30%] flex flex-col gap-5">
          <h1 className="font-semibold text-2xl text-primary">
            Work Summary: What’s Done & What’s Next?
          </h1>
          <WorkForm
            refetch={refetch}
            objWork={objWork}
            setObjWork={setObjWork}
          />
        </div>
      </div>
    </div>
  );
}
