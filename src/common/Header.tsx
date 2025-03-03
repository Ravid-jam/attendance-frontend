"use client";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

import React, { useEffect, useState } from "react";
import Link from "next/link";
export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
}

const navLinks = [
  { name: "Home", path: "/" },
  { name: "History", path: "/history" },
  { name: "Lives", path: "/lives" },
];
const navLinksForAdmin = [
  { name: "History", path: "/admin/history" },
  { name: "Lives", path: "/lives" },
  { name: "Employees", path: "/admin/employees" },
  { name: "Settings", path: "/settings" },
];

export default function Header() {
  const [userInfo, setUserInfo] = useState<User>();
  const router = useRouter();
  useEffect(() => {
    const currentUser = JSON.parse(
      localStorage.getItem("employeeInfo") || "null"
    );
    setUserInfo(currentUser);
  }, []);
  return (
    <header className="fixed top-0 w-full text-white bg-[#2596be] h-20">
      <div className="max-w-[1400px] mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <a className="flex title-font font-medium items-center bg-white rounded-[14px] text-gray-900 mb-4 md:mb-0">
          <img src="/assets/logo.png" className="h-12 " />
        </a>
        {userInfo?.role === "ADMIN" ? (
          <nav className="md:ml-auto flex flex-wrap items-center justify-center">
            {navLinksForAdmin.map(({ name, path }) => (
              <Link
                key={path}
                href={path}
                className="mr-5 text-base font-medium cursor-pointer"
              >
                {name}
              </Link>
            ))}
          </nav>
        ) : (
          <nav className="md:ml-auto flex flex-wrap items-center justify-center">
            {navLinks.map(({ name, path }) => (
              <Link
                key={path}
                href={path}
                className="mr-5 text-base font-medium cursor-pointer"
              >
                {name}
              </Link>
            ))}
          </nav>
        )}
        <Menu as="div" className="relative ml-3">
          <div>
            <MenuButton className="flex rounded-full bg-gray-800 text-base">
              <img
                alt=""
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                className="size-10 rounded-full"
              />
            </MenuButton>
          </div>
          <MenuItems
            transition
            className="absolute right-0  mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
          >
            <MenuItem>
              <a className="block disabled border-b px-4 py-3 text-xs text-black font-normal data-focus:bg-gray-100 data-focus:outline-hidden">
                <span className="text-lg font-medium text-black">
                  {userInfo?.name}
                </span>
                <br />
                role:&nbsp;
                {userInfo?.role}
              </a>
            </MenuItem>
            <MenuItem>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden cursor-pointer"
              >
                Settings
              </a>
            </MenuItem>
            <MenuItem>
              <a
                onClick={() => {
                  Cookies.remove("token");
                  localStorage.removeItem("employeeInfo");
                  router.push("/login");
                }}
                className="block px-4 cursor-pointer py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
              >
                Sign out
              </a>
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>
    </header>
  );
}
