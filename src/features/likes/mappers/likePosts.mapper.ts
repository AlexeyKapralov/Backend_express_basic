import {ILikeDetailsViewModel, ILikePostsDbModel} from "../models/like.type";

export const likePostsMapper = (likesDTO: ILikePostsDbModel): ILikeDetailsViewModel => {
    return {
        addedAt: likesDTO.addedAt,
        userId: likesDTO.userId,
        login: likesDTO.login
    }
}