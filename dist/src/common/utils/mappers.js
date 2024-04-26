"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserViewModel = void 0;
const getUserViewModel = (data) => {
    return {
        id: data._id,
        login: data.login,
        email: data.email,
        createdAt: data.createdAt,
        password: data.password
    };
};
exports.getUserViewModel = getUserViewModel;
