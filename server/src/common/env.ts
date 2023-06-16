import { z } from 'zod';
import dotenv from 'dotenv';
dotenv.config();

const envShcema = {
	NODE_ENV: z.string().default('development'),
	PORT: z.string().default('3000'),
	JWT_SECRET: z.string().default('secret'),
	ACCESS_TOKEN_EXPIRES_IN: z.string().default('15m'),
	REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d'),
};

const env = z.object(envShcema).parse(process.env);

export default env;