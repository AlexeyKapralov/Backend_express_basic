"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testRouter = void 0;
const express_1 = require("express");
const utils_1 = require("../../utils/utils");
const db_1 = require("../../db/db");
exports.testRouter = (0, express_1.Router)({});
exports.testRouter.delete('/', (req, res) => {
    db_1.db.blogs = [];
    db_1.db.posts = [];
    res.sendStatus(utils_1.HTTP_STATUSES.NO_CONTENT_204);
});
