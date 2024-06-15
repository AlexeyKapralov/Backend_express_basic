import {IPostDbModel} from "../models/postDb.model";
import {IPostViewModel} from "../models/postView.model";
import {WithId} from "mongodb";
import {
    ILikeDetailsViewModel,
    ILikeInfoViewModel,
    ILikePostsDbModel,
    LikeStatus
} from "../../likes/models/like.type";

export const getPostViewModel = (data: WithId<IPostDbModel>, newestlikes: ILikeDetailsViewModel[], status: LikeStatus): IPostViewModel => {
    return {
        id: data._id.toString(),
        title: data.title,
        shortDescription: data.shortDescription,
        content: data.content,
        blogId: data.blogId,
        blogName: data.blogName,
        createdAt: data.createdAt,
        extendedLikesInfo: {
            likesCount: data.likesCount,
            dislikesCount: data.dislikesCount,
            newestLikes: newestlikes,
            myStatus: status
        }
    }
}