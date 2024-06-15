import {resolveSrv} from "node:dns";

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

export interface ILikeCommentsDbModel {
    createdAt: Date,
    status: LikeStatus,
    userId: string
}

export interface ILikePostsDbModel {
    description: string,
    addedAt: Date,
    userId: string,
    login: string,
    postId: string
}


export interface ILikeInputModel {
    likeStatus: LikeStatus,
}

export interface IExtendedLikeInfoViewModel {
    likesCount: number,
    dislikesCount: number,
    myStatus: LikeStatus,
    newestLikes: ILikeDetailsViewModel[]
}

export interface ILikeDetailsViewModel {
    addedAt: Date,
    userId: string,
    login: string
}
