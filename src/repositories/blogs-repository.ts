import {blogsCollection, BlogType, db} from "../db/db";
import {BlogInputModel} from "../features/blogs/models/BlogInputModel";

export const blogsRepository = {
    async getBlogs(name: string | null | undefined): Promise<BlogType[]> {
        // let foundBlogs = db.blogs
        // if (name) {
        //     foundBlogs = foundBlogs.filter(c => c.name.indexOf(name) > -1)
        // }
        // return foundBlogs
        if (name) {
            return await blogsCollection.find({name: {$regex: name}}).toArray()
        } else {
            return await blogsCollection.find({}).toArray()
        }
    },

    getBlogById(id: string) {
        let foundBlogs = db.blogs

        let result = foundBlogs.find(item => item.id === id)

        if (result) {
            return result
        } else {
            return undefined
        }

    },

    async createBlog(name: string, description: string, websiteUrl: string): Promise<BlogType> {

        const newBlog: BlogType = {
            id: String(+(new Date())),
            name,
            description,
            websiteUrl,
        }

        await blogsCollection.insertOne(newBlog)
        return newBlog
    },

    updateBlog(id: string, data: BlogInputModel) {
        const foundedBlog = db.blogs.find(i => i.id === id)

        if (foundedBlog) {
            foundedBlog.name = data.name
            foundedBlog.description = data.description
            foundedBlog.websiteUrl = data.websiteUrl
            return true
        } else {
            return false
        }
    },

    deleteBlog(id: string) {

        const foundedBlog = db.blogs.find(i => i.id === id)

        if (foundedBlog) {
            db.blogs = db.blogs.filter(c => c.id !== id)
            return true
        } else {
            return false
        }

    }

}