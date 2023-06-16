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
import { AppContext } from "../../../utils/types";
import AddEdit from "./add-edit";
import Pagination from "../../../components/pagination";
import { MqttServer } from "../../../utils/types.ts";
import {
  deleteMqttServer,
  getMqttServers,
} from "../../../api/mqtt-server/index.ts";
import { useMutation, useQuery } from "@tanstack/react-query";

const defaultMqttServer: MqttServer = {
  host: "",
  topic: "",
  password: "",
  username: "",
  clientId: 0,
};

export type Context = AppContext & {
  mqttServer: MqttServer | null;
  setMqttServer: React.Dispatch<MqttServer | null>;
  fetchRows: () => Promise<void>;
};

export function MqttServersPage() {
  const context = useProvider<AppContext>();
  const { handleConfirm } = context;
  const [mqttServer, setMqttServer] = React.useState<MqttServer | null>(null);
  const [rows, setRows] = React.useState<MqttServer[]>([]);
  const [refetch, setRefetch] = useState<boolean>(true);

  const { data, isError, isLoading } = useQuery({
    queryKey: ["mqtt-servers"],
    queryFn: () => getMqttServers(),
    onSuccess: (data) => {
      setRows(data.results);
      setRefetch(false);
    },
    enabled: refetch,
  });

  const mqttServerMutation = useMutation({
    mutationFn: (id: number) => deleteMqttServer(id),
    onSuccess: () => {
      setRefetch(true);
    },
  });

  const columns: Column<MqttServer>[] = useMemo(
    () =>
      [
        {
          header: "id",
          field: "id",
        },
        {
          header: "clientId",
          field: "clientId",
        },
        {
          header: "username",
          field: "username",
        },
        {
          header: "host",
          field: "host",
        },
        {
          header: "topic",
          field: "topic",
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
                onClick={() => setMqttServer(row)}
              >
                <PencilIcon className="h-6" />
              </IconButton>
              <IconButton
                variant="text"
                color="red"
                onClick={() => {
                  handleConfirm({
                    title: "Delete MqttServer!",
                    body: "Are you Sure do you want to precede. this action is irreversible",
                    onConfirm: async () => {
                      if (!row.id) return;
                      try {
                        mqttServerMutation.mutate(row.id);
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
      ] as Column<MqttServer>[],
    []
  );

  return (
    <Provider
      value={{
        ...context,
        mqttServer,
        setMqttServer,
        getMqttServers,
      }}
    >
      <div className="h-full flex flex-col gap-4">
        <div className="flex flex-wrap gap-4">
          <Typography variant="h5" color="blue">
            MqttServers management
          </Typography>
          <div className="ml-auto">
            <Input label="Search"></Input>
          </div>
          <Button
            className="flex justify-center items-center "
            onClick={() => setMqttServer(defaultMqttServer)}
          >
            <PlusCircleIcon strokeWidth={2} className="w-6" />
          </Button>
        </div>
        <Card className="flex flex-col flex-1">
          <DataGrid
            className="text-left table-fixed w-full "
            headerClassName="[&>*]:p-2 md:[&>*]:p-3 lg:[&>*]:p-4 border-b border-blue-gray-100 text-gray-900"
            rowClassName="[&>*]:p-2 md:[&>*]:p-3 lg:[&>*]:p-4 border-b border-blue-gray-100  hover:bg-blue-50/50 transition-colors"
            rows={rows}
            columns={columns}
            loading={isLoading}
            error={isError}
          ></DataGrid>
          <Pagination
            className="mt-auto p-2 md:p-3 lg:p-4 ml-auto"
            value={{
              page: 1,
              perPage: 5,
            }}
            total={data?.totalResult || 0}
          />
        </Card>
        <AddEdit setRefetch={setRefetch} />
      </div>
    </Provider>
  );
}

export default MqttServersPage;
