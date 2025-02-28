"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const express_openid_connect_1 = require("express-openid-connect");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    authRequired: false,
    auth0Logout: true,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    baseURL: process.env.BASE_URL,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    secret: process.env.SESSION_SECRET,
    authorizationParams: {
        response_type: "id_token",
        scope: "openid profile email",
    },
};
exports.authMiddleware = (0, express_openid_connect_1.auth)(config);
//   remark ไว้ถามผู้สัมภาษณ์ว่าทำไมต้องใช้ callback แบบนี้
//   callback: undefined, // turn of callback express-openid-connect
