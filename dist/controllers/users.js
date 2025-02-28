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
exports.deleteUser = exports.patchUser = exports.updateUser = exports.createUser = exports.getUsersByID = exports.getAllUsers = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, pageSize, search } = req.query;
        const pageNumber = parseInt(page, 10) || 1;
        const pageSizeNumber = parseInt(pageSize, 10) || 10;
        const skip = (pageNumber - 1) * pageSizeNumber;
        const take = pageSizeNumber;
        const where = search
            ? {
                OR: [
                    { name: { contains: search } },
                    { email: { contains: search } },
                    { phone: { contains: search } },
                    { website: { contains: search } },
                ],
            }
            : {};
        const totalUsers = yield prisma.user.count({ where });
        const totalPages = Math.ceil(totalUsers / pageSizeNumber);
        const results = yield prisma.user.findMany({
            where,
            skip,
            take,
            include: {
                posts: true,
            },
        });
        res.status(200).json({
            currentPage: pageNumber,
            totalPages: totalPages,
            pageSize: pageSizeNumber,
            total: totalUsers,
            data: results,
        });
    }
    catch (error) {
        console.error("Error fetching users:", error);
        res.status(400).send({ error: "Cannot get users" });
    }
});
exports.getAllUsers = getAllUsers;
const getUsersByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma.user.findUnique({
            where: { id: Number(req.params.id) },
        });
        if (user) {
            res.status(200).send(user);
        }
        else {
            res.status(400).send({ error: "User not found" });
        }
    }
    catch (error) {
        res.status(400).send({ error: "Cannot get user" });
    }
});
exports.getUsersByID = getUsersByID;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = yield prisma.user.create({
            data: Object.assign({}, req.body),
        });
        res.status(201).send(newUser);
    }
    catch (error) {
        res.status(400).send({ error: "Cannot create user" });
    }
});
exports.createUser = createUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        if (body.id) {
            delete body.id;
        }
        const updatedUser = yield prisma.user.update({
            where: { id: Number(req.params.id) },
            data: req.body,
        });
        res.send(updatedUser);
    }
    catch (error) {
        res.status(400).send({ error: "Cannot update user" });
    }
});
exports.updateUser = updateUser;
const patchUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const updatedUser = yield prisma.user.update({
            where: { id: Number(req.params.id) },
            data: body,
        });
        res.send(updatedUser);
    }
    catch (error) {
        res.status(400).send({ error: "Cannot patch user" });
    }
});
exports.patchUser = patchUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.user.delete({ where: { id: Number(req.params.id) } });
        res.send({ message: "User deleted successfully" });
    }
    catch (error) {
        res.status(400).send({ error: "Cannot delete user" });
    }
});
exports.deleteUser = deleteUser;
