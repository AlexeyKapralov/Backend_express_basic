import { ICommentatorInfo } from './commentatorInfo.model'
import {ILikeInfoViewModel} from "./commentDb.model";

export interface ICommentViewModel {
	id: string
	content: string
	commentatorInfo: ICommentatorInfo
	createdAt: string
	likesInfo: ILikeInfoViewModel
}