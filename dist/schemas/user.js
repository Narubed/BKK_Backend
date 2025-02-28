"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onRequestIDSchema = exports.onPatchUsersSchema = exports.onUpdateUsersSchema = exports.onCreateUsersSchema = exports.onQueryAllUsersSchema = void 0;
const joi_1 = __importDefault(require("@hapi/joi"));
exports.onQueryAllUsersSchema = joi_1.default.object({
    page: joi_1.default.number().integer().min(1).required(),
    pageSize: joi_1.default.number().integer().min(1).max(100).required(),
    search: joi_1.default.string().optional(),
});
exports.onCreateUsersSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    username: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    phone: joi_1.default.string().optional(),
    website: joi_1.default.string().optional(),
    address: joi_1.default.string().optional(),
    company: joi_1.default.string().optional(),
});
exports.onUpdateUsersSchema = joi_1.default.object({
    id: joi_1.default.number().integer().required(),
    name: joi_1.default.string().required(),
    username: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    phone: joi_1.default.string().optional(),
    website: joi_1.default.string().optional(),
    address: joi_1.default.string().optional(),
    company: joi_1.default.string().optional(),
});
exports.onPatchUsersSchema = joi_1.default.object({
    id: joi_1.default.number().integer().required(),
    name: joi_1.default.string().optional(),
    username: joi_1.default.string().optional(),
    email: joi_1.default.string().email().optional(),
    phone: joi_1.default.string().optional(),
    website: joi_1.default.string().optional(),
    address: joi_1.default.string().optional(),
    company: joi_1.default.string().optional(),
});
exports.onRequestIDSchema = joi_1.default.object({
    id: joi_1.default.number().integer().required(),
});
