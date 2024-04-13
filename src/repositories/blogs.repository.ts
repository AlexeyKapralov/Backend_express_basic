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

    async getBlogsById(id: string): Promise<BlogType> {

        return await blogsCollection.findOne({id: id}) as BlogType

    },


    async createBlog(data: BlogInputModelType): Promise<BlogViewModelType> {

        const newBlog: BlogType = {
            id: String(new ObjectId()),
            name: data.name,
            description: data.description,
            websiteUrl: data.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }


        await blogsCollection.insertOne(newBlog)

        return {
            id: newBlog.id,
            name: newBlog.name,
            description: newBlog.description,
            websiteUrl: newBlog.websiteUrl,
            createdAt: newBlog.createdAt,
            isMembership: newBlog.isMembership
        };

    },

    async updateBlog(data: BlogInputModelType, id: string): Promise<boolean> {

        const foundBlog = await blogsCollection.findOne({id: id})

        const isUpdated = await blogsCollection.updateOne(
            {id: id},
            {
                $set:
                    {
                        name: data.name || foundBlog?.name,
                        description: data.description || foundBlog?.description,
                        websiteUrl: data.websiteUrl || foundBlog?.websiteUrl
                    }
            })

        return isUpdated.matchedCount !== 0;
    },

    async deleteBlog(id: string): Promise<boolean> {
        const result = await blogsCollection.deleteOne({id: id})
        return !!result
    }
}