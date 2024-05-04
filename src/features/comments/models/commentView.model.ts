import { ICommentatorInfo } from './commentatorInfo.model'

export interface ICommentViewModel {
	id: string
	content: string
	commentatorInfo: ICommentatorInfo
	createdAt: string
}