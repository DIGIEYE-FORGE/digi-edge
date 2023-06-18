import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  Typography,
  IconButton,
  Input,
  Button,
} from "@material-tailwind/react";
import { useProvider } from "../../../../components/provider";
import { Context } from "..";
import Drawer from "../../../../components/drawer";
import CustomSelect from "../../../../components/custom-select";
import { TRPCClientError } from "@trpc/client";
import { toast } from "react-toastify";

function AddEditGroup() {
  const { data, setData, trpc, fetchRows } = useProvider<Context>();

  async function handleSave() {
    if (!data) {
      console.error("No data to save");
      return;
    }

    try {
      if (data.id) {
        console.log("craeting");
        await trpc.user.update.mutate({
          id: data.id,
          data: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
            role: data.role,
          },
        });
      } else {
        console.log("updating");

        await trpc.user.create.mutate({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          role: data.role,
        });
      }
      setData(null);
      fetchRows();
    } catch (e) {
      console.error(e);
      if (e instanceof TRPCClientError && e.data.code === "CONFLICT") {
        toast.error(e.message);
        return;
      }
      toast.error("Something went wrong");
    }
  }
  return (
    <Drawer
      placement="right"
      className="!w-[30rem] flex flex-col"
      open={!!data}
      onClose={() => setData(null)}
    >
      <div className="p-4 flex items-center justify-between border-b">
        <Typography variant="h5" color="blue">
          {data?.id ? "Edit" : "Add"} User
        </Typography>
        <IconButton
          variant="text"
          color="blue-gray"
          onClick={() => setData(null)}
        >
          <XMarkIcon strokeWidth={2} className="h-5 w-5" />
        </IconButton>
      </div>
      <div className="flex-1 flex flex-col gap-4 md:gap-6 p-2 md:p-4 lg:p-6 ">
        <div>
          <Input
            label="FirstName *"
            value={data?.firstName || ""}
            onChange={(e) => {
              setData({
                ...data!,
                firstName: e.target.value,
              });
            }}
          />
        </div>
        <div>
          <Input
            label="LastName *"
            value={data?.lastName || ""}
            onChange={(e) => {
              setData({
                ...data!,
                lastName: e.target.value,
              });
            }}
          />
        </div>
        <div>
          <Input
            label="Email *"
            value={data?.email || ""}
            onChange={(e) => {
              setData({
                ...data!,
                email: e.target.value,
              });
            }}
          />
        </div>
        {data?.id ? null : (
          <div>
            <Input
              label="Password "
              value={data?.password || ""}
              onChange={(e) => {
                setData({
                  ...data!,
                  password: e.target.value,
                });
              }}
            />
          </div>
        )}
        <div>
          <CustomSelect
            label="Role *"
            value={data?.role || ""}
            onChange={(newVal) => {
              setData({
                ...data!,
                role: newVal as "USER" | "ADMIN",
              });
            }}
            options={["USER", "ADMIN"]}
          />
        </div>
      </div>
      <div className="flex p-4 justify-between bg-blue-gray-500/10">
        <Button variant="text" color="red" onClick={() => setData(null)}>
          cancel
        </Button>
        <Button
          disabled={
            !data?.firstName ||
            !data?.lastName ||
            !data?.email ||
            (!data?.id && !data?.password)
          }
          variant="filled"
          color="green"
          onClick={handleSave}
        >
          save
        </Button>
      </div>
    </Drawer>
  );
}

export default AddEditGroup;
