import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";


interface CustomRequest extends Request {
  user?: any;
}


const client = jwksClient({
  jwksUri: "https://dev-yg.us.auth0.com/.well-known/jwks.json", // เปลี่ยนให้ตรงกับของคุณ
});
// ลักไก่เพื่อให้รับข้อมูล key จาก Auth0
const getKey = (header: any, callback: any) => {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      return callback(err, null);
    }
    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
};

export const verifyToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];
  console.log("token =>", token)
  jwt.verify(token, getKey, { algorithms: ["RS256"] }, (err, decoded) => {
    if (err) {
      console.log("THI SIS err =>", err)
      res.status(401).json({ message: "Unauthorized: Invalid token" });
      return;
    }

    req.user = decoded; // เพิ่มข้อมูล user เข้าไปใน request
    next(); // เรียกต่อไปยัง route ถัดไป
  });
};
