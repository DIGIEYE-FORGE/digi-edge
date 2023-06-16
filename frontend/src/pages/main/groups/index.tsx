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
import { Group, State } from "../../../utils/types.ts";

const defaultGroup: Group = {
  name: "",
  type: "",
};

export type GroupsPageContext = AppContext & {
  group: Group | null;
  setGroup: React.Dispatch<Group | null>;
  getGroups: () => Promise<void>;
};

export function GroupsPage() {
  const context = useProvider<AppContext>();
  const { trpc, handleConfirm } = context;
  const [group, setGroup] = React.useState<Group | null>(null);
  const [rows, setRows] = React.useState<Group[]>([]);
  const [fetchingState, setFetchingState] = useState<State>("idle");

  const getGroups = useCallback(async () => {
    setFetchingState("loading");
    await new Promise((r) => setTimeout(r, 500));
    try {
      const groups = await trpc.group.findMany.query();
      setFetchingState("idle");
      setRows(groups);
    } catch (error) {
      setFetchingState("error");
    }
  }, [trpc]);

  useEffect(() => {
    getGroups();
  }, []);

  const columns: Column<Group>[] = useMemo(
    () =>
      [
        {
          header: "id",
          field: "id",
        },
        {
          header: "type",
          field: "type",
        },
        {
          header: "name",
          field: "name",
        },
        {
          header: "createdAt",
          field: "createdAt",
        },
        {
          header: "updatedAt",
          field: "createdAt",
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
    []
  );

  return (
    <Provider
      value={{
        ...context,
        group,
        setGroup,
        getGroups,
      }}
    >
      <div className="h-full flex flex-col gap-4">
        <div className="flex flex-wrap gap-4">
          <Typography variant="h5" color="blue">
            Groups management
          </Typography>
          <div className="ml-auto">
            <Input label="Search"></Input>
          </div>
          <Button
            className="flex justify-center items-center gap-3 "
            onClick={() => setGroup(defaultGroup)}
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

export default GroupsPage;
