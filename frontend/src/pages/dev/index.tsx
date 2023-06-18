import { AppContext } from "../../App";
import { useProvider } from "../../components/provider";

function DevPage() {
  const { user } = useProvider<AppContext>();
  return <div className="flex flex-col gap-12 ">{JSON.stringify(user)}</div>;
}

export default DevPage;
