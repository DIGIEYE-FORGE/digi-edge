import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Provider from "./components/provider";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import ComplexNavbar from "./components/nav";
import {
  BuildingLibraryIcon,
  FireIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../../server/src/main";
import useLocalStorage from "./hooks/use-local-storage";
import Loader from "./components/loader";
import LoginPage from "./pages/login";
import { State } from "./utils/types";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export type AppContext = {
  secondaryMenu: boolean;
  setSecondaryMenu: React.Dispatch<React.SetStateAction<boolean>>;
  handleConfirm: (data: ConfirmDialogData) => void;
  accessToken: string;
  setAccessToken: React.Dispatch<React.SetStateAction<string>>;
  trpc: ReturnType<typeof createTRPCProxyClient<AppRouter>>;
  loginState: State;
  setLoginState: React.Dispatch<React.SetStateAction<State>>;
  user: User | null;
};

type ConfirmDialogData = {
  title?: string;
  body?: string;
  confrimText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  [key: string]: any;
};

const defaultConfirmDialogData = {
  title: "Confirm",
  body: "Are you sure?",
  confrimText: "Confirm",
  cancelText: "Cancel",
};

function App() {
  const [secondaryMenu, setSecondaryMenu] = useState(window.innerWidth > 1320);
  const [user, setUser] = useState<User | null>(null);
  const [loginState, setLoginState] = useState<State>("loading");
  const [confirmDialogData, setConfirmDialogData] =
    useState<ConfirmDialogData | null>(null);
  const handleClose = () => {
    setConfirmDialogData(null);
  };

  const [accessToken, setAccessToken] = useLocalStorage<string>(
    "accessToken",
    ""
  );
  const [refreshToken, setRefreshToken] = useLocalStorage<string>(
    "refreshToken",
    ""
  );

  const trpc = useMemo(() => {
    return createTRPCProxyClient<AppRouter>({
      links: [
        httpBatchLink({
          // url: "http://localhost:3000/trpc",
          url: `http://${window.location.hostname}:3000/trpc`,
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }),
      ],
    });
  }, [accessToken]);

  const verifyToken = useCallback(async () => {
    if (!accessToken) setLoginState("error");
    try {
      // await new Promise((resolve) => setTimeout(resolve, 3000));
      const data = await trpc.auth.verify.mutate({ accessToken });
      setUser(data);
      setLoginState("idle");
    } catch (err) {
      setLoginState("error");
    }
  }, [accessToken]);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    verifyToken();
  }, [accessToken]);

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
        trpc,
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
              onClick={() => {
                if (location.pathname === "/flow")
                  setSecondaryMenu((prev) => !prev);
                else {
                  setSecondaryMenu(true);
                  navigate("/flow");
                }
              }}
            >
              <FireIcon className="w-8 text-gray-50" />
            </Button>
            <Button
              variant="text"
              className=" flex justify-center items-center hover:bg-blue-500 "
              onClick={() => {
                if (location.pathname !== "/flow")
                  setSecondaryMenu((prev) => !prev);
                else {
                  setSecondaryMenu(true);
                  navigate("/");
                }
              }}
            >
              <HomeIcon className="w-8 text-gray-50" />
            </Button>
          </div>
          <div className="h-screen w-screen bg-blue-50/20  pt-16 [&>*]:w-full [&>*]:h-full ">
            <Outlet />
          </div>
          <Dialog
            open={!!confirmDialogData}
            size="xs"
            handler={handleClose}
            className="!w-11/12 !max-w-[20rem] "
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
                <span>{confirmDialogData?.confrimText}</span>
              </Button>
            </DialogFooter>
          </Dialog>
          <ToastContainer />
        </>
      )}
    </Provider>
  );
}

export default App;
