import {IBlogInputModel, IBlogPostInputModel} from "../features/blogs/models/blogInput.model";
import {IBlogDbModel} from "../features/blogs/models/blogDb.model";
import {ObjectId} from "mongodb";
import {blogsRepository} from "../repositories/blogs/blogs.repository";
import {getBlogViewModel} from "../common/utils/mappers";
import {IPostViewModel} from "../features/posts/models/postView.model";
import {postsRepository} from "../repositories/posts/posts.repository";

export const blogsService = {
    async createBlog(body: IBlogInputModel) {
        const blog: IBlogDbModel = {
            _id: new ObjectId().toString(),
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false,
        }


        return await blogsRepository.createBlog(blog) ? getBlogViewModel(blog) : undefined
    },
    async updateBlogByID(id: string, body: IBlogInputModel): Promise<boolean> {
        return await blogsRepository.updateBlogByID(id, body)
    },
    async deleteBlogByID(id: string): Promise<boolean> {
        return await blogsRepository.deleteBlogByID(id)
    },
    async createPostByBlogId(blogId: string, body: IBlogPostInputModel): Promise<IPostViewModel | undefined> {
        const newBody = {
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: blogId,
        }
        return await postsRepository.createPost(newBody)
    }
}
