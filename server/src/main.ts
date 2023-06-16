import { createContext, router } from './trpc';
import userRouter from './routes/user';
import authRouter from './routes/auth';
import express from 'express';
import * as trpcExpress from '@trpc/server/adapters/express';
import cors from 'cors';
import { TRPCError } from '@trpc/server';
import { getHTTPStatusCodeFromError } from '@trpc/server/http';
import deviceTypeRouter from './routes/device-type';
import groupRouter from './routes/group';
import mqttServerRouter from './routes/mqtt-server';
import deviceProfileRouter from './routes/device-profile';
import protocolRouter from './routes/protocol';
import decoderRouter from './routes/decoder';
import deviceRouter from './routes/device';

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

});

const app = express();

app.use(cors());


app.use(
	'/trpc',
	trpcExpress.createExpressMiddleware({
		router: appRouter,
		createContext,
	}),
);

app.use(async (req, res, next) => {
	console.log(req);
	try { }
	catch (error) {

		if (error instanceof TRPCError) {

			const { code, message, name, cause } = error;
			const httpCode = getHTTPStatusCodeFromError(error);
			res.status(httpCode).json({
				code,
				message,
				name,
				cause
			});
		}
	}
	next();
});

app.get('/', (_req, res) => {
	res.send('Hello World!');
});


app.listen(3000);


console.log('server started on http://localhost:3000');

export type AppRouter = typeof appRouter;
