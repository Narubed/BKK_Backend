import { Router } from "express";
import { requiresAuth } from "express-openid-connect";
import { verifyToken } from "../middleware/access_token";
import { validate } from "../middleware/validate"; // นำเข้า middleware
import {
  onQueryAllUsersSchema,
  onCreateUsersSchema,
  onUpdateUsersSchema,
  onRequestIDSchema,
  onPatchUsersSchema,
} from "../schemas/user";
import {
  getAllUsers,
  getUsersByID,
  createUser,
  updateUser,
  patchUser,
  deleteUser,
} from "../controllers/users";

const router = Router();

router.get("/", verifyToken, validate(onQueryAllUsersSchema), getAllUsers);
router.get("/:id", verifyToken, validate(onRequestIDSchema), getUsersByID);
router.post("/", verifyToken, validate(onCreateUsersSchema), createUser);
router.put("/:id", verifyToken, validate(onUpdateUsersSchema), updateUser);
router.patch("/:id", verifyToken, validate(onPatchUsersSchema), patchUser);
router.delete("/:id", verifyToken, validate(onRequestIDSchema), deleteUser);

export default router;
