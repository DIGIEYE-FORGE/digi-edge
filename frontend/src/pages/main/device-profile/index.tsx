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
import { AppContext, DeviceProfile } from "../../../utils/types";
import AddEdit from "./add-edit";
import Pagination from "../../../components/pagination";
import {
  DeviceProfile as Data,
  Decoder,
  DeviceType,
  Protocol,
} from "../../../utils/types.ts";
import { useMutation, useQueries } from "@tanstack/react-query";
import { getDecoders } from "../../../api/decoder/index.ts";
import {
  deleteDeviceProfile,
  getDeviceProfiles,
} from "../../../api/device-profile/index.ts";
import { getDeviceTypes } from "../../../api/device-type/index.ts";
import { getProtocols } from "../../../api/protocol/index.ts";

const defaultData: Data = {
  name: "",
  description: "",
  decoderId: null,
  decoder: null,
  deviceTypeId: null,
  deviceType: null,
  protocolId: null,
  protocol: null,
  credentialsType: null,
};

export type Context = AppContext & {
  data: Data | null;
  setData: React.Dispatch<Data | null>;
  fetchRows: () => Promise<void>;
  deviceTypes: DeviceType[];
  fetchDeviceTypes: () => Promise<void>;
  protocols: Protocol[];
  fetchProtocols: () => Promise<void>;
  decoders: Decoder[];
  fetchDecoders: () => Promise<void>;
};

export function DeviceProfilePage() {
  const context = useProvider<AppContext>();
  const { handleConfirm } = context;
  const [data, setData] = React.useState<Data | null>(null);
  const [rows, setRows] = React.useState<Data[]>([]);
  const [deviceTypes, setDeviceTypes] = React.useState<DeviceType[]>([]);
  const [protocols, setProtocols] = React.useState<Protocol[]>([]);
  const [decoders, setDecoders] = React.useState<Decoder[]>([]);
  const [refetch, setRefetch] = useState<{
    deviceType: boolean;
    protocol: boolean;
    decoder: boolean;
    deviceProfile: boolean;
  }>({
    deviceType: true,
    protocol: true,
    decoder: true,
    deviceProfile: true,
  });

  const [deviceProfileQuery] = useQueries({
    queries: [
      {
        queryKey: ["device-profiles"],
        queryFn: () => getDeviceProfiles(),
        onSuccess: (data: {
          totalResult: number;
          results: DeviceProfile[];
        }) => {
          setRows(data.results);
          setRefetch((prev) => {
            return {
              ...prev,
              deviceProfile: false,
            };
          });
        },
        enabled: refetch.deviceProfile,
      },
      {
        queryKey: ["device-types"],
        queryFn: () => getDeviceTypes(),
        onSuccess: (data: { totalResult: number; results: DeviceType[] }) => {
          setDeviceTypes(data.results);
          setRefetch((prev) => {
            return {
              ...prev,
              deviceType: false,
            };
          });
        },
        enabled: refetch.deviceType,
      },
      {
        queryKey: ["protocols"],
        queryFn: () => getProtocols(),
        onSuccess: (data: { totalResult: number; results: Protocol[] }) => {
          setProtocols(data.results);
          setRefetch((prev) => {
            return {
              ...prev,
              protocol: false,
            };
          });
        },
        enabled: refetch.protocol,
      },
      {
        queryKey: ["decoders"],
        queryFn: () => getDecoders(),
        onSuccess: (data: { totalResult: number; results: Decoder[] }) => {
          setDecoders(data.results);
          setRefetch((prev) => {
            return {
              ...prev,
              decoder: false,
            };
          });
        },
        enabled: refetch.decoder,
      },
    ],
  });

  const deviceProfileMutation = useMutation({
    mutationFn: (id: number) => deleteDeviceProfile(id),
    onSuccess: () => {
      setRefetch((prev) => {
        return {
          ...prev,
          deviceProfile: true,
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
          header: "deviceType",
          valueGetter: (row) => row.deviceType?.name,
        },
        {
          header: "protocol",
          valueGetter: (row) => row.protocol?.name,
        },
        {
          header: "description",
          field: "description",
        },
        {
          header: "decoder",
          valueGetter: (row) => row.decoder?.name,
        },
        {
          header: "credentialsType",
          valueGetter: (row) => row.credentialsType,
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
                        deviceProfileMutation.mutate(row.id);
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
        deviceTypes,
        protocols,
        decoders,
      }}
    >
      <div className="h-full flex flex-col gap-4">
        <div className="flex flex-wrap gap-4">
          <Typography variant="h5" color="blue">
            DeviceProfile management
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
            loading={deviceProfileQuery.isLoading}
            error={deviceProfileQuery.isError}
          ></DataGrid>
          <Pagination
            className="mt-auto p-2 md:p-3 lg:p-4 ml-auto"
            value={{
              page: 1,
              perPage: 5,
            }}
            total={deviceProfileQuery.data?.totalResult || 0}
          />
        </Card>
        <AddEdit setRefetch={setRefetch} />
      </div>
    </Provider>
  );
}

export default DeviceProfilePage;
