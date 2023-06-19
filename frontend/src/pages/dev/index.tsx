import { useEffect, useState } from "react";
import { AppContext } from "../../App";
import { useProvider } from "../../components/provider";
import { Button, Input } from "@material-tailwind/react";
import { Tag } from "../../utils/types";
import { set } from "date-fns";

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
      <div className="flex flex-col gap-4">
        {data.map((tag, index) => (
          <div className="flex gap-4 items-center">
            <div className="w-72">
              <Input
                value={tag.value}
                label="tagvalue"
                onChange={(e) => {
                  setData((prev) => {
                    const newData = [...prev];
                    newData[index].value = e.target.value;
                    return newData;
                  });
                }}
              ></Input>
            </div>
            <Button
              onClick={() => {
                trpc.tag.update.mutate({
                  id: tag.id,
                  data: {
                    value: tag.value,
                  },
                });
              }}
            >
              save
            </Button>
            <Button
              onClick={() => {
                trpc.tag.delete.mutate(tag.id);
              }}
            >
              delete
            </Button>
          </div>
        ))}
      </div>
      <div className="flex gap-4">
        <div className="w-72">
          <Input
            value={value}
            label="new value"
            onChange={(e) => setValue(e.target.value)}
          />
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
              });
          }}
        >
          {" "}
          save
        </Button>
      </div>
    </div>
  );
}

export default DevPage;
