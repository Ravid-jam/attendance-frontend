import Button from "@/common/Button";
import InputField from "@/common/InputField";
import TextareaField from "@/common/TextareaField";
import {
  convertTime,
  formatDate,
  formatTime12Hour,
  Toast,
} from "@/common/utils";
import { addWork, updateWork } from "@/services/work.services";
import { yupResolver } from "@hookform/resolvers/yup";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export interface IWork {
  _id?: string;
  employee?: string;
  startTime: string;
  endTime: string;
  description: string;
  date: Date;
}

export const workSchema = yup.object().shape({
  employee: yup.string().required("Employee ID is required").optional(),
  startTime: yup.string().required("Start Time is required"),
  endTime: yup.string().required("End Time is required"),
  description: yup.string().required("Description is required"),
  date: yup.date().required("Date is required"),
});

type Props = {
  refetch: (options?: RefetchOptions) => Promise<
    QueryObserverResult<
      | AxiosResponse<any, any>
      | {
          data: never[];
          totalCount: number;
        },
      Error
    >
  >;
  objWork: any | undefined;
  setObjWork: Dispatch<SetStateAction<IWork | any>>;
};

export default function WorkForm({ refetch, objWork, setObjWork }: Props) {
  const [currentUser, setCurrentUser] = useState({
    employeeId: "",
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isLoading },
    reset,
  } = useForm({
    resolver: yupResolver(workSchema),
  });
  const onSubmit = async (data: IWork) => {
    const workData = {
      employee: currentUser.employeeId,
      startTime: formatTime12Hour(data.startTime),
      endTime: formatTime12Hour(data.endTime),
      description: data.description,
      date: data.date,
    };
    if (objWork?._id) {
      try {
        const response: any = await updateWork(objWork._id, workData);
        if (response?.status === true) {
          Toast("Work Summary Updated Successfully", "Success");
          setObjWork(null);
          reset();
          refetch();
        }
      } catch (err: any) {
        console.error(err);
        Toast("Invalid email or password", "error");
      }
    } else {
      try {
        const response: any = await addWork(workData);
        if (response?.status === true) {
          Toast("Work Summary Added Successfully", "Success");
          refetch();
        }
      } catch (err: any) {
        console.error(err);
        Toast("Invalid email or password", "error");
      }
    }
  };

  useEffect(() => {
    const currentUser = JSON.parse(
      localStorage.getItem("employeeInfo") || "null"
    );

    if (currentUser?._id) {
      setCurrentUser((prev) => ({ ...prev, employeeId: currentUser._id }));
    }
  }, []);

  useEffect(() => {
    if (objWork) {
      reset({
        employee: objWork.employee._id,
        startTime: convertTime(objWork.startTime),
        endTime: convertTime(objWork.endTime),
        description: objWork.description,
      });
    }
  }, [objWork]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <InputField
        id="date"
        type="date"
        label="Date"
        defaultValue={formatDate(new Date())}
        {...register("date")}
        error={errors.date}
      />

      <InputField
        id="startTime"
        type="time"
        label="Start Time"
        defaultValue={"10:00"}
        {...register("startTime")}
        error={errors.startTime}
      />

      <InputField
        id="endTime"
        type="time"
        label="End Time"
        defaultValue={"19:00"}
        {...register("endTime")}
        error={errors.endTime}
      />
      <TextareaField
        id="Description"
        label="Description"
        {...register("description")}
        error={errors.description}
        rows={5}
      />

      <div className="flex gap-5">
        <Button
          type="reset"
          variant="secondary"
          disabled={isLoading}
          isLoading={isLoading}
        >
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
  );
}
