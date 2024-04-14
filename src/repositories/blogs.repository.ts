import {blogsCollection, BlogType} from '../db/db'
import {BlogInputModelType} from '../features/blogs/models/blogInputModelType'
import {BlogViewModelType} from '../features/blogs/models/blogViewModelType'
import {ObjectId} from 'mongodb'

const getBlogViewModel = (dbBlog: BlogType): BlogViewModelType => {
    return {
        id: dbBlog._id,
        name: dbBlog.name,
        description: dbBlog.description,
        websiteUrl: dbBlog.websiteUrl,
        createdAt: dbBlog.createdAt,
        isMembership: dbBlog.isMembership
    }
}

export const blogsRepository = {
    async getBlogs(query?: BlogInputModelType): Promise<BlogViewModelType[]> {
        if (query) {
            const result: BlogType[] = await blogsCollection
                .find({
                    name: {$regex: query.name || ''},
                    description: {$regex: query.description || ''},
                    websiteUrl: {$regex: query.websiteUrl || ''}
                })
                // .project({
                // 	_id: 0
                // })
                .toArray()
            return result.map((i: BlogType) => getBlogViewModel(i))
        } else {
            const result: BlogType[] = await blogsCollection
                .find({})
                .toArray()
            return result.map((i: BlogType) => getBlogViewModel(i))
        }

    },

    async getBlogsById(id: string): Promise<BlogViewModelType | false> {
        const result = (await blogsCollection.findOne({_id: id})) as BlogType

        if (result) {
            return getBlogViewModel(result)
        } else {
            return false
        }
    },

    async createBlog(data: BlogInputModelType): Promise<BlogViewModelType> {
        const newBlog: BlogType = {
            _id: String(new ObjectId()),
            name: data.name,
            description: data.description,
            websiteUrl: data.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }

        await blogsCollection.insertOne(newBlog)

        return getBlogViewModel(newBlog)
    },

    async updateBlog(data: BlogInputModelType, id: string): Promise<boolean> {
        const foundBlog = await blogsCollection.findOne({_id: id})

        const isUpdated = await blogsCollection.updateOne(
            {_id: id},
            {
                $set: {
                    name: data.name || foundBlog?.name,
                    description: data.description || foundBlog?.description,
                    websiteUrl: data.websiteUrl || foundBlog?.websiteUrl
                }
            }
        )

        return isUpdated.matchedCount !== 0
    },

    async deleteBlog(id: string): Promise<boolean> {
        const result = await blogsCollection.deleteOne({_id: id})
        if (result.deletedCount !== 0) {
            return true
        } else {
            return false
        }
    }
}
