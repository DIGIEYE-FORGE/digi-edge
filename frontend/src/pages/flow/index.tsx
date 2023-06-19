import { Outlet } from "react-router-dom";
import { AppContext } from "../../App";
import { useProvider } from "../../components/provider";
import { Card } from "@material-tailwind/react";

function FlowPage() {
  const { secondaryMenu } = useProvider<AppContext>();

  return (
    <div className="flex overflow-x-hidden">
      <div
        className={`fixed top-[4rem] left-2 bottom-2 transition-[width] shadow-xl shadow-blue-gray-900/20 rounded-xl overflow-hidden z-[2] ${
          secondaryMenu ? "w-[20rem]" : "w-12"
        } `}
      >
        <Card
          className="h-full pl-[4rem] min-w-[20rem] 
			 "
          shadow={false}
        >
          side bar
        </Card>
      </div>
      <div
        className={`w-full mx-auto max-w-[1920px] h-full transition-[padding] [&>*]:p-2 md:[&>*]:p-4 lg:[&>*]:p-6   pl-[4rem]  ${
          secondaryMenu && " 2xl:pl-[20.5rem]"
        }`}
      >
        flow page
      </div>
    </div>
  );
}

export default FlowPage;
