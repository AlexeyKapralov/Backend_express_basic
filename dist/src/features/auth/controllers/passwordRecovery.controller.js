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
exports.passwordRecoveryController = void 0;
const usersQuery_repository_1 = require("../../users/repository/usersQuery.repository");
const http_status_codes_1 = require("http-status-codes");
const resultStatus_type_1 = require("../../../common/types/resultStatus.type");
const authCompositionRoot_1 = require("../authCompositionRoot");
const passwordRecoveryController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const user = yield usersQuery_repository_1.usersQueryRepository.findUserByLoginOrEmail(email);
    if (!user) {
        res.status(http_status_codes_1.StatusCodes.NO_CONTENT).json();
        return;
    }
    const recoveryStatus = yield authCompositionRoot_1.authService.recoveryPassword(email);
    switch (recoveryStatus.status) {
        case resultStatus_type_1.ResultStatus.NotFound: // if (x === 'value1')
            res.status(http_status_codes_1.StatusCodes.NO_CONTENT).send();
            break;
        case resultStatus_type_1.ResultStatus.BadRequest:
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send();
            break;
        default:
            res.status(http_status_codes_1.StatusCodes.NO_CONTENT).send();
            break;
    }
});
exports.passwordRecoveryController = passwordRecoveryController;
