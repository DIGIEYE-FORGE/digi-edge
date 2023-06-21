import {
  Button,
  Card,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Typography,
} from "@material-tailwind/react";
import { useProvider } from "../../components/provider";
import { AppContext } from "../../App";
import Avatar from "../../components/avatar";
import { useState } from "react";
import axios from "axios";

function ChangePasswordCard() {
  const { trpc, user } = useProvider<AppContext>();
  const [open, setOpen] = useState(false);
  const [password, setpassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const changePassword = async () => {
    if (password === confirmPassword && user?.id !== undefined) {
      await trpc.user.updatePassword.mutate({
        id: user?.id,
        password: password,
      });
    }
  };

  return (
    <>
      <Card className="flex flex-col justify-evenly gap-2 md:gap-3 lg:gap-4 xl:gap-6 lg:h-[40vh] lg:max-h-[30rem]">
        <Typography variant="h3" color="blue">
          Change Password
        </Typography>
        <p>
          {/* Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore,
          facilis! */}
        </p>
        <Button size="lg" className="text-lg" onClick={() => setOpen(true)}>
          change
        </Button>
      </Card>
      <Dialog
        open={open}
        handler={() => setOpen(false)}
        className="!w-11/12"
        size="xs"
      >
        <DialogHeader>Change Password</DialogHeader>
        <DialogBody divider className="flex flex-col gap-4 py-6">
          {/* <div>
            <Input label="old password" type="password" />
          </div> */}
          <div>
            <Input
              label="new password"
              type="password"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
            />
          </div>
          <div>
            <Input
              label="confirm password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            className="mr-1"
            onClick={() => setOpen(false)}
          >
            <span>Cancel</span>
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={() => {
              changePassword();
              setOpen(false);
            }}
          >
            Submit
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

function ProfilePage() {
  const { user, trpc } = useProvider<AppContext>();
  const [data, setData] = useState<{
    username?: string;
    avatar?: File;
    firstName?: string;
    lastName?: string;
  } | null>({
    username: user?.username,
    avatar: undefined,
    firstName: user?.firstName,
    lastName: user?.lastName,
  });
  const [preview, setPreview] = useState<any>(null);

  const uploadImage = async () => {
    const formData = new FormData();
    if (data?.avatar) formData.append("file", data.avatar);

    try {
      if (data?.avatar !== undefined)
        axios
          .post(`http://${location.hostname}:3000/upload`, formData)
          .then(async (res) => {
            await trpc.user.update.mutate({
              id: user?.id!,
              data: {
                avatar: res.data.filename,
                firstName: data?.firstName,
                lastName: data?.lastName,
                username: data?.username,
              },
            });
          });
      else
        await trpc.user.update.mutate({
          id: user?.id!,
          data: {
            firstName: data?.firstName,
            lastName: data?.lastName,
            username: data?.username,
          },
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3  gap-4  [&>*]:p-2 md:[&>*]:p-3 lg:[&>*]:p-4 xl:[&>*]:p-6">
      <Card
        className="col-span-full lg:col-span-2 row-span-2 min-h-[30rem]"
        style={{
          backgroundImage: "url(/online_resume.svg)",
          backgroundPosition: "bottom right",
          backgroundSize: "80%",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="flex gap-4 xl:gap-8 flex-col ">
          <div className="flex gap-6 flex-wrap max-w-[30rem]">
            <input
              type="file"
              className="hidden"
              id="avatar"
              onChange={(e) => {
                if (e.target.files)
                  setData({ ...data, avatar: e.target.files[0] });
                if (e.target.files) {
                  setPreview(URL.createObjectURL(e.target.files[0]));
                }
              }}
            />
            <Avatar
              className="min-w-[7rem] max-h-[7rem] text-[5rem]"
              src={preview || "http://localhost:3000/" + user?.avatar}
              alt={user?.username}
            ></Avatar>
            <div className="flex flex-1 flex-col gap- justify-evenly items-start gap-3 bg-white/50 min-w-[15rem] ">
              <label
                className="px-3 py-2 border-2 rounded text-center  text-blue-300 font-semibold border-blue-300 cursor-pointer hover:bg-blue-50 active:bg-blue-100"
                htmlFor="avatar"
              >
                Upload avatar
              </label>
              <p className="">
                {/* Lorem ipsum dolor sit amet consectetur, adipisicing elit. Natus
                enim voluptas earum. */}
              </p>
            </div>
          </div>
          <div className="max-w-[30rem] w-full bg-white/50 bg-blur">
            <Input
              size="lg"
              label="Username"
              value={data?.username}
              onChange={(e) => {
                setData({
                  ...data,
                  username: e.target.value,
                });
              }}
            ></Input>
          </div>
          <div className="max-w-[30rem] w-full bg-white/50 bg-blur">
            <Input
              size="lg"
              label="First name"
              value={data?.firstName}
              onChange={(e) => {
                setData({
                  ...data,
                  firstName: e.target.value,
                });
              }}
            ></Input>
          </div>
          <div className="max-w-[30rem] w-full bg-white/50 bg-blur">
            <Input
              size="lg"
              label="Last name"
              value={data?.lastName}
              onChange={(e) => {
                setData({
                  ...data,
                  lastName: e.target.value,
                });
              }}
            ></Input>
          </div>
        </div>
        <div className="flex gap-4 mt-5">
          <Button
            variant="outlined"
            size="md"
            className="text-lg w-[30%]"
            onClick={() => {
              setData({
                username: user?.username,
                avatar: user?.avatar,
                firstName: user?.firstName,
                lastName: user?.lastName,
              });
              setPreview(null);
            }}
          >
            reset
          </Button>
          <Button size="md" className="text-lg w-[30%]" onClick={uploadImage}>
            Submit
          </Button>
        </div>
      </Card>
      <ChangePasswordCard />
      <Card className="flex flex-col justify-evenly gap-2 md:gap-3 lg:gap-4 xl:gap-6 lg:h-[40vh] lg:max-h-[30rem]">
        <Typography variant="h3" color="blue">
          Close Account
        </Typography>
        <p>
          {/* Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore,
          facilis! */}
        </p>
        <Button size="lg" className="text-lg">
          Close
        </Button>
      </Card>
    </div>
  );
}

export default ProfilePage;
