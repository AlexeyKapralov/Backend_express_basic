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
exports.newPasswordController = void 0;
const resultStatus_type_1 = require("../../../common/types/resultStatus.type");
const http_status_codes_1 = require("http-status-codes");
const authCompositionRoot_1 = require("../authCompositionRoot");
const newPasswordController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newPassword = req.body.newPassword;
    const recoveryCode = req.body.recoveryCode;
    const updatedPasswordStatus = yield authCompositionRoot_1.authService.setNewPassword(recoveryCode, newPassword);
    if (updatedPasswordStatus.status === resultStatus_type_1.ResultStatus.Success) {
        res.status(http_status_codes_1.StatusCodes.NO_CONTENT).send();
        return;
    }
    res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send();
});
exports.newPasswordController = newPasswordController;
