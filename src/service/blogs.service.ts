import {IBlogInputModel, IBlogPostInputModel} from "../features/blogs/models/blogInput.model";
import {IBlogDbModel} from "../features/blogs/models/blogDb.model";
import {ObjectId} from "mongodb";
import {blogsRepository} from "../repositories/blogs/blogs.repository";
import {getBlogViewModel} from "../common/utils/mappers";
import {IPostViewModel} from "../features/posts/models/postView.model";
import {postsRepository} from "../repositories/posts/posts.repository";
import {ResultType} from "../common/types/result.type";
import {IBlogViewModel} from "../features/blogs/models/blogView.model";
import {ResultStatus} from "../common/types/resultStatus.type";

//TODO: переписать всё на новый тип Result Type
export const blogsService = {
    async createBlog(body: IBlogInputModel): Promise<ResultType<IBlogViewModel | null>> {
        const blog: IBlogDbModel = {
            _id: new ObjectId().toString(),
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false,
        }
        const result = await blogsRepository.createBlog(blog)

        return result ? {
            status: ResultStatus.Success,
            data: getBlogViewModel(blog)
        } : {
            status: ResultStatus.NotFound,
            errorMessage : 'blog did not find',
            data: null
        }
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
