import { Router } from "express";
import { requiresAuth } from "express-openid-connect";
import { verifyToken } from "../middleware/access_token";
import { validate } from "../middleware/validate"; // นำเข้า middleware
import {
  onQueryAllPostsSchema,
  onCreatePostsSchema,
  onUpdatePostsSchema,
  onRequestIDSchema,
  onPatchPostsSchema,
} from "../schemas/post";
import {
  getAllPosts,
  getPostsByID,
  createPost,
  updatePost,
  patchPost,
  deletePost,
} from "../controllers/posts";

const router = Router();

router.get("/", verifyToken, validate(onQueryAllPostsSchema), getAllPosts);
router.get("/:id", verifyToken, validate(onRequestIDSchema), getPostsByID);
router.post("/", verifyToken, validate(onCreatePostsSchema), createPost);
router.put("/:id", verifyToken, validate(onUpdatePostsSchema), updatePost);
router.patch("/:id", verifyToken, validate(onPatchPostsSchema), patchPost);
router.delete("/:id", verifyToken, validate(onRequestIDSchema), deletePost);

export default router;
