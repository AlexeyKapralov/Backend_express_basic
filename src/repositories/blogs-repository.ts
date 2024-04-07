import {BlogType, db} from "../db/db";
import {BlogInputModel} from "../features/blogs/models/BlogInputModel";

export const blogsRepository = {
    getBlogs(name: string | null | undefined) {
        let foundBlogs = db.blogs

        if (name) {
            foundBlogs = foundBlogs.filter(c => c.name.indexOf(name) > -1)
        }
        return foundBlogs
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

    createBlog(name: string, description: string, websiteUrl: string) {

        const newBlog: BlogType = {
            id: String(+(new Date())),
            name,
            description,
            websiteUrl,
        }

        //push in db
        db.blogs.push(newBlog)
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