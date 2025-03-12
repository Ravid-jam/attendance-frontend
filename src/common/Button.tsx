import React from "react";
import { Icons } from "./Icons";

interface ButtonProps {
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "outline";
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  type = "button",
  variant = "primary",
  isLoading = false,
  disabled = false,
  onClick,
  children,
}) => {
  const baseStyles =
    "py-2.5 px-5 w-full text-base font-medium justify-center rounded-lg inline-flex items-center";
  const variants = {
    primary: "bg-[#2596be] text-white",
    secondary: "bg-transparent text-black border border-gray-300 shadow-xs",
    outline: "bg-transparent border border-[#2596be] text-[#2596be]",
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${
        isLoading || disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={onClick}
      disabled={isLoading || disabled}
    >
      {isLoading && <Icons.Loading />}
      {children}
    </button>
  );
};

export default Button;
