"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTestRouter = void 0;
const express_1 = require("express");
const utils_1 = require("../../utils/utils");
const getTestRouter = (db) => {
    const testRouter = (0, express_1.Router)({});
    testRouter.delete('/', (req, res) => {
        db.blogs = [];
        res.sendStatus(utils_1.HTTP_STATUSES.NO_CONTENT_204);
    });
    return testRouter;
};
exports.getTestRouter = getTestRouter;
