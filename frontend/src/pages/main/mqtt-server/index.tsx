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
import { MqttServer as Data, State } from "../../../utils/types.ts";
import { FaPlus } from "react-icons/fa";

const defaultData: Data = {
  host: "",
  topic: "",
  password: "",
  username: "",
  clientId: 0,
};

export type Context = AppContext & {
  data: Data | null;
  setData: React.Dispatch<Data | null>;
  fetchRows: () => Promise<void>;
};

export function MqttServersPage() {
  const context = useProvider<AppContext>();
  const { trpc, handleConfirm } = context;
  const [data, setData] = React.useState<Data | null>(null);
  const [rows, setRows] = React.useState<Data[]>([]);
  const [search, setSearch] = useState<string>("");
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 5,
  });
  const [fetchingState, setFetchingState] = useState<State>("idle");

  const fetchRows = useCallback(async () => {
    setFetchingState("loading");
    await new Promise((r) => setTimeout(r, 500));
    try {
      const mqttServers = await trpc.mqttServer.findMany.query();
      setFetchingState("idle");
      setRows(mqttServers);
    } catch (error) {
      setFetchingState("error");
    }
  }, [trpc]);

  const filteredRows = useMemo(() => {
    if (!search) return rows;
    setPagination((prev) => ({ ...prev, page: 1 }));
    return rows.filter((row) => {
      return (
        row.username.toLowerCase().includes(search.toLowerCase()) ||
        row.host.toLowerCase().includes(search.toLowerCase()) ||
        row.topic.toLowerCase().includes(search.toLowerCase()) ||
        row.clientId.toString().toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [rows, search]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const columns: Column<Data>[] = useMemo(
    () =>
      [
        {
          header: "Client Id",
          field: "clientId",
        },
        {
          header: "Username",
          field: "username",
        },
        {
          header: "Host",
          field: "host",
        },
        {
          header: "Topic",
          field: "topic",
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
      }}
    >
      <div className="h-full flex flex-col gap-4">
        <div className="flex flex-wrap gap-4">
          <Typography variant="h5" color="blue">
            MQTT Servers management
          </Typography>
          <div className="ml-auto">
            <Input
              label="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            ></Input>
          </div>
        </div>
        <Card className="flex flex-col flex-1">
          <DataGrid
            className="text-left table-fixed w-full "
            headerClassName="[&>*]:p-2 md:[&>*]:p-3 lg:[&>*]:p-4 border-b border-blue-gray-100 text-gray-900"
            rowClassName="[&>*]:p-2 md:[&>*]:p-3 lg:[&>*]:p-4 border-b border-blue-gray-100  hover:bg-blue-50/50 transition-colors"
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
              total={filteredRows.length}
            />
          </div>
        </Card>
        <AddEdit />
      </div>
    </Provider>
  );
}

export default MqttServersPage;
