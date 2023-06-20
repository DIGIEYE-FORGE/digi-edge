import { Alert, Switch } from "@material-tailwind/react";
import React from "react";

function TenantsPage() {
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);
  const [isConnected, setIsConnected] = React.useState(false);
  const [error, setError] = React.useState("");
  const handleSwichChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(e.target.checked);
    setIsSwitchOn(e.target.checked);
    if (!isConnected) {
      setError("Please connect to the device first");
      setTimeout(() => {
        setIsSwitchOn(false);
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full justify-center items-center">
      {error && <Alert color="red">{error}</Alert>}
      <div className="flex gap-12">
        <div className="flex flex-col gap-4">
          <span>{`
        isConnected  ${isConnected ? "true" : "false"}
        `}</span>

          <Switch
            id="1"
            checked={isConnected}
            onChange={() => setIsConnected((prev) => !prev)}
          />
        </div>
        <div className="flex flex-col gap-4">
          <span>{`
        switch is ${isSwitchOn ? "on" : "off"}
        `}</span>
          <Switch
            color={isConnected && isSwitchOn ? "blue" : "red"}
            id="2"
            checked={isSwitchOn}
            onChange={(e) => handleSwichChange(e)}
          />
        </div>
      </div>
    </div>
  );
}

export default TenantsPage;
