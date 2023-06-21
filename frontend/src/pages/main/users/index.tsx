import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  Typography,
  IconButton,
  Card,
  Input,
  Tab,
  Tabs,
  TabsHeader,
} from "@material-tailwind/react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import DataGrid, { Column } from "../../../components/data-grid";
import Provider, { useProvider } from "../../../components/provider";
import { AppContext } from "../../../App";
import AddEdit from "./add-edit";
import Pagination from "../../../components/pagination";
import { User as Data, State } from "../../../utils/types.ts";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { TRPCClientError } from "@trpc/client";
import { FaPlus } from "react-icons/fa";

const defaultData: Data = {
  firstName: "",
  lastName: "",
  username: "",
  password: "",
  role: "USER",
};

export type Context = AppContext & {
  data: Data | null;
  setData: React.Dispatch<Data | null>;
  fetchRows: () => Promise<void>;
};

type OrderBy = {
  field: "firstName" | "lastName" | "username" | "createdAt";
  direction: "asc" | "desc";
};
export function UsersPage() {
  const context = useProvider<AppContext>();
  const { trpc, handleConfirm } = context;
  const [data, setData] = React.useState<Data | null>(null);
  const [rows, setRows] = React.useState<Data[]>([]);
  const [fetchingState, setFetchingState] = useState<State>("idle");
  const [orderBy, setOrderBy] = useState<OrderBy | undefined>();
  const [search, setSearch] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<"USER" | "ADMIN" | null>(
    null
  );
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 5,
  });

  const filterRows = useMemo(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    return rows
      .filter((row) => {
        return (
          (!selectedRole || row.role === selectedRole) &&
          (row.firstName.toLowerCase().includes(search.toLowerCase()) ||
            row.lastName.toLowerCase().includes(search.toLowerCase()) ||
            row.username.toLowerCase().includes(search.toLowerCase()))
        );
      })
      .sort((a, b) => {
        if (!orderBy) return 0;
        return a[orderBy?.field] > b[orderBy?.field]
          ? orderBy?.direction === "asc"
            ? 1
            : -1
          : orderBy?.direction === "asc"
          ? -1
          : 1;
      });
  }, [rows, search, orderBy, selectedRole]);

  const fetchRows = useCallback(async () => {
    setFetchingState("loading");
    await new Promise((r) => setTimeout(r, 500));
    try {
      const res = await trpc.user.findMany.query();
      setFetchingState("idle");
      setRows(
        res.map((u) => ({
          ...u,
          role: u.role === "ADMIN" ? "ADMIN" : "USER",
        }))
      );
    } catch (error) {
      console.error(error);
      setFetchingState("error");
    }
  }, [trpc]);

  // TODO: add debounce
  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const columns: Column<Data>[] = useMemo(
    () =>
      [
        {
          header: (
            <Button
              variant="text"
              onClick={() => {
                setOrderBy((prev) => ({
                  field: "firstName",
                  direction: prev?.direction === "asc" ? "desc" : "asc",
                }));
              }}
              className="flex px-2 gap-2 items-center text-inherit text-md w-full h-full rounded-none"
            >
              <span className="flex flex-col justify-center text-blue-gray-100 ">
                <ChevronUpIcon
                  className={`h-3 font-bold ${
                    orderBy?.field === "firstName" &&
                    orderBy?.direction === "asc"
                      ? "text-blue-500"
                      : ""
                  }`}
                />
                <ChevronDownIcon
                  className={`h-3 font-bold ${
                    orderBy?.field === "firstName" &&
                    orderBy?.direction === "desc"
                      ? "text-blue-500"
                      : ""
                  }`}
                />
              </span>
              <span>firstName</span>
            </Button>
          ),
          field: "firstName",
        },
        {
          header: (
            <Button
              variant="text"
              onClick={() => {
                setOrderBy((prev) => ({
                  field: "lastName",
                  direction: prev?.direction === "asc" ? "desc" : "asc",
                }));
              }}
              className="flex px-2 gap-2 items-center text-inherit text-md w-full h-full rounded-none"
            >
              <span className="flex flex-col justify-center text-blue-gray-100">
                <ChevronUpIcon
                  className={`h-3 font-bold ${
                    orderBy?.field === "lastName" &&
                    orderBy?.direction === "asc"
                      ? "text-blue-700"
                      : ""
                  }`}
                />
                <ChevronDownIcon
                  className={`h-3 font-bold ${
                    orderBy?.field === "lastName" &&
                    orderBy?.direction === "desc"
                      ? "text-blue-700"
                      : ""
                  }`}
                />
              </span>
              <span>lastName</span>
            </Button>
          ),
          field: "lastName",
        },
        {
          header: (
            <Button
              variant="text"
              onClick={() => {
                setOrderBy((prev) => ({
                  field: "username",
                  direction: prev?.direction === "asc" ? "desc" : "asc",
                }));
              }}
              className="flex px-2 gap-2 items-center text-inherit text-md w-full h-full rounded-none"
            >
              <span className="flex flex-col justify-center text-blue-gray-100">
                <ChevronUpIcon
                  className={`h-3 font-bold ${
                    orderBy?.field === "username" &&
                    orderBy?.direction === "asc"
                      ? "text-blue-700"
                      : ""
                  }`}
                />
                <ChevronDownIcon
                  className={`h-3 font-bold ${
                    orderBy?.field === "username" &&
                    orderBy?.direction === "desc"
                      ? "text-blue-700"
                      : ""
                  }`}
                />
              </span>
              <span>username</span>
            </Button>
          ),
          field: "username",
        },
        {
          header: "role",
          field: "role",
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
                onClick={() => setData(row)}
              >
                <PencilIcon className="h-6" />
              </IconButton>
              <IconButton
                variant="text"
                color="red"
                onClick={() => {
                  handleConfirm({
                    title: "Delete Data!",
                    body: "Are you Sure do you want to precede. this action is irriversible",
                    onConfirm: async () => {
                      if (!row.id) return;
                      try {
                        await trpc.user.delete.mutate(row.id);
                        fetchRows();
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
      ] as Column<Data>[],
    [orderBy]
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
            Users management
          </Typography>
          <div className="ml-auto">
            <Tabs value="ALL">
              <TabsHeader>
                <Tab value="ALL" onClick={() => setSelectedRole(null)}>
                  ALL
                </Tab>
                <Tab value="USER" onClick={() => setSelectedRole("USER")}>
                  USER
                </Tab>
                <Tab value="ADMIN" onClick={() => setSelectedRole("ADMIN")}>
                  ADMIN
                </Tab>
              </TabsHeader>
            </Tabs>
          </div>
          <div>
            <Input
              label="Search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
            ></Input>
          </div>
          <Button
            className="flex justify-center items-center gap-3 "
            onClick={() => setData(defaultData)}
          >
            <FaPlus className="text-xl" />
          </Button>
        </div>
        <Card className="flex flex-col flex-1 ">
          <DataGrid
            className="text-left table-fixed w-full capitalize"
            headerClassName="capitalize [&>*]:h-16 border-b border-blue-gray-100 text-gray-900"
            rowClassName="[&>*]:p-2 md:[&>*]:p-3 lg:[&>*]:p-4 border-b border-blue-gray-100  hover:bg-blue-50/50 transition-colors"
            rows={filterRows.slice(
              (pagination.page - 1) * pagination.perPage,
              pagination.page * pagination.perPage
            )}
            columns={columns}
            loading={fetchingState === "loading"}
            error={fetchingState === "error"}
          ></DataGrid>
          <Pagination
            className="mt-auto p-2 md:p-3 lg:p-4 ml-auto"
            value={pagination}
            onChange={setPagination}
            total={rows.length}
          />
        </Card>
        <AddEdit />
      </div>
    </Provider>
  );
}

export default UsersPage;
