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
exports.createSchema = zod_1.z.object({
    id: zod_1.z.number().optional(),
    name: (0, utils_1.isBetween)(2, 50),
    description: zod_1.z.string().optional(),
    decoderId: zod_1.z.number().optional(),
    protocolId: zod_1.z.number().optional(),
    deviceTypeId: zod_1.z.number().optional(),
    credentialsType: zod_1.z.string().optional(),
    attributes: zod_1.z.record(zod_1.z.string()).optional(),
});
exports.updateSchema = exports.createSchema.partial();
var deviceProfileRouter = (0, trpc_1.router)({
    findMany: trpc_1.authProcedure
        .input(zod_1.z
        .object({
        search: zod_1.z.string().optional(),
        take: zod_1.z.number().optional(),
        skip: zod_1.z.number().optional(),
    })
        .optional())
        .query(function (opts) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, take, skip, search;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = opts.input || {}, take = _a.take, skip = _a.skip, search = _a.search;
                    return [4 /*yield*/, prisma_1.default.deviceProfile.findMany({
                            take: take,
                            skip: skip,
                            orderBy: { createdAt: "desc" },
                            include: {
                                deviceType: true,
                                decoder: true,
                                attributes: true,
                                protocol: true,
                            },
                            where: search
                                ? {
                                    OR: [
                                        { name: { contains: search } },
                                        { description: { contains: search } },
                                        { decoder: { name: { contains: search } } },
                                        { protocol: { name: { contains: search } } },
                                        { deviceType: { name: { contains: search } } },
                                    ],
                                }
                                : undefined,
                        })];
                case 1: return [2 /*return*/, _b.sent()];
            }
        });
    }); }),
    getNames: trpc_1.authProcedure.query(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma_1.default.deviceProfile.findMany({
                        select: { id: true, name: true, credentialsType: true },
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
                    return [4 /*yield*/, prisma_1.default.deviceProfile.findUnique({ where: { id: input } })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); }),
    create: trpc_1.authProcedure.input(exports.createSchema).mutation(function (opts) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, id, attributes, deviceTypeId, decoderId, protocolId, rest;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = opts.input, id = _a.id, attributes = _a.attributes, deviceTypeId = _a.deviceTypeId, decoderId = _a.decoderId, protocolId = _a.protocolId, rest = __rest(_a, ["id", "attributes", "deviceTypeId", "decoderId", "protocolId"]);
                    return [4 /*yield*/, prisma_1.default.deviceProfile.create({
                            data: {
                                name: rest.name,
                                description: rest.description,
                                credentialsType: rest.credentialsType,
                                decoder: decoderId ? { connect: { id: decoderId } } : undefined,
                                deviceType: deviceTypeId
                                    ? { connect: { id: deviceTypeId } }
                                    : undefined,
                                protocol: protocolId ? { connect: { id: protocolId } } : undefined,
                            },
                        })];
                case 1: return [2 /*return*/, _b.sent()];
            }
        });
    }); }),
    update: trpc_1.authProcedure
        .input(zod_1.z.object({
        id: zod_1.z.number(),
        data: exports.updateSchema,
    }))
        .mutation(function (opts) { return __awaiter(void 0, void 0, void 0, function () {
        var input, id, data, attributes, rest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    input = opts.input;
                    id = input.id, data = input.data;
                    attributes = data.attributes, rest = __rest(data, ["attributes"]);
                    return [4 /*yield*/, prisma_1.default.deviceProfile.update({
                            where: { id: id },
                            data: __assign({ attributes: attributes && {
                                    upsert: Object.entries(attributes).map(function (_a) {
                                        var key = _a[0], value = _a[1];
                                        return ({
                                            where: {
                                                deviceProfileId_name: { deviceProfileId: id, name: key },
                                            },
                                            create: {
                                                name: key,
                                                value: value,
                                            },
                                            update: {
                                                value: value,
                                            },
                                        });
                                    }),
                                } }, rest),
                        })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); }),
    delete: trpc_1.authProcedure.input(zod_1.z.number()).mutation(function (opts) { return __awaiter(void 0, void 0, void 0, function () {
        var input;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    input = opts.input;
                    return [4 /*yield*/, prisma_1.default.deviceProfile.delete({ where: { id: input } })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); }),
    deleteMany: trpc_1.authProcedure.mutation(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma_1.default.deviceProfile.deleteMany()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); }),
});
exports.default = deviceProfileRouter;
