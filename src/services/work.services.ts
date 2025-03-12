import { IWork } from "@/app/user/dashboard/components/WorkForm";
import { PaginationState } from "@tanstack/react-table";
import api from "../services/axiosInstance";

export async function addWork(data: IWork) {
  return await api.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/work/createWork`,
    data
  );
}

export async function getWorks(id: string, pagination: PaginationState) {
  return await api.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/work/getWork/${id}?page=${
      pagination.pageIndex + 1
    }&limit=${pagination.pageSize}`
  );
}

export async function updateWork(id: string, data: IWork) {
  return await api.put(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/work/updateWork/${id}`,
    data
  );
}

export async function getWorkByDateAndName(
  id: string | null,
  startDate: string,
  endDate: string,
  pagination: PaginationState
) {
  const params = new URLSearchParams({
    startDate,
    endDate,
    page: (pagination.pageIndex + 1).toString(),
    limit: pagination.pageSize.toString(),
  });

  if (id) params.append("employeeId", id);

  return await api.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/work/list?${params.toString()}`
  );
}

export async function deleteLeave(id: string) {
  return await api.delete(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/leaves/remove/${id}`
  );
}

export async function updateLeave(id: string, data: any) {
  return await api.put(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/leaves/update/${id}`,
    data
  );
}
export async function addLeave(data: any) {
  return await api.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/leaves/addLeave`,
    data
  );
}

export async function getEmployeeDetails(id: string) {
  return await api.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/getEmployee/${id}`
  );
}

//admin side API
export async function addEmployee(data: any) {
  return await api.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`,
    data
  );
}

export async function updateEmployee(id: string, data: any) {
  return await api.put(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/update/${id}`,
    data
  );
}

export async function deleteEmployeeWork(id: string) {
  return await api.delete(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/work/remove/${id}`
  );
}

export async function getEmployee() {
  return await api.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/listEmployees`
  );
}

export async function getEmployeeList(pagination: PaginationState) {
  return await api.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/listEmployees?page=${
      pagination.pageIndex + 1
    }&limit=${pagination.pageSize}`
  );
}

export async function deleteEmployee(id: string) {
  return await api.delete(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/remove/${id}`
  );
}

export async function updateLeaveStatus(id: string, status: string) {
  return await api.put(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/leaves/updateStatus/${id}`,
    { status }
  );
}

export async function getLeaveByEmployee(
  id: string,
  pagination: PaginationState
) {
  return await api.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/leaves/getLeave/${id}?page=${
      pagination.pageIndex + 1
    }&limit=${pagination.pageSize}`
  );
}

export async function getLeaveByDateRange(
  id: string,
  month: string,
  year: string,
  pagination: PaginationState
) {
  try {
    const params = new URLSearchParams({
      page: (pagination.pageIndex + 1).toString(),
      limit: pagination.pageSize.toString(),
    });
    if (id) params.append("employeeId", id);
    if (month) params.append("month", month);
    if (year) params.append("year", year);

    const response = await api.get(
      `${
        process.env.NEXT_PUBLIC_BACKEND_URL
      }/leaves/getLeaveDateRange?${params.toString()}`
    );

    return response;
  } catch (error) {
    console.error("Error fetching leave data:", error);
    throw error;
  }
}
