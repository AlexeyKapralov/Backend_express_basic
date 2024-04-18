import {blogsCollection, BlogType} from "../db/db";

export const blogsQueryRepository = {
    async findManyBlogs() {
        return await blogsCollection.find().toArray() as BlogType[]
    }

}