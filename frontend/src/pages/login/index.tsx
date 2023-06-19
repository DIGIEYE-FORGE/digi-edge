import {
  Card,
  CardHeader,
  Typography,
  CardBody,
  Input,
  Checkbox,
  CardFooter,
  Button,
  Alert,
  Spinner,
} from "@material-tailwind/react";
import { useProvider } from "../../components/provider";
import { AppContext } from "../../App";
import { useState } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { z } from "zod";
import { TRPCClientError } from "@trpc/client";

const loginSchema = z.object({
  username: z.string().min(3, {
    message: "please enter a valid username address",
  }),
  password: z.string().min(8, {
    message: "password must be at least 8 characters long",
  }),
});

function LoginPage() {
  const { trpc, setAccessToken } = useProvider<AppContext>();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  async function handleLogin() {
    try {
      const data = loginSchema.parse(loginData);
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const { accessToken } = await trpc.auth.login.mutate({
        username: data.username,
        password: data.password,
      });

      setAccessToken(accessToken);
    } catch (e) {
      console.error(e);
      if (e instanceof z.ZodError) {
        setError(e.errors[0].message);
      } else if (e instanceof TRPCClientError) {
        setError(e.message);
      } else {
        setError("something went wrong");
      }
    }
    setIsLoading(false);
  }
  return (
    <div className="flex min-h-screen ">
      <div className="flex-1 flex flex-col gap-12 justify-center items-center">
        <img src="/logo.svg" alt="" className="h-[4rem]" />
        <Card className="w-11/12 max-w-[24rem] bg-blur">
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-4 grid h-28 place-items-center"
          >
            <Typography variant="h3" color="white">
              Sign In
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            {error && (
              <Alert
                className="first-letter:uppercase"
                color="red"
                icon={
                  <InformationCircleIcon strokeWidth={2} className="h-6 w-6" />
                }
              >
                {error}
              </Alert>
            )}
            <Input
              label="Email"
              size="lg"
              error={!!error && !error.includes("password")}
              onChange={(e) => {
                setLoginData({ ...loginData, username: e.target.value });
              }}
            />
            <Input
              label="Password"
              type="password"
              size="lg"
              error={!!error && !error.includes("username")}
              onChange={(e) => {
                setLoginData({ ...loginData, password: e.target.value });
              }}
            />
            <div className="-ml-2.5">
              <Checkbox label="Remember Me" />
            </div>
          </CardBody>
          <CardFooter className="pt-0">
            <Button
              variant="gradient"
              className={`!p-0 h-14 flex items-center justify-center ${
                isLoading && "pointer-events-none"
              }`}
              size="lg"
              fullWidth
              onClick={handleLogin}
            >
              {isLoading ? <Spinner /> : <span>Sign In</span>}
            </Button>
            <Typography variant="small" className="mt-6 flex justify-center">
              Don't have an account?
              <Typography
                as="a"
                href="#signup"
                variant="small"
                color="blue"
                className="ml-1 font-bold"
              >
                Sign up
              </Typography>
            </Typography>
          </CardFooter>
        </Card>
      </div>
      <div
        className="flex-1 flex-col hidden lg:flex "
        style={{
          backgroundImage: "url('/login-bg.png')",
          backgroundSize: "cover",
        }}
      >
        <img
          src="white-logo.svg"
          alt=""
          className="absolute bottom-6 right-6"
        />
      </div>
    </div>
  );
}

export default LoginPage;
