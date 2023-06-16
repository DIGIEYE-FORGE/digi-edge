import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Provider from "./components/provider";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import ComplexNavbar from "./components/nav";
import { BuildingLibraryIcon, HomeIcon } from "@heroicons/react/24/outline";

import useLocalStorage from "./hooks/use-local-storage";

import Loader from "./components/loader";
import LoginPage from "./pages/login";
import { ConfirmDialogData, State, User } from "./utils/types";
import { defaultConfirmDialogData } from "./utils/data";

import { currentUser } from "./api/user";
import "./utils/config";
import axios from "axios";

function App() {
  const [secondaryMenu, setSecondaryMenu] = useState(window.innerWidth > 1320);
  const [user, setUser] = useState<User | null>(null);
  const [loginState, setLoginState] = useState<State>("loading");
  const [confirmDialogData, setConfirmDialogData] =
    useState<ConfirmDialogData | null>(null);

  const [accessToken, setAccessToken] = useLocalStorage<string>(
    "accessToken",
    ""
  );
  const [refreshToken, setRefreshToken] = useLocalStorage<string>(
    "refreshToken",
    ""
  );

  const handleClose = () => {
    setConfirmDialogData(null);
  };

  const handleConfirm = (data: ConfirmDialogData) => {
    setConfirmDialogData({ ...defaultConfirmDialogData, ...data });
  };

  useEffect(() => {
    const resizeEvent = () => {
      if (window.innerWidth > 1320) setSecondaryMenu(true);
      else setSecondaryMenu(false);
    };
    window.addEventListener("resize", resizeEvent);
    return () => window.removeEventListener("resize", resizeEvent);
  }, []);

  useEffect(() => {
    if (!accessToken || !refreshToken) {
      setLoginState("error");
      return;
    }
    axios.defaults.headers.common["Authorization"] = `Bearer ${JSON.parse(
      window.localStorage.getItem("accessToken") || "{}"
    )}`;
    (async () => {
      setUser(await currentUser());
    })();
    setLoginState("idle");
  }, [accessToken]);

  if (loginState === "loading")
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <Loader />
      </div>
    );

  return (
    <Provider
      value={{
        secondaryMenu,
        setSecondaryMenu,
        handleConfirm,
        accessToken,
        setAccessToken,
        refreshToken,
        setRefreshToken,
        loginState,
        setLoginState,
        user,
      }}
    >
      {loginState === "error" ? (
        <LoginPage />
      ) : (
        <>
          <ComplexNavbar />
          <div className="flex flex-col  fixed top-[4rem] bottom-2 left-2 !w-14 rounded bg-blue-600 z-10 py-2">
            <Button
              variant="text"
              className="flex justify-center items-center hover:bg-blue-500 "
            >
              <BuildingLibraryIcon className="w-8 text-gray-50" />
            </Button>
            <Button
              variant="text"
              className="mt-auto  flex justify-center items-center hover:bg-blue-500 "
              onClick={() => setSecondaryMenu(!secondaryMenu)}
            >
              <HomeIcon className="w-8 text-gray-50" />
            </Button>
          </div>
          <div className="h-screen w-screen bg-blue-50/20  pt-16 [&>*]:w-full [&>*]:h-full ">
            <Outlet />
          </div>
          <Dialog
            open={!!confirmDialogData}
            handler={handleClose}
            className="!w-11/12 !max-w-[30rem] "
          >
            <DialogHeader>{confirmDialogData?.title || ""}</DialogHeader>
            <DialogBody divider>{confirmDialogData?.body || ""}</DialogBody>
            <DialogFooter>
              <Button
                variant="text"
                color="red"
                onClick={() => {
                  confirmDialogData?.onCancel?.();
                  handleClose();
                }}
                className="mr-1"
              >
                <span>Cancel</span>
              </Button>
              <Button
                variant="gradient"
                color="green"
                onClick={() => {
                  confirmDialogData?.onConfirm?.();
                  setConfirmDialogData(null);
                }}
              >
                <span>{confirmDialogData?.confirmText}</span>
              </Button>
            </DialogFooter>
          </Dialog>
        </>
      )}
    </Provider>
  );
}

export default App;
