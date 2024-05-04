import { IPostInputModel } from '../features/posts/models/postInput.model'
import { postsRepository } from '../repositories/posts/posts.repository'
import { ICommentInputModel } from '../features/comments/models/commentInput.model'
import { ResultType } from '../common/types/result.type'
import { ICommentViewModel } from '../features/comments/models/commentView.model'
import { postsQueryRepository } from '../repositories/posts/postsQuery.repository'
import { commentsRepository } from '../repositories/comments/comments.repository'
import { ResultStatus } from '../common/types/resultStatus.type'
import { usersQueryRepository } from '../repositories/users/usersQuery.repository'
import { getCommentView } from '../common/utils/mappers'

//TODO: переписать всё на новый тип Result Type
export const postsService = {
	async createPost(body: IPostInputModel) {
		return await postsRepository.createPost(body)
	},
	async updatePost(id: string, body: IPostInputModel) {
		return await postsRepository.updatePost(id, body)
	},
	async deletePost(id: string) {
		return await postsRepository.deletePost(id)
	},
	async createComment(userId: string, postId: string, body: ICommentInputModel): Promise<ResultType<ICommentViewModel | null>> {
		const post = await postsQueryRepository.getPostById(postId)
		const user = await usersQueryRepository.findUserById(userId)

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