import React, { useMemo, useState } from "react";
import {
  Button,
  Typography,
  IconButton,
  Card,
  Input,
} from "@material-tailwind/react";
import {
  PencilIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import DataGrid, { Column } from "../../../components/data-grid";
import Provider, { useProvider } from "../../../components/provider";
import {
  AppContext,
  DeviceProfile,
  Group,
  MqttServer,
} from "../../../utils/types.ts";
import AddEdit from "./add-edit";
import Pagination from "../../../components/pagination";
import { Devices as Data } from "../../../utils/types.ts";
import { useMutation, useQueries } from "@tanstack/react-query";
import { deleteDevice, getDevices } from "../../../api/device/index.ts";
import { getGroups } from "../../../api/group/index.ts";
import { getMqttServers } from "../../../api/mqtt-server/index.ts";
import { getDeviceProfiles } from "../../../api/device-profile/index.ts";

const defaultData: Data = {
  name: "",
  serial: "",
};

export type Context = AppContext & {
  data: Data | null;
  setData: React.Dispatch<Data | null>;
  fetchRows: () => Promise<void>;
  deviceProfiles: DeviceProfile[];
  groups: Group[];
  mqttServers: MqttServer[];
};
export function DeviceProfilePage() {
  const context = useProvider<AppContext>();
  const { handleConfirm } = context;
  const [data, setData] = React.useState<Data | null>(null);
  const [groups, setGroups] = React.useState<Group[]>([]);
  const [mqttServers, setMqttServers] = React.useState<MqttServer[]>([]);
  const [deviceProfiles, setDeviceProfiles] = React.useState<DeviceProfile[]>(
    []
  );

  const [rows, setRows] = React.useState<Data[]>([]);
  const [refetch, setRefetch] = useState<{
    device: boolean;
    group: boolean;
    deviceProfile: boolean;
    mqttServer: boolean;
  }>({
    device: true,
    group: true,
    deviceProfile: true,
    mqttServer: true,
  });

  const [deviceQuery] = useQueries({
    queries: [
      {
        queryKey: ["devices"],
        queryFn: () =>
          getDevices({
            include: { attributes: true },
          }),
        onSuccess: (data: any) => {
          setRows(data.results);
          setRefetch((prev) => {
            return {
              ...prev,
              device: false,
            };
          });
        },
        enabled: refetch.device,
      },
      {
        queryKey: ["groups"],
        queryFn: () => getGroups(),
        onSuccess: (data: any) => {
          setGroups(data.results);
          setRefetch((prev) => {
            return {
              ...prev,
              group: false,
            };
          });
        },
        enabled: refetch.group,
      },
      {
        queryKey: ["mqtt-servers"],
        queryFn: () => getMqttServers(),
        onSuccess: (data: any) => {
          setMqttServers(data.results);
          setRefetch((prev) => {
            return {
              ...prev,
              mqttServer: false,
            };
          });
        },
        enabled: refetch.mqttServer,
      },
      {
        queryKey: ["device-profiles"],
        queryFn: () => getDeviceProfiles(),
        onSuccess: (data: any) => {
          setDeviceProfiles(data.results);
          setRefetch((prev) => {
            return {
              ...prev,
              deviceProfile: false,
            };
          });
        },
        enabled: refetch.deviceProfile,
      },
    ],
  });

  const deviceMutation = useMutation({
    mutationFn: (id: number) => deleteDevice(id),
    onSuccess: () => {
      setRefetch((prev) => {
        return {
          ...prev,
          device: true,
        };
      });
    },
  });

  const columns: Column<Data>[] = useMemo(
    () =>
      [
        {
          header: "id",
          field: "id",
        },
        {
          header: "name",
          field: "name",
        },
        {
          header: "serial",
          field: "serial",
        },
        {
          header: "actions",
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
                        deviceMutation.mutate(row.id);
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
        getDevices,
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
            <Input label="Search"></Input>
          </div>
          <Button
            className="flex justify-center items-center "
            onClick={() => setData(defaultData)}
          >
            <PlusCircleIcon strokeWidth={2} className="w-6" />
          </Button>
        </div>
        <Card className="flex flex-col flex-1">
          <DataGrid
            cellMinWidth={150}
            className="text-left table-auto w-full "
            headerClassName="[&>*]:p-2 md:[&>*]:p-3 lg:[&>*]:p-4 border-b border-blue-gray-100 text-gray-900"
            rowClassName="[&>*]:p-2 md:[&>*]:p-3 lg:[&>*]:p-4 border-b border-blue-gray-100  hover:bg-blue-50/50 transition-colors"
            rows={rows}
            columns={columns}
            loading={deviceQuery.isLoading}
            error={deviceQuery.isError}
          ></DataGrid>
          <Pagination
            className="mt-auto p-2 md:p-3 lg:p-4 ml-auto"
            value={{
              page: 1,
              perPage: 5,
            }}
            total={deviceQuery.data?.totalResult || 0}
          />
        </Card>
        <AddEdit setRefetch={setRefetch} />
      </div>
    </Provider>
  );
}

export default DeviceProfilePage;
