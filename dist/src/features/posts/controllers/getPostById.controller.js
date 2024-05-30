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
exports.getPostByIdController = void 0;
const postsQuery_repository_1 = require("../repository/postsQuery.repository");
const http_status_codes_1 = require("http-status-codes");
const getPostByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield postsQuery_repository_1.postsQueryRepository.getPostById(req.params.id);
    result ? res.status(http_status_codes_1.StatusCodes.OK).json(result) : res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json();
});
exports.getPostByIdController = getPostByIdController;
