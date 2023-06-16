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
import { useMutation } from "@tanstack/react-query";
import { addMqttServer, updateMqttServer } from "../../../../api/mqtt-server";

interface Props {
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
}

function AddEditGroup({ setRefetch }: Props) {
  const { mqttServer, setMqttServer } = useProvider<Context>();

  const mqttServerMutation = useMutation({
    mutationFn: () => handleSave(),
    onSuccess: () => {
      setRefetch(true);
      setMqttServer(null);
    },
  });

  async function handleSave() {
    if (!mqttServer) {
      console.error("No mqtt server to save");
      return;
    }

    const { id, createdAt, updatedAt, ...rest } = mqttServer;
    try {
      if (id) {
        console.log("updating");
        return await updateMqttServer(id, rest);
      } else {
        console.log("creating");
        return await addMqttServer(rest);
      }
    } catch (e) {
      console.error(e);
    }
  }
  return (
    <Drawer
      className=" flex flex-col"
      open={!!mqttServer}
      onClose={() => setMqttServer(null)}
    >
      <div className="p-4 flex items-center justify-between border-b">
        <Typography variant="h5" color="blue">
          {mqttServer?.id ? "Edit" : "Add"} MQTT Server
        </Typography>
        <IconButton
          variant="text"
          color="blue-gray"
          onClick={() => setMqttServer(null)}
        >
          <XMarkIcon strokeWidth={2} className="h-5 w-5" />
        </IconButton>
      </div>
      <div className="flex-1 flex flex-col gap-4 p-4 border-b">
        <div>
          <Input
            label="Client Id"
            type="number"
            value={mqttServer?.clientId || ""}
            onChange={(e) => {
              setMqttServer({
                ...mqttServer!,
                clientId: parseInt(e.target.value),
              });
            }}
          />
        </div>
        <div>
          <Input
            label="Username"
            type="text"
            value={mqttServer?.username || ""}
            onChange={(e) => {
              setMqttServer({
                ...mqttServer!,
                username: e.target.value,
              });
            }}
          />
        </div>
        <div>
          <Input
            label="Password"
            value={mqttServer?.password || ""}
            onChange={(e) => {
              setMqttServer({
                ...mqttServer!,
                password: e.target.value,
              });
            }}
          />
        </div>
        <div>
          <Input
            label="Host"
            value={mqttServer?.host || ""}
            onChange={(e) => {
              setMqttServer({
                ...mqttServer!,
                host: e.target.value,
              });
            }}
          />
        </div>
        <div>
          <Input
            label="topic"
            value={mqttServer?.topic || ""}
            onChange={(e) => {
              setMqttServer({
                ...mqttServer!,
                topic: e.target.value,
              });
            }}
          />
        </div>
      </div>
      {/* <span className="whitespace-break-spaces">
        {data && Object.entries(data).map(([k, v]) => `${k}: ${v}\n`)}
      </span> */}
      <div className="flex p-4 justify-between">
        <Button variant="text" color="red" onClick={() => setMqttServer(null)}>
          cancel
        </Button>
        <Button
          variant="filled"
          color="green"
          onClick={() => mqttServerMutation.mutate()}
        >
          save
        </Button>
      </div>
    </Drawer>
  );
}

export default AddEditGroup;
