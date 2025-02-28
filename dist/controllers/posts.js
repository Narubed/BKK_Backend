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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.patchPost = exports.updatePost = exports.createPost = exports.getPostsByID = exports.getAllPosts = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, pageSize, search } = req.query;
        const pageNumber = parseInt(page, 10) || 1;
        const pageSizeNumber = parseInt(pageSize, 10) || 10;
        const skip = (pageNumber - 1) * pageSizeNumber;
        const take = pageSizeNumber;
        const where = search
            ? {
                OR: [
                    {
                        title: { contains: search },
                    },
                ],
            }
            : {};
        const totalPosts = yield prisma.post.count({ where });
        const totalPages = Math.ceil(totalPosts / pageSizeNumber);
        const results = yield prisma.post.findMany({
            where,
            skip: skip,
            take: take,
        });
        res.status(200).json({
            currentPage: pageNumber,
            totalPages: totalPages,
            pageSize: pageSizeNumber,
            total: totalPosts,
            data: results,
        });
    }
    catch (error) {
        res.status(400).send({ error: "Cannot get Posts" });
    }
});
exports.getAllPosts = getAllPosts;
const getPostsByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield prisma.post.findUnique({
            where: { id: Number(req.params.id) },
        });
        if (post) {
            res.status(200).send(post);
        }
        else {
            res.status(400).send({ error: "post not found" });
        }
    }
    catch (error) {
        res.status(400).send({ error: "Cannot get post" });
    }
});
exports.getPostsByID = getPostsByID;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newPost = yield prisma.post.create({
            data: Object.assign({}, req.body),
        });
        res.status(201).send(newPost);
    }
    catch (error) {
        res.status(400).send({ error: "Cannot create post" });
    }
});
exports.createPost = createPost;
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedPost = yield prisma.post.update({
            where: { id: Number(req.params.id) },
            data: req.body,
        });
        res.send(updatedPost);
    }
    catch (error) {
        res.status(400).send({ error: "Cannot update post" });
    }
});
exports.updatePost = updatePost;
const patchPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const updatedPost = yield prisma.post.update({
            where: { id: Number(req.params.id) },
            data: body,
        });
        res.send(updatedPost);
    }
    catch (error) {
        res.status(400).send({ error: "Cannot patch post" });
    }
});
exports.patchPost = patchPost;
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.post.delete({ where: { id: Number(req.params.id) } });
        res.send({ message: "Post deleted successfully" });
    }
    catch (error) {
        res.status(400).send({ error: "Cannot delete post" });
    }
});
exports.deletePost = deletePost;
