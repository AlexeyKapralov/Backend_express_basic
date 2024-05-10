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
exports.getPostsByBlogIDController = void 0;
const blogsQuery_repository_1 = require("../../../repositories/blogs/blogsQuery.repository");
const http_status_codes_1 = require("http-status-codes");
const mappers_1 = require("../../../common/utils/mappers");
const getPostsByBlogIDController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = (0, mappers_1.getQueryParams)(req.query);
    const result = yield blogsQuery_repository_1.blogsQueryRepository.getPostsByBlogID(req.params.id, query);
    result ? res.status(http_status_codes_1.StatusCodes.OK).json(result) : res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json();
});
exports.getPostsByBlogIDController = getPostsByBlogIDController;
