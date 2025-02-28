"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onRequestIDSchema = exports.onPatchPostsSchema = exports.onUpdatePostsSchema = exports.onCreatePostsSchema = exports.onQueryAllPostsSchema = void 0;
const joi_1 = __importDefault(require("@hapi/joi"));
exports.onQueryAllPostsSchema = joi_1.default.object({
    page: joi_1.default.number().integer().min(1).required(),
    pageSize: joi_1.default.number().integer().min(1).max(100).required(),
    search: joi_1.default.string().optional(),
});
exports.onCreatePostsSchema = joi_1.default.object({
    title: joi_1.default.string().required(),
    body: joi_1.default.string().required(),
    userId: joi_1.default.number().required(),
});
exports.onUpdatePostsSchema = joi_1.default.object({
    id: joi_1.default.number().integer().required(),
    title: joi_1.default.string().required(),
    body: joi_1.default.string().required(),
    userId: joi_1.default.number().integer().optional(),
});
exports.onPatchPostsSchema = joi_1.default.object({
    id: joi_1.default.number().integer().required(),
    title: joi_1.default.string().optional(),
    body: joi_1.default.string().optional(),
    userId: joi_1.default.number().integer().optional(),
});
exports.onRequestIDSchema = joi_1.default.object({
    id: joi_1.default.number().integer().required(),
});
