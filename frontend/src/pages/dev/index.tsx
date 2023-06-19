import { useEffect, useState } from "react";
import { AppContext } from "../../App";
import { useProvider } from "../../components/provider";
import { Button, Input } from "@material-tailwind/react";

function DevPage() {
  const { trpc } = useProvider<AppContext>();
  const [value, setValue] = useState<string>("");
  const [data, setData] = useState<
    {
      id: number;
      value: string;
    }[]
  >([]);

  const getTags = () => {
    trpc.tag.findMany.query().then((data) => {
      setData(data);
    });
  };

  useEffect(() => {
    getTags();
  }, []);
  return (
    <div className="flex flex-col gap-12 ">
      <div className="flex flex-col gap-4">
        {data?.map((tag, index) => {
          return (
            <div className="flex gap-4" key={index}>
              <span>{tag.value}</span>
              <Button
                onClick={() => {
                  trpc.tag.delete.mutate(tag.id).then(() => {
                    getTags();
                  });
                }}
              >
                Delete
              </Button>
            </div>
          );
        })}
      </div>
      <div className="flex gap-4 my-6">
        <div className="w-72 ">
          <Input value={value} onChange={(e) => setValue(e.target.value)} />
        </div>
        <Button
          onClick={() => {
            trpc.tag.create
              .mutate({
                value,
              })
              .then(() => {
                setValue("");
                getTags();
              })
              .catch((e) => {
                console.log(e);
              });
          }}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}

export default DevPage;
