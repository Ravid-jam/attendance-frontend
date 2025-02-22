import { toast } from "react-toastify";

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
