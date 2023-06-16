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
} from "@material-tailwind/react";
import { useProvider } from "../../components/provider";
import { AppContext } from "../../utils/types";
import { useState } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "../../api/user";
import { AxiosError } from "axios";

function LoginPage() {
  const { setAccessToken, setRefreshToken } = useProvider<AppContext>();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const signInMutation = useMutation({
    mutationFn: (data: any) => signIn(data),
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
    },
    onError: (error: AxiosError) => {
      setError(error.message);
      setIsLoading(false);
    },
  });

  return (
    <div
      className="flex min-h-screen justify-center items-center"
      style={{
        backgroundImage: "url('/login-bg.jpg')",
        backgroundSize: "cover",
      }}
    >
      <Card className="w-96 bg-white/80 bg-blur">
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
            label="username"
            size="lg"
            error={!!error && !error.includes("password")}
            onChange={(e) => {
              setLoginData({ ...loginData, username: e.target.value });
            }}
          />
          <Input
            label="Password"
            size="lg"
            type="password"
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
            onClick={() => {
              setIsLoading(true);
              signInMutation.mutate(loginData);
            }}
          >
            {isLoading ? (
              <div className="h-6 aspect-square bg-white/20 rounded-full animate-pulse">
                {""}
              </div>
            ) : (
              <span>Sign In</span>
            )}
          </Button>
          {/* <Typography variant="small" className="mt-6 flex justify-center">
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
          </Typography> */}
        </CardFooter>
      </Card>
    </div>
  );
}

export default LoginPage;
