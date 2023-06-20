import { PlusCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  Typography,
  IconButton,
  Input,
  Button,
  Select,
  Option,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Textarea,
} from "@material-tailwind/react";
import { useProvider } from "../../../../components/provider";
import { Context } from "..";
import Drawer from "../../../../components/drawer";
import { useState } from "react";
import { Decoder, DeviceType, Protocol } from "../../../../utils/types";
import CustomSelect from "../../../../components/custom-select";

function AddDeviceType() {
  const { trpc, fetchDeviceTypes } = useProvider<Context>();
  const [addDeviceData, setDeviceTypeData] = useState<DeviceType | null>(null);
  async function addDeviceType() {
    if (!addDeviceData) {
      console.error("No device type to add");
      return;
    }
    try {
      await trpc.deviceType.create.mutate(addDeviceData);
      setDeviceTypeData(null);
      fetchDeviceTypes();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <>
      <Button
        variant="text"
        className="flex justify-center items-center "
        onClick={() => setDeviceTypeData({ name: "" })}
      >
        <PlusCircleIcon strokeWidth={2} className="w-6" />
      </Button>
      <Dialog
        open={!!addDeviceData}
        handler={() => setDeviceTypeData(null)}
        className="!w-11/12"
        size="xs"
      >
        <DialogHeader>Add device Type</DialogHeader>
        <DialogBody divider className="flex flex-col gap-2">
          <div>
            <Input
              label="name"
              onChange={(e) => {
                setDeviceTypeData({
                  ...addDeviceData!,
                  name: e.target.value,
                });
              }}
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" className="mr-1">
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="green" onClick={addDeviceType}>
            save
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

function AddProtocol() {
  const { trpc, fetchProtocols } = useProvider<Context>();
  const [addProtocolData, setProtocolData] = useState<Protocol | null>(null);
  async function addProtocol() {
    if (!addProtocolData) {
      console.error("No protocol to add");
      return;
    }
    try {
      await trpc.protocol.create.mutate(addProtocolData);
      setProtocolData(null);
      fetchProtocols();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <>
      <Button
        variant="text"
        className="flex justify-center items-center "
        onClick={() => setProtocolData({ name: "" })}
      >
        <PlusCircleIcon strokeWidth={2} className="w-6" />
      </Button>
      <Dialog
        open={!!addProtocolData}
        handler={() => setProtocolData(null)}
        className="!w-11/12"
        size="xs"
      >
        <DialogHeader>Add protocol</DialogHeader>
        <DialogBody divider className="flex flex-col gap-2">
          <div>
            <Input
              label="name"
              onChange={(e) => {
                setProtocolData({
                  ...addProtocolData!,
                  name: e.target.value,
                });
              }}
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" className="mr-1">
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="green" onClick={addProtocol}>
            save
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

function AddDocoder() {
  const { trpc, fetchDecoders } = useProvider<Context>();
  const [addDecoderData, setDecoderData] = useState<Decoder | null>(null);
  async function addDecoder() {
    if (!addDecoderData) {
      console.error("No decoder to add");
      return;
    }
    try {
      await trpc.decoder.create.mutate(addDecoderData);
      setDecoderData(null);
      fetchDecoders();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <>
      <Button
        variant="text"
        className="flex justify-center items-center "
        onClick={() => setDecoderData({ name: "", description: "", fnc: "" })}
      >
        <PlusCircleIcon strokeWidth={2} className="w-6" />
      </Button>
      <Dialog
        open={!!addDecoderData}
        handler={() => setDecoderData(null)}
        className="!w-11/12"
        size="xs"
      >
        <DialogHeader>Add decoder</DialogHeader>
        <DialogBody divider className="flex flex-col gap-2">
          <div>
            <Input
              label="name"
              onChange={(e) => {
                setDecoderData({
                  ...addDecoderData!,
                  name: e.target.value,
                });
              }}
            />
          </div>
          <div>
            <Input
              label="description"
              onChange={(e) => {
                setDecoderData({
                  ...addDecoderData!,
                  description: e.target.value,
                });
              }}
            />
          </div>
          <div>
            <Input
              label="func"
              onChange={(e) => {
                setDecoderData({
                  ...addDecoderData!,
                  fnc: e.target.value,
                });
              }}
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" className="mr-1">
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="green" onClick={addDecoder}>
            save
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

function AddEdit() {
  const { data, setData, trpc, fetchRows, deviceTypes, protocols, decoders } =
    useProvider<Context>();

  async function handleSave() {
    if (!data) {
      console.error("No group to save");
      return;
    }
    try {
      if (data.id) {
        // console.log({ data });
        await trpc.deviceProfile.update.mutate({
          id: data.id,
          data: {
            name: data.name,
            description: data.description || undefined,
            deviceTypeId: data.deviceTypeId || undefined,
            protocolId: data.protocolId || undefined,
            decoderId: data.decoderId || undefined,
            credentialsType: data.credentialsType || undefined,
          },
        });
      } else {
        await trpc.deviceProfile.create?.mutate({
          name: data.name,
          description: data.description || undefined,
          deviceTypeId: data.deviceTypeId || undefined,
          protocolId: data.protocolId || undefined,
          decoderId: data.decoderId || undefined,
          credentialsType: data.credentialsType || undefined,
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
          {data?.id ? "Edit" : "Add"} Device Profile
        </Typography>
        <IconButton
          variant="text"
          color="blue-gray"
          onClick={() => setData(null)}
        >
          <XMarkIcon strokeWidth={2} className="h-5 w-5" />
        </IconButton>
      </div>
      <div className="flex-1 flex flex-col p-2 md:p-4 gap-6 overflow-x-auto">
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
          <Textarea
            label="description"
            value={data?.description || ""}
            onChange={(e) => {
              setData({
                ...data!,
                description: e.target.value,
              });
            }}
          />
        </div>
        <div>
          <Select
            label="Credintials Type"
            id="credintials-type"
            value={data?.credentialsType || undefined}
            onChange={(newVal) => {
              setData({
                ...data!,
                credentialsType: newVal || null,
              });
            }}
          >
            <Option value={"username_password"}>username_password</Option>
            <Option value={"certificates"}>certificates</Option>
          </Select>
        </div>
        <div className="flex gap-2 ">
          <div className="flex-1 ">
            <CustomSelect
              label="Device Type"
              value={data?.deviceTypeId?.toString()}
              onChange={(newVal) => {
                setData({
                  ...data!,
                  deviceTypeId: parseInt(newVal as string),
                });
              }}
              options={deviceTypes.map((dt) => ({
                value: dt.id?.toString() ?? "",
                label: dt.name,
              }))}
            />
          </div>
          <AddDeviceType />
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <CustomSelect
              label="Protocol"
              value={data?.protocolId?.toString() || ""}
              onChange={(newVal) => {
                setData({
                  ...data!,
                  protocolId: parseInt(newVal as string),
                });
              }}
              options={protocols.map((p) => ({
                value: p.id?.toString() ?? "",
                label: p.name,
              }))}
            />
          </div>
          <AddProtocol />
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <CustomSelect
              label="Decoder"
              value={data?.decoderId?.toString() || ""}
              onChange={(newVal) => {
                setData({
                  ...data!,
                  decoderId: parseInt(newVal as string),
                });
              }}
              options={decoders.map((d) => ({
                value: d.id?.toString() ?? "",
                label: d.name,
              }))}
            />
          </div>
          <AddDocoder />
        </div>
      </div>
      <div className="flex p-2 sm:p-3  md:p-4 justify-between bg-[#F4F5F7]">
        <Button variant="text" color="red" onClick={() => setData(null)}>
          cancel
        </Button>
        <Button
          variant="filled"
          color="green"
          onClick={handleSave}
          disabled={!data?.name || !data.credentialsType}
        >
          save
        </Button>
      </div>
    </Drawer>
  );
}

export default AddEdit;
