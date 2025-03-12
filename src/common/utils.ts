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

export const displayDate = (date: Date | string) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

export const formatDate = (date: Date | string) => {
  return new Date(date).toISOString().split("T")[0]; // Converts to 'YYYY-MM-DD'
};

export const formatTime12Hour = (time: string) => {
  if (!time) return "";
  const [hour, minute] = time.split(":").map(Number);
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12; // Convert 0 to 12
  return `${formattedHour}:${minute.toString().padStart(2, "0")} ${ampm}`;
};

export const convertTime = (timeString: string, format: string = "HH:mm") => {
  if (!timeString) return "";

  return moment(timeString, ["h:mm A", "HH:mm"]).format(format);
};

export const calculateAge = (dob: string): number | null => {
  if (!dob) return null;

  const parts = dob.split("-");
  if (parts.length !== 3) return null;

  const birthDate = new Date(
    parseInt(parts[2], 10),
    parseInt(parts[1], 10) - 1,
    parseInt(parts[0], 10)
  );
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
};
