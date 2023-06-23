import { HomeIcon } from "@heroicons/react/24/outline";
import { Button, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className=" h-screen flex flex-col justify-center items-center ">
      <img src="/not-found.svg" className="h-1/2" />
      <Typography variant="h2" className="mt-4">
        404 Page Not Found
      </Typography>
      <Button
        onClick={() => navigate("/")}
        color="blue"
        size="lg"
        className="mt-4 flex items-center gap-2"
      >
        <span>Go Home</span>
        <HomeIcon className="w-5" />
      </Button>
    </div>
  );
}

export default NotFoundPage;
