"use client";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profile_Image: any;
  role: string;
}

const navLinks = [
  { name: "Home", path: "/user/dashboard" },
  { name: "Apply For Leave", path: "/user/leaves" },
];
const navLinksForAdmin = [
  { name: "Dashboard", path: "/admin/dashboard" },
  { name: "Leaves", path: "/admin/leaves" },
  { name: "Employees", path: "/admin/employees" },
];

export default function Header() {
  const [userInfo, setUserInfo] = useState<User>();
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    const currentUser = JSON.parse(
      localStorage.getItem("employeeInfo") || "null"
    );
    setUserInfo(currentUser);
  }, []);

  return (
    <header className="sticky top-0 z-50 text-gray-600 shadow-md border-b h-20 w-full bg-white">
      <div className="container flex flex-wrap py-4 flex-col md:flex-row justify-between items-center">
        <div className="h-12">
          <img
            src="/assets/logo.png"
            className="h-full w-full object-contain cursor-pointer"
            onClick={() => {
              if (userInfo?.role == "ADMIN") {
                router.push("/admin/dashboard");
              } else {
                router.push("/user/dashboard");
              }
            }}
          />
        </div>
        {userInfo?.role === "ADMIN" ? (
          <nav className="flex gap-7 flex-wrap items-center justify-center">
            {navLinksForAdmin.map(({ name, path }) => (
              <Link
                key={path}
                href={path}
                className={clsx(
                  "text-lg  cursor-pointer",
                  path === pathName
                    ? "text-primary font-medium"
                    : "text-gray-600 font-medium"
                )}
              >
                {name}
              </Link>
            ))}
          </nav>
        ) : (
          <nav className="flex gap-7 flex-wrap items-center justify-center">
            {navLinks.map(({ name, path }) => (
              <Link
                key={path}
                href={path}
                className={clsx(
                  "text-lg cursor-pointer",
                  path === pathName
                    ? "text-primary font-medium"
                    : "text-gray-600 font-medium"
                )}
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
                src={
                  userInfo?.profile_Image?.url
                    ? userInfo?.profile_Image?.url
                    : "/assets/profile.png"
                }
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
                  {userInfo?.firstName}&nbsp;
                  {userInfo?.lastName}
                </span>
                <br />
                role:&nbsp;
                {userInfo?.role}
              </a>
            </MenuItem>
            <MenuItem>
              <a
                onClick={() => {
                  router.push("/user/profile");
                }}
                className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden cursor-pointer"
              >
                Profile
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
