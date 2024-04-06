"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRepository = void 0;
const db_1 = require("../db/db");
exports.blogsRepository = {
    getBlogs(name) {
        let foundBlogs = db_1.db.blogs;
        if (name) {
            foundBlogs = foundBlogs.filter(c => c.name.indexOf(name) > -1);
        }
        return foundBlogs;
    }
};
