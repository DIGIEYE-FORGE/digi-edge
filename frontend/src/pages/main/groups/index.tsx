import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  Typography,
  IconButton,
  Card,
  Input,
} from "@material-tailwind/react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  PencilIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import DataGrid, { Column } from "../../../components/data-grid";
import Provider, { useProvider } from "../../../components/provider";
import { AppContext } from "../../../App";
import AddEdit from "./add-edit";
import Pagination from "../../../components/pagination";
import { Group, MqttServer, State } from "../../../utils/types.ts";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { TRPCClientError } from "@trpc/client";

const defaultGroup: Group = {
  name: "",
  type: "",
  mqttServerId: null,
};

export type GroupsPageContext = AppContext & {
  group: Group | null;
  setGroup: React.Dispatch<Group | null>;
  getGroups: () => Promise<void>;
  mqttServers: MqttServer[];
};

type OrderBy = {
  field: "name" | "type" | "createdAt";
  direction: "asc" | "desc";
};
export function GroupsPage() {
  const context = useProvider<AppContext>();
  const { trpc, handleConfirm } = context;
  const [group, setGroup] = React.useState<Group | null>(null);
  const [rows, setRows] = React.useState<Group[]>([]);
  const [fetchingState, setFetchingState] = useState<State>("idle");
  const [orderBy, setOrderBy] = useState<OrderBy | undefined>();
  const [search, setSearch] = useState<string>("");
  const [mqttServers, setMqttServers] = useState<MqttServer[]>([]);

  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 5,
  });

  const fetchStatic = useCallback(async () => {
    await new Promise((r) => setTimeout(r, 500));
    try {
      const mqttServers = await trpc.mqttServer.findMany.query();
      setMqttServers(mqttServers);
    } catch (error) {
      console.error(error);
    }
  }, [trpc]);

  const getGroups = useCallback(async () => {
    setFetchingState("loading");
    await new Promise((r) => setTimeout(r, 500));
    try {
      const groups = await trpc.group.findMany.query();
      setFetchingState("idle");
      setRows(groups);
    } catch (error) {
      console.error(error);
      setFetchingState("error");
    }
  }, [trpc]);

  // TODO: add debounce
  useEffect(() => {
    getGroups();
    fetchStatic();
  }, [getGroups]);

  const columns: Column<Group>[] = useMemo(
    () =>
      [
        {
          header: (
            <Button
              variant="text"
              onClick={() => {
                setOrderBy((prev) => ({
                  field: "name",
                  direction: prev?.direction === "asc" ? "desc" : "asc",
                }));
              }}
              className="flex px-2 gap-2 items-center text-inherit text-md w-full h-full rounded-none"
            >
              <span className="flex flex-col justify-center text-blue-gray-100 ">
                <ChevronUpIcon
                  className={`h-3 font-bold ${
                    orderBy?.field === "name" && orderBy?.direction === "asc"
                      ? "text-blue-500"
                      : ""
                  }`}
                />
                <ChevronDownIcon
                  className={`h-3 font-bold ${
                    orderBy?.field === "name" && orderBy?.direction === "desc"
                      ? "text-blue-500"
                      : ""
                  }`}
                />
              </span>
              <span>type</span>
            </Button>
          ),
          field: "type",
        },
        {
          header: "MQTT Server",
          valueGetter: (row) => row.mqttServer?.host || "N/A",
        },
        {
          header: (
            <Button
              variant="text"
              onClick={() => {
                setOrderBy((prev) => ({
                  field: "type",
                  direction: prev?.direction === "asc" ? "desc" : "asc",
                }));
              }}
              className="flex px-2 gap-2 items-center text-inherit text-md w-full h-full rounded-none"
            >
              <span className="flex flex-col justify-center text-blue-gray-100">
                <ChevronUpIcon
                  className={`h-3 font-bold ${
                    orderBy?.field === "type" && orderBy?.direction === "asc"
                      ? "text-blue-700"
                      : ""
                  }`}
                />
                <ChevronDownIcon
                  className={`h-3 font-bold ${
                    orderBy?.field === "type" && orderBy?.direction === "desc"
                      ? "text-blue-700"
                      : ""
                  }`}
                />
              </span>
              <span>name</span>
            </Button>
          ),
          field: "name",
        },
        {
          header: (
            <Button
              variant="text"
              onClick={() => {
                setOrderBy((prev) => ({
                  field: "createdAt",
                  direction: prev?.direction === "asc" ? "desc" : "asc",
                }));
              }}
              className="flex px-2 gap-1 items-center text-inherit text-md w-full h-full rounded-none"
            >
              <span className="!px-3 flex flex-col justify-center text-blue-gray-100">
                <ChevronUpIcon
                  className={`h-3 font-bold ${
                    orderBy?.field === "createdAt" &&
                    orderBy?.direction === "asc"
                      ? "text-blue-700"
                      : ""
                  }`}
                />
                <ChevronDownIcon
                  className={`h-3 font-bold ${
                    orderBy?.field === "createdAt" &&
                    orderBy?.direction === "desc"
                      ? "text-blue-500"
                      : ""
                  }`}
                />
              </span>
              <span>creation date</span>
            </Button>
          ),
          valueGetter: (row) =>
            format(new Date(row.createdAt!), "yyyy-MM-dd HH:mm"),
        },
        {
          header: <span className="px-2">Actions</span>,
          width: "120px",
          valueGetter: (row) => (
            <div className="flex items-center gap-2">
              <IconButton
                variant="text"
                color="light-blue"
                className="opacity-50 hover:opacity-100"
                onClick={() => setGroup(row)}
              >
                <PencilIcon className="h-6" />
              </IconButton>
              <IconButton
                variant="text"
                color="red"
                onClick={() => {
                  handleConfirm({
                    title: "Delete Group!",
                    body: "Are you Sure do you want to precede. this action is irriversible",
                    onConfirm: async () => {
                      if (!row.id) return;
                      try {
                        await trpc.group.delete.mutate(row.id);
                        getGroups();
                      } catch (error) {
                        if (error instanceof TRPCClientError) {
                          toast.error(error.message);
                          return;
                        }
                        toast.error("Something went wrong");
                        console.error(error);
                      }
                    },
                  });
                }}
              >
                <TrashIcon className="h-6" />
              </IconButton>
            </div>
          ),
        },
      ] as Column<Group>[],
    [orderBy]
  );

  return (
    <Provider
      value={{
        ...context,
        group,
        setGroup,
        getGroups,
        mqttServers,
      }}
    >
      <div className="h-full flex flex-col gap-4">
        <div className="flex flex-wrap gap-4">
          <Typography variant="h5" color="blue">
            Applications management
          </Typography>
          <div className="ml-auto">
            <Input
              label="Search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
            ></Input>
          </div>
        </div>
        <Card className="flex flex-col flex-1 ">
          <DataGrid
            className="text-left table-fixed w-full capitalize"
            headerClassName="capitalize [&>*]:h-16 border-b border-blue-gray-100 text-gray-900"
            rowClassName="[&>*]:p-2 md:[&>*]:p-3 lg:[&>*]:p-4 border-b border-blue-gray-100  hover:bg-blue-50/50 transition-colors"
            rows={rows.slice(
              (pagination.page - 1) * pagination.perPage,
              pagination.page * pagination.perPage
            )}
            columns={columns}
            loading={fetchingState === "loading"}
            error={fetchingState === "error"}
          ></DataGrid>
          <div className="flex items-center py-2 px-1 sm:px-2 md:px-4 mt-auto flex-wrap ">
            <Button
              className="flex justify-center items-center gap-3 rounded-full p-0 h-10  md:h-12 aspect-square "
              onClick={() => setGroup(defaultGroup)}
            >
              <PlusCircleIcon strokeWidth={2} className="w-7 md:w-8" />
            </Button>
            <Pagination
              className="mt-auto md:p-3 lg:p-4 ml-auto"
              value={pagination}
              onChange={setPagination}
              total={500}
            />
          </div>
        </Card>
        <AddEdit />
      </div>
    </Provider>
  );
}

export default GroupsPage;
