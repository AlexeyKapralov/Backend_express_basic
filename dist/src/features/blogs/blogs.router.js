"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogsRouter = void 0;
const express_1 = require("express");
const getBlogsController_1 = require("./getBlogsController");
exports.BlogsRouter = (0, express_1.Router)({});
exports.BlogsRouter.get('/', getBlogsController_1.getBlogsController);
