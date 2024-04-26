"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const http_status_codes_1 = require("http-status-codes");
const settings_1 = require("../common/config/settings");
const authMiddleware = (req, res, next) => {
    const auth = req.headers['authorization'];
    if (!auth) {
        res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({});
        return;
    }
    const buff = Buffer.from(auth.slice(5), 'base64');
    const decodedAuth = buff.toString('utf-8');
    if (decodedAuth !== settings_1.SETTINGS.ADMIN_AUTH || auth.slice(0, 5) !== 'Basic') {
        res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({});
        return;
    }
    next();
};
exports.authMiddleware = authMiddleware;
