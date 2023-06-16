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
} from "@material-tailwind/react";
import { useProvider } from "../../../../components/provider";
import { Context } from "..";
import Drawer from "../../../../components/drawer";
import { useState } from "react";
import { Decoder, DeviceType, Protocol } from "../../../../utils/types";
import CustomSelect from "../../../../components/custom-select";
import { useMutation } from "@tanstack/react-query";
import { addDeviceType } from "../../../../api/device-type";
import { addProtocol } from "../../../../api/protocol";
import { addDecoder } from "../../../../api/decoder";
import {
  addDeviceProfile,
  updateDeviceProfile,
} from "../../../../api/device-profile";

interface Props {
  setRefetch: React.Dispatch<
    React.SetStateAction<{
      deviceType: boolean;
      protocol: boolean;
      decoder: boolean;
      deviceProfile: boolean;
    }>
  >;
}

function AddDeviceType({ setRefetch }: Props) {
  const [addDeviceData, setDeviceTypeData] = useState<DeviceType | null>(null);

  const deviceTypeMutation = useMutation({
    mutationFn: () => addDeviceType(addDeviceData),
    onSuccess: () => {
      setDeviceTypeData(null);
      setRefetch((prev) => {
        return {
          ...prev,
          deviceType: true,
        };
      });
    },
  });

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
        className="!w-11/12 !max-w-[30rem] "
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
          <Button
            variant="gradient"
            color="green"
            onClick={() => deviceTypeMutation.mutate()}
          >
            save
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

function AddProtocol({ setRefetch }: Props) {
  const [addProtocolData, setProtocolData] = useState<Protocol | null>(null);

  const protocolMutation = useMutation({
    mutationFn: () => addProtocol(addProtocolData),
    onSuccess: () => {
      setProtocolData(null);
      setRefetch((prev) => {
        return {
          ...prev,
          protocol: true,
        };
      });
    },
  });

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
        className="!w-11/12 !max-w-[30rem] "
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
          <Button
            variant="gradient"
            color="green"
            onClick={() => protocolMutation.mutate()}
          >
            save
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

function AddDocoder({ setRefetch }: Props) {
  const [addDecoderData, setDecoderData] = useState<Decoder | null>(null);

  const decoderMutation = useMutation({
    mutationFn: () => addDecoder(addDecoderData),
    onSuccess: () => {
      setDecoderData(null);
      setRefetch((prev) => {
        return {
          ...prev,
          decoder: true,
        };
      });
    },
  });

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
        className="!w-11/12 !max-w-[30rem] "
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
          <Button
            variant="gradient"
            color="green"
            onClick={() => decoderMutation.mutate()}
          >
            save
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

function AddEdit({ setRefetch }: Props) {
  const { data, setData, deviceTypes, protocols, decoders } =
    useProvider<Context>();

  const deviceProfileMutation = useMutation({
    mutationFn: () => handleSave(),
    onSuccess: () => {
      setRefetch((prev) => {
        return {
          ...prev,
          deviceProfile: true,
        };
      });
      setData(null);
    },
  });

  async function handleSave() {
    if (!data) {
      console.error("No group to save");
      return;
    }
    const { id, createdAt, updatedAt, decoder, deviceType, protocol, ...rest } =
      data;
    try {
      if (data.id) {
        updateDeviceProfile(id, rest);
      } else {
        addDeviceProfile(rest);
      }
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
          {data?.id ? "Edit" : "Add"} Device Profiles
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
          <AddDeviceType setRefetch={setRefetch} />
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
          <AddProtocol setRefetch={setRefetch} />
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
          <AddDocoder setRefetch={setRefetch} />
        </div>
      </div>
      {/* <span className="whitespace-break-spaces">
        {data && Object.entries(data).map(([k, v]) => `${k}: ${v}\n`)}
      </span> */}
      <div className="flex p-4 justify-between">
        <Button variant="text" color="red" onClick={() => setData(null)}>
          cancel
        </Button>
        <Button
          variant="filled"
          color="green"
          onClick={() => deviceProfileMutation.mutate()}
        >
          saved
        </Button>
      </div>
    </Drawer>
  );
}

export default AddEdit;
