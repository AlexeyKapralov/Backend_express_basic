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
const resultStatus_type_1 = require("../../../common/types/resultStatus.type");
const http_status_codes_1 = require("http-status-codes");
const generators_1 = require("../../../common/utils/generators");
const jwt_service_1 = require("../../../common/adapters/jwt.service");
const authCompositionRoot_1 = require("../authCompositionRoot");
const refreshTokenController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    const tokenPayload = jwt_service_1.jwtService.verifyAndDecodeToken(refreshToken);
    if (!tokenPayload) {
        res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json();
        return;
    }
    const result = yield authCompositionRoot_1.authService.refreshToken(tokenPayload.deviceId, tokenPayload.userId, tokenPayload.iat);
    if (result.status === resultStatus_type_1.ResultStatus.Success) {
        (0, generators_1.setCookie)(res, result.data.refreshToken);
        res.status(http_status_codes_1.StatusCodes.OK)
            .send({ accessToken: result.data.accessToken });
    }
    else {
        res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json();
    }
});
exports.refreshTokenController = refreshTokenController;
