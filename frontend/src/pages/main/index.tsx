import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useProvider } from "../../components/provider";
import { AppContext } from "../../App";

import React from "react";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  PowerIcon,
  RectangleGroupIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
import {
  ChevronRightIcon,
  ChevronDownIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

function ListItemLink({
  children,
  path,
}: {
  children: React.ReactNode;
  path: string;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <ListItem
      className={`${
        location.pathname === path ? "bg-gray-100 text-blue-600" : ""
      }`}
      onClick={() => navigate(path)}
    >
      {children}
    </ListItem>
  );
}

function SideBar() {
  const { secondaryMenu, setAccessToken, user } = useProvider<AppContext>();
  const [open, setOpen] = React.useState(0);

  const handleOpen = (value: number) => {
    setOpen(open === value ? 0 : value);
  };
  const handleLogout = () => {
    setAccessToken("");
  };

  return (
    <div
      className={`fixed top-[4rem] left-2 bottom-2 transition-[width] shadow-xl shadow-blue-gray-900/20 rounded-xl overflow-hidden z-[2] ${
        secondaryMenu ? "w-[20rem]" : "w-12"
      } `}
    >
      <Card
        className="h-full pl-[4rem] min-w-[20rem]
			 "
        shadow={false}
      >
        <div className="mb-2 p-4">
          <Typography variant="h5" color="blue-gray">
            Digiey DataPlatform
          </Typography>
        </div>
        <List>
          <ListItemLink path="">
            <ListItemPrefix>
              <PresentationChartBarIcon className="h-5 w-5" />
            </ListItemPrefix>
            Dashboard
          </ListItemLink>
          <Accordion
            open={open === 1}
            icon={
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`mx-auto h-4 w-4 transition-transform ${
                  open === 1 ? "rotate-180" : ""
                }`}
              />
            }
          >
            <ListItem className="p-0" selected={open === 1}>
              <AccordionHeader
                onClick={() => handleOpen(1)}
                className="border-b-0 p-3"
              >
                <ListItemPrefix>
                  <RectangleGroupIcon className="h-5 w-5" />
                </ListItemPrefix>
                <Typography
                  color="blue-gray"
                  className="mr-auto font-normal text-sm"
                >
                  Devices & Applications
                </Typography>
              </AccordionHeader>
            </ListItem>
            <AccordionBody className="py-1">
              <List className="p-0">
                <ListItemLink path="/applications">
                  <ListItemPrefix>
                    <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                  </ListItemPrefix>
                  Applications
                </ListItemLink>
                <ListItemLink path="/devices">
                  <ListItemPrefix>
                    <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                  </ListItemPrefix>
                  Devices
                </ListItemLink>
                <ListItemLink path="/mqtt-servers">
                  <ListItemPrefix>
                    <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                  </ListItemPrefix>
                  MQTT Servers
                </ListItemLink>
                <ListItemLink path="/device-profiles">
                  <ListItemPrefix>
                    <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                  </ListItemPrefix>
                  Device Profiles
                </ListItemLink>
                <ListItemLink path="/types">
                  <ListItemPrefix>
                    <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                  </ListItemPrefix>
                  Types
                </ListItemLink>
              </List>
            </AccordionBody>
          </Accordion>
          {user && user.role === "ADMIN" && (
            <ListItemLink path="/users">
              <ListItemPrefix>
                <UserGroupIcon className="h-5 w-5" />
              </ListItemPrefix>
              Users
            </ListItemLink>
          )}
          {/* <ListItem>
            <ListItemPrefix>
              <InboxIcon className="h-5 w-5" />
            </ListItemPrefix>
            Inbox
            <ListItemSuffix>
              <Chip
                value="14"
                size="sm"
                variant="ghost"
                color="blue-gray"
                className="rounded-full"
              />
            </ListItemSuffix>
          </ListItem> */}
          <ListItemLink path="/profile">
            <ListItemPrefix>
              <UserCircleIcon className="h-5 w-5" />
            </ListItemPrefix>
            Profile
          </ListItemLink>
          {/* <ListItemLink path="/setting">
            <ListItemPrefix>
              <Cog6ToothIcon className="h-5 w-5" />
            </ListItemPrefix>
            Settings
          </ListItemLink> */}
          <ListItem onClick={handleLogout}>
            <ListItemPrefix>
              <PowerIcon className="h-5 w-5" />
            </ListItemPrefix>
            Log Out
          </ListItem>
          {/* <ListItemLink path="/dev">
            <ListItemPrefix>
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
            </ListItemPrefix>
            Dev
          </ListItemLink> */}
        </List>
      </Card>
    </div>
  );
}

function MainPage() {
  ``;
  const { secondaryMenu } = useProvider<AppContext>();
  return (
    <div className="flex overflow-x-hidden">
      <SideBar />
      <div
        className={`w-full mx-auto max-w-[1920px] h-full transition-[padding] [&>*]:p-2 md:[&>*]:p-4 lg:[&>*]:p-6   pl-[4rem]  ${
          secondaryMenu && " 2xl:pl-[20.5rem]"
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default MainPage;
