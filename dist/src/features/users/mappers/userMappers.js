"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserInfo = exports.getUserViewModel = void 0;
const getUserViewModel = (data) => {
    return {
        id: data._id,
        login: data.login,
        email: data.email,
        createdAt: data.createdAt,
    };
};
exports.getUserViewModel = getUserViewModel;
const getUserInfo = (user) => {
    return {
        userId: user.id,
        email: user.email,
        login: user.login
    };
};
exports.getUserInfo = getUserInfo;
