"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlogViewModel = void 0;
const getBlogViewModel = (data) => {
    return {
        id: data._id,
        name: data.name,
        description: data.description,
        websiteUrl: data.websiteUrl,
        createdAt: data.createdAt,
        isMembership: data.isMembership
    };
};
exports.getBlogViewModel = getBlogViewModel;
