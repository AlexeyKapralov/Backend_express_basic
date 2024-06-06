"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsService = void 0;
const comments_service_1 = require("./service/comments.service");
const users_repository_1 = require("../users/repository/users.repository");
const comments_repository_1 = require("./repository/comments.repository");
const usersRepository = new users_repository_1.UsersRepository();
const commentsRepository = new comments_repository_1.CommentsRepository();
exports.commentsService = new comments_service_1.CommentsService(usersRepository, commentsRepository);
