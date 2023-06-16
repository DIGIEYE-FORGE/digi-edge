import {
  PlusCircleIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  Typography,
  IconButton,
  Input,
  Button,
  Switch,
  Tabs,
  Tab,
  TabsHeader,
  TabPanel,
  TabsBody,
} from "@material-tailwind/react";
import { useProvider } from "../../../../components/provider";
import { Context } from "..";
import Drawer from "../../../../components/drawer";
import CustomSelect from "../../../../components/custom-select";
import { useNavigate } from "react-router-dom";
import { Attribute } from "../../../../utils/types";
import { useEffect, useState } from "react";

function AddEdit() {
  const {
    data,
    setData,
    trpc,
    fetchRows,
    deviceProfiles,
    groups,
    mqttServers,
  } = useProvider<Context>();
  const navigate = useNavigate();

  const [attributes, setAttributes] = useState<Attribute[]>(
    data?.attributes || []
  );

  useEffect(() => {
    setAttributes(data?.attributes || []);
  }, [data]);

  const removeAttribute = (index: number) => {
    setAttributes((prev) => {
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
  };

  const addAttribute = () => {
    setAttributes((prev) => {
      const next = [...prev];
      next.push({
        name: "",
        value: "",
      });
      return next;
    });
  };

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
            mqttServerId: data.mqttServerId || undefined,
            isPassive: data.isPassive,
            isDecoded: data.isDecoded,
            attributes: Object.fromEntries(
              attributes.map((a) => [a.name, a.value])
            ),
          },
        });
      } else {
        await trpc.device.create?.mutate({
          name: data.name,
          serial: data.serial,
          deviceProfileId: data.deviceProfileId || undefined,
          groupId: data.groupId || undefined,
          mqttServerId: data.mqttServerId || undefined,
          isPassive: data.isPassive,
          isDecoded: data.isDecoded,
          attributes: Object.fromEntries(
            attributes.map((a) => [a.name, a.value])
          ),
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
      className=" flex flex-col !max-w-[40rem]"
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
      <div className="flex-1">
        <Tabs value="General">
          <TabsHeader>
            <Tab value="General">General</Tab>
            <Tab value="Attributes">Attributes</Tab>
            <Tab value="Credentials">Credentials</Tab>
          </TabsHeader>
          <TabsBody>
            <TabPanel value="General">
              <div className="flex flex-col p-2 md:p-4 gap-6">
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
                <div className="p-2">
                  <Switch
                    id="is-passive"
                    checked={data?.isPassive}
                    onChange={(e) => {
                      setData({
                        ...data!,
                        isPassive: e.target.checked,
                      });
                    }}
                    label={
                      <div>
                        <Typography color="blue-gray" className="font-medium">
                          IsPassive
                        </Typography>
                        <Typography
                          variant="small"
                          color="gray"
                          className="font-normal"
                        >
                          If true, the device will not be able to send data to
                          the server
                        </Typography>
                      </div>
                    }
                  />
                </div>
                <div className="p-2">
                  <Switch
                    id="is-decoded"
                    checked={data?.isDecoded}
                    onChange={(e) => {
                      setData({
                        ...data!,
                        isDecoded: e.target.checked,
                      });
                    }}
                    label={
                      <div>
                        <Typography color="blue-gray" className="font-medium">
                          IsDecoded
                        </Typography>
                        <Typography
                          variant="small"
                          color="gray"
                          className="font-normal"
                        >
                          If true, the device don't need to decode the payload
                        </Typography>
                      </div>
                    }
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
                      options={groups.map((item) => ({
                        label: item.name,
                        value: item.id.toString(),
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
                <div className="flex gap-2">
                  <div className="flex-1">
                    <CustomSelect
                      label="MQTT Server"
                      value={data?.mqttServerId?.toString() || ""}
                      options={mqttServers.map((item) => ({
                        label: item.host,
                        value: item.id!.toString(),
                      }))}
                      onChange={(newVal) => {
                        setData({
                          ...data!,
                          mqttServerId: parseInt(newVal as string),
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
            </TabPanel>
            <TabPanel value="Attributes">
              <Button
                variant="outlined"
                className="flex items-center text-lg gap-2"
                onClick={addAttribute}
              >
                <span>add attribute</span>
                <PlusCircleIcon strokeWidth={2} className="w-6" />
              </Button>
              <div className="flex flex-col gap-2">
                {attributes.map((attr, index) => (
                  <div
                    className="flex gap-2 flex-wrap border-b py-2 justify-center"
                    key={index}
                  >
                    <div className="flex flex-1 h-10">
                      <label
                        htmlFor={`name-${index}`}
                        className="px-2 bg-blue-500 text-white rounded-s flex items-center"
                      >
                        name
                      </label>
                      <input
                        className=" outline-none px-2 w-[6rem] flex-1 border-2 focus:border-blue-500 rounded-e"
                        value={attr.name}
                        id={`name-${index}`}
                        onChange={(e) => {
                          const newAttributes = [...attributes];
                          newAttributes[index].name = e.target.value;
                          setAttributes(newAttributes);
                        }}
                      ></input>
                    </div>
                    <div className="flex flex-[2] h-10">
                      <label
                        htmlFor={`value-${index}`}
                        className="px-2 bg-blue-500 text-white rounded-s flex items-center"
                      >
                        value
                      </label>
                      <input
                        className="flex-1 outline-none px-2 w-[6rem] border-2 focus:border-blue-500 rounded-e"
                        value={attr.value}
                        id={`value-${index}`}
                        onChange={(e) => {
                          const newAttributes = [...attributes];
                          newAttributes[index].value = e.target.value;
                          setAttributes(newAttributes);
                        }}
                      ></input>
                    </div>
                    <Button
                      variant="text"
                      onClick={() => removeAttribute(index)}
                    >
                      <TrashIcon className="w-6" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabPanel>
            <TabPanel value="Credentials">Credentials</TabPanel>
          </TabsBody>
        </Tabs>
      </div>
      <div className="flex p-4 justify-between bg-[#F4F5F7]">
        <Button variant="text" color="red" onClick={() => setData(null)}>
          cancel
        </Button>
        <Button
          variant="filled"
          color="green"
          onClick={handleSave}
          disabled={!data?.id && !data?.name && !data?.serial}
        >
          save
        </Button>
      </div>
    </Drawer>
  );
}

export default AddEdit;
