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

function AddEditGroup() {
  const { data, setData, trpc, fetchRows } = useProvider<Context>();

  async function handleSave() {
    if (!data) {
      console.error("No group to save");
      return;
    }

    try {
      const { id, ...rest } = data;
      if (id) {
        // console.log({ id, ...rest });
        await trpc.mqttServer.update.mutate({
          id,
          serial: "SERIAL",
          data: rest,
        });
      } else {
        // console.log({ id, ...rest });

        await trpc.mqttServer.create?.mutate(rest);
      }
      setData(null);
      fetchRows();
    } catch (e) {
      console.error(e);
    }
  }
  return (
    <Drawer
      className=" flex flex-col"
      open={!!data}
      onClose={() => setData(null)}
    >
      <div className="p-4 flex items-center justify-between border-b">
        <Typography variant="h5" color="blue">
          {data?.id ? "Edit" : "Add"} MQTT Server
        </Typography>
        <IconButton
          variant="text"
          color="blue-gray"
          onClick={() => setData(null)}
        >
          <XMarkIcon strokeWidth={2} className="h-5 w-5" />
        </IconButton>
      </div>
      <div className="flex-1 flex flex-col gap-4 p-4 overflow-x-hidden">
        <div>
          <Input
            label="Client Id"
            type="string"
            pattern="[0-9]*"
            value={data?.clientId || ""}
            onChange={(e) => {
              setData({
                ...data!,
                clientId: parseInt(e.target.value),
              });
            }}
          />
        </div>
        <div>
          <Input
            label="Username"
            type="text"
            value={data?.username || ""}
            onChange={(e) => {
              setData({
                ...data!,
                username: e.target.value,
              });
            }}
          />
        </div>
        <div>
          <Input
            label="Password"
            value={data?.password || ""}
            onChange={(e) => {
              setData({
                ...data!,
                password: e.target.value,
              });
            }}
          />
        </div>
        <div>
          <Input
            label="Host"
            value={data?.host || ""}
            onChange={(e) => {
              setData({
                ...data!,
                host: e.target.value,
              });
            }}
          />
        </div>
        <div>
          <Input
            label="topic"
            value={data?.topic || ""}
            onChange={(e) => {
              setData({
                ...data!,
                topic: e.target.value,
              });
            }}
          />
        </div>
      </div>
      <div className="flex p-4 justify-between bg-[#F4F5F7]">
        <Button variant="text" color="red" onClick={() => setData(null)}>
          cancel
        </Button>
        <Button variant="filled" color="green" onClick={handleSave}>
          save
        </Button>
      </div>
    </Drawer>
  );
}

export default AddEditGroup;
