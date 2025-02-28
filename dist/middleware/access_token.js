"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwks_rsa_1 = __importDefault(require("jwks-rsa"));
const client = (0, jwks_rsa_1.default)({
    jwksUri: "https://dev-yg.us.auth0.com/.well-known/jwks.json", // เปลี่ยนให้ตรงกับของคุณ
});
// ลักไก่เพื่อให้รับข้อมูล key จาก Auth0
const getKey = (header, callback) => {
    client.getSigningKey(header.kid, (err, key) => {
        if (err) {
            return callback(err, null);
        }
        const signingKey = key === null || key === void 0 ? void 0 : key.getPublicKey();
        callback(null, signingKey);
    });
};
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ message: "Unauthorized: No token provided" });
        return;
    }
    const token = authHeader.split(" ")[1];
    console.log("token =>", token);
    jsonwebtoken_1.default.verify(token, getKey, { algorithms: ["RS256"] }, (err, decoded) => {
        if (err) {
            console.log("THI SIS err =>", err);
            res.status(401).json({ message: "Unauthorized: Invalid token" });
            return;
        }
        req.user = decoded; // เพิ่มข้อมูล user เข้าไปใน request
        next(); // เรียกต่อไปยัง route ถัดไป
    });
};
exports.verifyToken = verifyToken;
