"use client";
import Button from "@/common/Button";
import InputField from "@/common/InputField";
import { Toast } from "@/common/utils";
import {
  addEmployee,
  deleteEmployee,
  getEmployeeList,
  updateEmployee,
} from "@/services/work.services";
import { Field, Select } from "@headlessui/react";
import {
  ChevronDownIcon,
  EyeIcon,
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
import ViewEmployee from "./components/ViewEmployee";

interface Employee {
  _id: string;
  firstName: string;
  email: string;
  role: string;
  totalWorkHours: string;
  totalDays: number;
  password: string;
}

export type register = {
  _id?: string;
  firstName: string;
  lastName?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
  phone?: string;
  email: string;
  password: string;
  role: string;
};
const schema = yup.object().shape({
  firstName: yup.string().required("Name is required"),
  lastName: yup.string(),
  address: yup.string(),
  dateOfBirth: yup.string(),
  gender: yup.string(),
  phone: yup.string(),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
  role: yup.string().required("Role is required"),
});

export default function Page() {
  const [objEmployee, setObjEmployee] = useState<Employee>();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [viewDetail, setViewDetail] = useState<any>();

  function closeModal() {
    setIsOpen(false);
  }

  const { data, refetch }: any = useQuery({
    queryKey: ["works", pagination],
    queryFn: async () => {
      const response = await getEmployeeList(pagination);
      return response;
    },
    refetchOnWindowFocus: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isLoading },
    reset,
  } = useForm<register>({
    resolver: yupResolver(schema),
  });

  const handleDeleteEmployee = async (employeeId: string) => {
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
          const response: any = await deleteEmployee(employeeId);

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
      Toast("Error deleting employee", "error");
    }
  };

  const onSubmit = async (data: register) => {
    if (objEmployee?.role === "ADMIN" || objEmployee?.role === "STAFF") {
      try {
        const response: any = await updateEmployee(objEmployee?._id, {
          firstName: data.firstName,
          email: data.email,
          role: data.role,
          password: data.password,
        });
        if (response?.status === true) {
          Toast("Updated successfully", "Success");
          refetch();
          reset({
            firstName: "",
            email: "",
            role: "",
            password: "",
          });
          setObjEmployee(undefined);
        }
      } catch (err) {
        Toast("Invalid email or password", "error");
      }
    } else {
      try {
        const response: any = await addEmployee({
          firstName: data.firstName,
          email: data.email,
          role: data.role,
          password: data.password,
        });
        if (response.status === true) {
          Toast("Added successfully", "Success");
          reset({
            firstName: "",
            email: "",
            role: "",
            password: "",
          });
          refetch();
        }
      } catch (err) {
        console.error(err);
        Toast("Invalid email or password", "error");
      }
    }
  };

  const columns = [
    {
      accessorKey: "firstName",
      cell: (info: any) => {
        return (
          <span className="!tw-font-semibold tw-text-sm tw-text-gray-900  text-justify">
            {info?.row?.original?.firstName}&nbsp;
            {info?.row?.original?.lastName}
          </span>
        );
      },
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "password",
      header: "Password",
    },
    {
      accessorKey: "role",

      header: "Position",
    },

    {
      accessorKey: "Action",
      cell: (info: any) => {
        return (
          <div className="flex justify-center gap-3">
            <EyeIcon
              onClick={() => {
                setIsOpen(!isOpen);
                setViewDetail(info?.row?.original);
              }}
              className="h-6 w-6 cursor-pointer text-primary"
            />
            <PencilIcon
              onClick={() => setObjEmployee(info?.row?.original)}
              className="h-6 w-6 cursor-pointer text-primary"
            />
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

  useEffect(() => {
    if (objEmployee?._id) {
      reset({
        firstName: objEmployee?.firstName,
        email: objEmployee?.email,
        role: objEmployee?.role,
        password: objEmployee?.password,
      });
    }
  }, [objEmployee]);

  return (
    <div className="container w-full lg:flex gap-20 mt-16">
      <div className="flex flex-col gap-3 w-full lg:w-[70%]">
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
      <div className="w-full lg:w-[30%] flex flex-col gap-3">
        <h1 className="font-semibold text-2xl text-primary">
          Manage Employees
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="flex flex-col gap-5">
            <InputField
              id="name"
              type="text"
              label="Name"
              {...register("firstName")}
              error={errors.firstName}
            />
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-900"
              >
                Role
              </label>
              <div className="mt-2">
                <Field className="relative">
                  <Select
                    id="role"
                    className={clsx(
                      "mt-1 block w-full appearance-none cursor-pointer rounded-md border border-gray-300 bg-white py-1.5 px-3 text-sm/6 text-black outline-red outline-[#2596be]"
                    )}
                    defaultValue={""}
                    {...register("role")}
                  >
                    <option value="" disabled>
                      Select Role
                    </option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="STAFF">STAFF</option>
                  </Select>
                  <ChevronDownIcon
                    className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-black"
                    aria-hidden="true"
                  />
                </Field>

                {errors.role && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.role.message}
                  </p>
                )}
              </div>
            </div>

            <InputField
              id="email"
              type="email"
              label="Email"
              {...register("email")}
              error={errors.email}
            />
            <InputField
              id="password"
              type="password"
              label="Password"
              {...register("password")}
              error={errors.password}
            />
          </div>
          <div className="flex gap-5">
            <Button
              type="reset"
              variant="secondary"
              onClick={() => {
                setObjEmployee(undefined);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              isLoading={isSubmitting}
            >
              {isSubmitting
                ? "Loading..."
                : objEmployee?._id
                ? "Update"
                : "Add"}
            </Button>
          </div>
        </form>
      </div>
      {isOpen && (
        <ViewEmployee
          viewDetail={viewDetail}
          isOpen={isOpen}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
