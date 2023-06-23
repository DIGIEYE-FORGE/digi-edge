import { Navbar } from "@material-tailwind/react";
import ProfileMenu from "./profile";
import ToggleFullScreen from "./toggle-full-screen/indes";
import Notifications from "./notifications";

// profile menu component

export default function ComplexNavbar() {
  return (
    <div className="fixed top-0 left-0 right-0">
      <Navbar className="mx-auto max-w-[100%] p-2 lg:px-4 rounded-none">
        <div className="relative mx-auto flex items-center text-blue-gray-900">
          <img src="/logo.svg" alt="" className="h-10" />
          {/* <ScreenIndicator className="mx-auto" /> */}
          <div  className=" mx-auto " ></div>
          <Notifications  />
          <ToggleFullScreen />
          <ProfileMenu />
        </div>
      </Navbar>
    </div>
  );
}
