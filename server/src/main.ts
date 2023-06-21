import { createContext, router } from "./trpc";
import userRouter from "./routes/user";
import authRouter from "./routes/auth";
import * as express from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import * as cors from "cors";
import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import deviceTypeRouter from "./routes/device-type";
import groupRouter from "./routes/group";
import mqttServerRouter from "./routes/mqtt-server";
import deviceProfileRouter from "./routes/device-profile";
import protocolRouter from "./routes/protocol";
import decoderRouter from "./routes/decoder";
import deviceRouter from "./routes/device";
import TagRouter from "./routes/tags";
import statsRouter from "./routes/stats";
import * as multer from "multer";

const storageEngine = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, fn) => {
    void req;
    fn(null, `${new Date().getTime()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storageEngine });

const appRouter = router({
  user: userRouter,
  auth: authRouter,
  deviceType: deviceTypeRouter,
  group: groupRouter,
  mqttServer: mqttServerRouter,
  deviceProfile: deviceProfileRouter,
  protocol: protocolRouter,
  decoder: decoderRouter,
  device: deviceRouter,
  tag: TagRouter,
  stats: statsRouter,
});

const app = express();

app.use(cors());

app.use(express.static("uploads"));

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.use(async (req, res, next) => {
  void req;
  try {
  } catch (error) {
    if (error instanceof TRPCError) {
      const { code, message, name, cause } = error;
      const httpCode = getHTTPStatusCodeFromError(error);
      res.status(httpCode).json({
        code,
        message,
        name,
        cause,
      });
    }
  }
  next();
});

app.get("/", (_req, res) => {
  res.send("Hello World!");
});

app.post("/upload", upload.single("file"), (req, res) => {
  if (req.file) {
    res.json({ filename: req.file.filename });
  } else {
    res.status(500).json({ message: "File upload failed" });
  }
});

app.listen(3000);

console.log("server started on http://localhost:3000");

export type AppRouter = typeof appRouter;
