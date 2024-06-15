import {IBlogInputModel, IBlogPostInputModel} from '../models/blogInput.model'
import {ResultType} from '../../../common/types/result.type'
import {IBlogViewModel} from '../models/blogView.model'
import {ResultStatus} from '../../../common/types/resultStatus.type'
import {IPostViewModel} from '../../posts/models/postView.model'
import {getBlogViewModel} from "../mappers/blogsMappers";
import {BlogsRepository} from "../repository/blogs.repository";
import {PostsRepository} from "../../posts/repository/posts.repository";
import {inject, injectable} from "inversify";

@injectable()
export class BlogsService {

	constructor(
		@inject(BlogsRepository) protected blogsRepository: BlogsRepository,
		@inject(PostsRepository) protected postsRepository: PostsRepository
	) {}

	async createBlog(body: IBlogInputModel): Promise<ResultType<IBlogViewModel | null>> {

		const createdBlog = await this.blogsRepository.createBlog(body)

		return createdBlog ? {
			status: ResultStatus.Success,
			data: getBlogViewModel(createdBlog)
		} : {
			status: ResultStatus.NotFound,
			errorMessage: 'blog did not found',
			data: null
		}
	}
	async updateBlogByID(id: string, body: IBlogInputModel): Promise<ResultType> {
		const result = await this.blogsRepository.updateBlogByID(id, body)
		return result
			? {
				status: ResultStatus.Success,
				data: null
			}
			: {
				status: ResultStatus.NotFound,
				data: null
			}
	}
	async deleteBlogByID(id: string): Promise<ResultType> {
		return await this.blogsRepository.deleteBlogByID(id)
			? {
				status: ResultStatus.Success,
				data:null
			}
			: {
				status: ResultStatus.NotFound,
				data:null
			}
	}
	async createPostByBlogId(blogId: string, body: IBlogPostInputModel): Promise<ResultType<IPostViewModel | null>> {
		const newBody = {
			title: body.title,
			shortDescription: body.shortDescription,
			content: body.content,
			blogId: blogId
		}
		const foundBlog = await this.blogsRepository.getBlogByID(blogId)
		if (!foundBlog) {
			return {
				status: ResultStatus.NotFound,
				data: null
			}
		}

		const createdPost = await this.postsRepository.createPost(newBody, foundBlog.name)
		return createdPost
			? {
				status: ResultStatus.Success,
				data: createdPost
			}
			: {
				status: ResultStatus.BadRequest,
				data: null
			}
	}
}