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
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminProcedure = exports.authProcedure = exports.router = exports.publicProcedure = exports.middleware = exports.createContext = void 0;
var server_1 = require("@trpc/server");
var utils_1 = require("./utils");
var prisma_1 = require("./common/prisma");
// export const createContext = async (opts: CreateNextContextOptions) => {
// 	return {
// 		req: opts.req,
// 	} as Context;
// };
var createContext = function (_a) {
    var req = _a.req, res = _a.res;
    return {
        req: req,
        res: res,
    };
};
exports.createContext = createContext;
var t = server_1.initTRPC.context().create();
exports.middleware = t.middleware;
exports.publicProcedure = t.procedure;
exports.router = t.router;
var isAuthed = (0, exports.middleware)(function (_a) {
    var ctx = _a.ctx, next = _a.next;
    return __awaiter(void 0, void 0, void 0, function () {
        var req, accessToken, id, user;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    req = ctx.req;
                    accessToken = (_d = (_c = (_b = req.headers) === null || _b === void 0 ? void 0 : _b.authorization) === null || _c === void 0 ? void 0 : _c.split(" ")) === null || _d === void 0 ? void 0 : _d[1];
                    if (!accessToken) {
                        throw new server_1.TRPCError({
                            code: "UNAUTHORIZED",
                            message: "You must be logged in to do that.",
                        });
                    }
                    return [4 /*yield*/, (0, utils_1.verifyToken)(accessToken)];
                case 1:
                    id = (_e.sent()).id;
                    return [4 /*yield*/, prisma_1.default.user.findUnique({ where: { id: id } })];
                case 2:
                    user = _e.sent();
                    if (!user) {
                        // console.log('no user found');
                        throw new server_1.TRPCError({
                            code: "UNAUTHORIZED",
                            message: "You must be logged in to do that.",
                        });
                    }
                    return [2 /*return*/, next({
                            ctx: __assign(__assign({}, ctx), { user: {
                                    id: user.id,
                                    role: user.role,
                                } }),
                        })];
            }
        });
    });
});
var isAdmin = isAuthed.unstable_pipe(function (_a) {
    var ctx = _a.ctx, next = _a.next;
    return __awaiter(void 0, void 0, void 0, function () {
        var _b;
        return __generator(this, function (_c) {
            if (((_b = ctx.user) === null || _b === void 0 ? void 0 : _b.role) !== "ADMIN") {
                throw new server_1.TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You must be an admin to do that.",
                });
            }
            return [2 /*return*/, next({ ctx: ctx })];
        });
    });
});
exports.authProcedure = exports.publicProcedure.use(isAuthed);
exports.adminProcedure = exports.publicProcedure.use(isAdmin);
