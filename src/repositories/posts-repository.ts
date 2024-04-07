import {db} from "../db/db";
import {PostInputModel} from "../features/posts/models/PostInputModel";
import {PostViewModel} from "../features/posts/models/PostViewModel";
import {blogsRepository} from "./blogs-repository";

export const postsRepository = {
    getPosts(title: string | null | undefined) {
        let foundPosts = db.posts

        if (title) {
            foundPosts = foundPosts.filter(c => c.title.indexOf(title) > -1)
        }
        return foundPosts
    },

    createPost(data: PostInputModel): PostViewModel | undefined {
        const posts = db.posts

        const foundedBlog = blogsRepository.getBlogById(data.blogId)

        if (foundedBlog) {
            const newPost: PostViewModel = {
                id: String(+new Date()),
                title: data.title,
                shortDescription: data.shortDescription,
                blogId: data.blogId,
                content: data.content,
                blogName: foundedBlog.name
            }
            posts.push(newPost)
            return newPost
        } else {
            return undefined
        }


    },

    updatePost(id: string, data: PostInputModel) {
        if (data) {
            const foundedPost = db.posts.find(i => i.id === id)
            if (!foundedPost) {
                return false
            }
            foundedPost.title = data.title
            foundedPost.shortDescription = data.shortDescription
            foundedPost.content = data.content
            foundedPost.blogId = data.blogId
            return true
        }
    },

    deletePost(id: string) {
        const isFound = db.posts.find(c => c.id === id)
        db.posts = db.posts.filter(c => c.id !== id)

        return !!isFound;

    },

    getPostById(id: string) {
        return db.posts.find(c => c.id === id)
    }
}