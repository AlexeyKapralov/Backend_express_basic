import {ICommentatorInfo} from './commentatorInfo.model'

export interface ICommentDbModel {
    _id: string
    content: string
    commentatorInfo: ICommentatorInfo
    createdAt: string
    postId: string
    likesCount: number,
    dislikesCount: number,
    likes: ILikeDbModel[]
}

export enum LikeStatus {
    None = 'None',
    Like = 'Like',
    Dislike = 'Dislike'
}

export interface ILikeInfoViewModel {
    likesCount: number,
    dislikesCount: number,
    myStatus: LikeStatus
}

export interface ILikeDbModel {
    createdAt: Date,
    status: LikeStatus,
    userId: string
}

export interface ILikeInputModel {
    likeStatus: LikeStatus,
}
