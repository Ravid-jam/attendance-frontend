import { toast } from "react-toastify";
import moment from "moment-timezone";

export const Toast = (message: string, type: "Success" | "error") => {
  switch (type) {
    case "Success":
      toast.success(message);
      break;
    case "error":
      toast.error(message);
      break;
    default:
      toast.info(message);
      break;
  }
};

export const convertDate = (
  isoDate: string,
  format: string = "DD MMM YYYY, hh:mm A",
  timeZone: string = "Asia/Kolkata"
): string => {
  if (!isoDate) return "Invalid Date"; // Handle empty or invalid inputs
  return moment(isoDate).tz(timeZone).format(format);
};

export const formatDate = (date: Date | string) => {
  return new Date(date).toISOString().split("T")[0]; // Converts to 'YYYY-MM-DD'
};
