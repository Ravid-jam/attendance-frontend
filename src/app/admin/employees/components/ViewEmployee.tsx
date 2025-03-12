import { calculateAge } from "@/common/utils";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { Fragment } from "react";

type Props = {
  isOpen: boolean;
  viewDetail: any;
  onClose: () => void;
};
export default function ViewEmployee({ isOpen, viewDetail, onClose }: Props) {
  const displayData = (title: string, value: string) => {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700">
          {title}
        </label>
        <span className="text-sm text-black font-bold">
          {value ? value : "--unknown"}
        </span>
      </div>
    );
  };
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10 w-full" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-screen-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-semibold leading-6 text-gray-900"
                  >
                    View Details
                  </Dialog.Title>
                  <XMarkIcon
                    className="h-7 w-7 cursor-pointer"
                    onClick={onClose}
                  />
                </div>
                <div className="mt-4 flex flex-col gap-5">
                  <div className="w-full flex justify-center">
                    <div className="h-28 w-28">
                      <img
                        src={
                          viewDetail?.profile_Image?.url
                            ? viewDetail?.profile_Image?.url
                            : "/assets/profile.png"
                        }
                        className="h-full w-full rounded-full border"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-5">
                    {displayData("First Name", viewDetail?.firstName)}
                    {displayData("Last Name", viewDetail?.lastName)}
                    {displayData("Role", viewDetail?.role)}
                    {displayData("Date of Birth", viewDetail?.dateOfBirth)}
                    {displayData("Gender", viewDetail?.gender)}
                    {displayData(
                      "Age",
                      calculateAge(viewDetail?.dateOfBirth) as any
                    )}
                    {displayData("Phone Number", viewDetail?.contactNumber)}

                    {displayData("Email", viewDetail?.email)}
                    {displayData("Password", viewDetail?.password)}
                    <div className="col-span-3">
                      {displayData("Address", viewDetail?.address)}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={onClose}
                    className="w-32  rounded-md bg-primary px-3 py-2.5 text-sm font-semibold text-white border border-gray-300 shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
