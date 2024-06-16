"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newestLikeMapper = void 0;
const newestLikeMapper = (likesDTO) => {
    return {
        addedAt: likesDTO.addedAt,
        userId: likesDTO.userId,
        login: likesDTO.login
    };
};
exports.newestLikeMapper = newestLikeMapper;
