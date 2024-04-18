import {blogsCollection, BlogType} from "../db/db";

export const blogsRepository = {
    async findBlogs() {
        return await blogsCollection.find().toArray() as BlogType[]
    }

}