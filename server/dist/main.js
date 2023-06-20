"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var trpc_1 = require("./trpc");
var user_1 = require("./routes/user");
var auth_1 = require("./routes/auth");
var express = require("express");
var trpcExpress = require("@trpc/server/adapters/express");
var cors = require("cors");
var server_1 = require("@trpc/server");
var http_1 = require("@trpc/server/http");
var device_type_1 = require("./routes/device-type");
var group_1 = require("./routes/group");
var mqtt_server_1 = require("./routes/mqtt-server");
var device_profile_1 = require("./routes/device-profile");
var protocol_1 = require("./routes/protocol");
var decoder_1 = require("./routes/decoder");
var device_1 = require("./routes/device");
var tags_1 = require("./routes/tags");
var stats_1 = require("./routes/stats");
var appRouter = (0, trpc_1.router)({
    user: user_1.default,
    auth: auth_1.default,
    deviceType: device_type_1.default,
    group: group_1.default,
    mqttServer: mqtt_server_1.default,
    deviceProfile: device_profile_1.default,
    protocol: protocol_1.default,
    decoder: decoder_1.default,
    device: device_1.default,
    tag: tags_1.default,
    stats: stats_1.default,
});
var app = express();
app.use(cors());
app.use("/trpc", trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: trpc_1.createContext,
}));
app.use(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var code, message, name_1, cause, httpCode;
    return __generator(this, function (_a) {
        console.log(req);
        try {
        }
        catch (error) {
            if (error instanceof server_1.TRPCError) {
                code = error.code, message = error.message, name_1 = error.name, cause = error.cause;
                httpCode = (0, http_1.getHTTPStatusCodeFromError)(error);
                res.status(httpCode).json({
                    code: code,
                    message: message,
                    name: name_1,
                    cause: cause,
                });
            }
        }
        next();
        return [2 /*return*/];
    });
}); });
app.get("/", function (_req, res) {
    res.send("Hello World!");
});
app.listen(3000);
console.log("server started on http://localhost:3000");
