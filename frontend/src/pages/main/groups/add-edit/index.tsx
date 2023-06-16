import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  // Drawer,
  Typography,
  IconButton,
  Input,
  Button,
} from "@material-tailwind/react";
import { useProvider } from "../../../../components/provider";
import { GroupsPageContext } from "..";
import Drawer from "../../../../components/drawer";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addGroup, updateGroup } from "../../../../api/group";
import { getMqttServers } from "../../../../api/mqtt-server";

interface Props {
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
}

function AddEditGroup({ setRefetch }: Props) {
  const { group, setGroup } = useProvider<GroupsPageContext>();

  const { data } = useQuery({
    queryKey: ["mqtt-servers"],
    queryFn: () => getMqttServers(),
  });

  const groupMutation = useMutation({
    mutationFn: () => handleSave(),
    onSuccess: () => {
      setRefetch(true);
      setGroup(null);
    },
  });

  async function handleSave() {
    if (!group) {
      console.error("No group to save");
      return;
    }

    const { id, createdAt, updatedAt, ...rest } = group;

    try {
      if (group.id) {
        console.log("updating");
        return await updateGroup(id, rest);
      } else {
        console.log("creating");
        return await addGroup(rest);
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Drawer
      placement="right"
      className="!w-[30rem] flex flex-col"
      open={!!group}
      onClose={() => setGroup(null)}
    >
      <div className="p-4 flex items-center justify-between border-b">
        <Typography variant="h5" color="blue">
          {group?.id ? "Edit" : "Add"} Group
        </Typography>
        <IconButton
          variant="text"
          color="blue-gray"
          onClick={() => setGroup(null)}
        >
          <XMarkIcon strokeWidth={2} className="h-5 w-5" />
        </IconButton>
      </div>
      <div className="flex-1 flex flex-col gap-4 p-4 border-b">
        <div>
          <Input
            label="Name"
            value={group?.name || ""}
            onChange={(e) => {
              setGroup({
                ...group!,
                name: e.target.value,
              });
            }}
          />
        </div>
        <div>
          <Input
            label="Type"
            value={group?.type || ""}
            onChange={(e) => {
              setGroup({
                ...group!,
                type: e.target.value,
              });
            }}
          />
        </div>
        <div>
          <select
            value={group?.mqttServerId}
            className={
              "w-full h-full bg-transparent text-blue-gray-700 outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all" +
              " placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2" +
              "text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-blue-500"
            }
            onChange={(e) => {
              setGroup({
                ...group!,
                mqttServerId: parseInt(e.target.value) || undefined,
              });
            }}
          >
            <option value="">Select server</option>
            {data?.results.map((server) => (
              <option key={server.id} value={server.id}>
                {server.username}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex p-4 justify-between">
        <Button variant="text" color="red" onClick={() => setGroup(null)}>
          cancel
        </Button>
        <Button
          variant="filled"
          color="green"
          onClick={() => groupMutation.mutate()}
        >
          save
        </Button>
      </div>
    </Drawer>
  );
}

export default AddEditGroup;
