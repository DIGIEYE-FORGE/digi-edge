import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/outline";
import { Card, Progress } from "@material-tailwind/react";
import { useQueries, useQuery } from "@tanstack/react-query";
import ReactApexChart from "react-apexcharts";
import { getDevices } from "../../../api/device";
import { getStats } from "../../../api/utils";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

function MetricCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="flex flex-col gap-1 p-3 ">
      <div className="capitalize text-blue-900">{title}</div>
      <div className="flex flex-1 items-center flex-wrap gap-3">{children}</div>
    </Card>
  );
}

function Metrics() {
  const [devicesQuery, statsQuery] = useQueries({
    queries: [
      {
        queryKey: ["devices"],
        queryFn: () => getDevices({ include: { attributes: true } }),
      },
      {
        queryKey: ["stats"],
        queryFn: () => getStats(),
      },
    ],
  });

  return (
    <>
      <MetricCard title="device total">
        <div className="bg-red-50 h-full flex-1 rounded-xl flex justify-between p-2 items-center">
          <span className="text-2xl">
            {devicesQuery?.data?.totalResult || "0"}
          </span>
          <span className="text-red-500 capitalize">devices</span>
        </div>
      </MetricCard>
      <MetricCard title="activity">
        <div className="bg-green-50 h-16 flex flex-col rounded-xl flex-1 justify-between gap-1 p-2 items-center">
          <span className="text-green-600  text-sm flex items-center gap-1 capitalize">
            <span className="w-3 aspect-square rounded-2xl bg-green-600"></span>
            <span>online</span>
          </span>
          <span className="text-xl font-bold">
            {devicesQuery.data?.results.filter((device) => {
              return device.attributes
                ?.map((attr) => {
                  if (attr.name === "isOnline" && attr.value == "true") {
                    return true;
                  }
                  return false;
                })
                .filter((item) => item === true);
            }).length || 0}
          </span>
        </div>
        <div className="bg-gray-100 h-16 flex flex-col rounded-xl flex-1 justify-between gap-1 p-2 items-center">
          <span className="text-gray-600  text-sm flex items-center gap-1 capitalize">
            <span className="w-3 aspect-square rounded-2xl bg-gray-600"></span>
            <span>inactive</span>
          </span>
          <span className="text-xl font-bold">
            {(devicesQuery?.data?.totalResult || 0) -
              (devicesQuery.data?.results.filter((device) => {
                return device.attributes
                  ?.map((attr) => {
                    if (attr.name === "isOnline" && attr.value == "true") {
                      return true;
                    }
                    return false;
                  })
                  .filter((item) => item === true);
              }).length || 0)}
          </span>
        </div>
        <div className="bg-red-50 h-16 flex flex-col rounded-xl flex-1 justify-between gap-1 p-2 items-center">
          <span className="text-red-600  text-sm flex items-center gap-1 capitalize">
            <span className="w-3 aspect-square rounded-2xl bg-red-600"></span>
            <span>offline</span>
          </span>
          <span className="text-xl font-bold">
            {devicesQuery.data?.results.filter((device) => {
              return device.blacklisted === true;
            }).length || 0}
          </span>
        </div>
      </MetricCard>
      <MetricCard title="messages">
        <div className="bg-green-50 h-16 flex-1 rounded-xl flex justify-between p-2 items-center">
          <span className="text-2xl">851</span>
          <span className="text-green-500 capitalize flex items-center gap-1">
            <span>in</span>
            <ArrowDownIcon className="w-4 h-4" />
          </span>
        </div>
        <div className="bg-light-blue-50 h-16 flex-1 rounded-xl flex justify-between p-2 items-center">
          <span className="text-2xl">851</span>
          <span className="text-light-blue-500 capitalize flex items-center gap-1">
            <span>out</span>
            <ArrowUpIcon className="w-4 h-4" />
          </span>
        </div>
      </MetricCard>
      <MetricCard title="total storage">
        <div className="bg-green-50 h-full flex-1 rounded-xl flex justify-between p-2 items-center">
          <span className="text-2xl w-10 -h-10 flex justify-center items-center">
            <CircularProgressbar
              value={statsQuery.data?.diskSpace}
              styles={buildStyles({
                pathColor: "#2BC6B7",
                trailColor: "#eee",
              })}
            />
            <span className="absolute text-[0.8rem] font-semibold">
              {statsQuery.data?.diskSpace}%
            </span>
          </span>
          <span className="text-blue-900 capitalize text-lg font-bold">
            {(statsQuery.data?.diskSize / Math.pow(10, 9)).toFixed(2)} GB
          </span>
        </div>
      </MetricCard>
    </>
  );
}

function CpuUsage() {
  const { data } = useQuery({
    queryKey: ["stats"],
    queryFn: () => getStats(),
  });
  console.log({ data });
  return (
    <Card className="flex flex-col  p-3 row-span-2 text-blue-900">
      <div className="title capitalize">cpu usage %</div>
      <div className="flex-1 flex items-center justify-center">
        <ReactApexChart
          height={300}
          series={[data?.cpuUsage, 100 - data?.cpuUsage]}
          options={{
            labels: ["Used", "Free"],
            chart: {
              type: "donut",
            },
            colors: ["#00607B", "#00B4CA"],
            legend: {
              position: "bottom",
            },
          }}
          type="donut"
        />
      </div>
    </Card>
  );
}

function MemoryUsage() {
  const { data } = useQuery({
    queryKey: ["stats"],
    queryFn: () => getStats(),
  });
  console.log({ data });
  return (
    <Card className="flex flex-col  p-3 row-span-2 text-blue-900">
      <div className="title capitalize">memory usage %</div>
      <div className="flex-1 flex items-center justify-center">
        <ReactApexChart
          height={300}
          series={[data?.memUsage, 100 - data?.memUsage]}
          options={{
            labels: ["Used", "Free"],
            chart: {
              type: "donut",
            },
            colors: ["#00607B", "#2BCF9D"],
            legend: {
              position: "bottom",
            },
          }}
          type="donut"
        />
      </div>
    </Card>
  );
}

function BarChart() {
  return (
    <Card className="flex flex-col  p-3 row-span-2 text-blue-900 xs:col-span-full 2xl:col-span-4 ">
      <div className="title capitalize"> some chart</div>
      <div className="flex-1 w-full ">
        <ReactApexChart
          options={{
            chart: {
              type: "bar",
              events: {
                // click: function (chart, w, e) {
                //   // console.log(chart, w, e)
                // },
              },
            },
            colors: ["#008392"],
            plotOptions: {
              bar: {
                columnWidth: "30%",
                distributed: true,
                borderRadius: 10,
              },
            },
            dataLabels: {
              enabled: false,
            },
            legend: {
              show: false,
            },
            xaxis: {
              categories: [
                ["John", "Doe"],
                ["Joe", "Smith"],
                ["Jake", "Williams"],
                "Amber",
                ["Peter", "Brown"],
                ["Mary", "Evans"],
                ["David", "Wilson"],
                ["Lily", "Roberts"],
              ],
              labels: {
                style: {
                  colors: ["#000000"],
                  fontSize: "12px",
                },
              },
            },
          }}
          series={[{ data: [21, 22, 10, 28, 16, 21, 13, 30, 16] }]}
          type="bar"
          height={300}
          width={"100%"}
        />
      </div>
    </Card>
  );
}

function AreaChart() {
  return (
    <Card className="flex flex-col  p-3 row-span-2 text-blue-900 xs:col-span-full 2xl:col-span-4 ">
      <div className="title capitalize"> onother chart</div>
      <div className="flex-1 w-full ">
        <ReactApexChart
          options={{
            chart: {
              height: 380,
              type: "area",
            },
            dataLabels: {
              enabled: false,
            },
            stroke: {
              curve: "smooth",
              width: 3,
            },
            colors: ["#008392", "#00B4CA"],
            xaxis: {
              type: "datetime",
              categories: [
                "2018-09-19T00:00:00.000Z",
                "2018-09-19T01:30:00.000Z",
                "2018-09-19T02:30:00.000Z",
                "2018-09-19T03:30:00.000Z",
                "2018-09-19T04:30:00.000Z",
                "2018-09-19T05:30:00.000Z",
                "2018-09-19T06:30:00.000Z",
              ],
            },
            tooltip: {
              x: {
                format: "dd/MM/yy HH:mm",
              },
            },
          }}
          series={[
            {
              name: "series1",
              data: [31, 40, 28, 51, 42, 109, 100],
            },
            {
              name: "series2",
              data: [11, 32, 45, 32, 34, 52, 41],
            },
          ]}
          type="area"
          height={380}
          width={"100%"}
        />
      </div>
    </Card>
  );
}

function Stats() {
  return (
    <Card className="flex flex-col gap-2 p-3 col-span-full xl:col-span-2 xl:row-span-2 2xl:col-span-1 2xl:row-span-1">
      <span className="text-lg text-blue-900">Configurations</span>
      <div className="flex flex-col gap-3 w-full flex-1 justify-evenly">
        <span className="flex flex-col gap-1">
          <div className="flex justify-between items-center ">
            <span className="text-xs">configuration not assigned</span>
            <span>800</span>
          </div>
          <Progress value={30} color="gray" />
        </span>
        <span className="flex flex-col gap-1">
          <div className="flex justify-between items-center ">
            <span className="text-xs">Config.xfg</span>
            <span>800</span>
          </div>
          <Progress value={50} color="cyan" />
        </span>
        <span className="flex flex-col gap-1">
          <div className="flex justify-between items-center ">
            <span className="text-xs">Config.cfg</span>
            <span>800</span>
          </div>
          <Progress value={20} color="deep-purple" />
        </span>
      </div>
    </Card>
  );
}

function DashboardPage() {
  return (
    <div className="grid grid-flow-dense md:grid-cols-2   xl:grid-cols-4 2xl:grid-cols-5 gap-2 md:gap-3 lg:gap-4 md ">
      <Metrics />
      <CpuUsage />
      <BarChart />
      <MemoryUsage />
      <AreaChart />
      <Stats />
    </div>
  );
}

export default DashboardPage;
