import { ICommentatorInfo } from './commentatorInfo.model'

import {ILikeInfoViewModel} from "../../likes/models/like.type";

export interface ICommentViewModel {
	id: string
	content: string
	commentatorInfo: ICommentatorInfo
	createdAt: string
	likesInfo: ILikeInfoViewModel
}