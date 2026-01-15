import express from "express";
import { getCurrentUser } from "../middlewares/user.controller.js";
import isAuth from "../middlewares/isAuth.js";
const authRouter = express.Router();

authRouter.get("/current", isAuth, getCurrentUser);

export default authRouter;