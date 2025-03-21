"use client";
import Button from "@/common/Button";
import DataTable from "@/common/DataTable";
import Heading from "@/common/Heading";
import InputField from "@/common/InputField";
import Loader from "@/common/Loader";
import Pagination from "@/common/Pagination";
import TextareaField from "@/common/TextareaField";
import { formatDate, Toast } from "@/common/utils";
import {
  addLeave,
  deleteLeave,
  getLeaveByEmployee,
  updateLeave,
} from "@/services/work.services";
import { Field, Select } from "@headlessui/react";
import {
  ChevronDownIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/16/solid";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import * as yup from "yup";

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
  const [objLeaves, setObjLives] = useState<any>();
  const [user, setCurrentUser] = useState({
    employeeId: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "",
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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(leaveSchema),
  });

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, refetch, isFetching, isLoading, isPending }: any = useQuery({
    queryKey: ["leaves", user.employeeId, pagination],
    queryFn: async () => {
      if (!user.employeeId) return { data: [], totalCount: 0 };
      const response = await getLeaveByEmployee(user.employeeId, pagination);
      return response;
    },
    refetchOnWindowFocus: false,
  });

  const columns = [
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
      cell: (info: any) => {
        return (
          <span className="!tw-font-semibold tw-text-sm tw-text-gray-900 text-justify">
            {info?.row?.original?.leaveType}
          </span>
        );
      },
      header: "Leave Type",
    },
    {
      accessorKey: "reason",
      cell: (info: any) => {
        return (
          <span className="!tw-font-semibold tw-text-sm tw-text-gray-900  text-justify">
            {info?.row?.original?.reason}
          </span>
        );
      },
      header: "Reason",
    },
    {
      accessorKey: "status",
      cell: (info: any) => {
        return (
          <span
            className={`font-semibold ${
              info?.row?.original?.status === "Approved"
                ? "text-green-500"
                : info?.row?.original?.status === "Pending"
                ? "text-yellow-500"
                : "text-red-500"
            } `}
          >
            {info?.row?.original?.status}
          </span>
        );
      },
      header: "Status",
    },

    {
      accessorKey: "Action",
      cell: (info: any) => {
        return (
          <div className="flex justify-center gap-3">
            <button
              disabled={
                info?.row?.original.status === "Approved" ||
                info?.row?.original.status === "Denied"
                  ? true
                  : false
              }
            >
              <PencilIcon
                className={clsx(
                  "h-6 w-6 cursor-pointer !text-[#2596be]",
                  info.row.original.status === "Approved" ||
                    info?.row?.original.status === "Denied"
                    ? "opacity-50"
                    : "opacity-100"
                )}
                onClick={() => {
                  setObjLives(info?.row?.original);
                }}
              />
            </button>
            <button
              disabled={info?.row?.original.status !== "Pending" ? true : false}
            >
              <TrashIcon
                className={clsx(
                  "h-6 w-6 cursor-pointer",
                  info?.row?.original.status !== "Pending"
                    ? "opacity-50"
                    : "opacity-100"
                )}
                color="red"
                onClick={() => {
                  handleDeleteLeave(info?.row?.original?._id);
                }}
              />
            </button>
          </div>
        );
      },
      header: "Action",
    },
  ];

  const handleDeleteLeave = async (leaveId: string) => {
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
          const response: any = await deleteLeave(leaveId);
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

  const onSubmit = async (data: formData) => {
    if (objLeaves?._id) {
      try {
        const response: any = await updateLeave(objLeaves?._id, data);
        if (response.status === true) {
          Toast("Updated successfully", "Success");
          refetch();
          reset({
            startDate: new Date(),
            endDate: new Date(),
            reason: "",
          });
          setObjLives(null);
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        const response: any = await addLeave({
          name: user.employeeId,
          ...data,
        });
        if (response.status === true) {
          Toast("Added successfully", "Success");
          refetch();
          reset();
        }
      } catch (err) {
        console.error(err);
        Toast("Invalid email or password", "error");
      }
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

  useEffect(() => {
    if (objLeaves?._id) {
      reset({
        leaveType:
          objLeaves?.leaveType === "Sick"
            ? "Sick"
            : objLeaves?.leaveType === "Vacation"
            ? "Vacation"
            : objLeaves?.leaveType === "Maternity Leave"
            ? "Maternity Leave"
            : "Paternity Leave",

        startDate: objLeaves.startDate || "",
        endDate: objLeaves.endDate || "",
        reason: objLeaves?.reason,
      });
    }
  }, [objLeaves]);

  if (isLoading || isFetching || isPending) {
    return <Loader />;
  }

  return (
    <div className="pt-10 container w-full lg:flex space-y-6 gap-16">
      <div className="flex flex-col gap-3 w-full lg:w-[70%]">
        <div className="flex flex-col gap-1.5">
          <div className="flex">
            <h1 className="text-gray-500">Name</h1>:&nbsp;
            <span className="text-base font-bold">
              {user?.firstName}&nbsp;
              {user?.lastName}
            </span>
          </div>
          <div className="flex">
            <h1 className="text-gray-500">Email</h1>:&nbsp;
            <span className="text-base font-bold"> {user.email}</span>
          </div>
        </div>
        <DataTable table={table} />
      </div>
      <div className="w-full lg:w-[30%] flex flex-col gap-5">
        <Heading title="Employee Leave Summary: Taken & Remaining" />

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-5">
            <InputField
              id="startDate"
              type="date"
              label="Start Date"
              {...register("startDate")}
              defaultValue={formatDate(new Date())}
              error={errors.startDate}
            />

            <InputField
              id="endDate"
              type="date"
              label="End Date"
              {...register("endDate")}
              defaultValue={formatDate(new Date())}
              error={errors.endDate}
            />
            <div>
              <label
                htmlFor="LiveType"
                className="block text-sm font-medium text-gray-900"
              >
                Live Type
              </label>
              <div className="mt-2">
                <Field className="relative">
                  <Select
                    id="LiveType"
                    defaultValue={""}
                    className={clsx(
                      "block w-full appearance-none rounded-md bg-white border px-3 py-2 text-base text-gray-900 placeholder:text-gray-400 sm:text-sm",
                      errors.leaveType
                        ? "border-red-500 focus:outline-2 focus:outline-red-500"
                        : "border-gray-300 focus:outline-2 focus:outline-[#2596be]"
                    )}
                    {...register("leaveType")}
                  >
                    <option value="" disabled>
                      Select Leave Type
                    </option>
                    <option value="Sick">Sick</option>
                    <option value="Vacation">Vacation</option>
                    <option value="Maternity Leave">Maternity Leave</option>
                    <option value="Paternity Leave">Paternity Leave</option>
                  </Select>
                  <ChevronDownIcon
                    className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-black"
                    aria-hidden="true"
                  />
                </Field>

                {errors.leaveType && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.leaveType.message}
                  </p>
                )}
              </div>
            </div>

            <TextareaField
              id="reason"
              label="Reason for Leave"
              {...register("reason")}
              error={errors.reason}
              rows={3}
            />
          </div>

          <div className="flex justify-end mt-10 gap-4">
            <Button type="reset" variant="secondary">
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
        </form>
      </div>
    </div>
  );
}
