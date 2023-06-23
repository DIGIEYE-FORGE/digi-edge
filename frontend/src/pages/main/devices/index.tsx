import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  Typography,
  IconButton,
  Card,
  Input,
} from "@material-tailwind/react";
import {
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import DataGrid, { Column } from "../../../components/data-grid";
import Provider, { useProvider } from "../../../components/provider";
import { AppContext } from "../../../App";
import AddEdit from "./add-edit";
import Pagination from "../../../components/pagination";
import {
  Device as Data,
  MqttServer,
  Name,
  State,
} from "../../../utils/types.ts";
import { generateRandomHex } from "../../../utils/functions.ts";
import { FaPlus } from "react-icons/fa";

const defaultData: Data = {
  name: "",
  serial: "",
  deviceProfileId: null,
  groupId: null,
  mqttServerId: null,
  isPassive: false,
  isDecoded: false,
  blacklisted: false,
  credential: null,
  credentialsType: null,
  attributes: [
    {
      name: "APP_EUI",
      value: generateRandomHex(16),
    },
    {
      name: "DEV_EUI",
      value: generateRandomHex(16),
    },
  ],
};

export type Context = AppContext & {
  data: Data | null;
  setData: React.Dispatch<Data | null>;
  fetchRows: () => Promise<void>;
  fetchDecoders: () => Promise<void>;
  deviceProfiles: Name[];
  groups: Name[];
  mqttServers: MqttServer[];
};
export function DevicePages() {
  const context = useProvider<AppContext>();
  const { trpc, handleConfirm } = context;
  const [data, setData] = React.useState<Data | null>(null);
  const [rows, setRows] = React.useState<Data[]>([]);
  const [fetchingState, setFetchingState] = useState<State>("idle");
  const [deviceProfiles, setDeviceProfiles] = useState<Name[]>([]);
  const [groups, setGroups] = useState<Name[]>([]);
  const [mqttServers, setMqttServers] = useState<MqttServer[]>([]);
  const [search, setSearch] = useState<string>("");
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 5,
  });

  const fetchStatic = useCallback(async () => {
    await new Promise((r) => setTimeout(r, 500));
    try {
      const deviceProfiles = await trpc.deviceProfile.getNames.query();
      const groups = await trpc.group.getNames.query();
      const mqttServers = await trpc.mqttServer.findMany.query();
      setDeviceProfiles(deviceProfiles);
      setGroups(groups);
      setMqttServers(mqttServers);
    } catch (error) {
      console.error(error);
    }
  }, [trpc]);

  const fetchRows = useCallback(async () => {
    setFetchingState("loading");
    await new Promise((r) => setTimeout(r, 500));
    try {
      const res = await trpc.device.findMany.query();
      setFetchingState("idle");
      setRows(res);
    } catch (error) {
      console.error(error);
      setFetchingState("error");
    }
  }, [trpc]);

  const filteredRows = useMemo(() => {
    if (!search) return rows;
    setPagination((prev) => ({ ...prev, page: 1 }));
    return rows.filter((row) => {
      return (
        row.name.toLowerCase().includes(search.toLowerCase()) ||
        row.serial.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [rows, search]);

  useEffect(() => {
    fetchStatic();
    fetchRows();
  }, []);

  const columns: Column<Data>[] = useMemo(
    () =>
      [
        {
          header: "Name",
          field: "name",
        },
        {
          header: "Serial",
          field: "serial",
        },
        {
          header: "Is Passive",
          field: "isPassive",
        },
        {
          header: "Is Decoded",
          field: "isDecoded",
        },
        {
          header: "Device Profile",
          valueGetter: (row) => row?.deviceProfile?.name || "N/A",
        },
        {
          header: "mqttServer Host",
          valueGetter: (row) => row?.mqttServer?.host || "N/A",
        },
        {
          header: "Application",
          valueGetter: (row) => row?.group?.name || "N/A",
        },
        {
          header: "Actions",
          width: "120px",
          valueGetter: (row) => (
            <div className="flex items-center gap-2">
              <IconButton
                variant="text"
                color="light-blue"
                className="opacity-50 hover:opacity-100"
                onClick={() => setData(row)}
              >
                <PencilIcon className="h-6" />
              </IconButton>
              <IconButton
                variant="text"
                color="red"
                onClick={() => {
                  handleConfirm({
                    title: "Delete MqttServer!",
                    body: "Are you Sure do you want to precede. this action is irriversible",
                    onConfirm: async () => {
                      if (!row.id) return;
                      try {
                        await trpc.device.delete.mutate(row.id);
                        fetchRows();
                      } catch (error) {
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
      ] as Column<Data>[],
    []
  );

  return (
    <Provider
      value={{
        ...context,
        data,
        setData,
        fetchRows,
        deviceProfiles,
        groups,
        mqttServers,
      }}
    >
      <div className="h-full flex flex-col gap-4">
        <div className="flex flex-wrap gap-4">
          <Typography variant="h5" color="blue">
            Devices management
          </Typography>
          <div className="ml-auto">
            <Input
              label="Search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            ></Input>
          </div>
        </div>
        <Card className="flex flex-col flex-1">
          <DataGrid
            cellMinWidth={150}
            className="text-left table-auto w-full "
            headerClassName="[&>*]:p-2 md:[&>*]:p-3 lg:[&>*]:p-4 border-b border-blue-gray-50 text-gray-900"
            rowClassName="[&>*]:p-2 md:[&>*]:p-3 lg:[&>*]:p-4 border-b border-blue-gray-50  hover:bg-blue-50/50 transition-colors"
            rows={
              filteredRows.slice(
                (pagination.page - 1) * pagination.perPage,
                pagination.page * pagination.perPage
              ) || []
            }
            columns={columns}
            loading={fetchingState === "loading"}
            error={fetchingState === "error"}
          ></DataGrid>
          <div className="flex items-center py-2 px-1 sm:px-2 md:px-4 mt-auto flex-wrap ">
            <Button
              className="flex justify-center items-center gap-3 rounded-full p-0 h-10  md:h-12 aspect-square "
              onClick={() => setData(defaultData)}
            >
              <FaPlus className="text-xl" />
            </Button>
            <Pagination
              className="mt-auto md:p-3 lg:p-4 ml-auto"
              value={pagination}
              onChange={setPagination}
              total={rows.length}
            />
          </div>
        </Card>
        <AddEdit />
      </div>
    </Provider>
  );
}

export default DevicePages;
