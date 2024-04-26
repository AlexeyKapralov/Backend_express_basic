"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const loginController_1 = require("./controllers/loginController");
exports.authRouter = (0, express_1.Router)({});
exports.authRouter.post('/login', loginController_1.loginController);
