import { auth } from "express-openid-connect";
import dotenv from "dotenv";

dotenv.config();

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
export const authMiddleware = auth(config);
  //   remark ไว้ถามผู้สัมภาษณ์ว่าทำไมต้องใช้ callback แบบนี้
  //   callback: undefined, // turn of callback express-openid-connect
