import Header from "@/common/Header";
import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="container">{children}</div>
    </>
  );
}
