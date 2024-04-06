import {db} from "../db/db";

export const blogsRepository = {
    getBlogs (name: string | null | undefined) {
        let foundBlogs = db.blogs

        if (name) {
            foundBlogs = foundBlogs.filter( c => c.name.indexOf(name) > -1)
        }
        return foundBlogs
    }
}