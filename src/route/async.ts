import express from "express";
import { requiresAuth } from "express-openid-connect";

import { asyncUsersAndPosts } from "../controllers/asyncUserAndPosts";
const router = express.Router();

router.post("/", asyncUsersAndPosts);

export default router;
