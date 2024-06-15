"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.likePostsMapper = void 0;
const likePostsMapper = (likesDTO) => {
    return {
        addedAt: likesDTO.addedAt,
        userId: likesDTO.userId,
        login: likesDTO.login
    };
};
exports.likePostsMapper = likePostsMapper;
