"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimitMiddleware = void 0;
const http_status_codes_1 = require("http-status-codes");
const date_fns_1 = require("date-fns");
const rateLimits_entity_1 = require("../features/rateLimits/domain/rateLimits.entity");
const rateLimitMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const ip = req.ip || '';
    const url = req.url;
    const dateRequest = (0, date_fns_1.addSeconds)(new Date(), -10);
    //todo возможно стоит переписать чтобы здесь не было обращения к бд а сделать через сервис
    const limitRequest = yield rateLimits_entity_1.RateLimitModel.find({ ip, url, date: { $gt: dateRequest } }).lean();
    if (limitRequest.length >= 5) {
        res.status(http_status_codes_1.StatusCodes.TOO_MANY_REQUESTS).send();
        return;
    }
    yield rateLimits_entity_1.RateLimitModel.create({ ip, url, date: new Date() });
    next();
});
exports.rateLimitMiddleware = rateLimitMiddleware;
