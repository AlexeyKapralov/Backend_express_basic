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
    },
    getBlogById(id) {
        let foundBlogs = db_1.db.blogs;
        let result = foundBlogs.find(item => item.id === id);
        if (result) {
            return result;
        }
        else {
            return undefined;
        }
    },
    createBlog(name, description, websiteUrl) {
        const newBlog = {
            id: String(+(new Date())),
            name,
            description,
            websiteUrl,
        };
        //push in db
        db_1.db.blogs.push(newBlog);
        return newBlog;
    },
    updateBlog(id, data) {
        const foundedBlog = db_1.db.blogs.find(i => i.id === id);
        if (foundedBlog) {
            foundedBlog.name = data.name;
            foundedBlog.description = data.description;
            foundedBlog.websiteUrl = data.websiteUrl;
            return true;
        }
        else {
            return false;
        }
    },
    deleteBlog(id) {
        db_1.db.blogs = db_1.db.blogs.filter(c => c.id !== id);
        return true;
    }
};
