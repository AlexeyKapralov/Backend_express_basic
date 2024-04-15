import {blogsCollection, postsCollection, PostType} from '../db/db'
import {ObjectId} from 'mongodb'
import {PostInputModelType} from '../features/posts/models/postInputModelType'
import {PostViewModelType} from '../features/posts/models/postViewModelType'

const getPostViewModel = (dbPost: PostType): PostViewModelType => {
    return {
        id: dbPost._id,
        title: dbPost.title,
        shortDescription: dbPost.shortDescription,
        content: dbPost.content,
        blogId: dbPost.blogId,
        blogName: dbPost.blogName,
        createdAt: dbPost.createdAt
    }
}

export const postsRepository = {
    async getPosts(query?: PostInputModelType): Promise<PostViewModelType[]> {
        if (query) {
            const result: PostType[] = await postsCollection
                .find({
                    title: {$regex: query.title || ''},
                    shortDescription: {$regex: query.shortDescription || ''},
                    content: {$regex: query.content || ''},
                    blogId: {$regex: query.blogId || ''}
                })
                .toArray()
            return result.map((i: PostType) => getPostViewModel(i))
        } else {
            const result: PostType[] = await postsCollection
                .find({})
                .toArray()
            return result.map((i: PostType) => getPostViewModel(i))
        }
    },
    async getPostById(id: string): Promise<PostViewModelType | false> {
        const result = (await postsCollection.findOne({_id: id})) as PostType

        if (result) {
            return getPostViewModel(result)
        } else {
            return false
        }
    },
    async createPost(data: PostInputModelType): Promise<PostViewModelType> {
        const foundBlog = await blogsCollection.findOne({_id: data.blogId})

        const newPost: PostType = {
            _id: String(new ObjectId()),
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            createdAt: new Date().toISOString(),
            blogId: data.blogId,
            blogName: foundBlog!.name //! означает что точно не undefined
        }

        await postsCollection.insertOne(newPost)

        return getPostViewModel(newPost)
    },
    async updatePost(data: PostInputModelType, id: string): Promise<boolean> {
        const foundBlog = await blogsCollection.findOne({_id: data.blogId})
        const isUpdated = await postsCollection.updateOne(
            {_id: id},
            {
                $set: {
                    title: data.title,
                    shortDescription: data.shortDescription,
                    content: data.content,
                    blogId: data.blogId,
                    blogName: foundBlog!.name
                }
            }
        )
        return isUpdated.matchedCount !== 0
    },
    async deletePost(id: string): Promise<boolean> {
        const result = await postsCollection.deleteOne({_id: id})
        return result.deletedCount > 0;
    }
}
