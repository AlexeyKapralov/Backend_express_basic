import { IPostInputModel } from '../models/postInput.model'
import { postsRepository } from '../repository/posts.repository'
import { ICommentInputModel } from '../../comments/models/commentInput.model'
import { ResultType } from '../../../common/types/result.type'
import { ICommentViewModel } from '../../comments/models/commentView.model'
import { commentsRepository } from '../../comments/repository/comments.repository'
import { ResultStatus } from '../../../common/types/resultStatus.type'
import { IPostViewModel } from '../models/postView.model'
import {usersRepository} from "../../users/repository/users.repository";
import {getCommentView} from "../../comments/mappers/commentsMappers";
import {blogsRepository} from "../../blogs/repository/blogs.repository";

export const postsService = {
	async createPost(body: IPostInputModel): Promise<ResultType<IPostViewModel | null>> {
		const foundBlog = await blogsRepository.getBlogByID(body.blogId)

		if (!foundBlog) {
			return {
				status: ResultStatus.NotFound,
				data: null
			}
		}
		const result = await postsRepository.createPost(body, foundBlog.name)
		return result
			? {
				status: ResultStatus.Success,
				data: result
			}
			: {
				status: ResultStatus.BadRequest,
				data: null
			}

	},
	async updatePost(id: string, body: IPostInputModel):Promise<ResultType> {
		return await postsRepository.updatePost(id, body)
			? {
				status: ResultStatus.Success,
				data: null
			}
			: {
				status: ResultStatus.BadRequest,
				data: null
			}
	},
	async deletePost(id: string):Promise<ResultType> {
		return await postsRepository.deletePost(id)
			? {
				status: ResultStatus.Success,
				data: null
			}
			: {
				status: ResultStatus.BadRequest,
				data: null
			}
	},
	async createComment(userId: string, postId: string, body: ICommentInputModel): Promise<ResultType<ICommentViewModel | null>> {
		const post = await postsRepository.getPostById(postId)
		const user = await usersRepository.findUserById(userId)

		if (post && user) {
			const res = await commentsRepository.createComment(user, post, body)
			return res
				? {
					status: ResultStatus.Success,
					data: getCommentView(res)
				}
				: {
					status: ResultStatus.BadRequest,
					data: null
				}
		} else {
			return {
				status: ResultStatus.NotFound,
				data: null
			}
		}
	}
}