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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncUsersAndPosts = asyncUsersAndPosts;
const client_1 = require("@prisma/client");
const axios_1 = __importDefault(require("axios"));
const prisma = new client_1.PrismaClient();
function asyncUsersAndPosts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield axios_1.default.get("https://jsonplaceholder.typicode.com/users");
            for (const user of users.data) {
                yield prisma.user.create({
                    data: {
                        name: user.name,
                        username: user.username,
                        email: user.email,
                        phone: user.phone,
                        website: user.website,
                    },
                });
            }
            const posts = yield axios_1.default.get("https://jsonplaceholder.typicode.com/posts");
            for (const post of posts.data) {
                yield prisma.post.create({
                    data: {
                        title: post.title,
                        body: post.body,
                        userId: post.userId, // ใช้ FK อ้างถึง User
                    },
                });
            }
            console.log("end process success");
            res.send({ success: true, message: 'async data is successfully' });
        }
        catch (error) {
            console.error("error catch", error);
        }
        finally {
            console.log("debug asyncUserAndPosts finally process");
            yield prisma.$disconnect();
        }
    });
}
