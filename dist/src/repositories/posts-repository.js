"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRepository = void 0;
const db_1 = require("../db/db");
const blogs_repository_1 = require("./blogs-repository");
exports.postsRepository = {
    getPosts(title) {
        let foundPosts = db_1.db.posts;
        if (title) {
            foundPosts = foundPosts.filter(c => c.title.indexOf(title) > -1);
        }
        return foundPosts;
    },
    createPost(data) {
        const posts = db_1.db.posts;
        const foundedBlog = blogs_repository_1.blogsRepository.getBlogById(data.blogId);
        if (foundedBlog) {
            const newPost = {
                id: String(+new Date()),
                title: data.title,
                shortDescription: data.shortDescription,
                blogId: data.blogId,
                content: data.content,
                blogName: foundedBlog.name
            };
            posts.push(newPost);
            return newPost;
        }
        else {
            return undefined;
        }
    },
    updatePost(id, data) {
        if (data) {
            const foundedPost = db_1.db.posts.find(i => i.id === id);
            if (!foundedPost) {
                return false;
            }
            foundedPost.title = data.title;
            foundedPost.shortDescription = data.shortDescription;
            foundedPost.content = data.content;
            foundedPost.blogId = data.blogId;
            return true;
        }
    },
    deletePost(id) {
        const isFound = db_1.db.posts.find(c => c.id === id);
        db_1.db.posts = db_1.db.posts.filter(c => c.id !== id);
        return !!isFound;
    },
    getPostById(id) {
        return db_1.db.posts.find(c => c.id === id);
    }
};
