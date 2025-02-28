"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const access_token_1 = require("../middleware/access_token");
const validate_1 = require("../middleware/validate"); // นำเข้า middleware
const post_1 = require("../schemas/post");
const posts_1 = require("../controllers/posts");
const router = (0, express_1.Router)();
router.get("/", access_token_1.verifyToken, (0, validate_1.validate)(post_1.onQueryAllPostsSchema), posts_1.getAllPosts);
router.get("/:id", access_token_1.verifyToken, (0, validate_1.validate)(post_1.onRequestIDSchema), posts_1.getPostsByID);
router.post("/", access_token_1.verifyToken, (0, validate_1.validate)(post_1.onCreatePostsSchema), posts_1.createPost);
router.put("/:id", access_token_1.verifyToken, (0, validate_1.validate)(post_1.onUpdatePostsSchema), posts_1.updatePost);
router.patch("/:id", access_token_1.verifyToken, (0, validate_1.validate)(post_1.onPatchPostsSchema), posts_1.patchPost);
router.delete("/:id", access_token_1.verifyToken, (0, validate_1.validate)(post_1.onRequestIDSchema), posts_1.deletePost);
exports.default = router;
