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
exports.loginController = void 0;
const http_status_codes_1 = require("http-status-codes");
const resultStatus_type_1 = require("../../../common/types/resultStatus.type");
const date_fns_1 = require("date-fns");
const authCompositionRoot_1 = require("../authCompositionRoot");
const loginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield authCompositionRoot_1.authService.loginUser(req.body, req.headers['user-agent'] || 'unknown Device Name', req.ip || 'Unknown IP');
    result.status === resultStatus_type_1.ResultStatus.Success
        ? res
            .cookie('refreshToken', result.data.refreshToken, {
            httpOnly: true,
            secure: true,
            expires: (0, date_fns_1.addSeconds)(new Date(), 20)
        })
            .status(http_status_codes_1.StatusCodes.OK).json({
            accessToken: result.data.accessToken
        })
        : res
            .status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send();
});
exports.loginController = loginController;
