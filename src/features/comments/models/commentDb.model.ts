import { ICommentatorInfo } from './commentatorInfo.model'

export interface ICommentDbModel {
	_id: string
	content: string
	commentatorInfo: ICommentatorInfo
	createdAt: string
	postId: string
}