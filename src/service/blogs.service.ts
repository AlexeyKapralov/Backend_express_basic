import { IBlogInputModel, IBlogPostInputModel } from '../features/blogs/models/blogInput.model'
import { IBlogDbModel } from '../features/blogs/models/blogDb.model'
import { ObjectId } from 'mongodb'
import { blogsRepository } from '../repositories/blogs/blogs.repository'
import { getBlogViewModel } from '../common/utils/mappers'
import { postsRepository } from '../repositories/posts/posts.repository'
import { ResultType } from '../common/types/result.type'
import { IBlogViewModel } from '../features/blogs/models/blogView.model'
import { ResultStatus } from '../common/types/resultStatus.type'
import { IPostViewModel } from '../features/posts/models/postView.model'

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
		const result = await postsRepository.createPost(newBody)
		return result
			? {
				status: ResultStatus.Success,
				data: result
			}
			: {
				status: ResultStatus.BadRequest,
				data: null
			}
	}
}
