"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSchema = exports.createSchema = void 0;
var trpc_1 = require("../trpc");
var prisma_1 = require("../common/prisma");
var zod_1 = require("zod");
var utils_1 = require("../utils");
var server_1 = require("@trpc/server");
exports.createSchema = zod_1.z.object({
    // id: z.number().optional(),
    name: (0, utils_1.isBetween)(2, 50),
    serial: (0, utils_1.isBetween)(2, 50),
    isPassive: zod_1.z.boolean().optional(),
    isDecoded: zod_1.z.boolean().optional(),
    blacklisted: zod_1.z.boolean().optional(),
    credential: zod_1.z
        .object({
        username: (0, utils_1.isBetween)(4, 20),
        password: (0, utils_1.isBetween)(8, 50).optional(),
        isToken: zod_1.z.boolean().default(false),
    })
        .optional(),
    attributes: zod_1.z.record(zod_1.z.string()).optional(),
    deviceProfileId: zod_1.z.number().optional(),
    mqttServerId: zod_1.z.number().optional(),
    groupId: zod_1.z.number().optional(),
});
exports.updateSchema = exports.createSchema.partial();
var deviceRouter = (0, trpc_1.router)({
    findMany: trpc_1.authProcedure.query(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma_1.default.device.findMany({
                        include: {
                            deviceProfile: {
                                select: { id: true, name: true, credentialsType: true },
                            },
                            group: { select: { id: true, name: true } },
                            mqttServer: true,
                            attributes: { select: { name: true, value: true } },
                            credential: true,
                        },
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); }),
    findUnique: trpc_1.authProcedure.input(zod_1.z.number()).query(function (opts) { return __awaiter(void 0, void 0, void 0, function () {
        var input;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    input = opts.input;
                    return [4 /*yield*/, prisma_1.default.device.findUnique({
                            where: { id: input },
                            include: {
                                deviceProfile: { select: { id: true, name: true } },
                                group: { select: { id: true, name: true } },
                                mqttServer: { select: { id: true, username: true } },
                                attributes: { select: { name: true, value: true } },
                                credential: true,
                            },
                        })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); }),
    create: trpc_1.authProcedure.input(exports.createSchema).mutation(function (opts) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, attributes, credential, deviceProfileId, groupId, mqttServerId, rest;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = opts.input, attributes = _a.attributes, credential = _a.credential, deviceProfileId = _a.deviceProfileId, groupId = _a.groupId, mqttServerId = _a.mqttServerId, rest = __rest(_a, ["attributes", "credential", "deviceProfileId", "groupId", "mqttServerId"]);
                    return [4 /*yield*/, prisma_1.default.device.create({
                            data: {
                                name: rest.name,
                                serial: rest.serial,
                                isPassive: rest.isPassive,
                                isDecoded: rest.isDecoded,
                                blacklisted: rest.blacklisted,
                                attributes: attributes && {
                                    create: Object.entries(attributes).map(function (_a) {
                                        var key = _a[0], value = _a[1];
                                        return ({
                                            name: key,
                                            value: value,
                                        });
                                    }),
                                },
                                credential: credential && {
                                    create: credential,
                                },
                                deviceProfile: deviceProfileId
                                    ? {
                                        connect: { id: deviceProfileId },
                                    }
                                    : undefined,
                                group: groupId ? { connect: { id: groupId } } : undefined,
                                mqttServer: mqttServerId
                                    ? { connect: { id: mqttServerId } }
                                    : undefined,
                            },
                        })];
                case 1: 
                // console.log({ credential });
                return [2 /*return*/, _b.sent()];
            }
        });
    }); }),
    update: trpc_1.authProcedure
        .input(zod_1.z.object({
        id: zod_1.z.number(),
        data: exports.updateSchema,
    }))
        .mutation(function (opts) { return __awaiter(void 0, void 0, void 0, function () {
        var input, id, _a, attributes, credential, deviceProfileId, groupId, mqttServerId, rest, device;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    input = opts.input;
                    id = input.id;
                    _a = input.data, attributes = _a.attributes, credential = _a.credential, deviceProfileId = _a.deviceProfileId, groupId = _a.groupId, mqttServerId = _a.mqttServerId, rest = __rest(_a, ["attributes", "credential", "deviceProfileId", "groupId", "mqttServerId"]);
                    return [4 /*yield*/, prisma_1.default.device.findUnique({ where: { id: id } })];
                case 1:
                    device = _b.sent();
                    return [4 /*yield*/, prisma_1.default.attribute.deleteMany({ where: { deviceId: id } })];
                case 2:
                    _b.sent();
                    if (!device)
                        throw new server_1.TRPCError({ code: "NOT_FOUND", message: "Device not found" });
                    return [4 /*yield*/, prisma_1.default.device.update({
                            where: { id: id },
                            data: __assign(__assign({}, rest), { attributes: attributes && {
                                    create: Object.entries(attributes).map(function (_a) {
                                        var key = _a[0], value = _a[1];
                                        return ({
                                            name: key,
                                            value: value,
                                        });
                                    }),
                                }, credential: credential && {
                                    update: credential,
                                }, deviceProfile: deviceProfileId
                                    ? {
                                        connect: { id: deviceProfileId },
                                    }
                                    : undefined, group: groupId ? { connect: { id: groupId } } : undefined, mqttServer: mqttServerId
                                    ? { connect: { id: mqttServerId } }
                                    : undefined }),
                        })];
                case 3: return [2 /*return*/, _b.sent()];
            }
        });
    }); }),
    delete: trpc_1.authProcedure.input(zod_1.z.number()).mutation(function (opts) { return __awaiter(void 0, void 0, void 0, function () {
        var input;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    input = opts.input;
                    return [4 /*yield*/, prisma_1.default.device.delete({ where: { id: input } })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); }),
    deleteMany: trpc_1.authProcedure.mutation(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma_1.default.device.deleteMany()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); }),
});
exports.default = deviceRouter;
