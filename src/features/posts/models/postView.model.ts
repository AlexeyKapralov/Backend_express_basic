import {IExtendedLikeInfoViewModel} from "../../likes/models/like.type";

export interface IPostViewModel {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
    extendedLikesInfo: IExtendedLikeInfoViewModel
}