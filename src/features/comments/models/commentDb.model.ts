import {ICommentatorInfo} from './commentatorInfo.model'
import {ILikeCommentsDbModel} from "../../likes/models/like.type";

export interface ICommentDbModel {
    _id: string
    content: string
    commentatorInfo: ICommentatorInfo
    createdAt: string
    postId: string
    likesCount: number,
    dislikesCount: number,
    likes: ILikeCommentsDbModel[]
}

