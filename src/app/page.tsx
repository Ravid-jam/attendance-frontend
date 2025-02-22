"use client";
import Header, { User } from "@/common/Header";
import { Toast } from "@/common/utils";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [userInfo, setUserInfo] = useState<User>();

  const [isDisabled, setIsDisabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [checkedIn, setCheckedIn] = useState(false);

  useEffect(() => {
    // Get user data
    const currentUser = JSON.parse(
      localStorage.getItem("employeeInfo") || "null"
    );
    setUserInfo(currentUser);

    const lastCheckIn = localStorage.getItem("lastCheckIn");
    if (lastCheckIn) {
      const elapsedTime = Date.now() - parseInt(lastCheckIn, 10);
      if (elapsedTime < 30000) {
        setIsDisabled(true);
        setTimeLeft((30000 - elapsedTime) / 1000);
        setCheckedIn(true);
      } else {
        setCheckedIn(true);
      }
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isDisabled && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsDisabled(false);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isDisabled, timeLeft]);

  const handleCheckInOut = async () => {
    if (!checkedIn) {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/attendance/check-in`,
          { employeeId: userInfo?._id }
        );
        if (response.data.status === true) {
          Toast("Checked in successfully!", "Success");
          setCheckedIn(true);
          setIsDisabled(true);
          localStorage.setItem("lastCheckIn", Date.now().toString());
          setTimeLeft(30); // 30 seconds countdown
        }
      } catch (err) {
        console.error("Error checking in:", err);
        Toast(
          "An error occurred while checking in. Please try again later.",
          "error"
        );
      }
    } else {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/attendance/check-out`,
          { employeeId: userInfo?._id }
        );
        if (response.data.status === true) {
          Toast("Checked out successfully!", "Success");
          setCheckedIn(false);
          setIsDisabled(false);
          localStorage.removeItem("lastCheckIn");
        }
      } catch (err) {
        console.error("Error checking out:", err);
        Toast(
          "An error occurred while checking out. Please try again later.",
          "error"
        );
      }
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen w-full flex justify-center items-center">
        <div className="flex flex-col gap-7">
          <div className="flex justify-center">
            <Image
              src="/assets/profile.png"
              alt="profile"
              height={100}
              width={100}
              className="rounded-full"
            />
          </div>
          <h1 className="text-4xl text-center">
            <span>Welcome,</span>
            <br />
            <span className="font-bold">{userInfo?.name || "User"}!</span>
          </h1>
          <div className="flex justify-center">
            <button
              onClick={handleCheckInOut}
              disabled={isDisabled}
              className="text-white bg-gradient-to-br  from-[#2596be] to-[#5c85d6] hover:bg-gradient-to-bl font-medium rounded-lg text-lg px-16 py-2.5 text-center me-2 mb-2"
            >
              {isDisabled
                ? `Wait ${Math.ceil(timeLeft)}s`
                : checkedIn
                ? "Check Out"
                : "Check In"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
