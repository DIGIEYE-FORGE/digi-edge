import { authProcedure as procedure, router } from "../trpc";
import checkDiskSpace from "check-disk-space";
import { cpu, mem } from "node-os-utils";

const statsRouter = router({
  getStats: procedure.query(async () => {
    const { free, size } = await checkDiskSpace("/").then((diskSpace) => {
      return diskSpace;
    });
    const cpuUsage = await cpu.usage();
    const memUsage = (await mem.info()).usedMemPercentage;

    return {
      diskSize: size,
      diskSpace: Math.round((free / size) * 100),
      cpuUsage,
      memUsage,
    };
  }),
});

export default statsRouter;
