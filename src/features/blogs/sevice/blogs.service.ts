import { IBlogInputModel, IBlogPostInputModel } from '../models/blogInput.model'
import { IBlogDbModel } from '../models/blogDb.model'
import { ObjectId } from 'mongodb'
import { blogsRepository } from '../repository/blogs.repository'
import { postsRepository } from '../../posts/repository/posts.repository'
import { ResultType } from '../../../common/types/result.type'
import { IBlogViewModel } from '../models/blogView.model'
import { ResultStatus } from '../../../common/types/resultStatus.type'
import { IPostViewModel } from '../../posts/models/postView.model'
import {getBlogViewModel} from "../mappers/blogsMappers";

export const blogsService = {
	async createBlog(body: IBlogInputModel): Promise<ResultType<IBlogViewModel | null>> {
		const blog: IBlogDbModel = {
			_id: new ObjectId().toString(),
			name: body.name,
			description: body.description,
			websiteUrl: body.websiteUrl,
			createdAt: new Date().toISOString(),
			isMembership: false
		}
		const result = await blogsRepository.createBlog(blog)

		return result ? {
			status: ResultStatus.Success,
			data: getBlogViewModel(blog)
		} : {
			status: ResultStatus.NotFound,
			errorMessage: 'blog did not find',
			data: null
		}
	},
	async updateBlogByID(id: string, body: IBlogInputModel): Promise<ResultType> {
		const result = await blogsRepository.updateBlogByID(id, body)
		return result
			? {
				status: ResultStatus.Success,
				data: null
			}
      : {
        status: ResultStatus.NotFound,
          data: null
      }
	},
	async deleteBlogByID(id: string): Promise<ResultType> {
		return await blogsRepository.deleteBlogByID(id)
			? {
				status: ResultStatus.Success,
				data:null
			}
			: {
				status: ResultStatus.NotFound,
				data:null
			}
	},
	async createPostByBlogId(blogId: string, body: IBlogPostInputModel): Promise<ResultType<IPostViewModel | null>> {
		const newBody = {
			title: body.title,
			shortDescription: body.shortDescription,
			content: body.content,
			blogId: blogId
		}
		const foundBlog = await blogsRepository.getBlogByID(blogId)
		if (!foundBlog) {
			return {
				status: ResultStatus.NotFound,
				data: null
			}
		}

		const createdPost = await postsRepository.createPost(newBody, foundBlog.name)
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