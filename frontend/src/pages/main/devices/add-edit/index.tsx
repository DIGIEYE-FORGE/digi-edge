import { PlusCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
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
import { useNavigate } from "react-router-dom";

function AddEdit() {
  const { data, setData, trpc, fetchRows, deviceProfiles, groups } =
    useProvider<Context>();
  const navigate = useNavigate();

  async function handleSave() {
    if (!data) {
      console.error("No group to save");
      return;
    }
    try {
      if (data.id) {
        console.log({ data });
        await trpc.device.update.mutate({
          id: data.id,
          data: {
            name: data.name,
            serial: data.serial || undefined,
            deviceProfileId: data.deviceProfileId || undefined,
            groupId: data.groupId || undefined,
          },
        });
      } else {
        await trpc.device.create?.mutate({
          name: data.name,
          serial: data.serial,
          deviceProfileId: data.deviceProfileId || undefined,
          groupId: data.groupId || undefined,
        });
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
      <div className="p-2 md:p-4 flex items-center justify-between border-b">
        <Typography variant="h5" color="blue">
          {data?.id ? "Edit" : "Add"} Device
        </Typography>
        <IconButton
          variant="text"
          color="blue-gray"
          onClick={() => setData(null)}
        >
          <XMarkIcon strokeWidth={2} className="h-5 w-5" />
        </IconButton>
      </div>
      <div className="flex-1 flex flex-col p-2 md:p-4 gap-4  border-b">
        <div>
          <Input
            label="name"
            value={data?.name || ""}
            onChange={(e) => {
              setData({
                ...data!,
                name: e.target.value,
              });
            }}
          />
        </div>
        <div>
          <Input
            label="serial"
            value={data?.serial || ""}
            onChange={(e) => {
              setData({
                ...data!,
                serial: e.target.value,
              });
            }}
          />
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <CustomSelect
              label="Device profile"
              value={data?.deviceProfileId?.toString() || ""}
              options={deviceProfiles.map((dp) => ({
                label: dp.name,
                value: dp.id.toString(),
              }))}
              onChange={(newVal) => {
                setData({
                  ...data!,
                  deviceProfileId: parseInt(newVal as string),
                });
              }}
            />
          </div>
          <Button
            variant="text"
            className="flex justify-center items-center "
            onClick={() => {
              navigate("/device-profiles");
            }}
          >
            <PlusCircleIcon strokeWidth={2} className="w-6" />
          </Button>
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <CustomSelect
              label="Group"
              value={data?.groupId?.toString() || ""}
              options={groups.map((dp) => ({
                label: dp.name,
                value: dp.id.toString(),
              }))}
              onChange={(newVal) => {
                setData({
                  ...data!,
                  groupId: parseInt(newVal as string),
                });
              }}
            />
          </div>
          <Button
            variant="text"
            className="flex justify-center items-center "
            onClick={() => {
              navigate("/device-profiles");
            }}
          >
            <PlusCircleIcon strokeWidth={2} className="w-6" />
          </Button>
        </div>
      </div>
      <span className="whitespace-break-spaces">
        {data && Object.entries(data).map(([k, v]) => `${k}: ${v}\n`)}
      </span>
      <div className="flex p-4 justify-between">
        <Button variant="text" color="red" onClick={() => setData(null)}>
          cancel
        </Button>
        <Button variant="filled" color="green" onClick={handleSave}>
          saved
        </Button>
      </div>
    </Drawer>
  );
}

export default AddEdit;
