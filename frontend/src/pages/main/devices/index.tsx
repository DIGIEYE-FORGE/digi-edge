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
  Device as Data,
  Decoder,
  DeviceType,
  Protocol,
  State,
} from "../../../utils/types.ts";

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

  useEffect(() => {
    fetchRows();
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
            loading={fetchingState === "loading"}
            error={fetchingState === "error"}
          ></DataGrid>
          <Pagination
            className="mt-auto p-2 md:p-3 lg:p-4 ml-auto"
            value={{
              page: 1,
              perPage: 5,
            }}
            total={500}
          />
        </Card>
        <AddEdit />
      </div>
    </Provider>
  );
}

export default DeviceProfilePage;
