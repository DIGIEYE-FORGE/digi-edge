import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  Typography,
  IconButton,
  Input,
  Button,
} from "@material-tailwind/react";
import { useProvider } from "../../../../components/provider";
import { GroupsPageContext } from "..";
import Drawer from "../../../../components/drawer";
import CustomSelect from "../../../../components/custom-select";

function AddEditGroup() {
  const { group, setGroup, trpc, getGroups } = useProvider<GroupsPageContext>();

  async function handleSave() {
    if (!group) {
      console.error("No group to save");
      return;
    }

    try {
      if (group.id) {
        console.log("craeting");
        await trpc.group.update.mutate({
          id: group.id,
          data: {
            name: group.name,
            type: group.type,
          },
        });
      } else {
        console.log("updating");

        await trpc.group?.create?.mutate({
          name: group.name,
          type: group.type,
        });
      }
      setGroup(null);
      getGroups();
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
      <div className="flex-1 flex flex-col gap-4 md:gap-6 p-2 md:p-4 lg:p-6 ">
        <div>
          <Input
            label="Name *"
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
          <CustomSelect
            label="Type *"
            value={group?.type || ""}
            onChange={(newVal) => {
              setGroup({
                ...group!,
                type: newVal as string,
              });
            }}
            options={["type1", "type2", "type3"]}
          />
        </div>
      </div>
      <div className="flex p-4 justify-between bg-blue-gray-500/10">
        <Button variant="text" color="red" onClick={() => setGroup(null)}>
          cancel
        </Button>
        <Button
          disabled={!group?.id && (!group?.name || !group?.type)}
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
