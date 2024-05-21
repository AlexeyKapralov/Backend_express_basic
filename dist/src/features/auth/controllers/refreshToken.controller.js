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
exports.refreshTokenController = void 0;
const login_service_1 = require("../../../service/login.service");
const resultStatus_type_1 = require("../../../common/types/resultStatus.type");
const http_status_codes_1 = require("http-status-codes");
const date_fns_1 = require("date-fns");
const refreshTokenController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    const result = yield login_service_1.loginService.refreshToken(refreshToken);
    if (result.status === resultStatus_type_1.ResultStatus.Success) {
        res.status(http_status_codes_1.StatusCodes.OK)
            .cookie('refreshToken', result.data.refreshToken, { httpOnly: true, secure: true, expires: (0, date_fns_1.addSeconds)(new Date(), 20) })
            .json({ accessToken: result.data.accessToken });
    }
    else {
        res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json();
    }
});
exports.refreshTokenController = refreshTokenController;