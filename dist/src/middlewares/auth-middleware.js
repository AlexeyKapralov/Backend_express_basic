"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const utils_1 = require("../utils/utils");
const settings_1 = require("../settings");
const authMiddleware = (req, res, next) => {
    const auth = req.headers['authorization'];
    if (!auth) {
        res
            .status(utils_1.HTTP_STATUSES.UNAUTHORIZED_401)
            .json({});
        return;
    }
    const buff = Buffer.from(auth.slice(5), "base64");
    const decodedAuth = buff.toString('utf-8');
    if (decodedAuth !== settings_1.SETTINGS.ADMIN_AUTH || auth.slice(0, 5) !== 'Basic') {
        res
            .status(utils_1.HTTP_STATUSES.UNAUTHORIZED_401)
            .json({});
        return;
    }
    next();
};
exports.authMiddleware = authMiddleware;
