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
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import DataGrid, { Column } from "../../../components/data-grid";
import Provider, { useProvider } from "../../../components/provider";
import { AppContext } from "../../../App";
import AddEdit from "./add-edit";
import Pagination from "../../../components/pagination";
import {
  DeviceProfile as Data,
  Decoder,
  DeviceType,
  Protocol,
  State,
} from "../../../utils/types.ts";

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
  const { trpc, handleConfirm } = context;
  const [data, setData] = React.useState<Data | null>(null);
  const [rows, setRows] = React.useState<Data[]>([]);
  const [fetchingState, setFetchingState] = useState<State>("idle");
  const [deviceTypes, setDeviceTypes] = React.useState<DeviceType[]>([]);
  const [protocols, setProtocols] = React.useState<Protocol[]>([]);
  const [decoders, setDecoders] = React.useState<Decoder[]>([]);

  const fetchDeviceTypes = useCallback(async () => {
    await new Promise((r) => setTimeout(r, 500));
    try {
      const res = await trpc.deviceType.findMany.query();
      setDeviceTypes(res);
    } catch (error) {
      console.error(error);
    }
  }, [trpc]);

  const fetchProtocols = useCallback(async () => {
    try {
      const res = await trpc.protocol.findMany.query();
      setProtocols(res);
    } catch (error) {
      console.error(error);
    }
  }, [trpc]);

  const fetchDecoders = useCallback(async () => {
    try {
      const res = await trpc.decoder.findMany.query();
      setDecoders(res);
    } catch (error) {
      console.error(error);
    }
  }, [trpc]);

  const fetchRows = useCallback(async () => {
    setFetchingState("loading");
    await new Promise((r) => setTimeout(r, 500));
    try {
      const res = await trpc.deviceProfile.findMany.query();
      setFetchingState("idle");
      setRows(res);
    } catch (error) {
      console.error(error);
      setFetchingState("error");
    }
  }, [trpc]);

  useEffect(() => {
    fetchRows();
    fetchDeviceTypes();
    fetchProtocols();
    fetchDecoders();
  }, []);

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
                        await trpc.mqttServer.delete.mutate(row.id);
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
        deviceTypes,
        fetchDeviceTypes,
        protocols,
        fetchProtocols,
        decoders,
        fetchDecoders,
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
        </div>
        <Card className="flex flex-col flex-1">
          <DataGrid
            cellMinWidth={150}
            className="text-left table-auto w-full "
            headerClassName="[&>*]:p-2 md:[&>*]:p-3 lg:[&>*]:p-4 border-b border-blue-gray-100 text-gray-900"
            rowClassName="[&>*]:p-2 md:[&>*]:p-3 lg:[&>*]:p-4 border-b border-blue-gray-100  hover:bg-blue-50/50 transition-colors"
            rows={rows}
            columns={columns}
            loading={fetchingState === "loading"}
            error={fetchingState === "error"}
          ></DataGrid>
          <div className="flex items-center py-2 px-1 sm:px-2 md:px-4 mt-auto flex-wrap ">
            <Button
              className="flex justify-center items-center gap-3 rounded-full p-0 h-10  md:h-12 aspect-square "
              onClick={() => setData(defaultData)}
            >
              <PlusCircleIcon strokeWidth={2} className="w-7 md:w-8" />
            </Button>
            <Pagination
              className="mt-auto md:p-3 lg:p-4 ml-auto"
              value={{
                page: 1,
                perPage: 5,
              }}
              total={500}
            />
          </div>
        </Card>
        <AddEdit />
      </div>
    </Provider>
  );
}

export default DeviceProfilePage;
