import Header from "@/common/Header";
import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full">
      <Header />
      {children}
    </div>
  );
}
