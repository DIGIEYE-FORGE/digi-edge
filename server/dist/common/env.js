"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var zod_1 = require("zod");
var dotenv = require("dotenv");
dotenv.config();
var envShcema = {
    NODE_ENV: zod_1.z.string().default("development"),
    PORT: zod_1.z.string().default("3000"),
    JWT_SECRET: zod_1.z.string().default("secret"),
    ACCESS_TOKEN_EXPIRES_IN: zod_1.z.string().default("1d"),
    REFRESH_TOKEN_EXPIRES_IN: zod_1.z.string().default("7d"),
};
var env = zod_1.z.object(envShcema).parse(process.env);
exports.default = env;
