import {blogsCollection, BlogType} from "../db/db";
import {BlogInputModelType} from "../features/blogs/models/blogInputModelType";
import {BlogViewModelType} from "../features/blogs/models/blogViewModelType";
import {ObjectId} from "mongodb";

export const blogsRepository = {
    async getBlogs(query?: BlogInputModelType): Promise<BlogType[]> {
        if (query) {
            return await blogsCollection
                .find({
                    name: {$regex: query.name || ''},
                    description: {$regex: query.description || ''},
                    websiteUrl: {$regex: query.websiteUrl || ''}
                })
                .project({
                    _id: 0
                }).toArray() as BlogType[]
        } else {
            return await blogsCollection.find({})
                .project({
                        _id: 0
                    }
                )
                .toArray() as BlogType[]
        }

    },

    async createBlog(data: BlogInputModelType): Promise<BlogViewModelType> {

        const newBlog: BlogType = {
            id: String(new ObjectId()),
            name: data.name,
            description: data.description,
            websiteUrl: data.websiteUrl,
            createdAt: new Date().toISOString() ,
            isMembership: false
        }


        await blogsCollection.insertOne(newBlog)
        return newBlog
    }
}