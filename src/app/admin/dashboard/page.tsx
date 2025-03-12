"use client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Loader from "@/common/Loader";
import { displayDate } from "@/common/utils";
import {
  deleteEmployeeWork,
  getEmployee,
  getWorkByDateAndName,
} from "@/services/work.services";
import { Field, Select } from "@headlessui/react";
import { ChevronDownIcon, TrashIcon } from "@heroicons/react/16/solid";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import moment from "moment-timezone";
import Swal from "sweetalert2";
import InputField from "@/common/InputField";

interface WorkForm {
  employeeId?: string;
  startDate: string;
  endDate: string;
}
export default function Page() {
  const userList = useQuery({
    queryKey: ["employees"],
    queryFn: async () => await getEmployee(),
  });

  const [objWork, setObjWork] = useState<WorkForm | any>({
    employeeId: "",
    startDate: moment().format("YYYY-MM-DD"),
    endDate: moment().format("YYYY-MM-DD"),
  });

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, refetch, isFetching, isLoading, isPending }: any = useQuery({
    queryKey: ["works", pagination, objWork],
    queryFn: async () => {
      const response = await getWorkByDateAndName(
        objWork.employeeId,
        objWork.startDate,
        objWork.endDate,
        pagination
      );
      return response;
    },
    refetchOnWindowFocus: false,
  });

  const handleDeleteEmployee = async (id: string) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "This record will be permanently deleted and cannot be recovered!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response: any = await deleteEmployeeWork(id);
          if (response.status === true) {
            refetch();
            Swal.fire({
              title: "Deleted!",
              text: "The record has been successfully deleted.",
              icon: "success",
            });
          }
        } else {
          Swal.fire("Cancelled", "The record is safe.", "info");
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    {
      accessorKey: "firstName",
      cell: (info: any) => {
        return (
          <span className="!tw-font-semibold tw-text-sm tw-text-gray-900">
            {info?.row?.original?.employee?.firstName}&nbsp;
            {info?.row?.original?.employee?.lastName}
          </span>
        );
      },
      header: "Name",
    },
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
        return (
          <div className="flex justify-center">
            <TrashIcon
              onClick={() => handleDeleteEmployee(info?.row?.original?._id)}
              className="h-6 w-6 cursor-pointer"
              color="red"
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
    <div className="container pt-10 flex flex-col gap-5">
      <div className="flex gap-5 justify-end items-center">
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
                value={objWork.employeeId}
                onChange={(e) => {
                  setObjWork({ ...objWork, employeeId: e.target.value });
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
                        {user.firstName}&nbsp;{user.lastName}
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

        <InputField
          label="Start Date"
          type="date"
          defaultValue={moment().format("YYYY-MM-DD")}
          value={objWork.startDate}
          id="startDate"
          onChange={(e) => {
            setObjWork({ ...objWork, startDate: e.target.value });
          }}
        />
        <InputField
          label="End Date"
          type="date"
          defaultValue={moment().format("YYYY-MM-DD")}
          value={objWork.endDate}
          id="EndDate"
          onChange={(e) => {
            setObjWork({ ...objWork, endDate: e.target.value });
          }}
        />
      </div>

      <div className="flex flex-col gap-3">
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
    </div>
  );
}
