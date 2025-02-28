"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const access_token_1 = require("../middleware/access_token");
const validate_1 = require("../middleware/validate"); // นำเข้า middleware
const user_1 = require("../schemas/user");
const users_1 = require("../controllers/users");
const router = (0, express_1.Router)();
router.get("/", access_token_1.verifyToken, (0, validate_1.validate)(user_1.onQueryAllUsersSchema), users_1.getAllUsers);
router.get("/:id", access_token_1.verifyToken, (0, validate_1.validate)(user_1.onRequestIDSchema), users_1.getUsersByID);
router.post("/", access_token_1.verifyToken, (0, validate_1.validate)(user_1.onCreateUsersSchema), users_1.createUser);
router.put("/:id", access_token_1.verifyToken, (0, validate_1.validate)(user_1.onUpdateUsersSchema), users_1.updateUser);
router.patch("/:id", access_token_1.verifyToken, (0, validate_1.validate)(user_1.onPatchUsersSchema), users_1.patchUser);
router.delete("/:id", access_token_1.verifyToken, (0, validate_1.validate)(user_1.onRequestIDSchema), users_1.deleteUser);
exports.default = router;
