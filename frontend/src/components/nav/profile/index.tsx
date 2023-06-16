import {
  UserCircleIcon,
  Cog6ToothIcon,
  InboxArrowDownIcon,
  LifebuoyIcon,
  PowerIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import {
  Menu,
  MenuHandler,
  Button,
  Avatar,
  Typography,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import React from "react";
import { useProvider } from "../../provider";
import { AppContext } from "../../../App";

function ProfileMenu() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user, setAccessToken, setRefreshToken } = useProvider<AppContext>();

  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      <MenuHandler>
        <Button
          variant="text"
          color="blue-gray"
          className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5"
        >
          <Avatar
            variant="circular"
            size="sm"
            alt="candice wu"
            className="border border-blue-500 p-0.5 "
            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
          />
          <Typography
            color="blue-gray"
            className="w-[6rem] hidden sm:inline-block"
          >{`${user?.firstName} ${user?.lastName}`}</Typography>
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`h-3 w-3 transition-transform ${
              isMenuOpen ? "rotate-180" : ""
            }`}
          />
        </Button>
      </MenuHandler>
      <MenuList className="p-1">
        <MenuItem className="flex items-center gap-2 rounded">
          <UserCircleIcon className="h-4 w-4" strokeWidth={2} />
          <Typography
            as="span"
            variant="small"
            className="font-normal"
            color="inherit"
          >
            My Profile
          </Typography>
        </MenuItem>
        <MenuItem className="flex items-center gap-2 rounded">
          <Cog6ToothIcon className="h-4 w-4" strokeWidth={2} />
          <Typography
            as="span"
            variant="small"
            className="font-normal"
            color="inherit"
          >
            Edit Profile
          </Typography>
        </MenuItem>
        <MenuItem className="flex items-center gap-2 rounded">
          <InboxArrowDownIcon className="h-4 w-4" strokeWidth={2} />
          <Typography
            as="span"
            variant="small"
            className="font-normal"
            color="inherit"
          >
            Inbox
          </Typography>
        </MenuItem>
        <MenuItem className="flex items-center gap-2 rounded">
          <LifebuoyIcon className="h-4 w-4" strokeWidth={2} />
          <Typography
            as="span"
            variant="small"
            className="font-normal"
            color="inherit"
          >
            Help
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAccessToken("");
            setRefreshToken("");
          }}
          className="flex items-center gap-2 rounded hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
        >
          <PowerIcon className="h-4 w-4 text-red-500" strokeWidth={2} />
          <Typography
            as="span"
            variant="small"
            className="font-normal"
            color="red"
          >
            Sign Out
          </Typography>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

export default ProfileMenu;
