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
exports.blogsRepository = void 0;
const db_1 = require("../db/db");
exports.blogsRepository = {
    getBlogs(name) {
        return __awaiter(this, void 0, void 0, function* () {
            // let foundBlogs = db.blogs
            // if (name) {
            //     foundBlogs = foundBlogs.filter(c => c.name.indexOf(name) > -1)
            // }
            // return foundBlogs
            if (name) {
                return yield db_1.blogsCollection.find({ name: { $regex: name } }).toArray();
            }
            else {
                return yield db_1.blogsCollection.find({}).toArray();
            }
        });
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
        return __awaiter(this, void 0, void 0, function* () {
            const newBlog = {
                id: String(+(new Date())),
                name,
                description,
                websiteUrl,
            };
            yield db_1.blogsCollection.insertOne(newBlog);
            return newBlog;
        });
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
        const foundedBlog = db_1.db.blogs.find(i => i.id === id);
        if (foundedBlog) {
            db_1.db.blogs = db_1.db.blogs.filter(c => c.id !== id);
            return true;
        }
        else {
            return false;
        }
    }
};
