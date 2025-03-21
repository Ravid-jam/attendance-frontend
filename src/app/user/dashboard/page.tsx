"use client";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import WorkForm, { IWork } from "./components/WorkForm";

import DataTable from "@/common/DataTable";
import Loader from "@/common/Loader";
import { displayDate, formatDate } from "@/common/utils";
import { getWorks } from "@/services/work.services";
import { PencilIcon } from "@heroicons/react/16/solid";
import {
  getCoreRowModel,
  getFilteredRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import moment from "moment-timezone";
import Heading from "@/common/Heading";

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
          <span className="!tw-font-semibold tw-text-sm tw-text-gray-900 line-clamp-1 text-center">
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
          <DataTable table={table} />
        </div>
        <div className="w-full lg:w-[30%] flex flex-col gap-5">
          <Heading title="Work Summary: What’s Done & What’s Next?" />
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
