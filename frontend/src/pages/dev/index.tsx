import { useEffect, useState } from "react";
import { AppContext } from "../../App";
import { useProvider } from "../../components/provider";
import { Button, Input } from "@material-tailwind/react";
import { Tag } from "../../utils/types";

function DevPage() {
  const { trpc } = useProvider<AppContext>();
  const [value, setValue] = useState<string>("");
  const [data, setData] = useState<Tag[]>([]);

  const getTags = () => {
    trpc.tag.findMany.query().then((data) => {
      setData(data);
    });
  };

  useEffect(() => {
    getTags();
  }, []);
  return (
    <div className="flex flex-col gap-6">
      <div style={{
        width: "20rem",
        height: "6rem",
        backgroundColor: "red",
        // remove quarder cilcle at top right
        clipPath: "inset(calc(100% - 1rem) 0 0 calc(100% - 1rem))",
      }}></div>
    </div>
  );
}

export default DevPage;
