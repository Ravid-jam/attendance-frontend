import React from "react";

interface HeadingProps {
  title: string;
  className?: string; // Allow additional styling if needed
}

const Heading: React.FC<HeadingProps> = ({ title, className = "" }) => {
  return (
    <h1 className={`font-semibold text-2xl text-primary ${className}`}>
      {title}
    </h1>
  );
};

export default Heading;
